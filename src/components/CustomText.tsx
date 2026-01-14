// components/CustomText.tsx
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

const CustomText: React.FC<TextProps> = ({ style, children, ...rest }) => {
  return (
    <Text {...rest} style={[styles.text, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Regular',
  },
});

export default CustomText;