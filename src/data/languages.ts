// Kurdish dialects (always first)
const kurdishDialects = [
  "Kurdish (Sorani)",
  "Kurdish (Kurmanji)",
  "Kurdish (Zazaki)",
  "Kurdish (Gorani)",
  "Kurdish (Hawrami)"
];

// Most popular languages among Kurdish diaspora & regional
const popularLanguages = [
  "Arabic",
  "Turkish",
  "Persian (Farsi)",
  "German",
  "English",
  "Swedish",
  "Dutch",
  "French",
  "Norwegian",
  "Danish",
  "Finnish",
];

// Regional / neighboring languages
const regionalLanguages = [
  "Azerbaijani",
  "Armenian",
  "Georgian",
  "Assyrian",
  "Aramaic",
  "Turkmen",
  "Uzbek",
  "Dari",
  "Pashto",
  "Balochi",
  "Luri",
  "Hebrew",
  "Urdu",
];

// European languages (diaspora)
const europeanLanguages = [
  "Italian",
  "Spanish",
  "Portuguese",
  "Russian",
  "Greek",
  "Polish",
  "Czech",
  "Hungarian",
  "Romanian",
  "Bulgarian",
  "Croatian",
  "Serbian",
  "Ukrainian",
  "Bosnian",
  "Albanian",
  "Slovak",
  "Slovenian",
  "Austrian German",
  "Swiss German",
  "Luxembourgish",
  "Icelandic",
  "Lithuanian",
  "Latvian",
  "Estonian",
  "Belarusian",
  "Macedonian",
  "Montenegrin",
  "Catalan",
  "Irish",
  "Welsh",
  "Maltese",
];

// Asian languages
const asianLanguages = [
  "Mandarin Chinese",
  "Japanese",
  "Korean",
  "Hindi",
  "Bengali",
  "Punjabi",
  "Tamil",
  "Indonesian",
  "Malay",
  "Vietnamese",
  "Thai",
  "Tagalog",
  "Nepali",
  "Telugu",
];

// African languages
const africanLanguages = [
  "Swahili",
  "Amharic",
  "Somali",
  "Hausa",
  "Yoruba",
  "Afrikaans",
];

// All languages combined — Kurdish dialects first, then popular, then rest sorted
export const allLanguages = [
  ...kurdishDialects,
  ...popularLanguages,
  ...[
    ...regionalLanguages,
    ...europeanLanguages,
    ...asianLanguages,
    ...africanLanguages,
  ].sort()
];

// Language categories for filtering
export const languageCategories = {
  kurdish: kurdishDialects,
  popular: popularLanguages,
  regional: regionalLanguages,
  european: europeanLanguages,
  asian: asianLanguages,
  african: africanLanguages,
  kurdishDialects: kurdishDialects, // Alias for backwards compatibility
  middleEastern: [...popularLanguages.slice(0, 3), ...regionalLanguages.slice(0, 6)], // backwards compat
};

// Get category for a language
export const getLanguageCategory = (language: string): string => {
  if (kurdishDialects.includes(language)) return 'kurdish';
  if (popularLanguages.includes(language)) return 'popular';
  if (regionalLanguages.includes(language)) return 'regional';
  if (europeanLanguages.includes(language)) return 'european';
  if (asianLanguages.includes(language)) return 'asian';
  if (africanLanguages.includes(language)) return 'african';
  return 'other';
};
