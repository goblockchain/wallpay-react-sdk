export const FormatPrice = ({ amount, currency }) => {
  amount = Number(amount);
  if (currency === "BRL") {
    return (
      <>
        R${" "}
        {amount
          .toFixed(2)
          .toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
      </>
    );
  }
  if (currency === "USD") {
    return (
      <>$ {amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</>
    );
  }
  return (
    <>
      {amount.toLocaleString(undefined)} {currency}
    </>
  );
};

export const sleep = async (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export const convertTimeStampToDateString = (timestamp: string): string => {
  const date = new Date(Number(timestamp) * 1000)
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(date)
}
