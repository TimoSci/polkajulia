const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
  console.log('⏳ Conectando ao nó da parachain People...');
  const wsProvider = new WsProvider('wss://api-people-polkadot.n.dwellir.com/024a8884-05e8-42af-928e-f93d4afc0a75');

  try {
    const api = await ApiPromise.create({ provider: wsProvider });
    console.log('✅ Conectado com sucesso à parachain People');
    console.log(`Chain: ${await api.rpc.system.chain()}`);
    await api.disconnect();
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
  }
}

main();
