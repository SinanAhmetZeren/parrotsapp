import React, { useRef, useEffect } from "react";
import { Animated } from "react-native";

const LoadingLogo = ({ size = 80, style }) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.7, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.Image
      source={require("../assets/parrotsiconpaddedtransparent.png")}
      style={[{ width: size, height: size, resizeMode: "contain", opacity: pulseAnim }, style]}
    />
  );
};

export default LoadingLogo;
