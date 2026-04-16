// ChatInput.js — Message input bar

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.94, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const hasText = text.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Ask about Nifty, BankNifty, strategies..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          maxLength={400}
          returnKeyType="default"
          onSubmitEditing={Platform.OS === 'ios' ? handleSend : undefined}
          editable={!disabled}
          selectionColor={COLORS.accent}
        />

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.sendButton,
              hasText && !disabled ? styles.sendButtonActive : styles.sendButtonInactive,
            ]}
            onPress={handleSend}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={!hasText || disabled}
            activeOpacity={0.85}
          >
            <Animated.Text style={styles.sendIcon}>
              {disabled ? '⏳' : '➤'}
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: COLORS.accent,
  },
  sendButtonInactive: {
    backgroundColor: COLORS.bgCard,
  },
  sendIcon: {
    fontSize: 15,
    color: COLORS.bg,
  },
});
