const { ApiPromise, WsProvider } = require('@polkadot/api');

const wsProvider = new WsProvider('wss://api-people-polkadot.n.dwellir.com/024a8884-05e8-42af-928e-f93d4afc0a75');

const addresses = [
  '114SUbKCXjmb9czpWTtS3JANSmNRwVa4mmsMrWYpRG1kDH5',
  '16KjnbCmBXqT3R956sHak7THsgQZ9Ek8ibnG1sFyCNtfJ8y',
  '16RfWatcKzDUqYyGKifUhHDcossWumW7bkyiX9fEMN77WKA',
  '1EheUmzB58Y26i8hse4EJo9ffG3M5qmhHzrFXJMQLkY9HoX',
  '1Ew5wAsMtvbRdd4RdxSheLpEkSRc718gtcfTv8EmgzEbknA',
  '1NebF2xZHb4TJJpiqZZ3reeTo8dZov6LZ49qZqcHHbsmHfo',
  '1RG5T6zGY4XovW75mTgpH6Bx7Y6uwwMmPToMCJSdMwdm4EW',
  '1RhqvtG4SS6ooc3JELk8kpTaDiLP9f92jdyR5p5efPWVsx1',
  '1ZKHNRib33noQn1FpjFsPCHuVYUfci5TXy4Lif1FcUUwZe6',
  '1cFsLn7o74nmjbRyDtMAnMpQMc5ZLsjgCSz9Np2mcejUK83',
  '1guBaaUmYpYPmsNmooQApqFmpmRHeaipb1CxoncMuiaqXGh',
  '1sAkfdTH3cHAdJRYqMPNdeV7GhTKrddvMfkQrm3pQBABWrN',
  '1v7QwYLMaABh7eyFKN9PHbKquAyPt6PtcYZZWvf12KV5pMk',
  '1vTaLKEyj2Wn9xEkUGixBkVXJAd4pzDgXzz9CuVjhVqhHRQ',
  '1zugcapKRuHy2C1PceJxTvXWiq6FHEDm2xa5XSU7KYP3rJE',
  '124X3VPduasSodAjS6MPd5nEqM8SUdKN5taMUUPtkWqF1fVf',
  '12713bbq45c66CN9AD7yusSXWE1kY91DcMpjVcB2rXqZKy2w',
  '12771k5UXewvK7FXd1RpPHxvFiCG4GQCrxRmXWN5tAAwDQoi',
  '12BkPLskXyXrHhktrinLxVFkPzzvCzCyVCaqHkUEoxMwSzeq',
  '12CJw9KNkC7FzVVg3dvny4PWHjjkvdyM17mmNfXyfucp8JfM',
  '12MgK2Sc8Rrh6DXS2gDrt7fWJ24eGeVb23NALbZLMw1grnkL',
  '12R2eXcE2QhMa9BkMsWktt9wmoxbgiQBDG9YUM1p94r2F5UD',
  '12YFWxpS32wTZq4HcH28HMR5atkGhxzfD7aNjhTCu5Vyz9J9',
];


function decodeField(field) {
  try {
    if (!field) return null;

    // Se for Raw (ex: { Raw: 'BINANCE_STAKE_9' })
    if (field.isRaw) {
      return field.asRaw.toUtf8();
    }

    // Se for Option com Some(Raw)
    if (field.isSome) {
      const unwrapped = field.unwrap();
      if (unwrapped.isRaw) {
        return unwrapped.asRaw.toUtf8();
      }
      return unwrapped.toHuman();
    }

    // fallback para toHuman, pode ser string ou null
    return field.toHuman ? field.toHuman() : null;
  } catch {
    return null;
  }
}

async function main() {
  const api = await ApiPromise.create({ provider: wsProvider });

  for (const address of addresses) {
    try {
      console.log(`\n🔍 Identidade de ${address}`);

      const identity = await api.query.identity.identityOf(address);

      if (identity.isSome) {
        const info = identity.unwrap().info;

        console.log('Display:', decodeField(info.display));
        console.log('Legal:  ', decodeField(info.legal));
        console.log('Web:    ', decodeField(info.web));
        console.log('Email:  ', decodeField(info.email));
        console.log('Twitter:', decodeField(info.twitter));
      } else {
        const superOf = await api.query.identity.superOf(address);

        if (superOf.isSome) {
          const [parent, data] = superOf.unwrap();
          console.log(`Sub-identidade de ${parent.toString()} com tag: ${decodeField(data)}`);
        } else {
          console.log('Nenhuma identidade registrada.');
        }
      }
    } catch (err) {
      console.error(`Erro ao processar ${address}: ${err.message}`);
    }
  }

  await api.disconnect();
}

main();
