import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, ScrollView, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthParamList } from '../../navigation/AppNavigator';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../theme/tokens';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<AuthParamList, 'Landing'>;
};

const features = [
  { icon: '🎧', title: 'Dictation',   desc: 'Luyện nghe từ video thực tế BBC, CNN, TED',  color: Colors.purple },
  { icon: '🎤', title: 'Shadowing',   desc: 'Luyện phát âm bằng cách bắt chước người bản ngữ', color: Colors.pink },
  { icon: '📚', title: 'Thư Viện',   desc: '500+ video học tập được tuyển chọn kỹ lưỡng',  color: Colors.cyan },
  { icon: '📝', title: 'Từ Vựng',    desc: 'Flashcard thông minh giúp ghi nhớ từ lâu hơn',  color: Colors.green },
  { icon: '🏆', title: 'Xếp Hạng',  desc: 'Cạnh tranh với cộng đồng, duy trì động lực',    color: Colors.orange },
  { icon: '🤖', title: 'AI Chat',    desc: 'Trợ lý AI giải thích ngữ pháp và từ vựng',      color: Colors.purple2 },
];

const stats = [
  { value: '1000+', label: 'Học viên', icon: '👥' },
  { value: '500+',  label: 'Video',    icon: '🎬' },
  { value: '5.0',   label: 'Đánh giá', icon: '⭐' },
];

