// Kurdish dialects
const kurdishLanguages = [
  "Kurdish (Sorani)",
  "Kurdish (Kurmanji)",
  "Kurdish (Zazaki)",
  "Kurdish (Gorani)",
  "Kurdish (Hawrami)"
];

// Middle Eastern languages
const middleEasternLanguages = [
  "Arabic",
  "Hebrew",
  "Persian (Farsi)",
  "Turkish",
  "Aramaic",
  "Armenian",
  "Azerbaijani",
  "Georgian",
  "Urdu",
  "Pashto",
  "Balochi",
  "Luri",
  "Assyrian",
  "Turkmen",
  "Kazakh"
];

// European languages
const europeanLanguages = [
  "English",
  "French",
  "German",
  "Spanish",
  "Italian",
  "Portuguese",
  "Russian",
  "Dutch",
  "Polish",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Greek",
  "Czech",
  "Hungarian",
  "Romanian",
  "Bulgarian",
  "Croatian",
  "Serbian",
  "Ukrainian",
  "Belarusian",
  "Slovak",
  "Slovenian",
  "Albanian",
  "Lithuanian",
  "Latvian",
  "Estonian",
  "Icelandic",
  "Irish",
  "Welsh",
  "Scots Gaelic",
  "Catalan",
  "Basque",
  "Galician",
  "Luxembourgish",
  "Maltese",
  "Macedonian",
  "Montenegrin",
  "Bosnian"
];

// Asian languages
const asianLanguages = [
  "Mandarin Chinese",
  "Japanese",
  "Korean",
  "Hindi",
  "Bengali",
  "Vietnamese",
  "Thai",
  "Indonesian",
  "Malay",
  "Tagalog",
  "Tamil",
  "Telugu",
  "Punjabi",
  "Nepali",
  "Sinhala"
];

// African languages
const africanLanguages = [
  "Swahili",
  "Amharic",
  "Somali",
  "Hausa",
  "Yoruba",
  "Zulu",
  "Afrikaans",
  "Berber"
];

// All languages combined and sorted alphabetically
export const allLanguages = [
  ...kurdishLanguages,
  ...middleEasternLanguages,
  ...europeanLanguages,
  ...asianLanguages,
  ...africanLanguages
].sort();

// Language categories for filtering
export const languageCategories = {
  kurdish: kurdishLanguages,
  middleEastern: middleEasternLanguages,
  european: europeanLanguages,
  asian: asianLanguages,
  african: africanLanguages,
  kurdishDialects: kurdishLanguages // Alias for backwards compatibility
};

// Get category for a language
export const getLanguageCategory = (language: string): string => {
  if (kurdishLanguages.includes(language)) return 'kurdish';
  if (middleEasternLanguages.includes(language)) return 'middleEastern';
  if (europeanLanguages.includes(language)) return 'european';
  if (asianLanguages.includes(language)) return 'asian';
  if (africanLanguages.includes(language)) return 'african';
  return 'other';
};
