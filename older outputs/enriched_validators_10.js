const { ApiPromise, WsProvider } = require('@polkadot/api');
const fs = require('fs');
const path = require('path');
const { stringify } = require('csv-stringify/sync');

const N_ERAS = 20;
const OUTPUT_FILE = path.join(__dirname, 'validadores_ultimas_eras.csv');

function decodeField(field) {
  try {
    if (!field) return '';
    if (field.isRaw) return field.asRaw.toUtf8() || '';
    if (field.isSome) {
      const unwrapped = field.unwrap();
      if (unwrapped.isRaw) return unwrapped.asRaw.toUtf8() || '';
      return unwrapped.toHuman() || '';
    }
    return field.toHuman ? field.toHuman() || '' : '';
  } catch {
    return '';
  }
}

async function getIdentity(apiPeople, address) {
  try {
    const identityOpt = await apiPeople.query.identity.identityOf(address);
    if (identityOpt.isSome) {
      const info = identityOpt.unwrap().info;
      return {
        display: decodeField(info.display),
        legal: decodeField(info.legal),
        web: decodeField(info.web),
        email: decodeField(info.email),
        twitter: decodeField(info.twitter),
        subOf: null
      };
    } else {
      const superOfOpt = await apiPeople.query.identity.superOf(address);
      if (superOfOpt.isSome) {
        const [parent, data] = superOfOpt.unwrap();

        // Busca identidade do pai (parent)
        const parentIdOpt = await apiPeople.query.identity.identityOf(parent.toString());
        if (parentIdOpt.isSome) {
          const info = parentIdOpt.unwrap().info;
          return {
            display: decodeField(info.display),
            legal: decodeField(info.legal),
            web: decodeField(info.web),
            email: decodeField(info.email),
            twitter: decodeField(info.twitter),
            subOf: parent.toString()
          };
        } else {
          // Pai sem identidade
          return {
            display: '',
            legal: '',
            web: '',
            email: '',
            twitter: '',
            subOf: parent.toString()
          };
        }
      }
    }
  } catch {
    return {
      display: '',
      legal: '',
      web: '',
      email: '',
      twitter: '',
      subOf: null
    };
  }

  return {
    display: '',
    legal: '',
    web: '',
    email: '',
    twitter: '',
    subOf: null
  };
}


async function main() {
  console.log('⏳ Conectando aos nós...');

  const apiRelay = await ApiPromise.create({
    provider: new WsProvider('wss://polkadot-rpc.dwellir.com')
  });

  const apiPeople = await ApiPromise.create({
    provider: new WsProvider('wss://api-people-polkadot.n.dwellir.com/024a8884-05e8-42af-928e-f93d4afc0a75')
  });

  console.log('✅ Conectado com sucesso!');

  const currentEra = (await apiRelay.query.staking.currentEra()).unwrap().toNumber();

  const allData = [];

  for (let eraOffset = 1; eraOffset <= N_ERAS; eraOffset++) {
    const era = currentEra - eraOffset;
    console.log(`\n📅 Processando era ${era}`);

    const eraPoints = await apiRelay.query.staking.erasRewardPoints(era);
    const validators = eraPoints.individual;

    console.log(`✅ ${validators.size} validadores encontrados`);

    let count = 1;
    for (const [validatorId, points] of validators.entries()) {
      const address = validatorId.toString();
      const eraPointsVal = points.toNumber ? points.toNumber() : points;

      const identity = await getIdentity(apiPeople, address);

      allData.push({
        era,
        address,
        eraPoints: eraPointsVal,
        display: identity.display,
        legal: identity.legal,
        web: identity.web,
        email: identity.email,
        twitter: identity.twitter,
        subOf: identity.subOf
      });

      if (count % 100 === 0) {
        console.log(`  → Processados ${count} validadores`);
      }
      count++;
    }
  }

  console.log('\n💾 Salvando CSV...');
  const csvData = stringify(allData, {
    header: true,
    columns: [
      'era',
      'address',
      'eraPoints',
      'display',
      'legal',
      'web',
      'email',
      'twitter',
      'subOf'
    ]
  });

  fs.writeFileSync(OUTPUT_FILE, csvData);
  console.log(`✅ Arquivo salvo: ${OUTPUT_FILE}`);

  await apiRelay.disconnect();
  await apiPeople.disconnect();
}

main().catch(console.error);


