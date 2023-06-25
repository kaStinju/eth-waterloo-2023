import { init, useQuery } from "@airstack/airstack-react";
import { query } from "../Queries";
import { useEffect, useState } from "react";
import { Client } from '@xmtp/xmtp-js';
import { dm } from "../xmtp-utils";
import { Account } from "../app-types";

init("a5a45fc3738d43819da07e99c34c4d77");


interface Recommendation {
  accountId: string;
  invited: boolean;
  name: string | null;
}

function Recommendations({ account, inviteUrl }: { account: Account, inviteUrl: string }) {
  const { data, loading, error } = useQuery(query, {});
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])


  useEffect(() => {
    if (data) {
      const owners = (data.TokenNfts.TokenNft.map((t: { tokenBalances: any; }) => t.tokenBalances[0].owner));
      const newRecommendations = owners.map(
        (o: { identity: any; primaryDomain: { name: any; }; }) => ({
          accountId: o.identity, invited: false, name: o.primaryDomain ? o.primaryDomain.name : null
        }));
      const noDuplicates = [];
      for (const r of newRecommendations) {
        if (!noDuplicates.map((x) => x.accountId).includes(r.accountId)) noDuplicates.push(r);
      }
      noDuplicates.push({ accountId: '0x3Ef2f5f75eb5199E986C1c6DBe51fbaBA3afe6a3', invited: false, name: 'willh.eth' })
      noDuplicates.push({ accountId: '0xECFc1F2664A8AbDbac152e68Ef3C58aA00FF0d99', invited: false, name: 'justin.nounlover' })
      setRecommendations(noDuplicates);
    }
  }, [data]);


  if (loading) {
    return <><p>Loading...</p></>;
  }

  if (error) {
    return <p>Error: {error.message} </p>;
  }

  if (!data) {
    return <p>Error: data did not load</p>;
  }
  // Render your component using the data returned by the query
  return <>
    <h2>Recommended</h2>
    <div className='recommended'>
      {recommendations.map((x) => (
        <div id='rec-invite'>
          <img src={`https://noun.pics/${Number(x.accountId) % 300}`} />
          <div key={x.accountId}>{x.name ? x.name : `${x.accountId.substring(0, 32)}...`}{" "}
            <button disabled={x.invited} onClick={() => {
              const text = `Join my game: ${inviteUrl}`;
              dm(account.xmtp, x.accountId, text);
              setRecommendations((r) => r.map((y) => y.accountId == x.accountId ? { ...x, invited: true } : y))
            }}>Invite</button>
          </div>
        </div>
      ))}
    </div>
  </>
};

export default Recommendations