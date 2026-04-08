import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../theme/tokens';

const stats = [
  { icon:'🔥', label:'Streak hiện tại', value:'7 ngày',    color: Colors.orange },
  { icon:'⏱',  label:'TB mỗi ngày',     value:'69 phút',   color: Colors.cyan },
  { icon:'📖',  label:'Từ đã học',       value:'83 từ',     color: Colors.green },
  { icon:'✅',  label:'Độ chính xác',    value:'87%',       color: Colors.purple2 },
];

const weekData = [
  { day:'T2', min:45 }, { day:'T3', min:72 }, { day:'T4', min:30 },
  { day:'T5', min:90 }, { day:'T6', min:69 }, { day:'T7', min:20 }, { day:'CN', min:0 },
];
const maxMin = 90;

const modules = [
  { name:'Dictation',  icon:'🎧', min:210, sessions:12, accuracy:'87%', color: Colors.purple },
  { name:'Shadowing',  icon:'🎤', min:140, sessions:8,  accuracy:'72%', color: Colors.pink },
  { name:'Vocabulary', icon:'📝', min:95,  sessions:20, accuracy:'94%', color: Colors.green },
  { name:'Library',    icon:'📚', min:180, sessions:5,  accuracy:'—',  color: Colors.cyan },
];
const totalMin = modules.reduce((a, m) => a + m.min, 0);

