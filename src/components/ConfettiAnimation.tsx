// components/ConfettiAnimation.tsx
import React from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';
import { View, StyleSheet } from 'react-native';

const ConfettiAnimation = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      <ConfettiCannon
        count={150}
        origin={{ x: -10, y: 0 }}
        fadeOut
        fallSpeed={3000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
});

export default ConfettiAnimation;