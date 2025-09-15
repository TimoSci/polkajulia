const { ApiPromise, WsProvider } = require('@polkadot/api');
const fs = require('fs');

function decodeField(field) {
  try {
    if (!field) return null;

    if (field.isRaw) return field.asRaw.toUtf8();
    if (field.isSome) {
      const unwrapped = field.unwrap();
      if (unwrapped.isRaw) return unwrapped.asRaw.toUtf8();
      return unwrapped.toHuman();
    }

    return field.toHuman ? field.toHuman() : null;
  } catch {
    return null;
  }
}

async function main() {
  // Conexões para as duas redes
  const relayProvider = new WsProvider('wss://polkadot-rpc.dwellir.com');
  const peopleProvider = new WsProvider('wss://api-people-polkadot.n.dwellir.com/024a8884-05e8-42af-928e-f93d4afc0a75');

  console.log('⏳ Conectando à relay chain...');
  const relayApi = await ApiPromise.create({ provider: relayProvider });
  console.log('✅ Conectado à relay chain!');

  console.log('⏳ Conectando à People chain...');
  const peopleApi = await ApiPromise.create({ provider: peopleProvider });
  console.log('✅ Conectado à People chain!\n');

  const currentEraOpt = await relayApi.query.staking.currentEra();
  const currentEra = currentEraOpt.unwrap().toNumber();
  const previousEra = currentEra - 2;

  console.log(`📅 Era anterior: ${previousEra}`);

  const eraPoints = await relayApi.query.staking.erasRewardPoints(previousEra);
  const validators = eraPoints.individual;

  console.log(`✅ Encontrados ${validators.size} validadores ativos na era ${previousEra}\n`);

  let count = 1;
  const enriched = [];

  for (const [validatorId, points] of validators.entries()) {
    const address = validatorId.toString();
    let identity = {
      display: null,
      legal: null,
      web: null,
      email: null,
      twitter: null,
      subOf: null,
    };

    try {
      const idInfo = await peopleApi.query.identity.identityOf(address);

      if (idInfo.isSome) {
        const info = idInfo.unwrap().info;
        identity.display = decodeField(info.display);
        identity.legal = decodeField(info.legal);
        identity.web = decodeField(info.web);
        identity.email = decodeField(info.email);
        identity.twitter = decodeField(info.twitter);
      } else {
        const superOf = await peopleApi.query.identity.superOf(address);
        if (superOf.isSome) {
          const [parent, data] = superOf.unwrap();
          identity.subOf = {
            parent: parent.toString(),
            tag: decodeField(data),
          };
        }
      }
    } catch (err) {
      identity.error = `Erro ao buscar identidade: ${err.message}`;
    }

    enriched.push({
      address,
      eraPoints: points.toNumber(),
      era: previousEra,
      identity,
    });

    const display = identity.display || (identity.subOf ? `[sub de ${identity.subOf.parent}]` : '🪪 (sem identidade)');
    console.log(`${count}. ${address} => ${points.toString()} pontos | ${display}`);
    count++;
  }

  fs.writeFileSync('validadores_com_identidade.json', JSON.stringify(enriched, null, 2));
  console.log('\n💾 Arquivo salvo como validadores_com_identidade.json');

  //console.log('\n🖨️ JSON completo:');
  //console.log(JSON.stringify(enriched, null, 2));

  await relayApi.disconnect();
  await peopleApi.disconnect();
}

main().catch((err) => {
  console.error('❌ Erro no script:', err);
});
