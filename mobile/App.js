// App.js — AI Trading Assistant (Expo Go compatible)

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import axios from 'axios';

import ChatBubble from './components/ChatBubble';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import MarketTicker from './components/MarketTicker';
import SuggestedQueries from './components/SuggestedQueries';
import { useChat } from './hooks/useChat';
import { COLORS, SPACING } from './constants/theme';
import { ENDPOINTS } from './constants/config';

export default function App() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [snapshot, setSnapshot] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const flatListRef = useRef(null);

  // Fetch market snapshot on mount
  useEffect(() => {
    const fetchSnapshot = async () => {
      try {
        const res = await axios.get(ENDPOINTS.snapshot, { timeout: 5000 });
        if (res.data.success) setSnapshot(res.data.data);
      } catch {
        // Silent fail — ticker just won't show
      }
    };
    fetchSnapshot();
    const interval = setInterval(fetchSnapshot, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, isLoading]);

  const handleSend = (query) => {
    setShowSuggestions(false);
    sendMessage(query);
  };

  const handleSuggestion = (query) => {
    setShowSuggestions(false);
    sendMessage(query);
  };

  const handleClear = () => {
    Alert.alert('Clear Chat', 'Reset the conversation?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          clearChat();
          setShowSuggestions(true);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => <ChatBubble message={item} />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>📊</Text>
          <View>
            <Text style={styles.headerTitle}>AI Trading Assistant</Text>
            <Text style={styles.headerSubtitle}>NSE/BSE • Powered by AI</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
          <Text style={styles.clearText}>New Chat</Text>
        </TouchableOpacity>
      </View>

      {/* ── Market Ticker ── */}
      <MarketTicker snapshot={snapshot} />

      {/* ── Chat Area ── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isLoading ? <TypingIndicator /> : null}
          removeClippedSubviews={false}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* ── Suggested Queries ── */}
        <SuggestedQueries onSelect={handleSuggestion} visible={showSuggestions && !isLoading} />

        {/* ── Input ── */}
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerIcon: {
    fontSize: 26,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '500',
  },
  clearBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  messageList: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
});
