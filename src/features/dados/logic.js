// Reglas del juego de dados (estilo Farkle). Funciones puras: sin estado,
// sin React, sin llamadas a red — solo matemática del juego.

export const META_PUNTOS = 3000;

export const calculatePoints = (values) => {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);

  const isSmallStraight = [1, 2, 3, 4, 5].every((v) => sorted.includes(v));
  const isLargeStraight = [2, 3, 4, 5, 6].every((v) => sorted.includes(v));

  if (isSmallStraight || isLargeStraight) {
    return 1500;
  }

  let score = 0;
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  values.forEach((v) => { if (v) counts[v]++; });

  for (let i = 1; i <= 6; i++) {
    const count = counts[i];
    if (count >= 3) {
      const valorTrio = i === 1 ? 1000 : i * 100;
      const bonoPorExtra = valorTrio / 10;
      score += valorTrio + (count - 3) * bonoPorExtra;
    } else {
      if (i === 1) score += count * 100;
      if (i === 5) score += count * 50;
    }
  }
  return score;
};

export const isBust = (values) => values.length > 0 && calculatePoints(values) === 0;

export const getScoringIndices = (diceArray) => {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  diceArray.forEach((d) => { if (!d.locked && d.value) counts[d.value]++; });
  const indices = [];
  diceArray.forEach((d, i) => {
    if (!d.locked && d.value) {
      if (d.value === 1 || d.value === 5 || counts[d.value] >= 3) indices.push(i);
    }
  });
  return indices;
};