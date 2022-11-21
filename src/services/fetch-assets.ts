export const getAssetsOfWallet = async (walletAddress: string) => {
  const res = await fetch(
    `https://staging-api.depocket.com/v1/account/${walletAddress}/balances?chain=bsc`,
    {
      method: "POST",
    }
  );
  const data = await res.json();
  return data;
};
