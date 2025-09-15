const { ApiPromise, WsProvider } = require('@polkadot/api');

const VALIDATOR_ADDRESS = '145Vw57NN3Y4tqFNidLTmkhaMLD4HPoRtU91vioXrKcTcirS';

async function main() {
  console.log('\n⏳ Conectando ao node...');
  const wsProvider = new WsProvider('wss://polkadot-rpc.dwellir.com');
  const api = await ApiPromise.create({ provider: wsProvider });
  console.log('✅ Conectado!\n');

  const activeEra = (await api.query.staking.activeEra()).unwrap().index.toNumber();
  console.log(`📌 Era atual: ${activeEra}\n`);

  console.log(`🔍 Coletando pontos do validador ${VALIDATOR_ADDRESS} nas últimas 15 eras:\n`);

  for (let i = 0; i < 15; i++) {
    const era = activeEra - i;

    // Verifica se o validador estava ativo na era
    const exposure = await api.query.staking.erasStakersClipped(era, VALIDATOR_ADDRESS);
    const totalStake = exposure?.total?.toBn?.(); // Proteção contra undefined

    if (!totalStake || totalStake.isZero()) {
      console.log(`📅 Era ${era} → não era validador ativo.`);
      continue;
    }

    // Se era ativo, verifica pontos
    const rewardPoints = await api.query.staking.erasRewardPoints(era);
    const individual = rewardPoints.individual.get(VALIDATOR_ADDRESS);

    if (individual) {
      console.log(`📅 Era ${era} → ${individual.toString()} points`);
    } else {
      console.log(`📅 Era ${era} → era ativo, mas sem pontos registrados.`);
    }
  }

  await api.disconnect();
}

main().catch((err) => {
  console.error('❌ Erro:', err);
});
