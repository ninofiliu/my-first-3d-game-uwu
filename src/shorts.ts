export const x = <T>(x: T | null | undefined): T => {
  if (!x) throw new Error("should not be nullish");
  return x;
};
