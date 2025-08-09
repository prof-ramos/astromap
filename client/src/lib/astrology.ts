// Astrology utility functions and constants

export const zodiacSigns = [
  { name: "Áries", symbol: "♈", element: "Fogo", quality: "Cardinal" },
  { name: "Touro", symbol: "♉", element: "Terra", quality: "Fixo" },
  { name: "Gêmeos", symbol: "♊", element: "Ar", quality: "Mutável" },
  { name: "Câncer", symbol: "♋", element: "Água", quality: "Cardinal" },
  { name: "Leão", symbol: "♌", element: "Fogo", quality: "Fixo" },
  { name: "Virgem", symbol: "♍", element: "Terra", quality: "Mutável" },
  { name: "Libra", symbol: "♎", element: "Ar", quality: "Cardinal" },
  { name: "Escorpião", symbol: "♏", element: "Água", quality: "Fixo" },
  { name: "Sagitário", symbol: "♐", element: "Fogo", quality: "Mutável" },
  { name: "Capricórnio", symbol: "♑", element: "Terra", quality: "Cardinal" },
  { name: "Aquário", symbol: "♒", element: "Ar", quality: "Fixo" },
  { name: "Peixes", symbol: "♓", element: "Água", quality: "Mutável" },
];

export const planets = [
  { name: "Sol", symbol: "☉", meaning: "Personalidade, ego" },
  { name: "Lua", symbol: "☽", meaning: "Emoções, instintos" },
  { name: "Mercúrio", symbol: "☿", meaning: "Comunicação, pensamento" },
  { name: "Vênus", symbol: "♀", meaning: "Amor, beleza" },
  { name: "Marte", symbol: "♂", meaning: "Ação, energia" },
  { name: "Júpiter", symbol: "♃", meaning: "Expansão, filosofia" },
  { name: "Saturno", symbol: "♄", meaning: "Disciplina, limites" },
  { name: "Urano", symbol: "♅", meaning: "Inovação, rebeldia" },
  { name: "Netuno", symbol: "♆", meaning: "Intuição, espiritualidade" },
  { name: "Plutão", symbol: "♇", meaning: "Transformação, poder" },
];

export const houses = [
  { number: 1, name: "Ascendente", meaning: "Personalidade, aparência" },
  { number: 2, name: "Recursos", meaning: "Dinheiro, valores" },
  { number: 3, name: "Comunicação", meaning: "Irmãos, estudos" },
  { number: 4, name: "Lar", meaning: "Família, raízes" },
  { number: 5, name: "Criatividade", meaning: "Filhos, diversão" },
  { number: 6, name: "Trabalho", meaning: "Saúde, serviço" },
  { number: 7, name: "Parcerias", meaning: "Relacionamentos, casamento" },
  { number: 8, name: "Transformação", meaning: "Morte, regeneração" },
  { number: 9, name: "Filosofia", meaning: "Viagens, ensino superior" },
  { number: 10, name: "Carreira", meaning: "Profissão, reputação" },
  { number: 11, name: "Amizades", meaning: "Grupos, esperanças" },
  { number: 12, name: "Espiritualidade", meaning: "Subconsciente, karma" },
];

export const aspects = [
  { name: "Conjunção", symbol: "☌", degrees: 0, meaning: "União, intensidade" },
  { name: "Sextil", symbol: "⚹", degrees: 60, meaning: "Oportunidade, harmonia" },
  { name: "Quadratura", symbol: "□", degrees: 90, meaning: "Tensão, desafio" },
  { name: "Trígono", symbol: "△", degrees: 120, meaning: "Fluidez, talento" },
  { name: "Oposição", symbol: "☍", degrees: 180, meaning: "Polaridade, consciência" },
];

export function getZodiacSymbol(signName: string): string {
  const sign = zodiacSigns.find(s => s.name === signName);
  return sign?.symbol || "♈";
}

export function getPlanetSymbol(planetName: string): string {
  const planet = planets.find(p => p.name === planetName);
  return planet?.symbol || "☉";
}

export function getAspectSymbol(aspectName: string): string {
  const aspect = aspects.find(a => a.name === aspectName);
  return aspect?.symbol || "☌";
}

export function formatDegree(degree: number): string {
  const deg = Math.floor(degree);
  const min = Math.floor((degree - deg) * 60);
  return `${deg}°${min.toString().padStart(2, '0')}'`;
}

export function getSignColor(signName: string): string {
  const fireColors = "#FF6B6B";
  const earthColors = "#4ECDC4";
  const airColors = "#45B7D1";
  const waterColors = "#96CEB4";

  const sign = zodiacSigns.find(s => s.name === signName);
  if (!sign) return fireColors;

  switch (sign.element) {
    case "Fogo": return fireColors;
    case "Terra": return earthColors;
    case "Ar": return airColors;
    case "Água": return waterColors;
    default: return fireColors;
  }
}
