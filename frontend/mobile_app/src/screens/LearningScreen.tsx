import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize } from '../theme/tokens';

const { width } = Dimensions.get('window');
const CARD_W = (width - Spacing.lg * 2 - Spacing.sm) / 2;

const categories = ['Tất cả', 'BBC', 'CNN', 'TED', 'Daily'];
const levels     = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'];

const lessons = [
  { id:'1', title:'Saving water in driest place', level:'B2', src:'BBC', time:'6:14', pct:34,  emoji:'🌊', desc:'Environmental issues' },
  { id:'2', title:'The future of AI technology', level:'C1', src:'TED', time:'8:22', pct:0,   emoji:'🤖', desc:'Technology' },
  { id:'3', title:'Morning routine phrases',      level:'A1', src:'Daily',time:'3:10',pct:100, emoji:'🌅', desc:'Daily life' },
  { id:'4', title:'Business email writing',       level:'B1', src:'BBC', time:'5:30', pct:60,  emoji:'💼', desc:'Business' },
  { id:'5', title:'Travel English essentials',    level:'A2', src:'CNN', time:'4:45', pct:20,  emoji:'✈️', desc:'Travel' },
  { id:'6', title:'Debating skills advanced',     level:'C1', src:'TED', time:'9:00', pct:0,   emoji:'🎤', desc:'Speaking' },
  { id:'7', title:'News vocabulary 2024',         level:'B2', src:'CNN', time:'5:15', pct:0,   emoji:'📰', desc:'Current events' },
  { id:'8', title:'Hello & introductions',        level:'A1', src:'Daily',time:'2:30',pct:100, emoji:'👋', desc:'Basics' },
];

export default function LearningScreen() {
  const [search,  setSearch]  = useState('');
  const [cat,     setCat]     = useState('Tất cả');
  const [level,   setLevel]   = useState('All');

  const filtered = lessons.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase());
    const matchCat    = cat === 'Tất cả' || l.src === cat;
    const matchLevel  = level === 'All'   || l.level === level;
    return matchSearch && matchCat && matchLevel;
  });

  const renderLesson = ({ item: l }: { item: typeof lessons[0] }) => (
    <TouchableOpacity style={[s.card, { width: CARD_W }]}>
      <View style={s.thumb}>
        <Text style={s.emoji}>{l.emoji}</Text>
        <View style={[s.badge, {
          backgroundColor: l.level[0]==='C'?Colors.orange+'30':l.level[0]==='B'?Colors.cyan+'30':Colors.green+'30'
        }]}>
          <Text style={[s.badgeText, {
            color: l.level[0]==='C'?Colors.orange:l.level[0]==='B'?Colors.cyan:Colors.green
          }]}>{l.level}</Text>
        </View>
        <View style={s.timeBadge}>
          <Text style={s.timeText}>{l.time}</Text>
        </View>
        {l.pct === 100 && (
          <View style={s.doneBadge}>
            <Ionicons name="checkmark-circle" size={18} color={Colors.green} />
          </View>
        )}
      </View>
      <View style={s.info}>
        <Text style={s.title} numberOfLines={2}>{l.title}</Text>
        <Text style={s.src}>{l.src} · {l.desc}</Text>
        {l.pct > 0 && l.pct < 100 && (
          <View style={s.progressWrap}>
            <View style={s.progressBg}>
              <LinearGradient
                colors={[Colors.purple, Colors.pink]}
                style={[s.progressFill, { width: `${l.pct}%` }]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={s.pct}>{l.pct}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.heading}>Thư Viện 📚</Text>
        <Text style={s.headingSub}>{filtered.length} bài học</Text>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Ionicons name="search" size={16} color={Colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={s.searchInput}
          placeholder="Tìm bài học..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category pills */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={i => i}
        style={{ maxHeight: 40, marginBottom: 8 }}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setCat(item)}
            style={[s.pill, cat === item && s.pillActive]}
          >
            <Text style={[s.pillText, cat === item && s.pillTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Level pills */}
      <FlatList
        data={levels}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={i => i}
        style={{ maxHeight: 36, marginBottom: Spacing.md }}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: 6 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setLevel(item)}
            style={[s.levelPill, level === item && s.levelPillActive]}
          >
            <Text style={[s.levelPillText, level === item && { color: Colors.purple2, fontWeight: '800' }]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: 20 }}
        columnWrapperStyle={{ gap: Spacing.sm }}
        renderItem={renderLesson}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 40 }}>🔍</Text>
            <Text style={{ color: Colors.textMuted, marginTop: 12 }}>Không tìm thấy bài học</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: Colors.bgPrimary },
  header:         { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  heading:        { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  headingSub:     { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  searchWrap:     { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard,
                     marginHorizontal: Spacing.lg, marginBottom: Spacing.sm,
                     borderRadius: Radius.full, paddingHorizontal: Spacing.md,
                     paddingVertical: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  searchInput:    { flex: 1, color: Colors.textPrimary, fontSize: FontSize.base, padding: 0 },
  pill:           { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full,
                     borderWidth: 1, borderColor: Colors.border, backgroundColor: 'transparent' },
  pillActive:     { borderColor: Colors.purple, backgroundColor: Colors.purple + '20' },
  pillText:       { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  pillTextActive: { color: Colors.purple2 },
  levelPill:      { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.sm,
                     borderWidth: 1, borderColor: Colors.border },
  levelPillActive:{ borderColor: Colors.purple, backgroundColor: Colors.purple + '15' },
  levelPillText:  { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '700' },
  card:           { backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
                     borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  thumb:          { height: 100, backgroundColor: Colors.bgSecondary,
                     alignItems: 'center', justifyContent: 'center', position: 'relative' },
  emoji:          { fontSize: 38 },
  badge:          { position: 'absolute', top: 6, left: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText:      { fontSize: 9, fontWeight: '800' },
  timeBadge:      { position: 'absolute', bottom: 6, right: 6,
                     backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  timeText:       { fontSize: 9, color: 'white' },
  doneBadge:      { position: 'absolute', top: 6, right: 6 },
  info:           { padding: Spacing.sm },
  title:          { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textPrimary, lineHeight: 16, marginBottom: 3 },
  src:            { fontSize: 10, color: Colors.textMuted, marginBottom: 5 },
  progressWrap:   { flexDirection: 'row', alignItems: 'center', gap: 5 },
  progressBg:     { flex: 1, height: 3, backgroundColor: Colors.bgPrimary, borderRadius: 2, overflow: 'hidden' },
  progressFill:   { height: 3, borderRadius: 2 },
  pct:            { fontSize: 9, color: Colors.purple2, fontWeight: '700' },
});
