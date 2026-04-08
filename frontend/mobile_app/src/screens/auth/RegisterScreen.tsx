import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../theme/tokens';

const GOALS = [5, 10, 15, 20];

export default function RegisterScreen() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [goal,     setGoal]     = useState(10);
  const [showPw,   setShowPw]   = useState(false);

  const strength = password.length === 0 ? 0
                 : password.length < 6    ? 1
                 : password.length < 10   ? 2 : 3;
  const strengthColors = ['transparent', Colors.red, Colors.orange, Colors.green];
  const strengthLabels = ['', 'Yếu', 'Trung bình', 'Mạnh'];

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={s.logoWrap}>
            <LinearGradient colors={[Colors.purple, Colors.pink]} style={s.logoMark}>
              <Text style={s.logoLetter}>S</Text>
            </LinearGradient>
            <Text style={s.appName}>Tạo tài khoản</Text>
            <Text style={s.tagline}>Bắt đầu hành trình học tiếng Anh</Text>
          </View>

          <View style={s.card}>
            {/* Google */}
            <TouchableOpacity style={s.oauthBtn}>
              <Text style={{ fontSize: 20 }}>🌐</Text>
              <Text style={s.oauthText}>Đăng ký với Google</Text>
            </TouchableOpacity>

            <View style={s.divider}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>hoặc</Text>
              <View style={s.dividerLine} />
            </View>

            {/* Name */}
            <Text style={s.label}>Họ và tên</Text>
            <View style={s.inputWrap}>
              <Ionicons name="person-outline" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
              <TextInput style={s.input} placeholder="Nguyễn Văn A"
                placeholderTextColor={Colors.textMuted} value={name} onChangeText={setName} />
            </View>

            {/* Email */}
            <Text style={s.label}>Email</Text>
            <View style={s.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
              <TextInput style={s.input} placeholder="email@example.com"
                placeholderTextColor={Colors.textMuted} value={email} onChangeText={setEmail}
                keyboardType="email-address" autoCapitalize="none" />
            </View>

            {/* Password + strength */}
            <Text style={s.label}>Mật khẩu</Text>
            <View style={s.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
              <TextInput style={[s.input, { flex: 1 }]} placeholder="••••••••"
                placeholderTextColor={Colors.textMuted} value={password} onChangeText={setPassword}
                secureTextEntry={!showPw} />
              <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            {password.length > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.md, marginTop: -6 }}>
                {[1, 2, 3].map(i => (
                  <View key={i} style={[s.strengthBar, {
                    backgroundColor: i <= strength ? strengthColors[strength] : Colors.border
                  }]} />
                ))}
                <Text style={{ fontSize: FontSize.xs, color: strengthColors[strength], fontWeight: '700' }}>
                  {strengthLabels[strength]}
                </Text>
              </View>
            )}

            {/* Daily goal */}
            <Text style={s.label}>Mục tiêu hàng ngày</Text>
            <View style={s.goalRow}>
              {GOALS.map(g => (
                <TouchableOpacity key={g} onPress={() => setGoal(g)}
                  style={[s.goalBtn, goal === g && s.goalBtnActive]}>
                  <Text style={[s.goalVal, goal === g && { color: Colors.purple2 }]}>{g}</Text>
                  <Text style={[s.goalUnit, goal === g && { color: Colors.purple2 }]}>phút</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit */}
            <TouchableOpacity style={{ marginTop: Spacing.md }}>
              <LinearGradient colors={[Colors.purple, Colors.pink]} style={s.submitBtn}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={s.submitText}>🚀 Bắt đầu học ngay</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={s.footer}>
              <Text style={{ color: Colors.textMuted, fontSize: FontSize.sm }}>Đã có tài khoản? </Text>
              <TouchableOpacity>
                <Text style={{ color: Colors.purple2, fontWeight: '700', fontSize: FontSize.sm }}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll:       { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
  logoWrap:     { alignItems: 'center', marginBottom: Spacing.xl },
  logoMark:     { width: 56, height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center',
                   marginBottom: Spacing.sm, ...Shadow.purple },
  logoLetter:   { color: 'white', fontSize: 26, fontWeight: '900' },
  appName:      { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textPrimary },
  tagline:      { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 4 },
  card:         { backgroundColor: Colors.bgCard, borderRadius: Radius.xl, padding: Spacing.xl,
                   borderWidth: 1, borderColor: Colors.border },
  oauthBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
                   backgroundColor: Colors.bgSecondary, borderWidth: 1, borderColor: Colors.border,
                   borderRadius: Radius.md, paddingVertical: Spacing.md, marginBottom: Spacing.lg },
  oauthText:    { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  divider:      { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  dividerLine:  { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText:  { fontSize: FontSize.sm, color: Colors.textMuted },
  label:        { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  inputWrap:    { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgPrimary,
                   borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
                   paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, marginBottom: Spacing.md },
  input:        { color: Colors.textPrimary, fontSize: FontSize.base },
  strengthBar:  { flex: 1, height: 3, borderRadius: 2 },
  goalRow:      { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  goalBtn:      { flex: 1, alignItems: 'center', backgroundColor: Colors.bgPrimary,
                   borderRadius: Radius.md, paddingVertical: Spacing.md,
                   borderWidth: 1.5, borderColor: Colors.border },
  goalBtnActive:{ borderColor: Colors.purple, backgroundColor: Colors.purple + '15' },
  goalVal:      { fontSize: FontSize.lg, fontWeight: '900', color: Colors.textSecondary },
  goalUnit:     { fontSize: 9, color: Colors.textMuted, fontWeight: '600' },
  submitBtn:    { borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center', ...Shadow.purple },
  submitText:   { color: 'white', fontSize: FontSize.base, fontWeight: '800' },
  footer:       { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
});
