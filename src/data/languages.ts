
// Middle Eastern languages
const middleEasternLanguages = [
  "Arabic",
  "Hebrew",
  "Persian (Farsi)",
  "Turkish",
  "Kurdish (Sorani)",
  "Kurdish (Kurmanji)",
  "Kurdish (Zazaki)",
  "Kurdish (Gorani)",
  "Kurdish (Hawrami)",
  "Aramaic",
  "Armenian",
  "Azerbaijani",
  "Georgian",
  "Urdu",
  "Pashto"
];

// European languages (most commonly used)
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

// All languages combined and sorted alphabetically
export const allLanguages = [
  ...middleEasternLanguages,
  ...europeanLanguages
].sort();

// Language categories for filtering
export const languageCategories = {
  middleEastern: middleEasternLanguages,
  european: europeanLanguages,
  kurdishDialects: [
    "Kurdish (Sorani)",
    "Kurdish (Kurmanji)",
    "Kurdish (Zazaki)",
    "Kurdish (Gorani)",
    "Kurdish (Hawrami)"
  ]
};
