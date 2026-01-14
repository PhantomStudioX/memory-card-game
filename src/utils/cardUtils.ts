// utils/cardUtils.ts

export type CardType = {
  id: number;
  value: number;
};

export const generateShuffledCards = (totalCards: number): CardType[] => {
  const pairCount = Math.floor(totalCards / 2);
  const cardValues: number[] = [];

  for (let i = 0; i < pairCount; i++) {
    cardValues.push(i, i); // two of each value
  }

  // Shuffle the card values
  for (let i = cardValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardValues[i], cardValues[j]] = [cardValues[j], cardValues[i]];
  }

  return cardValues.map((value, index) => ({
    id: index,
    value,
  }));
};