export const getPendingDeleteAt = (): Date => {
  return new Date(Date.now() + 2 * 60 * 60 * 1000);
};

export const getPaidDeleteAt = (): Date => {
  const nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 1);
  return nextDate;
};