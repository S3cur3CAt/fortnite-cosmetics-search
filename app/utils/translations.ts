const translations: { [key: string]: string } = {
  "Bunny Brawler": "Conejo Asaltante",
  // Añade más traducciones aquí
};

export function translateToSpanish(englishName: string): string {
  return translations[englishName] || englishName;
}

export function translateToEnglish(spanishName: string): string {
  const entry = Object.entries(translations).find(([_, spanish]) => spanish.toLowerCase() === spanishName.toLowerCase());
  return entry ? entry[0] : spanishName;
}

