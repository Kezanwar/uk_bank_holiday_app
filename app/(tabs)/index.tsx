import Holidays from "@/components/holidays";
import ScreenTitle from "@/components/screen-title";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScreenTitle
        title="Bank Holidays"
        subtitle="England, Wales, Scotland and Northern Ireland"
      />
      <Holidays />
    </SafeAreaView>
  );
}
