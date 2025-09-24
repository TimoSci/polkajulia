// people_identities.js funciona se tiver um validators.json
const { ApiPromise, WsProvider } = require('@polkadot/api');
const fs = require('fs');

const PEOPLE_WS = 'wss://api-people-polkadot.n.dwellir.com/024a8884-05e8-42af-928e-f93d4afc0a75'; // endpoint da parachain People

async function main() {
  console.log('⏳ Conectando à parachain People...');
  const provider = new WsProvider(PEOPLE_WS);
  const api = await ApiPromise.create({ provider });
  console.log('✅ Conectado à People');

  const validators = JSON.parse(fs.readFileSync('validators.json'));

  for (const address of validators) {
    const identity = await api.query.identity.identityOf(address);

    if (identity.isSome) {
      const info = identity.unwrap().info;
      const display = info.display?.Raw?.toHuman() || '<sem nome>';
      console.log(`✔️ ${address} → ${display}`);
    } else {
      console.log(`❌ ${address} → sem identidade`);
    }
  }
}

main().catch(console.error);
