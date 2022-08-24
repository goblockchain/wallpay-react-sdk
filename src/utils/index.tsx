import React from "react";

export const FormatPrice = ({ amount, currency }) => {
  amount = Number(amount);
  if (currency === "BRL") {
    return (
      <>
        R${" "}
        {(amount / 100).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}{" "}
      </>
    );
  }
  if (currency === "USD") {
    return (
      <>
        ${" "}
        {(amount / 100).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}
      </>
    );
  }
  return (
    <>
      {amount} {currency}
    </>
  );
};

export const sleep = async (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

export const convertTimeStampToDateString = (timestamp: string): string => {
  const date = new Date(Number(timestamp) * 1000);
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
};
