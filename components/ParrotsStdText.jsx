import { Text } from "react-native";

export function ParrotsStdText({ style, children, ...props }) {
  return (
    <Text
      style={style}
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
      {...props}
    >
      {children}
    </Text>
  );
}
