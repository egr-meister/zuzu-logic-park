// Parent Settings — calm, simple controls. All local and offline.

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import DifficultyChip from "../components/DifficultyChip";
import { colors, layout } from "../theme/colors";
import { DIFFICULTIES } from "../data/taskItems";
import {
  loadAppData,
  updateSettings,
  clearAllData,
  DEFAULT_SETTINGS,
} from "../storage/appStorage";
import { disableKeepAwakeSafely } from "../utils/immersiveHelpers";

export default function ParentSettingsScreen({ navigation }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      disableKeepAwakeSafely();
      loadAppData().then((data) => {
        if (active) setSettings(data?.settings ?? DEFAULT_SETTINGS);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const apply = async (patch) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    await updateSettings(patch);
  };

  const onClearAll = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all local Zuzu progress?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const fresh = await clearAllData();
            setSettings(fresh?.settings ?? DEFAULT_SETTINGS);
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Parent Settings</Text>

      <SettingBlock
        label="Sound"
        note="Gentle success sounds can be turned off anytime."
      >
        <OnOffToggle
          value={settings?.soundEnabled ?? true}
          onChange={(v) => apply({ soundEnabled: v })}
        />
      </SettingBlock>

      <SettingBlock
        label="Default Difficulty"
        note="This level is pre-selected when starting a new task."
      >
        <View style={styles.row}>
          {DIFFICULTIES.map((d) => (
            <DifficultyChip
              key={d.id}
              difficulty={d}
              selected={(settings?.defaultDifficulty ?? "easy") === d.id}
              onPress={() => apply({ defaultDifficulty: d.id })}
            />
          ))}
        </View>
      </SettingBlock>

      <SettingBlock
        label="Hints"
        note="Hints appear after mistakes to help children continue calmly."
      >
        <OnOffToggle
          value={settings?.hintsEnabled ?? true}
          onChange={(v) => apply({ hintsEnabled: v })}
        />
      </SettingBlock>

      <SettingBlock
        label="Answer Animation"
        note="Answer animation is soft and can be turned off."
      >
        <OnOffToggle
          value={settings?.answerAnimationEnabled ?? true}
          onChange={(v) => apply({ answerAnimationEnabled: v })}
        />
      </SettingBlock>

      <SettingBlock
        label="Theme"
        note="Zuzu Logic Park uses a bright but calm park theme."
      >
        <View style={styles.themePill}>
          <Text style={styles.themePillText}>🌳 Zuzu Park</Text>
        </View>
      </SettingBlock>

      <InfoCard title="Achievement Progress">
        Achievements are simple learning markers inside the app. They have no
        money value.
      </InfoCard>

      <InfoCard title="Privacy Note">
        Zuzu Logic Park does not collect personal data. The app works offline and
        stores progress, statistics, achievements, and settings only on this
        device.
      </InfoCard>

      <InfoCard title="Child-Friendly Note">
        There are no ads, purchases, accounts, internet access, social sharing,
        leaderboards, coins, bonuses, jackpots, or real money rewards.
      </InfoCard>

      <View style={styles.buttons}>
        <AppButton
          label="Clear All Data"
          emoji="🧹"
          variant="danger"
          onPress={onClearAll}
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

function SettingBlock({ label, note, children }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockLabel}>{label}</Text>
      <View style={styles.blockControl}>{children}</View>
      {note ? <Text style={styles.blockNote}>{note}</Text> : null}
    </View>
  );
}

function OnOffToggle({ value, onChange }) {
  return (
    <View style={styles.toggleRow}>
      <ToggleButton label="On" active={value === true} onPress={() => onChange(true)} />
      <ToggleButton label="Off" active={value === false} onPress={() => onChange(false)} />
    </View>
  );
}

function ToggleButton({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.toggle, active ? styles.toggleActive : null]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.toggleText, active ? styles.toggleTextActive : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

function InfoCard({ title, children }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 12,
  },
  block: {
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  blockLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
  },
  blockControl: {
    marginBottom: 6,
  },
  blockNote: {
    fontSize: 13,
    color: colors.mutedText,
    lineHeight: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toggleRow: {
    flexDirection: "row",
  },
  toggle: {
    flex: 1,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderRadius: layout.radiusLarge,
    borderWidth: 2,
    borderColor: colors.border,
    marginHorizontal: 4,
  },
  toggleActive: {
    backgroundColor: colors.parkGrass,
    borderColor: colors.primary,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.mutedText,
  },
  toggleTextActive: {
    color: colors.primary,
  },
  themePill: {
    alignSelf: "flex-start",
    backgroundColor: colors.parkGrass,
    borderRadius: layout.radiusLarge,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  themePillText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },
  infoCard: {
    backgroundColor: colors.board,
    borderRadius: layout.radius,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: colors.mutedText,
    lineHeight: 20,
  },
  buttons: {
    marginTop: 6,
  },
});
