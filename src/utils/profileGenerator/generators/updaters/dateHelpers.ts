
/**
 * Generate a random date between start and end dates
 * @param start Start date
 * @param end End date
 * @returns Random date between start and end
 */
export const generateRandomDateBetween = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * Generate a random recent active date (within last 7 days)
 * @returns Date object representing last active time
 */
export const generateRecentActiveDate = (): Date => {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return generateRandomDateBetween(lastWeek, now);
};

/**
 * Generate a join date between 1 month and 2 years ago
 * @returns Date object representing join date
 */
export const generateJoinDate = (): Date => {
  const now = new Date();
  const twoYearsAgo = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return generateRandomDateBetween(twoYearsAgo, oneMonthAgo);
};
