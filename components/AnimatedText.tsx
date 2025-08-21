import { COLORS } from "@/services/constants";
import MaskedView from "@react-native-masked-view/masked-view";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const AnimatedText = () => {
  return (
    <View style={{ flex: 1 }}>
      <MaskedView
        style={styles.maskView}
        maskElement={
          <View style={styles.mask}>
            {"Product Advisor".split("").map((char, index) => (
              <Animated.Text
                style={styles.greeting}
                key={index}
                entering={FadeInDown.delay(index * 33)
                  .springify()
                  .mass(2)}
              >
                {char}
              </Animated.Text>
            ))}
          </View>
        }
      >
        <Animated.View
          style={[
            styles.gradient,
            {
              animationName: {
                to: {
                  transform: [{ rotate: "360deg" }],
                },
              },
              animationDuration: "3s",
              animationIterationCount: "infinite",
            },
          ]}
        ></Animated.View>
      </MaskedView>
    </View>
  );
};

export default AnimatedText;

const styles = StyleSheet.create({
  greeting: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
  },
  gradient: {
    experimental_backgroundImage: `linear-gradient(90deg,${COLORS.marine} 40%,${COLORS.aqua} 80%)`,
    width: "100%",
    height: "100%",
  },
  mask: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  maskView: { flex: 1, flexDirection: "row", height: "100%" },
});
