import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, Image, TouchableOpacity,
  TextInput, ScrollView, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert,
} from 'react-native';
import { authStorage } from './services/storageService';

import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import ExploreScreen from './screens/ExploreScreen';
import BeveragesScreen from './screens/BeveragesScreen';
import FilterScreen from './screens/FilterScreen';
import CartScreen from './screens/CartScreen';
import FavouriteScreen from './screens/FavouriteScreen';
import AccountScreen from './screens/AccountScreen';
import OrdersScreen from './screens/OrdersScreen';
import { CartProvider } from './CartContext';

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ── Auto-login: kiểm tra storage khi app khởi động ──
  useEffect(() => {
    async function checkAutoLogin() {
      // Hiển thị splash tối thiểu 1.5 giây
      const [authData] = await Promise.all([
        authStorage.load(),
        new Promise((res) => setTimeout(res, 1500)),
      ]);

      const { user, token } = authData;

      if (user && token) {
        // Có dữ liệu hợp lệ → tự động vào Home
        setCurrentUser(user);
        setScreen('home');
      } else {
        // Chưa đăng nhập → vào Onboarding
        setScreen('onboarding');
      }
      setIsCheckingAuth(false);
    }

    checkAutoLogin();
  }, []);

  // ── Handler đăng nhập thành công ──
  const handleLoginSuccess = async (user, token) => {
    await authStorage.save(user, token);
    setCurrentUser(user);
    setScreen('home');
  };

  // ── Handler logout ──
  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc muốn đăng xuất không?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await authStorage.clear();
            setCurrentUser(null);
            setScreen('onboarding');
          },
        },
      ]
    );
  };

  // ── Splash (luôn hiển thị khi đang kiểm tra auth) ──
  if (screen === 'splash' || isCheckingAuth) {
    return <SplashScreen />;
  }

  return (
    <CartProvider>
      <>
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
        {screen === 'home' && (
          <HomeScreen
            setScreen={setScreen}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
        {screen === 'productDetail' && (
          <ProductDetailScreen onBack={() => setScreen('home')} />
        )}
        {screen === 'explore' && (
          <ExploreScreen
            onNavigate={setScreen}
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
        {screen === 'orders' && (
          <OrdersScreen onNavigate={setScreen} onBack={() => setScreen('account')} />
        )}
        {screen === 'account' && (
          <AccountScreen
            onNavigate={setScreen}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
        {screen === 'beverages' && (
          <BeveragesScreen
            onBack={() => setScreen('explore')}
            onNavigate={setScreen}
          />
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
            onNext={handleLoginSuccess}   // ← nhận (user, token)
            onBack={() => setScreen('selectLocation')}
            onSignUp={() => setScreen('signup')}
          />
        )}
        {screen === 'signup' && (
          <SignUpScreen
            onBack={() => setScreen('login')}
            onLogin={() => setScreen('login')}
            onSignUpSuccess={handleLoginSuccess}  // ← tuỳ chọn: auto-login sau signup
          />
        )}
      </>
    </CartProvider>
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
      <ActivityIndicator color="#fff" style={{ marginTop: 24 }} />
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
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Image
          source={require('./assets/illustration.png')}
          style={styles.mapImage}
          resizeMode="contain"
        />

        <Text style={styles.locationTitle}>Select Your Location</Text>
        <Text style={styles.locationSub}>
          Switche on your location to stay in tune with{"\n"}what's happening in your area
        </Text>

        <Text style={styles.fieldLabel}>Your Zone</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>{zone}</Text>
          <Text style={styles.dropdownArrow}>∨</Text>
        </TouchableOpacity>

        <Text style={styles.fieldLabel}>Your Area</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={[styles.dropdownText, !area && { color: '#aaa' }]}>
            {area || 'Types of your area'}
          </Text>
          <Text style={styles.dropdownArrow}>∨</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={onNext}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =============================
// Login Screen  ← CÓ XÁC THỰC THỰC TẾ
// =============================
function LoginScreen({ onBack, onSignUp, onNext }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    // ── Validation cơ bản ──
    if (!email.trim()) {
      setError('Vui lòng nhập email.');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      // ──────────────────────────────────────────────────────────────────────
      // TODO: Thay đoạn này bằng API call thực tế của bạn, ví dụ:
      //
      //   const res = await fetch('https://your-api.com/auth/login', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ email, password }),
      //   });
      //   const data = await res.json();
      //   if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');
      //   const user  = data.user;
      //   const token = data.token;
      //
      // Hiện tại: mock đơn giản để demo
      // ──────────────────────────────────────────────────────────────────────
      await new Promise((res) => setTimeout(res, 1000)); // giả lập network

      // Mock kiểm tra (xoá khi có API thật)
      if (password.length < 4) {
        throw new Error('Mật khẩu không đúng.');
      }

      const user = { id: '1', name: email.split('@')[0], email };
      const token = 'mock_token_' + Date.now();

      // Gọi callback của App: lưu storage + chuyển màn hình
      await onNext(user, token);
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.authContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.carrotTop}>
          <Text style={styles.carrotEmoji}>🥕</Text>
        </View>

        <Text style={styles.authTitle}>Login</Text>
        <Text style={styles.authSub}>Enter your email and password</Text>

        {/* Hiển thị lỗi */}
        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.authInput}
          value={email}
          onChangeText={(t) => { setEmail(t); setError(''); }}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
          placeholderTextColor="#bbb"
        />

        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.authInput, { flex: 1, borderBottomWidth: 0 }]}
            value={password}
            onChangeText={(t) => { setPassword(t); setError(''); }}
            secureTextEntry={!showPass}
            placeholder="••••••••"
            placeholderTextColor="#bbb"
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
            <Text style={styles.eyeIcon}>{showPass ? '👁' : '🙈'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.passwordUnderline} />

        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.primaryBtnText}>Log In</Text>
          }
        </TouchableOpacity>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onSignUp}>
            <Text style={styles.switchLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =============================
// Sign Up Screen  ← CÓ XÁC THỰC THỰC TẾ
// =============================
function SignUpScreen({ onBack, onLogin, onSignUpSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setError('');

    if (!username.trim()) { setError('Vui lòng nhập tên.'); return; }
    if (!email.trim()) { setError('Vui lòng nhập email.'); return; }
    if (password.length < 6) { setError('Mật khẩu ít nhất 6 ký tự.'); return; }

    setLoading(true);
    try {
      // ──────────────────────────────────────────────────────────────────────
      // TODO: Thay bằng API đăng ký thực tế:
      //
      //   const res = await fetch('https://your-api.com/auth/signup', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ username, email, password }),
      //   });
      //   const data = await res.json();
      //   if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại');
      //   const user  = data.user;
      //   const token = data.token;
      //
      // ──────────────────────────────────────────────────────────────────────
      await new Promise((res) => setTimeout(res, 1000));

      const user = { id: Date.now().toString(), name: username, email };
      const token = 'mock_token_' + Date.now();

      // Auto-login sau khi đăng ký thành công
      if (onSignUpSuccess) {
        await onSignUpSuccess(user, token);
      } else {
        onLogin(); // fallback: chuyển sang màn login
      }
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.authContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.carrotTop}>
          <Text style={styles.carrotEmoji}>🥕</Text>
        </View>

        <Text style={styles.authTitle}>Sign Up</Text>
        <Text style={styles.authSub}>Enter your credentials to continue</Text>

        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.inputLabel}>Username</Text>
        <TextInput
          style={styles.authInput}
          value={username}
          onChangeText={(t) => { setUsername(t); setError(''); }}
          autoCapitalize="words"
          placeholder="Tên của bạn"
          placeholderTextColor="#bbb"
        />

        <Text style={styles.inputLabel}>Email</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.authInput, { flex: 1, borderBottomWidth: 0 }]}
            value={email}
            onChangeText={(t) => { setEmail(t); setError(''); }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
            placeholderTextColor="#bbb"
          />
          {email.includes('@') && <Text style={styles.checkIcon}>✓</Text>}
        </View>
        <View style={styles.passwordUnderline} />

        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.authInput, { flex: 1, borderBottomWidth: 0 }]}
            value={password}
            onChangeText={(t) => { setPassword(t); setError(''); }}
            secureTextEntry={!showPass}
            placeholder="Tối thiểu 6 ký tự"
            placeholderTextColor="#bbb"
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
            <Text style={styles.eyeIcon}>{showPass ? '👁' : '🙈'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.passwordUnderline} />

        <Text style={styles.termsText}>
          By continuing you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy.</Text>
        </Text>

        <TouchableOpacity
          style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.primaryBtnText}>Sign Up</Text>
          }
        </TouchableOpacity>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Already have an account? </Text>
          <TouchableOpacity onPress={onLogin}>
            <Text style={styles.switchLink}>Login</Text>
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
  back: { fontSize: 24, left: 10 },
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
  locationContainer: { flex: 1, backgroundColor: '#fff' },
  locationScroll: { padding: 24, paddingTop: 56, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', marginBottom: 16, padding: 4 },
  backIcon: { fontSize: 28, color: '#222', fontWeight: '300' },
  locationTitle: {
    fontSize: 22, fontWeight: '700', color: '#222',
    marginBottom: 8, textAlign: 'center',
  },
  locationSub: {
    fontSize: 13, color: '#888', textAlign: 'center',
    lineHeight: 20, marginBottom: 32,
  },
  fieldLabel: {
    alignSelf: 'flex-start', fontSize: 13, color: '#555',
    marginBottom: 6, marginTop: 8,
  },
  dropdown: {
    width: '100%', flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', paddingVertical: 12, marginBottom: 8,
  },
  dropdownText: { fontSize: 15, color: '#222' },
  dropdownArrow: { fontSize: 14, color: '#888' },
  submitBtn: {
    marginTop: 32, backgroundColor: GREEN, borderRadius: 14,
    width: '100%', paddingVertical: 16, alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // --- Auth (Login / Sign Up) ---
  authContainer: { flex: 1, backgroundColor: '#fff' },
  authScroll: { padding: 24, paddingTop: 48 },
  carrotTop: { alignItems: 'center', marginBottom: 24 },
  carrotEmoji: { fontSize: 42 },
  authTitle: { fontSize: 24, fontWeight: '700', color: '#222', marginBottom: 6 },
  authSub: { fontSize: 13, color: '#888', marginBottom: 28 },
  inputLabel: { fontSize: 12, color: '#888', marginTop: 12, marginBottom: 4 },
  authInput: {
    fontSize: 15, color: '#222', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#e0e0e0', marginBottom: 4,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  passwordUnderline: { borderBottomWidth: 1, borderBottomColor: '#e0e0e0', marginBottom: 4 },
  eyeBtn: { padding: 6 },
  eyeIcon: { fontSize: 16 },
  checkIcon: { fontSize: 18, color: GREEN, paddingHorizontal: 6 },
  forgotRow: { alignItems: 'flex-end', marginTop: 8, marginBottom: 28 },
  forgotText: { fontSize: 13, color: '#555' },
  primaryBtn: {
    backgroundColor: GREEN, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 20,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  switchText: { fontSize: 13, color: '#555' },
  switchLink: { fontSize: 13, color: GREEN, fontWeight: '600' },
  termsText: { fontSize: 12, color: '#888', marginTop: 12, marginBottom: 24, lineHeight: 18 },
  termsLink: { color: GREEN },

  // --- Error box ---
  errorBox: {
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#E53935',
  },
  errorText: { color: '#C62828', fontSize: 13 },
});