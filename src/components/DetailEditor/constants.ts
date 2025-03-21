
export const OPTIONS = {
  bodyType: ['Athletic', 'Average', 'Slim', 'Muscular', 'Curvy', 'Full Figured'],
  height: ['5\'0"', '5\'1"', '5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"', '6\'1"', '6\'2"', '6\'3"', '6\'4"'],
  ethnicity: ['White', 'Black', 'Hispanic', 'Asian', 'Middle Eastern', 'Mixed', 'Other'],
  zodiacSign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  personalityType: ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'],
  relationshipGoals: ['Casual dating', 'Long-term relationship', 'Marriage', 'Not sure yet', 'Just making friends'],
  wantChildren: ['Want children', 'Don\'t want children', 'Have children', 'Open to children'],
  childrenStatus: ['No children', 'Have children', 'Have children and want more'],
  familyCloseness: ['Very close with family', 'Somewhat close with family', 'Not close with family'],
  exerciseHabits: ['Regular - 4-5 times per week', 'Occasional - 1-3 times per week', 'Rarely', 'Never'],
  sleepSchedule: ['Early bird', 'Night owl', 'Regular schedule', 'Irregular schedule'],
  financialHabits: ['Saver', 'Spender', 'Balanced', 'Saver with occasional splurges', 'Financial planner'],
  communicationStyle: ['Direct and thoughtful', 'Emotionally expressive', 'Reserved and thoughtful', 'Open and honest', 'Analytical'],
  workLifeBalance: ['Work focused', 'Life focused', 'Balanced', 'Values boundaries between work and personal life'],
  favoriteSeason: ['Spring', 'Summer', 'Fall', 'Winter'],
  drinking: ['Never', 'Rarely', 'Socially', 'Regularly'],
  smoking: ['Never', 'Socially', 'Regularly', 'Trying to quit'],
  religion: ['Christian', 'Catholic', 'Jewish', 'Muslim', 'Hindu', 'Buddhist', 'Spiritual', 'Agnostic', 'Atheist', 'Other'],
  politicalViews: ['Liberal', 'Moderate', 'Conservative', 'Not political', 'Other'],
  loveLanguage: ['Quality Time', 'Physical Touch', 'Words of Affirmation', 'Acts of Service', 'Receiving Gifts'],
};

export function convertHeightToCm(height: string): string {
  if (height.toLowerCase().includes("cm")) {
    return height;
  }
  
  if (height.includes("'")) {
    const parts = height.split("'");
    const feet = parseInt(parts[0], 10);
    const inches = parts[1] ? parseInt(parts[1].replace('"', ''), 10) : 0;
    
    const cm = Math.round(feet * 30.48 + inches * 2.54);
    return `${cm} cm`;
  }
  
  if (!isNaN(Number(height))) {
    return `${height} cm`;
  }
  
  return height;
}
