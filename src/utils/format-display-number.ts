export const formatDisplayNumber = (amount: string) => {
  return amount
    ? Number(amount)
        .toFixed(3)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")
    : 0;
};
