export const MathRoundService = (num: number) => {
  return +(Math.round(num * 100) / 100).toFixed(2);
}

export const FormatCardNumber = (cardNumber: string) => {
  let sliced = cardNumber.slice(-4);
  let mask = String(sliced).padStart(cardNumber.length, "*")
  return mask;
}