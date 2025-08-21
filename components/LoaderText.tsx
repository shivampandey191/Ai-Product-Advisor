import { COLORS } from "@/services/constants";
import MaskedView from "@react-native-masked-view/masked-view";
import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

const LoaderText = () => {
  return (
    <MaskedView
      style={styles.mask}
      maskElement={
        <Animated.Text style={styles.label}>Thinking...</Animated.Text>
      }
    >
      <Animated.View
        style={[
          styles.gradient,
          {
            animationName: {
              from: {
                transform: [{ translateX: "-25%" }],
              },
              to: {
                transform: [{ translateX: "25%" }],
              },
            },
            animationDuration: "3s",
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
          },
        ]}
      />
    </MaskedView>
  );
};

export default LoaderText;

const styles = StyleSheet.create({
  mask: {
    height: 30,
    width: 235,
  },
  gradient: {
    flex: 1,
    width: "300%",
    marginHorizontal: "-100%",
    experimental_backgroundImage: `linear-gradient(100deg, ${COLORS.brown} 46%, ${COLORS.aqua} 50%, ${COLORS.brown} 54%)`,
  },
  label: {
    color: COLORS.marine,
    fontSize: 18,
    fontWeight: "bold",
  },
});
