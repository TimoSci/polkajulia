const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
  console.log("⏳ Conectando ao nó...");

    const provider = new WsProvider('wss://polkadot-rpc.dwellir.com')
  const api = await ApiPromise.create({ provider });

  console.log("✅ Conectado com sucesso!");

  // Algumas contas conhecidas com identidade (exemplo)
  const knownAccounts = [
    '16F3rA6fd6JQ2Toj7cRQTRpk2K8aR7LHZB2bdEyA6fqynEgb', // Parity
    '14fhY5pVt7HQ3xw3FqqWYxrDtkZGziiP71h79A1gDbBGzAmT'  // Web3 Foundation
  ];

  for (const account of knownAccounts) {
    const identityOpt = await api.query.identity.identityOf(account);

    if (identityOpt.isSome) {
      const identity = identityOpt.unwrap();
      const info = identity.info;
      console.log(`🪪 ${account} => ${info.display?.raw?.toHuman() || '[sem nome visível]'}`);
    } else {
      console.log(`❌ ${account} => sem identidade`);
    }
  }

  process.exit(0);
}

main().catch(console.error);
