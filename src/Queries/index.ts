export const query = `query NewHolders {
  TokenNfts(input: {filter: {address: {_eq: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03"}}, blockchain: ethereum}) {
    TokenNft {
      tokenBalances {
        owner {
          primaryDomain {
            name
          }
          identity
        }
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
}`