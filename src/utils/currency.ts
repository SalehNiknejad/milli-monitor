export const rialToToman = (value: number) => {
  return Math.round(value / 10);
};

export const tomanToRial = (value: number) => {
  return value * 10;
};

export const formatToman = (value: number) => {
  return rialToToman(value).toLocaleString("fa-IR");
};

export const formatRial = (value: number) => {
  return value.toLocaleString("fa-IR");
};
