import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../theme/tokens';

const { width } = Dimensions.get('window');

const stats = [
  { icon: '🔥', label: 'Streak',     value: '7',    unit: 'ngày',   color: Colors.orange },
  { icon: '⏱',  label: 'Hôm nay',   value: '69',   unit: 'phút',   color: Colors.cyan },
  { icon: '📖',  label: 'Từ đã lưu', value: '10',   unit: 'từ',     color: Colors.green },
  { icon: '⭐',  label: 'Tổng XP',   value: '90',   unit: 'XP',     color: Colors.purple2 },
];

const weekDays = ['T2','T3','T4','T5','T6','T7','CN'];
const doneDays = [0,1,2,3,4]; // Mon–Fri done

const lessons = [
  { title: 'Saving water in deserts', level: 'B2', src: 'BBC', time: '6:14', pct: 34, emoji: '🌊' },
  { title: 'The future of AI',        level: 'C1', src: 'TED', time: '8:22', pct: 0,  emoji: '🤖' },
  { title: 'Daily English phrases',   level: 'A2', src: 'Daily', time: '4:10', pct: 100, emoji: '💬' },
  { title: 'Business English',        level: 'B1', src: 'BBC', time: '5:30', pct: 60, emoji: '💼' },
];

export default function DashboardScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Chào mừng trở lại! 👋</Text>
            <Text style={s.subtitle}>Tiếp tục phát huy hôm nay</Text>
          </View>
          <TouchableOpacity style={s.avatar}>
            <Text style={s.avatarText}>H</Text>
          </TouchableOpacity>
        </View>

        {/* ── Stats 2x2 grid ── */}
        <View style={s.statsGrid}>
          {stats.map((st, i) => (
            <View key={i} style={s.statCard}>
              <View style={[s.statIcon, { backgroundColor: st.color + '22' }]}>
                <Text style={s.statEmoji}>{st.icon}</Text>
              </View>
              <Text style={[s.statValue, { color: st.color }]}>{st.value}
                <Text style={s.statUnit}> {st.unit}</Text>
              </Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Weekly streak ── */}
        <View style={s.card}>
          <Text style={s.cardTitle}>📅 Tuần này</Text>
          <View style={s.weekRow}>
            {weekDays.map((d, i) => (
              <View key={i} style={s.weekItem}>
                <LinearGradient
                  colors={doneDays.includes(i)
                    ? [Colors.purple, Colors.pink]
                    : [Colors.bgSecondary, Colors.bgSecondary]}
                  style={[s.weekDot, !doneDays.includes(i) && s.weekDotEmpty]}
                >
                  {doneDays.includes(i)
                    ? <Ionicons name="checkmark" size={14} color="white" />
                    : <Text style={s.weekDotNum}>{i + 1}</Text>
                  }
                </LinearGradient>
                <Text style={s.weekLabel}>{d}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <View style={s.card}>
          <Text style={s.cardTitle}>⚡ Truy cập nhanh</Text>
          <View style={s.quickRow}>
            {[
              { icon: 'headset', label: 'Dictation', color: Colors.purple },
              { icon: 'mic',     label: 'Shadowing', color: Colors.pink },
              { icon: 'book',    label: 'Từ vựng',   color: Colors.green },
              { icon: 'search',  label: 'Từ điển',   color: Colors.cyan },
            ].map((a, i) => (
              <TouchableOpacity key={i} style={s.quickCard}>
                <View style={[s.quickIcon, { backgroundColor: a.color + '25' }]}>
                  <Ionicons name={a.icon as any} size={22} color={a.color} />
                </View>
                <Text style={s.quickLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Continue Learning ── */}
        <View style={[s.card, { paddingRight: 0 }]}>
          <Text style={[s.cardTitle, { marginBottom: Spacing.md }]}>📚 Tiếp tục học</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: Spacing.lg }}>
            {lessons.map((l, i) => (
              <TouchableOpacity key={i} style={s.lessonCard}>
                <View style={s.lessonThumb}>
                  <Text style={s.lessonEmoji}>{l.emoji}</Text>
                  <View style={[s.levelBadge, {
                    backgroundColor: l.level[0]==='C'?Colors.orange+'30':l.level[0]==='B'?Colors.cyan+'30':Colors.green+'30'
                  }]}>
                    <Text style={[s.levelText, {
                      color: l.level[0]==='C'?Colors.orange:l.level[0]==='B'?Colors.cyan:Colors.green
                    }]}>{l.level}</Text>
                  </View>
                  <View style={s.timeBadge}>
                    <Text style={s.timeText}>{l.time}</Text>
                  </View>
                </View>
                <View style={s.lessonInfo}>
                  <Text style={s.lessonTitle} numberOfLines={2}>{l.title}</Text>
                  <Text style={s.lessonSrc}>{l.src}</Text>
                  <View style={s.progressBar}>
                    <LinearGradient
                      colors={[Colors.purple, Colors.pink]}
                      style={[s.progressFill, { width: `${l.pct}%` }]}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity style={s.fab}>
        <LinearGradient colors={[Colors.purple, Colors.pink]} style={s.fabGrad}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Ionicons name="play" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.bgPrimary },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.lg },
  greeting:    { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  subtitle:    { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  avatar:      { width: 42, height: 42, borderRadius: 21,
                  backgroundColor: Colors.purple, alignItems: 'center', justifyContent: 'center',
                  ...Shadow.purple },
  avatarText:  { color: 'white', fontWeight: '800', fontSize: FontSize.md },

  statsGrid:   { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.md, gap: Spacing.sm,
                  marginBottom: Spacing.md },
  statCard:    { width: (width - Spacing.md * 2 - Spacing.sm) / 2,
                  backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
                  padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  statIcon:    { width: 36, height: 36, borderRadius: Radius.md,
                  alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xs },
  statEmoji:   { fontSize: 18 },
  statValue:   { fontSize: FontSize.xl, fontWeight: '900' },
  statUnit:    { fontSize: FontSize.sm, fontWeight: '400', color: Colors.textMuted },
  statLabel:   { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  card:        { backgroundColor: Colors.bgCard, marginHorizontal: Spacing.lg,
                  marginBottom: Spacing.md, borderRadius: Radius.lg, padding: Spacing.lg,
                  borderWidth: 1, borderColor: Colors.border },
  cardTitle:   { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },

  weekRow:     { flexDirection: 'row', justifyContent: 'space-between' },
  weekItem:    { alignItems: 'center', gap: 4 },
  weekDot:     { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  weekDotEmpty:{ borderWidth: 1.5, borderColor: Colors.border },
  weekDotNum:  { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '700' },
  weekLabel:   { fontSize: 9, color: Colors.textMuted, fontWeight: '700' },

  quickRow:    { flexDirection: 'row', gap: Spacing.sm },
  quickCard:   { flex: 1, alignItems: 'center', gap: Spacing.xs,
                  backgroundColor: Colors.bgSecondary, borderRadius: Radius.md,
                  padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  quickIcon:   { width: 42, height: 42, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  quickLabel:  { fontSize: 10, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },

  lessonCard:  { width: 160, backgroundColor: Colors.bgSecondary, borderRadius: Radius.md,
                  marginLeft: Spacing.lg, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  lessonThumb: { height: 90, backgroundColor: Colors.bgPrimary,
                  alignItems: 'center', justifyContent: 'center', position: 'relative' },
  lessonEmoji: { fontSize: 36 },
  levelBadge:  { position: 'absolute', top: 6, left: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  levelText:   { fontSize: 9, fontWeight: '800' },
  timeBadge:   { position: 'absolute', bottom: 6, right: 6,
                  backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  timeText:    { fontSize: 9, color: 'white' },
  lessonInfo:  { padding: Spacing.sm },
  lessonTitle: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3, lineHeight: 16 },
  lessonSrc:   { fontSize: 10, color: Colors.textMuted, marginBottom: 6 },
  progressBar: { height: 3, backgroundColor: Colors.bgPrimary, borderRadius: 2, overflow: 'hidden' },
  progressFill:{ height: 3, borderRadius: 2 },

  fab:         { position: 'absolute', bottom: 80, right: Spacing.lg },
  fabGrad:     { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
                  ...Shadow.purple },
});