export default function LandingScreen({ navigation }: Props) {
  // Floating animation for hero card
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 800, useNativeDriver: true,
    }).start();

    // Float loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0,   duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Navbar ── */}
        <Animated.View style={[s.nav, { opacity: fadeAnim }]}>
          <LinearGradient colors={[Colors.purple, Colors.pink]} style={s.navLogo}>
            <Text style={s.navLogoText}>S</Text>
          </LinearGradient>
          <Text style={s.navBrand}>S English</Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={s.navLoginBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={s.navLoginText}>Đăng nhập</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Hero Section ── */}
        <Animated.View style={[s.hero, { opacity: fadeAnim }]}>
          {/* Glow blobs */}
          <View style={[s.blob, s.blob1]} />
          <View style={[s.blob, s.blob2]} />

          <Text style={s.heroTag}>🚀 Nền tảng học tiếng Anh #1</Text>

          <Text style={s.heroTitle}>
            Thành thạo{'\n'}
            <Text style={s.heroTitleGrad}>Tiếng Anh{'\n'}</Text>
            mỗi ngày
          </Text>

          <Text style={s.heroDesc}>
            Học Dictation, Shadowing và từ vựng qua video thực tế.{'\n'}
            Phương pháp được 1000+ học viên tin dùng.
          </Text>

          {/* Hero preview card (floating) */}
          <Animated.View style={[s.heroCard, { transform: [{ translateY: floatAnim }] }]}>
            <LinearGradient colors={[Colors.bgCard, Colors.bgSecondary]} style={s.heroCardInner}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={s.heroCardRow}>
                <View style={s.heroCardIcon}>
                  <Text style={{ fontSize: 20 }}>🎧</Text>
                </View>
                <View>
                  <Text style={s.heroCardTitle}>Saving water...</Text>
                  <Text style={s.heroCardSub}>BBC · B2 · 6:14</Text>
                </View>
                <View style={{ flex: 1 }} />
                <LinearGradient colors={[Colors.purple, Colors.pink]} style={s.heroPlayBtn}>
                  <Ionicons name="play" size={14} color="white" />
                </LinearGradient>
              </View>
              <View style={s.heroProgress}>
                <LinearGradient colors={[Colors.purple, Colors.pink]} style={[s.heroProgressFill, { width: '34%' }]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
              </View>
              <Text style={s.heroProgressText}>34% hoàn thành</Text>

              {/* Mini badges */}
              <View style={s.heroBadges}>
                {['🔥 7 ngày', '⭐ 90 XP', '📖 10 từ'].map((b, i) => (
                  <View key={i} style={s.heroBadge}>
                    <Text style={s.heroBadgeText}>{b}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </Animated.View>

          {/* CTA Buttons */}
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ width: '100%' }}>
            <LinearGradient colors={[Colors.purple, Colors.pink]}
              style={s.ctaPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={s.ctaPrimaryText}>🚀 Bắt đầu miễn phí</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={s.ctaSecondary} onPress={() => navigation.navigate('Login')}>
            <Text style={s.ctaSecondaryText}>Đã có tài khoản? Đăng nhập</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Stats ── */}
        <View style={s.statsRow}>
          {stats.map((st, i) => (
            <View key={i} style={s.statItem}>
              <Text style={s.statIcon}>{st.icon}</Text>
              <Text style={s.statValue}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Features ── */}
        <View style={s.section}>
          <Text style={s.sectionTag}>✨ Tính năng</Text>
          <Text style={s.sectionTitle}>Tất cả những gì bạn cần</Text>

          <View style={s.featuresGrid}>
            {features.map((f, i) => (
              <View key={i} style={s.featureCard}>
                <View style={[s.featureIcon, { backgroundColor: f.color + '20' }]}>
                  <Text style={{ fontSize: 22 }}>{f.icon}</Text>
                </View>
                <Text style={s.featureTitle}>{f.title}</Text>
                <Text style={s.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Testimonial ── */}
        <View style={s.section}>
          <Text style={s.sectionTag}>💬 Học viên nói gì</Text>
          {[
            { name:'Minh Trần', level:'B2', text:'Sau 3 tháng dùng app, IELTS của mình tăng từ 6.0 lên 7.0!', avatar:'M' },
            { name:'Linh Phạm', level:'C1', text:'Phương pháp Dictation thực sự hiệu quả, nghe BBC rõ hơn nhiều.', avatar:'L' },
          ].map((t, i) => (
            <View key={i} style={s.testimonialCard}>
              <View style={s.testimonialHeader}>
                <LinearGradient colors={[Colors.purple, Colors.pink]} style={s.testimonialAvatar}>
                  <Text style={s.testimonialAvatarText}>{t.avatar}</Text>
                </LinearGradient>
                <View>
                  <Text style={s.testimonialName}>{t.name}</Text>
                  <Text style={s.testimonialLevel}>Level {t.level}</Text>
                </View>
                <View style={{ flex: 1 }} />
                <Text style={{ color: Colors.orange }}>⭐⭐⭐⭐⭐</Text>
              </View>
              <Text style={s.testimonialText}>"{t.text}"</Text>
            </View>
          ))}
        </View>

        {/* ── Final CTA ── */}
        <LinearGradient colors={[Colors.purple + '30', Colors.pink + '20']}
          style={s.finalCta} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={s.finalCtaTitle}>Bắt đầu hành trình{'\n'}học tiếng Anh hôm nay</Text>
          <Text style={s.finalCtaSub}>Miễn phí · Không cần thẻ tín dụng · Hủy bất kỳ lúc nào</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <LinearGradient colors={[Colors.purple, Colors.pink]} style={s.finalCtaBtn}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={s.finalCtaBtnText}>🎯 Đăng ký ngay — Miễn phí</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <LinearGradient colors={[Colors.purple, Colors.pink]} style={s.footerLogo}>
            <Text style={{ color: 'white', fontWeight: '900', fontSize: 16 }}>S</Text>
          </LinearGradient>
          <Text style={s.footerText}>© 2025 S English · Học tiếng Anh mỗi ngày</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: Colors.bgPrimary },

  // Navbar
  nav:             { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg,
                     paddingVertical: Spacing.md, gap: Spacing.sm },
  navLogo:         { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  navLogoText:     { color: 'white', fontWeight: '900', fontSize: 16 },
  navBrand:        { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary },
  navLoginBtn:     { paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: Radius.full,
                     borderWidth: 1, borderColor: Colors.purple + '60' },
  navLoginText:    { fontSize: FontSize.sm, color: Colors.purple2, fontWeight: '600' },

  // Hero
  hero:            { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, alignItems: 'center', overflow: 'hidden' },
  blob:            { position: 'absolute', borderRadius: 999, opacity: 0.15 },
  blob1:           { width: 250, height: 250, backgroundColor: Colors.purple, top: -60, left: -80 },
  blob2:           { width: 200, height: 200, backgroundColor: Colors.pink,   top: 100, right: -60 },
  heroTag:         { backgroundColor: Colors.purple + '25', paddingHorizontal: Spacing.md, paddingVertical: 5,
                     borderRadius: Radius.full, fontSize: FontSize.sm, color: Colors.purple2,
                     fontWeight: '700', marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.purple + '40' },
  heroTitle:       { fontSize: 34, fontWeight: '900', color: Colors.textPrimary, textAlign: 'center', lineHeight: 42 },
  heroTitleGrad:   { color: Colors.purple2 },
  heroDesc:        { fontSize: FontSize.base, color: Colors.textSecondary, textAlign: 'center',
                     lineHeight: 22, marginTop: Spacing.md, marginBottom: Spacing.xl },

  // Hero Card
  heroCard:        { width: '100%', marginBottom: Spacing.xl, ...Shadow.purple },
  heroCardInner:   { borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  heroCardRow:     { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  heroCardIcon:    { width: 42, height: 42, borderRadius: Radius.md, backgroundColor: Colors.purple + '20',
                     alignItems: 'center', justifyContent: 'center' },
  heroCardTitle:   { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  heroCardSub:     { fontSize: FontSize.xs, color: Colors.textMuted },
  heroPlayBtn:     { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  heroProgress:    { height: 5, backgroundColor: Colors.bgPrimary, borderRadius: 3, marginBottom: 5, overflow: 'hidden' },
  heroProgressFill:{ height: 5, borderRadius: 3 },
  heroProgressText:{ fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.md },
  heroBadges:      { flexDirection: 'row', gap: 8 },
  heroBadge:       { backgroundColor: Colors.bgPrimary, paddingHorizontal: 8, paddingVertical: 3,
                     borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border },
  heroBadgeText:   { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },

  // CTAs
  ctaPrimary:      { width: '100%', borderRadius: Radius.lg, paddingVertical: 16,
                     alignItems: 'center', marginBottom: Spacing.md, ...Shadow.purple },
  ctaPrimaryText:  { color: 'white', fontSize: FontSize.md, fontWeight: '800' },
  ctaSecondary:    { paddingVertical: Spacing.sm, marginBottom: Spacing.xl },
  ctaSecondaryText:{ fontSize: FontSize.base, color: Colors.textMuted },

  // Stats
  statsRow:        { flexDirection: 'row', marginHorizontal: Spacing.lg, marginBottom: Spacing.xl,
                     backgroundColor: Colors.bgCard, borderRadius: Radius.xl, padding: Spacing.lg,
                     borderWidth: 1, borderColor: Colors.border },
  statItem:        { flex: 1, alignItems: 'center', gap: 3 },
  statIcon:        { fontSize: 22 },
  statValue:       { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textPrimary },
  statLabel:       { fontSize: FontSize.xs, color: Colors.textMuted },

  // Features
  section:         { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  sectionTag:      { fontSize: FontSize.sm, color: Colors.purple2, fontWeight: '700',
                     marginBottom: Spacing.xs, textAlign: 'center' },
  sectionTitle:    { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textPrimary,
                     textAlign: 'center', marginBottom: Spacing.lg },
  featuresGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  featureCard:     { width: (width - Spacing.lg * 2 - Spacing.sm) / 2, backgroundColor: Colors.bgCard,
                     borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  featureIcon:     { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center',
                     justifyContent: 'center', marginBottom: Spacing.sm },
  featureTitle:    { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  featureDesc:     { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 16 },

  // Testimonials
  testimonialCard: { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.lg,
                     borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  testimonialHeader:{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  testimonialAvatar:{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  testimonialAvatarText:{ color: 'white', fontWeight: '800', fontSize: FontSize.md },
  testimonialName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  testimonialLevel:{ fontSize: FontSize.xs, color: Colors.purple2 },
  testimonialText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },

  // Final CTA
  finalCta:        { margin: Spacing.lg, borderRadius: Radius.xl, padding: Spacing.xl,
                     alignItems: 'center', borderWidth: 1, borderColor: Colors.purple + '30' },
  finalCtaTitle:   { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textPrimary,
                     textAlign: 'center', marginBottom: Spacing.sm, lineHeight: 30 },
  finalCtaSub:     { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.lg },
  finalCtaBtn:     { borderRadius: Radius.lg, paddingVertical: 14, paddingHorizontal: Spacing.xl,
                     alignItems: 'center', ...Shadow.purple },
  finalCtaBtnText: { color: 'white', fontWeight: '800', fontSize: FontSize.base },

  // Footer
  footer:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                     gap: Spacing.sm, paddingVertical: Spacing.xl },
  footerLogo:      { width: 28, height: 28, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  footerText:      { fontSize: FontSize.xs, color: Colors.textMuted },
});
