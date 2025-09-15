const { ApiPromise, WsProvider } = require('@polkadot/api');
const fs = require('fs');

const wsProvider = new WsProvider('wss://api-people-polkadot.n.dwellir.com/024a8884-05e8-42af-928e-f93d4afc0a75');

// Exemplo estático — você pode integrar com o retorno de active_validators
const validatorAddresses = [
  '114SUbKCXjmb9czpWTtS3JANSmNRwVa4mmsMrWYpRG1kDH5',
  '11VR4pF6c7kfBhfmuwwjWY3FodeYBKWx7ix2rsRCU2q6hq',
  '11uMPbeaEDJhUxzU4ZfWW9VQEsryP9XqFcNRfPdYda6aFWJ',
  '6KjnbCmBXqT3R956sHak7THsgQZ9Ek8ibnG1sFyCNtfJ8y',
  
];

function safeToHuman(field) {
  return field?.isSome ? field.toHuman() : null;
}

async function main() {
  const api = await ApiPromise.create({ provider: wsProvider });
  const results = [];

  for (const address of validatorAddresses) {
    console.log(`🔍 Verificando identidade de ${address}`);
    const identity = await api.query.identity.identityOf(address);

    if (identity.isSome) {
      const info = identity.unwrap().info;
      results.push({
        address,
        display: safeToHuman(info.display),
        legal: safeToHuman(info.legal),
        web: safeToHuman(info.web),
        email: safeToHuman(info.email),
        twitter: safeToHuman(info.twitter),
      });
    } else {
      const superOf = await api.query.identity.superOf(address);
      if (superOf.isSome) {
        const [superAccount, data] = superOf.unwrap();
        results.push({
          address,
          display: `(sub: ${data.toHuman()})`,
          legal: null,
          web: null,
          email: null,
          twitter: null,
          parent: superAccount.toString()
        });
      } else {
        results.push({
          address,
          display: null,
          legal: null,
          web: null,
          email: null,
          twitter: null
        });
      }
    }
  }

  // Salvar como CSV
  //const header = 'address,display,legal,web,email,twitter,parent\n';
  //const rows = results.map(r =>
  //  `${r.address},"${r.display ?? ''}","${r.legal ?? ''}","${r.web ?? ''}","${r.email ?? ''}","${r.twitter ?? ''}","${r.parent ?? ''}"`
  //).join('\n');

  //fs.writeFileSync('identities.csv', header + rows);
  //console.log(`✅ Identidades salvas em identities.csv`);

  await api.disconnect();
}

main().catch(console.error);
