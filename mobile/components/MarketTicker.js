// MarketTicker.js — Top market snapshot bar

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

const TickerItem = ({ symbol, ltp, changePct }) => {
  const isUp = changePct >= 0;
  return (
    <View style={styles.tickerItem}>
      <Text style={styles.tickerSymbol}>{symbol}</Text>
      <Text style={styles.tickerLtp}>₹{ltp?.toLocaleString('en-IN')}</Text>
      <Text style={[styles.tickerChange, { color: isUp ? COLORS.bullish : COLORS.bearish }]}>
        {isUp ? '▲' : '▼'} {Math.abs(changePct).toFixed(2)}%
      </Text>
    </View>
  );
};

export default function MarketTicker({ snapshot }) {
  if (!snapshot) return null;

  const { nifty50, banknifty, topStocks = [] } = snapshot;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {nifty50 && (
          <TickerItem symbol="NIFTY 50" ltp={nifty50.ltp} changePct={nifty50.changePct} />
        )}
        {banknifty && (
          <TickerItem symbol="BANK NIFTY" ltp={banknifty.ltp} changePct={banknifty.changePct} />
        )}
        {topStocks.slice(0, 3).map((s) => (
          <TickerItem key={s.symbol} symbol={s.symbol} ltp={s.ltp} changePct={s.change} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.sm,
  },
  scroll: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  tickerItem: {
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    minWidth: 110,
    marginRight: SPACING.sm,
  },
  tickerSymbol: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tickerLtp: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginVertical: 1,
  },
  tickerChange: {
    fontSize: 11,
    fontWeight: '600',
  },
});
