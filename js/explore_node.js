const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
  console.log('\n⏳ Conectando ao node...');
  //const wsProvider = new WsProvider('wss://polkadot-rpc.dwellir.com');
  const wsProvider = new WsProvider('wss://api-people-polkadot.n.dwellir.com/024a8884-05e8-42af-928e-f93d4afc0a75');
  const api = await ApiPromise.create({ provider: wsProvider });
  console.log('✅ Conectado!\n');

  console.log('📦 Pallets disponíveis no node:');
  const modules = Object.keys(api.query);
  modules.forEach((mod) => console.log(`- ${mod}`));

  const moduleName = 'staking'; // ou 'balances', 'system', etc.
  console.log(`\n🔍 Chamadas disponíveis em api.query.${moduleName}:`);
  const calls = Object.keys(api.query[moduleName]);
  calls.forEach((c) => console.log(`- ${moduleName}.${c}`));

  await api.disconnect();
}

main().catch((err) => {
  console.error('❌ Erro:', err);
});
