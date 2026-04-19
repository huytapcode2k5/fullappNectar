import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, Image, TouchableOpacity,
  TextInput, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';

import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import ExploreScreen from './screens/ExploreScreen';
import BeveragesScreen from './screens/BeveragesScreen';
import FilterScreen from './screens/FilterScreen';
import CartScreen from './screens/CartScreen';
import FavouriteScreen from './screens/FavouriteScreen';
export default function App() {
  const [screen, setScreen] = useState('splash');

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {screen === 'splash' && <SplashScreen />}
      {screen === 'onboarding' && (
        <OnboardingScreen onNext={() => setScreen('signin')} />
      )}
      {screen === 'signin' && (
        <SignInScreen
          onNext={() => setScreen('number')}
          onBack={() => setScreen('onboarding')}
        />
      )}
      {screen === 'number' && (
        <NumberScreen
          onNext={() => setScreen('otp')}
          onBack={() => setScreen('signin')}
        />
      )}
      {screen === 'home' && <HomeScreen setScreen={setScreen} />}
      {screen === 'productDetail' && (
        <ProductDetailScreen onBack={() => setScreen('home')} />
      )}
      {screen === 'explore' && (
        <ExploreScreen
          onNavigate={setScreen}   // 👈 THÊM DÒNG NÀY
          onSelectCategory={(cat) => {
            if (cat.name.includes('Beverages')) setScreen('beverages');
          }}
        />
      )}
      {screen === 'filter' && (
        <FilterScreen
          onApply={() => setScreen('explore')}
          onClose={() => setScreen('explore')}
        />
      )}
      {screen === 'cart' && <CartScreen onNavigate={setScreen} />}
      {screen === 'favourite' && <FavouriteScreen onNavigate={setScreen} />}
      {screen === 'beverages' && (
        <BeveragesScreen onBack={() => setScreen('explore')}
          onNavigate={setScreen} />
      )}

      {screen === 'otp' && (
        <VerificationScreen
          onBack={() => setScreen('number')}
          onNext={() => setScreen('selectLocation')}
        />
      )}
      {screen === 'selectLocation' && (
        <SelectLocationScreen
          onNext={() => setScreen('login')}
          onBack={() => setScreen('otp')}
        />
      )}
      {screen === 'login' && (
        <LoginScreen
          onNext={() => setScreen('home')}   // 👈 QUAN TRỌNG
          onBack={() => setScreen('selectLocation')}
          onSignUp={() => setScreen('signup')}
        />
      )}
      {screen === 'signup' && (
        <SignUpScreen
          onBack={() => setScreen('login')}
          onLogin={() => setScreen('login')}
        />
      )}
    </>
  );
}

// =============================
// Splash Screen
// =============================
function SplashScreen() {
  return (
    <View style={styles.splash}>
      <Text style={styles.logo}>🥕 nectar</Text>
      <Text style={{ color: '#fff' }}>online groceries</Text>
      <StatusBar style="light" />
    </View>
  );
}

// =============================
// Onboarding
// =============================
function OnboardingScreen({ onNext }) {
  return (
    <View style={styles.full}>
      <Image
        source={require('./assets/8140 1.png')}
        style={styles.image}
      />
      <View style={styles.overlay} />
      <View style={styles.bottom}>
        <Text style={styles.title}>Welcome to our store</Text>
        <Text style={styles.sub}>Get groceries fast</Text>
        <TouchableOpacity style={styles.btn} onPress={onNext}>
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// =============================
// Sign In
// =============================
function SignInScreen({ onNext }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/Mask Group.png')}
        style={styles.topImg}
      />
      <Text style={styles.bigText}>
        Get your groceries{"\n"}with nectar
      </Text>
      <TouchableOpacity onPress={onNext}>
        <View style={styles.phoneBox}>
          <Image
            source={require('./assets/Rectangle 11.png')}
            style={styles.flag}
          />
          <Text style={styles.code}>+880</Text>
          <TextInput
            placeholder="Enter phone number"
            style={styles.phoneInput}
            keyboardType="phone-pad"
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleBtn}>
        <Text style={{ color: '#fff' }}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.fbBtn}>
        <Text style={{ color: '#fff' }}>Continue with Facebook</Text>
      </TouchableOpacity>
    </View>
  );
}

