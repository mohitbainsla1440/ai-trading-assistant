// ChatBubble.js — Chat message bubble component

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

// Parse AI response sections for colored formatting
function parseAIResponse(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    let color = COLORS.textPrimary;
    let weight = '400';
    let size = 13;

    if (line.startsWith('MARKET STATUS:') || line.startsWith('TREND:') ||
        line.startsWith('VOLATILITY:') || line.startsWith('RISK LEVEL:')) {
      color = COLORS.accent;
      weight = '700';
      size = 13;
    } else if (line.startsWith('BEST TRADE:') || line.startsWith('WHY THIS TRADE:') ||
               line.startsWith('NEWS IMPACT:')) {
      color = COLORS.textPrimary;
      weight = '700';
      size = 14;
    } else if (line.startsWith('Strategy:')) {
      color = COLORS.bullish;
      weight = '700';
    } else if (line.startsWith('Stop Loss:')) {
      color = COLORS.danger;
      weight = '600';
    } else if (line.startsWith('Exit (Target):') || line.startsWith('Exit:')) {
      color = COLORS.success;
      weight = '600';
    } else if (line.startsWith('Risk-Reward:')) {
      color = COLORS.warning;
      weight = '600';
    } else if (line.startsWith('⚠️')) {
      color = COLORS.textMuted;
      size = 11;
      weight = '400';
    }

    return { line, color, weight, size, key: i };
  });
}

export default function ChatBubble({ message }) {
  const { role, content, timestamp, isError } = message;
  const isUser = role === 'user';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();
  }, []);

  const parsedLines = !isUser ? parseAIResponse(content) : null;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        isUser ? styles.wrapperUser : styles.wrapperAI,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Avatar */}
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>📈</Text>
        </View>
      )}

      <View style={[
        styles.bubble,
        isUser ? styles.bubbleUser : styles.bubbleAI,
        isError && styles.bubbleError,
      ]}>
        {isUser ? (
          <Text style={styles.userText}>{content}</Text>
        ) : (
          <View>
            {parsedLines?.map(({ line, color, weight, size, key }) => (
              line.trim() === '' ? (
                <View key={key} style={{ height: 6 }} />
              ) : (
                <Text key={key} style={[styles.aiLine, { color, fontWeight: weight, fontSize: size }]}>
                  {line}
                </Text>
              )
            ))}
          </View>
        )}
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>

      {isUser && (
        <View style={[styles.avatar, styles.avatarUser]}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    alignItems: 'flex-end',
  },
  wrapperUser: {
    justifyContent: 'flex-end',
  },
  wrapperAI: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.xs,
    flexShrink: 0,
  },
  avatarUser: {
    backgroundColor: COLORS.userBubble,
  },
  avatarText: {
    fontSize: 14,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: RADIUS.bubble,
    padding: SPACING.md,
  },
  bubbleUser: {
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: COLORS.aiBubble,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: 4,
  },
  bubbleError: {
    borderColor: COLORS.danger,
    backgroundColor: '#2D1B1B',
  },
  userText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  aiLine: {
    lineHeight: 20,
  },
  timestamp: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: SPACING.xs,
    alignSelf: 'flex-end',
  },
});
