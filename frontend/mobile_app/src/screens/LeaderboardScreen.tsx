import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../theme/tokens';

const users = [
  { rank:1, name:'Bạn',           xp:60, time:'1h 9m', streak:7,  avatar:'B', me:true },
  { rank:2, name:'Harvey Nguyen', xp:40, time:'45m',   streak:5,  avatar:'H', me:false },
  { rank:3, name:'Harvey Test',   xp:20, time:'30m',   streak:3,  avatar:'H', me:false },
  { rank:4, name:'MinhTran',      xp:15, time:'25m',   streak:2,  avatar:'M', me:false },
  { rank:5, name:'LinhPham',      xp:10, time:'18m',   streak:1,  avatar:'L', me:false },
  { rank:6, name:'AnhDo',         xp:8,  time:'12m',   streak:1,  avatar:'A', me:false },
  { rank:7, name:'TuanLe',        xp:5,  time:'8m',    streak:0,  avatar:'T', me:false },
];

const medals: Record<number, string> = { 1:'🥇', 2:'🥈', 3:'🥉' };
const xpColors: Record<number, string> = {
  1: Colors.orange, 2: '#94a3b8', 3: '#c2976a',
};

const TABS = ['Tuần này', 'Tháng này', 'Tất cả'];

export default function LeaderboardScreen() {
  const [tab, setTab] = useState(0);

  return (
    <SafeAreaView style={s.safe}>
      <FlatList
        data={users}
        keyExtractor={u => String(u.rank)}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View style={s.header}>
              <Text style={s.heading}>Xếp Hạng 🏆</Text>
              <Text style={s.sub}>Cạnh tranh cùng cộng đồng</Text>
            </View>

            {/* Tabs */}
            <View style={s.tabs}>
              {TABS.map((t, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setTab(i)}
                  style={[s.tabBtn, i === tab && s.tabActive]}
                >
                  <Text style={[s.tabText, i === tab && s.tabTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Podium */}
            <View style={s.podium}>
              {/* 2nd */}
              <View style={[s.podiumItem, { marginTop: 24 }]}>
                <View style={[s.podiumAvatar, { backgroundColor: '#374151' }]}>
                  <Text style={s.podiumAvatarText}>H</Text>
                </View>
                <Text style={s.podiumName}>Harvey N.</Text>
                <Text style={s.podiumXp}>40 XP</Text>
                <View style={[s.podiumBar, { height: 64, backgroundColor: '#4b5563' + '50' }]}>
                  <Text style={{ fontSize: 28 }}>🥈</Text>
                </View>
              </View>
              {/* 1st */}
              <View style={s.podiumItem}>
                <LinearGradient colors={[Colors.purple, Colors.pink]} style={[s.podiumAvatar, { width: 56, height: 56, borderRadius: 28 }]}>
                  <Text style={[s.podiumAvatarText, { fontSize: 20 }]}>B</Text>
                </LinearGradient>
                <Text style={[s.podiumName, { fontWeight: '900', color: Colors.textPrimary }]}>Bạn 👑</Text>
                <Text style={[s.podiumXp, { color: Colors.purple2, fontWeight: '800' }]}>60 XP</Text>
                <LinearGradient
                  colors={[Colors.purple + '40', Colors.purple + '15']}
                  style={[s.podiumBar, { height: 96 }]}
                >
                  <Text style={{ fontSize: 34 }}>🥇</Text>
                </LinearGradient>
              </View>
              {/* 3rd */}
              <View style={[s.podiumItem, { marginTop: 36 }]}>
                <View style={[s.podiumAvatar, { backgroundColor: '#374151' }]}>
                  <Text style={s.podiumAvatarText}>H</Text>
                </View>
                <Text style={s.podiumName}>Harvey T.</Text>
                <Text style={s.podiumXp}>20 XP</Text>
                <View style={[s.podiumBar, { height: 48, backgroundColor: '#c2976a' + '25' }]}>
                  <Text style={{ fontSize: 24 }}>🥉</Text>
                </View>
              </View>
            </View>

            <View style={s.listHeader}>
              <Text style={s.listTitle}>Bảng xếp hạng đầy đủ</Text>
            </View>
          </>
        )}
        renderItem={({ item: u }) => (
          <View style={[s.row, u.me && s.rowMe]}>
            <Text style={[s.rank, { color: xpColors[u.rank] ?? Colors.textMuted, fontSize: u.rank <= 3 ? 20 : 14 }]}>
              {medals[u.rank] ?? u.rank}
            </Text>
            <LinearGradient
              colors={u.me ? [Colors.purple, Colors.pink] : ['#374151', '#4b5563']}
              style={s.avatar}
            >
              <Text style={s.avatarText}>{u.avatar}</Text>
            </LinearGradient>
            <View style={s.userInfo}>
              <Text style={s.userName}>
                {u.name} {u.me && <Text style={{ color: Colors.purple2, fontSize: 11 }}>(Bạn)</Text>}
              </Text>
              <Text style={s.userMeta}>🔥 {u.streak} ngày · {u.time}</Text>
            </View>
            {/* XP bar */}
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Text style={[s.xpText, { color: xpColors[u.rank] ?? Colors.purple2 }]}>{u.xp} XP</Text>
              <View style={s.xpBar}>
                <LinearGradient
                  colors={[Colors.purple, Colors.pink]}
                  style={[s.xpFill, { width: Math.round((u.xp / 60) * 80) }]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Colors.bgPrimary },
  header:        { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  heading:       { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  sub:           { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },

  tabs:          { flexDirection: 'row', marginHorizontal: Spacing.lg, marginBottom: Spacing.lg,
                    backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: 4,
                    borderWidth: 1, borderColor: Colors.border },
  tabBtn:        { flex: 1, paddingVertical: 7, borderRadius: Radius.md, alignItems: 'center' },
  tabActive:     { backgroundColor: Colors.purple + '30' },
  tabText:       { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textMuted },
  tabTextActive: { color: Colors.purple2 },

  podium:        { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end',
                    paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl, gap: Spacing.md },
  podiumItem:    { flex: 1, alignItems: 'center', gap: 4 },
  podiumAvatar:  { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center',
                    ...Shadow.purple },
  podiumAvatarText:{ color: 'white', fontWeight: '800', fontSize: FontSize.md },
  podiumName:    { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary, textAlign: 'center' },
  podiumXp:      { fontSize: FontSize.xs, color: Colors.textMuted },
  podiumBar:     { width: '100%', borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },

  listHeader:    { paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  listTitle:     { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },

  row:           { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
                    marginHorizontal: Spacing.lg, marginBottom: 8,
                    backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
                    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  rowMe:         { borderColor: Colors.purple + '50', backgroundColor: Colors.purple + '10' },
  rank:          { width: 28, textAlign: 'center', fontWeight: '800' },
  avatar:        { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText:    { color: 'white', fontWeight: '800', fontSize: FontSize.base },
  userInfo:      { flex: 1 },
  userName:      { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  userMeta:      { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  xpText:        { fontSize: FontSize.sm, fontWeight: '800' },
  xpBar:         { width: 80, height: 4, backgroundColor: Colors.bgPrimary, borderRadius: 2, overflow: 'hidden' },
  xpFill:        { height: 4, borderRadius: 2 },
});
