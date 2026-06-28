// Simple stack navigation for Zuzu Logic Park.
// Headers are hidden because the app runs fullscreen and each screen draws its
// own friendly top area.

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ZuzuHomeScreen from "../screens/ZuzuHomeScreen";
import ParkZoneScreen from "../screens/ParkZoneScreen";
import TaskPickerScreen from "../screens/TaskPickerScreen";
import LogicTaskScreen from "../screens/LogicTaskScreen";
import SortingTaskScreen from "../screens/SortingTaskScreen";
import TaskResultScreen from "../screens/TaskResultScreen";
import AchievementsScreen from "../screens/AchievementsScreen";
import ParentSettingsScreen from "../screens/ParentSettingsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ZuzuHome"
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: "#F3FFE8" },
      }}
    >
      <Stack.Screen name="ZuzuHome" component={ZuzuHomeScreen} />
      <Stack.Screen name="ParkZone" component={ParkZoneScreen} />
      <Stack.Screen name="TaskPicker" component={TaskPickerScreen} />
      <Stack.Screen name="LogicTask" component={LogicTaskScreen} />
      <Stack.Screen name="SortingTask" component={SortingTaskScreen} />
      <Stack.Screen name="TaskResult" component={TaskResultScreen} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} />
      <Stack.Screen name="ParentSettings" component={ParentSettingsScreen} />
    </Stack.Navigator>
  );
}
