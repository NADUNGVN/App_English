import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../theme/tokens';

export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={s.logoWrap}>
            <LinearGradient colors={[Colors.purple, Colors.pink]} style={s.logoMark}>
              <Text style={s.logoLetter}>S</Text>
            </LinearGradient>
            <Text style={s.appName}>S English</Text>
            <Text style={s.tagline}>Học tiếng Anh thú vị & hiệu quả</Text>
          </View>

          {/* Card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Đăng nhập</Text>

            {/* Google OAuth */}
            <TouchableOpacity style={s.oauthBtn}>
              <Text style={{ fontSize: 20 }}>🌐</Text>
              <Text style={s.oauthText}>Tiếp tục với Google</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={s.divider}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>hoặc</Text>
              <View style={s.dividerLine} />
            </View>

            {/* Email */}
            <Text style={s.label}>Email</Text>
            <View style={s.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
              <TextInput
                style={s.input}
                placeholder="email@example.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <Text style={s.label}>Mật khẩu</Text>
            <View style={s.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
              <TextInput
                style={[s.input, { flex: 1 }]}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Forgot */}
            <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: Spacing.lg }}>
              <Text style={{ fontSize: FontSize.sm, color: Colors.purple2 }}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Submit */}
            <TouchableOpacity>
              <LinearGradient
                colors={[Colors.purple, Colors.pink]}
                style={s.submitBtn}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={s.submitText}>Đăng nhập</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Register link */}
            <View style={s.footer}>
              <Text style={{ color: Colors.textMuted, fontSize: FontSize.sm }}>Chưa có tài khoản? </Text>
              <TouchableOpacity>
                <Text style={{ color: Colors.purple2, fontWeight: '700', fontSize: FontSize.sm }}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll:      { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
  logoWrap:    { alignItems: 'center', marginBottom: Spacing['3xl'] },
  logoMark:    { width: 64, height: 64, borderRadius: Radius.lg,
                  alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm, ...Shadow.purple },
  logoLetter:  { color: 'white', fontSize: 32, fontWeight: '900' },
  appName:     { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.textPrimary },
  tagline:     { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 4 },
  card:        { backgroundColor: Colors.bgCard, borderRadius: Radius.xl, padding: Spacing.xl,
                  borderWidth: 1, borderColor: Colors.border },
  cardTitle:   { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.lg },
  oauthBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
                  backgroundColor: Colors.bgSecondary, borderWidth: 1, borderColor: Colors.border,
                  borderRadius: Radius.md, paddingVertical: Spacing.md, marginBottom: Spacing.lg },
  oauthText:   { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  divider:     { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: FontSize.sm, color: Colors.textMuted },
  label:       { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  inputWrap:   { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgPrimary,
                  borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
                  paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, marginBottom: Spacing.md },
  input:       { color: Colors.textPrimary, fontSize: FontSize.base },
  submitBtn:   { borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center', ...Shadow.purple },
  submitText:  { color: 'white', fontSize: FontSize.base, fontWeight: '800' },
  footer:      { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
});