// =============================
// Arrow Button Component
// =============================
function ArrowButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.arrowBtn} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.arrowInner}>
        <Text style={styles.arrowIcon}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

// =============================
// Enter Number
// =============================
function NumberScreen({ onNext, onBack }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backTouchable}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>
      <Text style={styles.bigText}>Enter your mobile number</Text>
      <View style={styles.phoneBox}>
        <Image
          source={require('./assets/Rectangle 11.png')}
          style={styles.flag}
        />
        <Text style={styles.code}>+84</Text>
        <TextInput
          placeholder="Phone number"
          style={styles.phoneInput}
          keyboardType="phone-pad"
        />
      </View>
      <ArrowButton onPress={onNext} />
    </View>
  );
}

// =============================
// OTP Verification
// =============================
function VerificationScreen({ onBack, onNext }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backTouchable}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>
      <Text style={styles.bigText}>Enter your 4-digit code</Text>
      <TextInput
        placeholder="- - - -"
        style={styles.input}
        keyboardType="number-pad"
      />
      <Text style={{ color: 'green', marginTop: 10 }}>Resend Code</Text>
      <ArrowButton onPress={onNext} />
    </View>
  );
}

// =============================
// Select Location Screen
// =============================
function SelectLocationScreen({ onNext, onBack }) {
  const [zone, setZone] = useState('Banasree');
  const [area, setArea] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.locationContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.locationScroll} showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        {/* Map image */}
        <Image
          source={require('./assets/illustration.png')}
          style={styles.mapImage}
          resizeMode="contain"
        />

        <Text style={styles.locationTitle}>Select Your Location</Text>
        <Text style={styles.locationSub}>
          Switche on your location to stay in tune with{"\n"}what's happening in your area
        </Text>

        {/* Zone dropdown */}
        <Text style={styles.fieldLabel}>Your Zone</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>{zone}</Text>
          <Text style={styles.dropdownArrow}>∨</Text>
        </TouchableOpacity>

        {/* Area dropdown */}
        <Text style={styles.fieldLabel}>Your Area</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={[styles.dropdownText, !area && { color: '#aaa' }]}>
            {area || 'Types of your area'}
          </Text>
          <Text style={styles.dropdownArrow}>∨</Text>
        </TouchableOpacity>

        {/* Submit button */}
        <TouchableOpacity style={styles.submitBtn} onPress={onNext}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =============================
// Login Screen
// =============================
function LoginScreen({ onBack, onSignUp, onNext }) {
  const [email, setEmail] = useState('Nguyễn Văn Huy');
  const [password, setPassword] = useState('········');
  const [showPass, setShowPass] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.authContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
        {/* Carrot logo */}
        <View style={styles.carrotTop}>
          <Text style={styles.carrotEmoji}>🥕</Text>
        </View>

        <Text style={styles.authTitle}>Loging</Text>
        <Text style={styles.authSub}>Enter your emails and password</Text>

        {/* Email field */}
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.authInput}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password field */}
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.authInput, { flex: 1, borderBottomWidth: 0 }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
            <Text style={styles.eyeIcon}>{showPass ? '👁' : '🙈'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.passwordUnderline} />

        {/* Forgot password */}
        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Log In button */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={onNext}
        >
          <Text style={styles.primaryBtnText}>Log In</Text>
        </TouchableOpacity>

        {/* Sign up link */}
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onSignUp}>
            <Text style={styles.switchLink}>Signup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =============================
