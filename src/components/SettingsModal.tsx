import React, { useContext } from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { ThemeContext } from '../utils/themeContext';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SettingsModal: React.FC<Props> = ({ visible, onClose }) => {
  const { width } = useWindowDimensions();
  const { isDarkMode, toggleTheme, isSoundOn, toggleSound } = useContext(ThemeContext);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            {
              backgroundColor: isDarkMode ? '#222' : '#fff',
              borderColor: isDarkMode ? '#555' : '#ccc',
              width: width * 0.8,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: isDarkMode ? '#fff' : '#000' },
            ]}
          >
            Settings
          </Text>

          <Button
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            onPress={toggleTheme}
          />

          <View style={{ marginVertical: 10 }} />

          <Button
            title={isSoundOn ? 'Sound: On' : 'Sound: Off'}
            onPress={toggleSound}
          />

          <View style={{ marginVertical: 10 }} />

          <Button title="Close" onPress={onClose} />
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
  modal: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SettingsModal;