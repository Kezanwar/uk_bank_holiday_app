import { Holiday, useHolidaysStore } from "@/stores/holidays";
import { router } from "expo-router";
import { Delete } from "lucide-react-native";
import { useRef } from "react";
import { Alert, View } from "react-native";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

const formatDay = (dateStr: string): string => {
  return new Date(dateStr).getDate().toString();
};

const formatDayName = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-GB", { weekday: "long" });
};

const DeleteAction = ({
  progress,
  onPress,
}: {
  progress: SharedValue<number>;
  onPress: () => void;
}) => {
  const springProgress = useSharedValue(0);

  useAnimatedReaction(
    () => progress.value,
    (current) => {
      springProgress.value = withSpring(current, {
        damping: 50,
        stiffness: 300,
      });
    },
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: (1 - springProgress.value) * 30 },
        { scale: springProgress.value },
      ],
    };
  });

  return (
    <Animated.View
      className={"w-14 h-14 items-center justify-center  rounded-lg "}
      style={animatedStyle}
    >
      <Button
        className="h-14 w-14 rounded-r-none"
        variant="destructive"
        onPress={onPress}
      >
        <Delete size={20} color={"white"} />
      </Button>
    </Animated.View>
  );
};

interface HolidayItemProps {
  holiday: Holiday;
}

const HolidayItem = ({ holiday }: HolidayItemProps) => {
  const swipeableRef = useRef<SwipeableMethods>(null);
  const isSwipeOpen = useRef(false);

  const { removeHoliday } = useHolidaysStore();

  const handleRemove = () => {
    Alert.alert(
      "Delete Holiday",
      `Are you sure you want to delete "${holiday.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            swipeableRef.current?.close();
            removeHoliday(holiday.uuid);
          },
        },
      ],
    );
  };

  const renderRightActions = (
    progress: SharedValue<number>,
    dragX: SharedValue<number>,
  ) => {
    return <DeleteAction progress={progress} onPress={handleRemove} />;
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={1}
      onSwipeableWillOpen={() => {
        isSwipeOpen.current = true;
      }}
      onSwipeableWillClose={() => {
        isSwipeOpen.current = false;
      }}
    >
      <Button
        variant="ghost"
        onPress={() => {
          if (!isSwipeOpen.current) {
            router.push({
              pathname: "/event",
              params: { uuid: holiday.uuid },
            });
          }
        }}
        className="flex-row items-center justify-start  py-2 h-14 px-6"
      >
        <View className="w-6 items-center">
          <Text systemBlue className="text-md font-bold">
            {formatDay(holiday.date)}
          </Text>
        </View>
        <View className="ml-1 border-l border-border pl-4">
          <Text className="text-sm mb-1 text-muted-foreground">
            {formatDayName(holiday.date)}
          </Text>
          <Text className="text-md font-semibold">{holiday.title}</Text>
        </View>
      </Button>
    </Swipeable>
  );
};

export default HolidayItem;
