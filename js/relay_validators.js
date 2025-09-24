//produz o validators.json
const { ApiPromise, WsProvider } = require('@polkadot/api');
const fs = require('fs');

async function main() {
  console.log('⏳ Conectando ao nó da relay chain...');
  const provider = new WsProvider('wss://polkadot-rpc.dwellir.com');
  const api = await ApiPromise.create({ provider });

  console.log('✅ Conectado à relay chain');

  const validators = await api.query.session.validators();
  const addresses = validators.map(v => v.toString());

  console.log(`✅ ${addresses.length} validadores encontrados`);
  console.log(addresses.map((v, i) => `${i + 1}. ${v}`).join('\n'));

  // Salva em validators.json
  fs.writeFileSync('validators.json', JSON.stringify(addresses, null, 2));
  console.log('💾 Arquivo validators.json salvo com sucesso!');
}

main().catch(console.error);
