const { ApiPromise, WsProvider } = require('@polkadot/api');

const ADDRESS = '1L7K4aXCU5csnUZkgUhLcmXGQfmm95vC9LHpc5gBH5V2hVs';
const TARGET_TIMESTAMP = Date.now(); // Pode alterar para um timestamp antigo, se quiser

async function isArchiveNode(api) {
  try {
    const blockHash = await api.rpc.chain.getBlockHash(1);
    console.log(`✅ Este node é archive! Bloco 1: ${blockHash.toHex()}`);
    return true;
  } catch (err) {
    console.error('❌ Este node NÃO é archive. Não é possível consultar blocos antigos.');
    return false;
  }
}

async function findBlockAtOrBefore(api, targetTimestamp) {
  let currentBlock = await api.rpc.chain.getHeader();
  let currentNumber = currentBlock.number.toNumber();

  while (currentNumber > 0) {
    const hash = await api.rpc.chain.getBlockHash(currentNumber);
    const timestamp = (await api.query.timestamp.now.at(hash)).toNumber();

    if (timestamp <= targetTimestamp) {
      return hash;
    }

    currentNumber -= 100; // Volta 100 blocos por vez para acelerar
  }

  throw new Error("Não foi possível encontrar um bloco com timestamp anterior ao alvo.");
}

async function main() {
  console.log('\n⏳ Conectando à API...');
  //const wsProvider = new WsProvider('wss://polkadot-rpc.dwellir.com');
  const wsProvider = new WsProvider('wss://polkadot-mainnet.core.chainstack.com/eef8631fb314f56b388525685ddebf25');
  //const wsProvider = new WsProvider('wss://polkadot.api.onfinality.io/public-ws?apikey=SUA_API_KEY');
  const api = await ApiPromise.create({ provider: wsProvider });

  console.log('✅ Conectado ao node!');
  const archive = await isArchiveNode(api);
  if (!archive) {
    await api.disconnect();
    return;
  }

  const dias = 2;
  const MILIS_DIA = 24 * 60 * 60 * 1000;
  const hoje = Date.now();

  console.log(`\n🔍 Buscando saldos de hoje até ${dias} dias atrás:`);

  for (let i = 0; i <= dias; i++) {
    const timestamp = hoje - i * MILIS_DIA;
    const dataStr = new Date(timestamp).toLocaleDateString('pt-BR');

    try {
      const blockHash = await findBlockAtOrBefore(api, timestamp);
      const blockTime = (await api.query.timestamp.now.at(blockHash)).toNumber();
      const { data: balance } = await api.query.system.account.at(blockHash, ADDRESS);

      console.log(`📅 ${dataStr} — Livre: ${balance.free}, Reservado: ${balance.reserved}`);
    } catch (err) {
      console.log(`❌ ${dataStr} — Erro ao buscar saldo: ${err.message}`);
    }
  }

  await api.disconnect();
}


main().catch((err) => {
  console.error('❌ Erro:', err);
});
