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
    <ul>
      {recommendations.map((x) => (<li key={x.accountId}>
        {x.name ? x.name : x.accountId}{" "}
        <button disabled={x.invited} onClick={() => {
          const text = `Join my game: ${inviteUrl}`;
          dm(account.xmtp, x.accountId, text);
          setRecommendations((r) => r.map((y) => y.accountId == x.accountId ? { ...x, invited: true } : y))
        }}>Invite</button>
      </li>))}
    </ul>
  </>
};

export default Recommendations