import { Text } from "react-native";

export function AppText({ style, children, ...props }) {
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
