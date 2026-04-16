// SuggestedQueries.js — Quick-tap query chips

import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { SUGGESTED_QUERIES } from '../constants/config';

export default function SuggestedQueries({ onSelect, visible }) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Suggested queries</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {SUGGESTED_QUERIES.map((q, i) => (
          <TouchableOpacity key={i} style={styles.chip} onPress={() => onSelect(q)} activeOpacity={0.7}>
            <Text style={styles.chipText}>{q}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 11,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scroll: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  chip: {
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    marginRight: SPACING.sm,
  },
  chipText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '500',
  },
});
