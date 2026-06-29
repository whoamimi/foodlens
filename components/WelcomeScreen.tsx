import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingVertical: 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-between">
          {/* Logo and Title Section */}
          <View className="items-center mt-12">
            {/* Official Logo */}
            <View className="mb-8 bg-primary rounded-full">
              <Image
                source={require("../assets/images/icon.png")}
                style={{ width: 130, height: 130 }}
                resizeMode="contain"
              />
            </View>

            {/* App Title */}
            <Text className="text-5xl font-black text-foreground tracking-tight mb-3">
              Dewy
            </Text>

            {/* Tagline */}
            <Text className="text-xl text-foreground text-center font-semibold mb-1">
              Eat for the skin
            </Text>
            <Text className="text-xl text-muted-foreground text-center font-semibold">
              you want tomorrow.
            </Text>
          </View>

          {/* Feature Cards */}
          <View className="gap-3 w-full mt-12">
            {/* Scan Feature */}
            <View className="bg-card flex-row items-center rounded-2xl px-5 py-5 shadow-sm border border-border-light">
              <View className="bg-accent rounded-full w-14 h-14 items-center justify-center mr-4">
                <Ionicons name="camera" size={26} color="#a3431f" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground mb-1">
                  Scan any meal
                </Text>
                <Text className="text-sm text-muted-foreground font-medium">
                  Macros and micros, instantly
                </Text>
              </View>
            </View>

            {/* Breakdown Feature */}
            <View className="bg-card flex-row items-center rounded-2xl px-5 py-5 shadow-sm border border-border-light">
              <View className="bg-secondary rounded-full w-14 h-14 items-center justify-center mr-4">
                <Ionicons name="stats-chart" size={26} color="#8c2e44" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground mb-1">
                  See what's missing
                </Text>
                <Text className="text-sm text-muted-foreground font-medium">
                  Nutrients that support skin and hair
                </Text>
              </View>
            </View>

            {/* Glow Score Feature */}
            <View className="bg-card flex-row items-center rounded-2xl px-5 py-5 shadow-sm border border-border-light">
              <View className="bg-primary/10 rounded-full w-14 h-14 items-center justify-center mr-4">
                <Ionicons name="sparkles" size={26} color="#b34a5c" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground mb-1">
                  Glow score
                </Text>
                <Text className="text-sm text-muted-foreground font-medium">
                  Get ahead of deficits before they show
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Section */}
          <View className="mt-12 mb-8">
            {/* Get Started Button */}
            <TouchableOpacity
              className="bg-primary w-full rounded-full py-5 px-6 items-center active:opacity-90 mb-4 shadow-lg"
              onPress={onGetStarted}
              activeOpacity={0.8}
            >
              <Text className="text-primary-foreground font-black text-xl tracking-wide">
                Start your glow profile
              </Text>
            </TouchableOpacity>

            {/* Info text */}
            <Text className="text-sm text-muted-foreground font-medium text-center px-6">
              Not a substitute for medical or dermatological advice
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
