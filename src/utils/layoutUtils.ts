// src/utils/layoutUtils.ts
import { Dimensions } from 'react-native';

export const getCardLayout = () => {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = height / width;

  if (width >= 768) {
    // Tablet
    return { columns: 5, totalCards: 30 }; // 5x6
  } else if (aspectRatio > 1.9) {
    // Small/narrow phone
    return { columns: 4, totalCards: 12 }; // 4x3
  } else {
    // Larger phone
    return { columns: 4, totalCards: 16 }; // 4x4
  }
};