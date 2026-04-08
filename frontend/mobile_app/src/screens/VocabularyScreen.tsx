import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize } from '../theme/tokens';

const words = [
  { id:'1', word:'Perseverance', phonetic:'/ˌpɜːrsɪˈvɪərəns/', meaning:'Sự kiên trì', level:'C1', learned:true },
  { id:'2', word:'Eloquent',     phonetic:'/ˈeləkwənt/',       meaning:'Hùng hồn, lưu loát', level:'B2', learned:true },
  { id:'3', word:'Ambiguous',    phonetic:'/æmˈbɪɡjuəs/',      meaning:'Mơ hồ, không rõ ràng', level:'B2', learned:false },
  { id:'4', word:'Meticulous',   phonetic:'/məˈtɪkjələs/',     meaning:'Tỉ mỉ, cẩn thận', level:'C1', learned:false },
  { id:'5', word:'Resilient',    phonetic:'/rɪˈzɪliənt/',      meaning:'Kiên cường, phục hồi tốt', level:'B2', learned:true },
  { id:'6', word:'Pragmatic',    phonetic:'/præɡˈmætɪk/',      meaning:'Thực tế, thực dụng', level:'C1', learned:false },
  { id:'7', word:'Tenacious',    phonetic:'/təˈneɪʃəs/',       meaning:'Bền bỉ, kiên quyết', level:'C1', learned:false },
  { id:'8', word:'Diligent',     phonetic:'/ˈdɪlɪdʒənt/',      meaning:'Chăm chỉ, cần cù', level:'B1', learned:true },
];

const learned  = words.filter(w => w.learned).length;
const toReview = words.filter(w => !w.learned).length;

export default function VocabularyScreen() {
  const renderWord = ({ item: w }: { item: typeof words[0] }) => (
    <View style={s.wordCard}>
      <View style={s.wordLeft}>
        <Text style={s.wordText}>{w.word}</Text>
        <Text style={s.phonetic}>{w.phonetic}</Text>
        <Text style={s.meaning} numberOfLines={1}>{w.meaning}</Text>
      </View>
      <View style={s.wordRight}>
        <View style={[s.levelBadge, {
          backgroundColor: w.level[0]==='C'?Colors.orange+'25':w.level[0]==='B'?Colors.cyan+'25':Colors.green+'25'
        }]}>
          <Text style={[s.levelText, {
            color: w.level[0]==='C'?Colors.orange:w.level[0]==='B'?Colors.cyan:Colors.green
          }]}>{w.level}</Text>
        </View>
        <View style={[s.statusBadge, { backgroundColor: w.learned ? Colors.green+'20' : Colors.orange+'20' }]}>
          <Text style={[s.statusText, { color: w.learned ? Colors.green : Colors.orange }]}>
            {w.learned ? '✓ Thuộc' : '⟳ Ôn'}
          </Text>
        </View>
        <TouchableOpacity style={s.soundBtn}>
          <Ionicons name="volume-high-outline" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.heading}>Từ Vựng 📝</Text>
        <TouchableOpacity style={s.addBtn}>
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={s.statsRow}>
        {[
          { icon:'📚', label:'Tổng',   value: words.length, color: Colors.purple2 },
          { icon:'✅', label:'Thuộc',  value: learned,      color: Colors.green },
          { icon:'🔄', label:'Cần ôn', value: toReview,     color: Colors.orange },
        ].map((st, i) => (
          <View key={i} style={s.statItem}>
            <Text style={[s.statVal, { color: st.color }]}>{st.value}</Text>
            <Text style={s.statLabel}>{st.icon} {st.label}</Text>
          </View>
        ))}
      </View>

      {/* Flashcard CTA */}
      <TouchableOpacity style={s.flashBanner}>
        <View>
          <Text style={s.flashTitle}>🃏 Luyện Flashcard</Text>
          <Text style={s.flashSub}>{toReview} từ cần ôn tập hôm nay</Text>
        </View>
        <Text style={s.flashCTA}>Bắt đầu →</Text>
      </TouchableOpacity>

      {/* Search */}
      <View style={s.searchWrap}>
        <Ionicons name="search" size={15} color={Colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={s.searchInput}
          placeholder="Tìm từ vựng..."
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* Word list */}
      <FlatList
        data={words}
        keyExtractor={i => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={renderWord}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.bgPrimary },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                   paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.md },
  heading:      { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  addBtn:       { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.purple, alignItems: 'center', justifyContent: 'center' },
  statsRow:     { flexDirection: 'row', marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
                   backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.md,
                   borderWidth: 1, borderColor: Colors.border },
  statItem:     { flex: 1, alignItems: 'center', gap: 2 },
  statVal:      { fontSize: FontSize.xl, fontWeight: '900' },
  statLabel:    { fontSize: FontSize.xs, color: Colors.textMuted },
  flashBanner:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                   marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
                   backgroundColor: Colors.purple + '20', borderRadius: Radius.lg,
                   padding: Spacing.md, borderWidth: 1, borderColor: Colors.purple + '40' },
  flashTitle:   { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  flashSub:     { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  flashCTA:     { fontSize: FontSize.base, fontWeight: '700', color: Colors.purple2 },
  searchWrap:   { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard,
                   marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
                   borderRadius: Radius.full, paddingHorizontal: Spacing.md,
                   paddingVertical: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  searchInput:  { flex: 1, color: Colors.textPrimary, fontSize: FontSize.base, padding: 0 },
  wordCard:     { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard,
                   borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  wordLeft:     { flex: 1 },
  wordText:     { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary },
  phonetic:     { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  meaning:      { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 3 },
  wordRight:    { alignItems: 'flex-end', gap: 6 },
  levelBadge:   { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.sm },
  levelText:    { fontSize: 10, fontWeight: '800' },
  statusBadge:  { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.sm },
  statusText:   { fontSize: 10, fontWeight: '700' },
  soundBtn:     { padding: 4 },
});
