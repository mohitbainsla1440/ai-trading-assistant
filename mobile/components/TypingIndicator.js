// TypingIndicator.js — Animated "AI thinking" dots

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

function Dot({ delay }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: -6, duration: 300, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.delay(600),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={[styles.dot, { transform: [{ translateY: anim }] }]} />
  );
}

export default function TypingIndicator() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.avatar}>
        <Animated.Text style={styles.avatarText}>📈</Animated.Text>
      </View>
      <View style={styles.bubble}>
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  avatarText: {
    fontSize: 14,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.aiBubble,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.bubble,
    borderBottomLeftRadius: 4,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: 5,
    height: 44,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.accent,
  },
});
