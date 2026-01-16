// src/components/GameOverPopup.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Button,
  useColorScheme,
} from 'react-native';

interface Props {
  visible: boolean;
  onViewStats: () => void;
  onPlayAgain: () => void;
}

const GameOverPopup: React.FC<Props> = ({
  visible,
  onViewStats,
  onPlayAgain,
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[
            styles.popup,
            { backgroundColor: isDarkMode ? '#333' : '#fff' },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: isDarkMode ? '#fff' : '#000' },
            ]}
          >
            🎉 Game Over!
          </Text>

          <Text
            style={[
              styles.message,
              { color: isDarkMode ? '#ccc' : '#333' },
            ]}
          >
            What would you like to do?
          </Text>

          <View style={styles.buttonGroup}>
            <Button title="Play Again" onPress={onPlayAgain} />
            <View style={{ height: 10 }} />
            <Button title="View Stats" onPress={onViewStats} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonGroup: {
    justifyContent: 'center',
  },
});

export default GameOverPopup;