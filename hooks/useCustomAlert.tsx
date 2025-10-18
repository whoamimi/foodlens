/**
 * useCustomAlert Hook - Manage custom alert state
 * Provides a simple API similar to Alert.alert but with custom UI
 */

import { useState } from "react";
import { AlertButton } from "../components/CustomAlert";

interface AlertConfig {
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const showAlert = (
    title: string,
    message?: string,
    buttons?: AlertButton[]
  ) => {
    setAlertConfig({
      title,
      message,
      buttons: buttons || [{ text: "OK", style: "default" }],
    });
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
    // Clear config after animation completes
    setTimeout(() => setAlertConfig(null), 300);
  };

  return {
    alertConfig,
    visible,
    showAlert,
    hideAlert,
  };
};
