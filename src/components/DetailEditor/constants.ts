
export const OPTIONS = {
  bodyType: ['Athletic', 'Average', 'Slim', 'Muscular', 'Curvy', 'Full Figured', 'Petite', 'Stocky', 'Heavyset'],
  height: ['5\'0"', '5\'1"', '5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"', '6\'1"', '6\'2"', '6\'3"', '6\'4"', '6\'5"', '6\'6"', '6\'7"', '6\'8"'],
  ethnicity: ['White', 'Black', 'Hispanic', 'Asian', 'Middle Eastern', 'Kurdish', 'Persian', 'Arab', 'Turkish', 'Mixed', 'Other'],
  zodiacSign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  personalityType: ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'],
  relationshipGoals: ['Casual dating', 'Long-term relationship', 'Marriage', 'Not sure yet', 'Just making friends', 'Networking', 'Looking for a serious relationship', 'Looking for a meaningful connection'],
  wantChildren: ['Want children', 'Don\'t want children', 'Have children', 'Open to children', 'Undecided about children'],
  childrenStatus: ['No children', 'Have children', 'Have children and want more', 'Have children and don\'t want more', 'Have adult children'],
  familyCloseness: ['Very close with family', 'Somewhat close with family', 'Not close with family', 'No contact with family', 'Family is everything to me'],
  exerciseHabits: ['Regular - 4-5 times per week', 'Occasional - 1-3 times per week', 'Rarely', 'Never', 'Daily', 'Professional athlete'],
  sleepSchedule: ['Early bird', 'Night owl', 'Regular schedule', 'Irregular schedule', 'Balanced sleeper', 'Insomniac'],
  financialHabits: ['Saver', 'Spender', 'Balanced', 'Saver with occasional splurges', 'Financial planner', 'Living paycheck to paycheck', 'Building wealth'],
  communicationStyle: ['Direct and thoughtful', 'Emotionally expressive', 'Reserved and thoughtful', 'Open and honest', 'Analytical', 'Passive', 'Assertive', 'Diplomatic'],
  workLifeBalance: ['Work focused', 'Life focused', 'Balanced', 'Values boundaries between work and personal life', 'Workaholic', 'Leisure prioritized'],
  favoriteSeason: ['Spring', 'Summer', 'Fall', 'Winter', 'Rainy season', 'Dry season'],
  drinking: ['Never', 'Rarely', 'Socially', 'Regularly', 'Recovering', 'Special occasions only'],
  smoking: ['Never', 'Socially', 'Regularly', 'Trying to quit', 'Former smoker', 'Vapes occasionally'],
  religion: ['Christian', 'Catholic', 'Protestant', 'Orthodox', 'Jewish', 'Muslim', 'Sunni Muslim', 'Shia Muslim', 'Hindu', 'Buddhist', 'Spiritual', 'Agnostic', 'Atheist', 'Taoist', 'Pagan', 'Other'],
  politicalViews: ['Liberal', 'Moderate', 'Conservative', 'Progressive', 'Libertarian', 'Socialist', 'Apolitical', 'Not political', 'Other'],
  loveLanguage: ['Quality Time', 'Physical Touch', 'Words of Affirmation', 'Acts of Service', 'Receiving Gifts'],
  education: ['High School', 'Some College', 'Associate\'s Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Trade School', 'Self-Educated', 'Professional Degree'],
  travelFrequency: ['Never', 'Rarely', 'Yearly', 'Several times per year', 'Monthly', 'Digital nomad'],
  dietaryPreferences: ['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Flexitarian', 'Keto', 'Paleo', 'Gluten-free', 'Kosher', 'Halal', 'No restrictions'],
  languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Japanese', 'Chinese', 'Arabic', 'Hindi', 'Kurdish', 'Farsi', 'Turkish', 'Other'],
  relationshipType: ['Monogamous', 'Polyamorous', 'Open relationship', 'Not sure yet', 'Depends on the partner'],
  livingArrangement: ['Live alone', 'Live with roommates', 'Live with family', 'Live with partner', 'Nomadic', 'Own my home', 'Rent'],
  petsOwned: ['Dog(s)', 'Cat(s)', 'Birds', 'Fish', 'Reptiles', 'Small mammals', 'Farm animals', 'No pets', 'Allergic to pets'],
  musicGenres: ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Country', 'Classical', 'Jazz', 'Electronic', 'Folk', 'Metal', 'Alternative', 'Indie', 'Kurdish Folk', 'Persian', 'Arabic', 'World Music'],
  movieGenres: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Documentary', 'Thriller', 'Fantasy', 'Animation', 'Independent', 'Foreign'],
  bookGenres: ['Fiction', 'Non-Fiction', 'Fantasy', 'Sci-Fi', 'Mystery', 'Thriller', 'Romance', 'Biography', 'Self-Help', 'History', 'Poetry', 'Comics/Graphic Novels'],
  cuisines: ['Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai', 'Mediterranean', 'American', 'French', 'Greek', 'Korean', 'Vietnamese', 'Middle Eastern', 'Kurdish', 'Persian', 'Turkish', 'Ethiopian', 'Caribbean'],
  idealDateActivities: ['Dinner at a restaurant', 'Coffee shop', 'Movie theater', 'Concert/live music', 'Museum/art gallery', 'Hiking/outdoor adventure', 'Cooking together', 'Beach day', 'Amusement park', 'Wine tasting', 'Sporting event', 'Game night'],
  creativeHobbies: ['Painting', 'Drawing', 'Photography', 'Writing', 'Music', 'Dance', 'Theater', 'Crafting', 'DIY projects', 'Digital art', 'Pottery/ceramics', 'Woodworking', 'Fashion design', 'Cooking/baking'],
  sportsActivities: ['Running', 'Cycling', 'Swimming', 'Hiking', 'Yoga', 'Weight training', 'Rock climbing', 'Tennis', 'Soccer', 'Basketball', 'Football', 'Volleyball', 'Golf', 'Skiing', 'Skateboarding', 'Martial arts'],
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