export default function ProfileScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Profile card */}
        <LinearGradient colors={[Colors.purple + '30', Colors.pink + '15']} style={s.profileCard}>
          <View style={s.avatarWrap}>
            <LinearGradient colors={[Colors.purple, Colors.pink]} style={s.bigAvatar}>
              <Text style={s.bigAvatarText}>H</Text>
            </LinearGradient>
            <View style={s.onlineDot} />
          </View>
          <Text style={s.name}>Harvey Nè</Text>
          <Text style={s.username}>@harvey · 7 ngày streak 🔥</Text>
          <View style={s.lvlBadge}>
            <Text style={s.lvlText}>✨ Level B2 · Intermediate</Text>
          </View>
          <TouchableOpacity style={s.editBtn}>
            <Text style={s.editBtnText}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Overview stats */}
        <View style={s.statsRow}>
          {stats.map((st, i) => (
            <View key={i} style={s.statCard}>
              <View style={[s.statIcon, { backgroundColor: st.color + '20' }]}>
                <Text style={{ fontSize: 18 }}>{st.icon}</Text>
              </View>
              <Text style={[s.statVal, { color: st.color }]}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* Weekly bar chart */}
        <View style={s.card}>
          <Text style={s.cardTitle}>📊 Thời gian học / ngày (phút)</Text>
          <View style={s.chartRow}>
            {weekData.map((d, i) => {
              const barH = maxMin > 0 ? Math.round((d.min / maxMin) * 110) : 0;
              return (
                <View key={i} style={s.barCol}>
                  {d.min > 0 && (
                    <Text style={s.barLabel}>{d.min}</Text>
                  )}
                  <View style={s.barBg}>
                    {d.min > 0 ? (
                      <LinearGradient
                        colors={[Colors.purple, Colors.pink]}
                        style={[s.barFill, { height: barH }]}
                      />
                    ) : (
                      <View style={[s.barFill, { height: 4, backgroundColor: Colors.border }]} />
                    )}
                  </View>
                  <Text style={s.barDay}>{d.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Module breakdown */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🎯 Phân bổ thời gian</Text>
          {modules.map((m, i) => {
            const pct = Math.round((m.min / totalMin) * 100);
            return (
              <View key={i} style={{ marginBottom: Spacing.md }}>
                <View style={s.moduleRow}>
                  <View style={[s.moduleIcon, { backgroundColor: m.color + '20' }]}>
                    <Text style={{ fontSize: 14 }}>{m.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={s.moduleName}>{m.name}</Text>
                      <Text style={s.moduleMeta}>{m.min}m · {pct}%</Text>
                    </View>
                    <View style={s.moduleBar}>
                      <LinearGradient
                        colors={[Colors.purple, Colors.pink]}
                        style={[s.moduleBarFill, { width: `${pct}%` }]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Settings */}
        <View style={s.card}>
          <Text style={s.cardTitle}>⚙️ Cài đặt</Text>
          {[
            { icon: 'notifications-outline', label: 'Thông báo',        color: Colors.purple },
            { icon: 'moon-outline',           label: 'Giao diện tối',    color: Colors.cyan },
            { icon: 'language-outline',       label: 'Ngôn ngữ: Tiếng Việt', color: Colors.green },
            { icon: 'log-out-outline',         label: 'Đăng xuất',       color: Colors.red },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={s.settingRow}>
              <View style={[s.settingIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={s.settingLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: Colors.bgPrimary },
  profileCard:    { margin: Spacing.lg, borderRadius: Radius.xl, padding: Spacing.xl,
                     alignItems: 'center', borderWidth: 1, borderColor: Colors.purple + '30' },
  avatarWrap:     { position: 'relative', marginBottom: Spacing.sm },
  bigAvatar:      { width: 78, height: 78, borderRadius: 39, alignItems: 'center', justifyContent: 'center',
                     ...Shadow.purple },
  bigAvatarText:  { color: 'white', fontSize: 30, fontWeight: '900' },
  onlineDot:      { position: 'absolute', bottom: 4, right: 4, width: 14, height: 14,
                     borderRadius: 7, backgroundColor: Colors.green, borderWidth: 2, borderColor: Colors.bgPrimary },
  name:           { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textPrimary, marginBottom: 4 },
  username:       { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.sm },
  lvlBadge:       { backgroundColor: Colors.purple + '25', borderRadius: Radius.full,
                     paddingHorizontal: Spacing.md, paddingVertical: 4, marginBottom: Spacing.md,
                     borderWidth: 1, borderColor: Colors.purple + '40' },
  lvlText:        { fontSize: FontSize.sm, color: Colors.purple2, fontWeight: '700' },
  editBtn:        { backgroundColor: Colors.bgCard, borderRadius: Radius.full,
                     paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm,
                     borderWidth: 1, borderColor: Colors.border },
  editBtnText:    { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '600' },

  statsRow:       { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.md,
                     gap: Spacing.sm, marginBottom: Spacing.md },
  statCard:       { flex: 1, minWidth: '22%', backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
                     padding: Spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, gap: 3 },
  statIcon:       { width: 34, height: 34, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  statVal:        { fontSize: FontSize.base, fontWeight: '900' },
  statLabel:      { fontSize: 9, color: Colors.textMuted, textAlign: 'center' },

  card:           { backgroundColor: Colors.bgCard, marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
                     borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  cardTitle:      { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },

  chartRow:       { flexDirection: 'row', alignItems: 'flex-end', height: 130 },
  barCol:         { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 3 },
  barLabel:       { fontSize: 9, color: Colors.purple2, fontWeight: '700' },
  barBg:          { width: '70%', justifyContent: 'flex-end' },
  barFill:        { width: '100%', borderRadius: 4, minHeight: 4 },
  barDay:         { fontSize: 9, color: Colors.textMuted, fontWeight: '600' },

  moduleRow:      { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  moduleIcon:     { width: 32, height: 32, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  moduleName:     { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  moduleMeta:     { fontSize: 10, color: Colors.textMuted },
  moduleBar:      { height: 5, backgroundColor: Colors.bgPrimary, borderRadius: 3, overflow: 'hidden' },
  moduleBarFill:  { height: 5, borderRadius: 3 },

  settingRow:     { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
                     paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  settingIcon:    { width: 34, height: 34, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  settingLabel:   { flex: 1, fontSize: FontSize.base, color: Colors.textPrimary },
});
