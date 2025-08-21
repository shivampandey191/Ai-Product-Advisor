import MaskedView from "@react-native-masked-view/masked-view";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

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
      {/* User bubble */}
      <View
        style={{
          alignSelf: "flex-end",
          backgroundColor: "#3b82f6",
          borderRadius: 12,
          padding: 10,
          maxWidth: "80%",
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>{item?.user}</Text>
      </View>

      <View
        style={{
          alignSelf: "flex-start",
          marginTop: 8,
          backgroundColor: "#f1f5f9",
          borderRadius: 12,
          padding: 12,
          maxWidth: "85%",
        }}
      >
        {item?.loading ? (
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
        ) : recommendations ? (
          <>
            {query_understanding && (
              <Text style={{ fontStyle: "italic", marginBottom: 6 }}>
                🤖 Understood: {query_understanding}
              </Text>
            )}
            {recommendations.length ? (
              recommendations.map((rec: any, index: number) => (
                <View key={index} style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    ➡️ {rec?.product_name}
                  </Text>
                  <Text style={{ color: "#334155" }}>{rec?.why}</Text>
                </View>
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
  mask: {
    height: 60,
    width: 235,
  },
  gradient: {
    flex: 1,
    width: "300%",
    marginHorizontal: "-100%",
    experimental_backgroundImage:
      "linear-gradient(100deg, #422006 46%, #facc15 50%, #422006 54%)",
  },
  label: {
    color: "#422006",
    fontSize: 18,
    fontWeight: "bold",
  },
});
