import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/tokens';

// Screens
import DashboardScreen   from '../screens/DashboardScreen';
import LearningScreen    from '../screens/LearningScreen';
import VocabularyScreen  from '../screens/VocabularyScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen     from '../screens/ProfileScreen';

// Auth Screens
import LoginScreen    from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// ── Types ──
export type TabParamList = {
  Dashboard:   undefined;
  Learning:    undefined;
  Vocabulary:  undefined;
  Leaderboard: undefined;
  Profile:     undefined;
};

export type AuthParamList = {
  Login:    undefined;
  Register: undefined;
};

const Tab   = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<AuthParamList>();

// ── Bottom Tab Navigator ──
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bgCard,
          borderTopColor:  Colors.border,
          borderTopWidth:  1,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor:   Colors.purple2,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
            Dashboard:   { active: 'home',          inactive: 'home-outline' },
            Learning:    { active: 'library',        inactive: 'library-outline' },
            Vocabulary:  { active: 'list',           inactive: 'list-outline' },
            Leaderboard: { active: 'trophy',         inactive: 'trophy-outline' },
            Profile:     { active: 'person-circle',  inactive: 'person-circle-outline' },
          };
          const icon = icons[route.name];
          return (
            <Ionicons
              name={focused ? icon.active : icon.inactive}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard"   component={DashboardScreen}   options={{ tabBarLabel: 'Trang Chủ' }} />
      <Tab.Screen name="Learning"    component={LearningScreen}    options={{ tabBarLabel: 'Thư Viện' }} />
      <Tab.Screen name="Vocabulary"  component={VocabularyScreen}  options={{ tabBarLabel: 'Từ Vựng' }} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} options={{ tabBarLabel: 'Xếp Hạng' }} />
      <Tab.Screen name="Profile"     component={ProfileScreen}     options={{ tabBarLabel: 'Cá Nhân' }} />
    </Tab.Navigator>
  );
}

// ── Root Navigator ──
export default function AppNavigator() {
  // TODO: replace with real auth state
  const isLoggedIn = true;

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppTabs />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login"    component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
