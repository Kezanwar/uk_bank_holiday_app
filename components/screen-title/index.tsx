import { Text } from "@/components/ui/text";
import React, { FC } from "react";
import { View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
};

const ScreenTitle: FC<Props> = ({ title, subtitle }) => {
  return (
    <View className="px-6 py-4">
      <Text className="text-3xl font-bold text-foreground">{title}</Text>
      {subtitle && (
        <Text className="text-muted-foreground mt-1">{subtitle}</Text>
      )}
    </View>
  );
};

export default ScreenTitle;
