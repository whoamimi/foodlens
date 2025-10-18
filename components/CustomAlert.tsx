/**
 * CustomAlert Component - A custom alert dialog with codebase styling
 * Replaces React Native's Alert.alert with a styled alternative
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: "OK", style: "default" }],
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleButtonPress = (button: AlertButton) => {
    onClose();
    if (button.onPress) {
      // Small delay to allow modal to close smoothly
      setTimeout(() => button.onPress!(), 100);
    }
  };

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case "destructive":
        return "bg-destructive";
      case "cancel":
        return "bg-secondary";
      default:
        return "bg-primary";
    }
  };

  const getButtonTextStyle = (style?: string) => {
    switch (style) {
      case "destructive":
        return "text-destructive-foreground";
      case "cancel":
        return "text-secondary-foreground";
      default:
        return "text-primary-foreground";
    }
  };

  const getIconForTitle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("success")) {
      return { name: "checkmark-circle" as const, color: "#2e7d32" };
    }
    if (lowerTitle.includes("error") || lowerTitle.includes("failed")) {
      return { name: "close-circle" as const, color: "#c62828" };
    }
    if (lowerTitle.includes("warning")) {
      return { name: "warning" as const, color: "#f57c00" };
    }
    return { name: "information-circle" as const, color: "#2e7d32" };
  };

  const icon = getIconForTitle(title);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="flex-1 bg-black/50 items-center justify-center px-6"
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={{ transform: [{ scale: scaleAnim }] }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-border-light"
            >
              {/* Header with Icon */}
              <View className="items-center pt-8 pb-4 px-6 bg-white">
                <View className="bg-secondary rounded-full p-3 mb-4">
                  <Ionicons name={icon.name} size={32} color={icon.color} />
                </View>
                <Text className="text-foreground text-2xl font-bold text-center mb-2">
                  {title}
                </Text>
                {message && (
                  <Text className="text-muted-foreground text-base text-center leading-6">
                    {message}
                  </Text>
                )}
              </View>

              {/* Buttons */}
              <View className="px-6 pb-6 gap-3">
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleButtonPress(button)}
                    className={`py-4 rounded-xl items-center justify-center ${getButtonStyle(
                      button.style
                    )}`}
                    activeOpacity={0.8}
                  >
                    <Text
                      className={`text-base font-semibold ${getButtonTextStyle(
                        button.style
                      )}`}
                    >
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomAlert;
