// Park Zone map — pick a learning station before choosing group/difficulty.

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ScreenContainer from "../components/ScreenContainer";
import ParkZoneCard from "../components/ParkZoneCard";
import AppButton from "../components/AppButton";
import { colors } from "../theme/colors";
import { PARK_ZONE_ITEMS } from "../data/parkZoneItems";
import { loadAppData } from "../storage/appStorage";
import { disableKeepAwakeSafely } from "../utils/immersiveHelpers";

export default function ParkZoneScreen({ navigation }) {
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      disableKeepAwakeSafely();
      loadAppData().then((data) => {
        if (active) setStats(data?.stats ?? null);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const zones = PARK_ZONE_ITEMS ?? [];

  const onContinue = () => {
    if (!selectedZoneId) {
      setError("Please choose a park zone.");
      return;
    }
    setError("");
    const zone = zones.find((z) => z.id === selectedZoneId);
    navigation.navigate("TaskPicker", {
      zoneId: selectedZoneId,
      taskMode: zone?.taskMode ?? "odd_item",
    });
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Choose a Park Zone</Text>
      <Text style={styles.subtitle}>
        Each station has a different kind of thinking game.
      </Text>

      {zones.map((zone) => (
        <ParkZoneCard
          key={zone.id}
          zone={zone}
          selected={selectedZoneId === zone.id}
          completedCount={stats?.byTaskMode?.[zone.taskMode]?.completed ?? 0}
          onPress={() => {
            setSelectedZoneId(zone.id);
            setError("");
          }}
        />
      ))}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttons}>
        <AppButton
          label="Continue"
          emoji="➡️"
          variant="primary"
          onPress={onContinue}
        />
        <AppButton
          label="Back Home"
          emoji="🏠"
          variant="secondary"
          onPress={() => navigation.navigate("ZuzuHome")}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.mutedText,
    marginBottom: 14,
  },
  error: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  buttons: {
    marginTop: 12,
  },
});
