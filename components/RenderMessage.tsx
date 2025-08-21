import { COLORS } from "@/services/constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import LoaderText from "./LoaderText";

type Recommendation = {
  product_name: string;
  why: string;
};

type AiData = {
  query_understanding?: string;
  recommendations?: Recommendation[];
  error?: string;
};

export type MessageItem = {
  user: string;
  loading: boolean;
  ai?: AiData;
};

type RenderMessageProps = {
  item: MessageItem;
};

const RenderMessage = ({ item }: RenderMessageProps) => {
  const { recommendations, query_understanding, error }: AiData =
    item?.ai || {};
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={styles.prompt}>
        <Text style={{ color: "white", fontSize: 16 }}>{item?.user}</Text>
      </View>

      <View style={styles.wrapper}>
        {item?.loading ? (
          <LoaderText />
        ) : recommendations ? (
          <>
            {query_understanding && (
              <Animated.Text
                entering={FadeInUp.delay(150)}
                style={styles.headerText}
              >
                🤖 Understood: {query_understanding}
              </Animated.Text>
            )}
            {recommendations.length ? (
              recommendations.map((rec: any, index: number) => (
                <Animated.View
                  entering={FadeInUp.delay(150)}
                  key={index}
                  style={{ marginBottom: 12 }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: COLORS.marine,
                    }}
                  >
                    ➡️ {rec?.product_name}
                  </Text>
                  <Text>{rec?.why}</Text>
                </Animated.View>
              ))
            ) : (
              <Text style={{ fontWeight: "bold" }}>
                🚫 Sorry, no recommendations found.
              </Text>
            )}
          </>
        ) : (
          <Text style={{ color: "red" }}>{error || "No response"}</Text>
        )}
      </View>
    </View>
  );
};

export default RenderMessage;

const styles = StyleSheet.create({
  headerText: {
    fontStyle: "italic",
    marginBottom: 10,
    fontWeight: "500",
  },
  prompt: {
    alignSelf: "flex-end",
    borderRadius: 12,
    padding: 10,
    maxWidth: "80%",
    experimental_backgroundImage: `linear-gradient(100deg,  ${COLORS.marine},${COLORS.marine},${COLORS.aqua})`,
  },
  wrapper: {
    alignSelf: "flex-start",
    marginTop: 8,
    backgroundColor: COLORS.light_grey,
    borderRadius: 12,
    padding: 12,
    maxWidth: "85%",
  },
});
