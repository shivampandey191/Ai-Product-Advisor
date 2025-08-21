import { PRODUCT_CATALOG } from "@/data/catalog";
import { aiSuggestProducts } from "@/services/ai";
import { COLORS } from "@/services/constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedText from "./AnimatedText";
import RenderMessage from "./RenderMessage";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function InputArea() {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const ref = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isSending, setSending] = useState(false);
  const [text, setText] = useState<string>("");

  const [history, setHistory] = useState<
    Array<{ user: string; ai: any | null; loading?: boolean }>
  >([]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    saveChatHistory();
  }, [history]);

  const loadChatHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem("chatHistory");
      if (savedHistory !== null) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const saveChatHistory = async () => {
    try {
      await AsyncStorage.setItem("chatHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  async function handleQuery(query: string) {
    setHistory((prev) => [...prev, { user: query, ai: null, loading: true }]);

    try {
      const r = await aiSuggestProducts({
        query,
        catalog: PRODUCT_CATALOG,
        apiKey,
      });
      setHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          user: query,
          ai: r,
          loading: false,
        };
        return newHistory;
      });
    } catch (err) {
      console.error(err);
      setHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          user: query,
          ai: { error: "Something went wrong" },
          loading: false,
        };
        return newHistory;
      });
    }
  }

  const handleSend = () => {
    if (!text.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSending(true);
    handleQuery(text.trim());

    setTimeout(() => {
      ref.current?.blur();
      ref.current?.clear();
      setText("");
      setSending(false);
    }, 600);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            {history.length ? (
              <FlatList
                data={history}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => <RenderMessage item={item} />}
                contentContainerStyle={styles.flatListContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
                scrollEnabled={true}
                bounces={true}
                onContentSizeChange={() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }}
                onLayout={() => {
                  setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                  }, 50);
                }}
                ref={flatListRef}
              />
            ) : (
              <AnimatedText />
            )}
          </View>

          <View style={styles.footer}>
            <TextInput
              ref={ref}
              style={styles.input}
              placeholder="Ask..."
              value={text}
              placeholderTextColor={COLORS.marine}
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              onChangeText={(t) => setText(t)}
            />
            <Animated.View
              style={{
                transitionProperty: ["transform", "opacity"],
                transitionDuration: "200ms",
                transform: [
                  { scale: isPressed ? 0.8 : 1 },
                  { translateY: isSending ? -200 : 0 },
                ],
                opacity: isSending ? 0 : 1,
              }}
            >
              <AnimatedPressable
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                onPress={() => handleSend()}
                style={[
                  styles.sendButton,
                  {
                    transitionProperty: ["opacity", "marginLeft", "transform"],
                    transitionDuration: "300ms",
                    opacity: isFocused ? 1 : 0,
                    marginLeft: isFocused ? 0 : -50,
                    transform: [{ translateX: isFocused ? 0 : 58 }],
                  },
                ]}
              >
                <AntDesign name="arrowup" size={24} color="white" />
              </AnimatedPressable>
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    flex: 1,
    width: "100%",
  },
  flatListContent: {
    padding: 12,
    paddingBottom: 80,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 0.8,
    borderColor: COLORS.marine,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: COLORS.marine,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 8,
    backgroundColor: COLORS.white,
    gap: 8,
  },
});
