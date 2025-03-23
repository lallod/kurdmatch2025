
/**
 * Selects a random element from an array
 */
export const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Selects a random subset of elements from an array
 */
export const getRandomSubset = <T>(array: T[], min: number = 1, max: number = 3): T[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Generates a random date between start and end dates
 */
export const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * Generates a bio for a user profile
 */
export const generateBio = (firstName: string, gender: string, region: string, occupation: string, ageNum: number): string => {
  const bioTemplates = [
    `${firstName} is a ${ageNum}-year-old ${gender === 'male' ? 'man' : 'woman'} from ${region}. Currently working as a ${occupation} with a passion for connecting with new people.`,
    `A friendly ${gender === 'male' ? 'guy' : 'girl'} from ${region}, ${firstName} works as a ${occupation} and loves to meet people who share similar interests.`,
    `${ageNum}-year-old ${firstName} is from ${region} and has spent the last few years working as a ${occupation}. Looking forward to making meaningful connections.`,
    `Born and raised in ${region}, ${firstName} is a ${occupation} who values ${gender === 'male' ? 'his' : 'her'} heritage and enjoys sharing cultural experiences with others.`,
    `${firstName} is a ${ageNum}-year-old ${occupation} from ${region} who believes in preserving cultural traditions while embracing modern life and forming genuine connections.`
  ];
  
  return getRandomElement(bioTemplates);
};
