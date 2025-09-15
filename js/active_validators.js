const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
  console.log('⏳ Conectando ao nó...');
  const wsProvider = new WsProvider('wss://polkadot-rpc.dwellir.com');// troca para o nó oficial
  const api = await ApiPromise.create({ provider: wsProvider });

  console.log('✅ Conectado com sucesso!');

  const currentEraOpt = await api.query.staking.currentEra();
  const currentEra = currentEraOpt.unwrap().toNumber();
  const previousEra = currentEra - 2;

  console.log(`📅 Era anterior: ${previousEra}`);

  const eraPoints = await api.query.staking.erasRewardPoints(previousEra);
  const validators = eraPoints.individual;

  console.log(`✅ Era points de ${validators.size} validadores na era ${previousEra}:\n`);

  let count = 1;
  for (const [validatorId, points] of validators.entries()) {
    const info = await api.derive.accounts.info(validatorId);
    const display = info.identity.display;

    const identidade = display && display.toHuman() !== null
      ? display.toHuman()
      : '🪪 (sem identidade)';

    console.log(`${count}. ${validatorId.toString()} => ${points.toString()} pontos | ${identidade}`);
    count++;
  }

  await api.disconnect();
}

main().catch((error) => {
  console.error('❌ Erro ao executar o script:', error);
});
