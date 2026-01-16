// src/components/Card.tsx
import { EMOJIS } from '../utils/cardUtils';
import React, { useEffect, useRef } from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  View,
  Text,
  StyleSheet,
} from 'react-native';

type Props = {
  value: number;
  isFlipped: boolean;
  shouldCelebrate: boolean;
  onPress: () => void;
  width: number;
  height: number;
};

const Card: React.FC<Props> = ({
  value,
  isFlipped,
  shouldCelebrate,
  onPress,
  width,
  height,
}) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 10,
    }).start();
  }, [isFlipped]);

  useEffect(() => {
    if (shouldCelebrate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.15,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ).start();
    }
  }, [shouldCelebrate]);

  const frontRotation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View
        style={[
          styles.card,
          {
            width,
            height,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.face,
            styles.front,
            {
              transform: [{ rotateY: frontRotation }],
              width,
              height,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.face,
            styles.back,
            {
              transform: [{ rotateY: backRotation }],
              width,
              height,
            },
          ]}
        >
          <Text style={styles.cardText}>{EMOJIS[value]}</Text>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 4,
  },
  face: {
    position: 'absolute',
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  front: {
    backgroundColor: '#4A90E2',
    borderColor: '#888',
  },
  back: {
    backgroundColor: '#0647a9',
    borderColor: '#333',
  },
  cardText: {
    fontSize: 28,
  },
});

export default Card;