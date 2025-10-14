export const occupationCategories = {
  education: [
    "University / College Student",
    "High School Student",
    "Apprentice / Trainee / Intern",
    "Teacher / Teaching Assistant / Professor",
    "Researcher / Academic"
  ],
  healthcare: [
    "Doctor / Surgeon",
    "Nurse / Midwife",
    "Physiotherapist / Occupational Therapist",
    "Psychologist / Therapist",
    "Social Worker",
    "Healthcare Assistant / Caregiver",
    "Veterinarian"
  ],
  technology: [
    "Software Developer / Programmer",
    "Web Designer / UX Designer",
    "Data Analyst / Data Scientist",
    "IT Support / Technician",
    "System Administrator / Network Administrator",
    "AI / Machine Learning Specialist",
    "Cybersecurity Specialist"
  ],
  creative: [
    "Designer (Graphic, Fashion, Interior)",
    "Artist / Illustrator / Painter",
    "Musician / Composer",
    "Actor / Performer",
    "Writer / Author",
    "Photographer / Videographer"
  ],
  media: [
    "Journalist / Reporter",
    "Blogger / Influencer / Content Creator",
    "PR / Marketing Professional",
    "Advertising / Ad Agency",
    "Social Media Specialist",
    "Editor / Publisher"
  ],
  business: [
    "CEO / Entrepreneur / Business Owner",
    "Accountant / Auditor",
    "Banking / Finance Professional",
    "Consultant / Advisor",
    "Sales / Account Manager",
    "Human Resources (HR)"
  ],
  trades: [
    "Electrician / Plumber / HVAC",
    "Carpenter / Joiner",
    "Painter / Decorator",
    "Mechanic / Technician",
    "Construction Worker / Contractor",
    "Heavy Machinery Operator"
  ],
  service: [
    "Waiter / Bartender / Chef",
    "Hotel Staff / Receptionist / Concierge",
    "Retail / Sales",
    "Customer Service / Call Center",
    "Tourism / Travel Industry"
  ],
  public: [
    "Police / Firefighter / Military",
    "Civil Servant / Government Worker",
    "Lawyer / Judge / Legal Professional",
    "Politician / Public Administration"
  ],
  transport: [
    "Pilot / Flight Crew",
    "Bus / Train / Truck Driver",
    "Logistics / Warehouse Worker",
    "Shipping / Freight"
  ],
  freelance: [
    "Freelancer (Translator, Writer, Designer)",
    "Stay-at-Home Parent",
    "Own Business / Online Store"
  ],
  kurdish: [
    "Agriculture / Farming",
    "Animal Husbandry / Livestock",
    "Handicrafts / Traditional Kurdish Crafts",
    "Small Business / Local Shop / Bazaar",
    "Traditional Food Production",
    "Musician / Cultural Promoter (Kurdish)",
    "Cultural Event Organizer",
    "Journalist / Media (Kurdish communities)",
    "NGO / Social Work (Kurdish communities)",
    "Kurdish Language Teacher / Language Promoter"
  ],
  other: [
    "Unemployed",
    "Retired",
    "Other / Miscellaneous"
  ]
};

export const allOccupations = Object.values(occupationCategories).flat();

export const occupationCategoryNames = {
  education: "Education & Studies",
  healthcare: "Health & Care",
  technology: "Technology & IT",
  creative: "Creative Professions",
  media: "Media & Communication",
  business: "Business & Finance",
  trades: "Trades & Construction",
  service: "Service & Retail",
  public: "Public Sector & Security",
  transport: "Transport & Logistics",
  freelance: "Freelance & Home-Based",
  kurdish: "Traditional / Kurdish Culture",
  other: "Other"
};

export const getOccupationCategory = (occupation: string): string => {
  for (const [category, occupations] of Object.entries(occupationCategories)) {
    if (occupations.includes(occupation)) {
      return category;
    }
  }
  return 'other';
};