// Sign Up Screen
// =============================
function SignUpScreen({ onBack, onLogin }) {
  const [username, setUsername] = useState('Nguyễn Văn Huy');
  const [email, setEmail] = useState('imshuvo97@gmail.com');
  const [password, setPassword] = useState('········');
  const [showPass, setShowPass] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.authContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
        {/* Carrot logo */}
        <View style={styles.carrotTop}>
          <Text style={styles.carrotEmoji}>🥕</Text>
        </View>

        <Text style={styles.authTitle}>Sign Up</Text>
        <Text style={styles.authSub}>Enter your credentials to continue</Text>

        {/* Username field */}
        <Text style={styles.inputLabel}>Username</Text>
        <TextInput
          style={styles.authInput}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="words"
        />

        {/* Email field with checkmark */}
        <Text style={styles.inputLabel}>Email</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.authInput, { flex: 1, borderBottomWidth: 0 }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.checkIcon}>✓</Text>
        </View>
        <View style={styles.passwordUnderline} />

        {/* Password field */}
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.authInput, { flex: 1, borderBottomWidth: 0 }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
            <Text style={styles.eyeIcon}>{showPass ? '👁' : '🙈'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.passwordUnderline} />

        {/* Terms */}
        <Text style={styles.termsText}>
          By continuing you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy.</Text>
        </Text>

        {/* Sign Up button */}
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Sing Up</Text>
        </TouchableOpacity>

        {/* Login link */}
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Already have an account? </Text>
          <TouchableOpacity onPress={onLogin}>
            <Text style={styles.switchLink}>Signup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


// =============================
// STYLES
// =============================
const GREEN = '#5DAF6A';

const styles = StyleSheet.create({
  // --- Splash ---
  splash: {
    flex: 1,
    backgroundColor: GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },

  // --- Onboarding ---
  full: { flex: 1 },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
  },
  title: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  sub: { color: '#ddd', marginBottom: 20 },
  btn: {
    backgroundColor: GREEN,
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },

  // --- Common ---
  back: { left: 10 },
  container: { flex: 1, padding: 24, paddingTop: 64 },
  bigText: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, padding: 10, marginBottom: 20 },
  googleBtn: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  fbBtn: {
    backgroundColor: '#3b5998',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  circleBtn: {
    backgroundColor: GREEN,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 30,
  },
  arrowBtn: {
    alignSelf: 'flex-end',
    marginTop: 40,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  arrowInner: {
    backgroundColor: GREEN,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '300',
    marginLeft: 3,
  },
  backTouchable: {
    marginBottom: 8,
    padding: 4,
    alignSelf: 'flex-start',
  },
  mapImage: {
    width: '100%',
    height: 220,
    marginBottom: 24,
  },
  topImg: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
    marginBottom: 130,
  },
  phoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  flag: { width: 24, height: 16, marginRight: 8 },
  code: { fontSize: 16, marginRight: 8 },
  phoneInput: { flex: 1 },

  // --- Select Location ---
  locationContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  locationScroll: {
    padding: 24,
    paddingTop: 56,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    padding: 4,
  },
  back: {
    fontSize: 30,
  },
  backIcon: {
    fontSize: 28,
    color: '#222',
    fontWeight: '300',
  },
  mapIllustration: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  mapBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapEmoji: { fontSize: 72 },
  pinCircle: {
    position: 'absolute',
    top: 0,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  pinEmoji: { fontSize: 28 },
  locationTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  locationSub: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  fieldLabel: {
    alignSelf: 'flex-start',
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    marginTop: 8,
  },
  dropdown: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
    marginBottom: 8,
  },
  dropdownText: { fontSize: 15, color: '#222' },
  dropdownArrow: { fontSize: 14, color: '#888' },
  submitBtn: {
    marginTop: 32,
    backgroundColor: GREEN,
    borderRadius: 14,
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // --- Auth (Login / Sign Up) ---
  authContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  authScroll: {
    padding: 24,
    paddingTop: 48,
  },
  carrotTop: {
    alignItems: 'center',
    marginBottom: 24,
  },
  carrotEmoji: { fontSize: 42 },
  authTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  authSub: {
    fontSize: 13,
    color: '#888',
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 12,
    marginBottom: 4,
  },
  authInput: {
    fontSize: 15,
    color: '#222',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 4,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 4,
  },
  eyeBtn: { padding: 6 },
  eyeIcon: { fontSize: 16 },
  checkIcon: {
    fontSize: 18,
    color: GREEN,
    paddingHorizontal: 6,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 28,
  },
  forgotText: {
    fontSize: 13,
    color: '#555',
  },
  primaryBtn: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  switchText: { fontSize: 13, color: '#555' },
  switchLink: { fontSize: 13, color: GREEN, fontWeight: '600' },
  termsText: {
    fontSize: 12,
    color: '#888',
    marginTop: 12,
    marginBottom: 24,
    lineHeight: 18,
  },
  termsLink: { color: GREEN },
});