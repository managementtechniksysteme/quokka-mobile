export const isMultipleOf = (value: number, multiplier: number) => {
  return (
    Number(value.toFixed(2).toString().replace('.', '')) %
      Number(multiplier.toFixed(2).toString().replace('.', '')) ===
    0
  );
};
