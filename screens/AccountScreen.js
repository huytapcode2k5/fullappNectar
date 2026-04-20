import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ScrollView, SafeAreaView, Alert,
} from 'react-native';

const GREEN = '#5DAF6A';

// ── Menu items ────────────────────────────────────────────────────────────────
const MENU_ITEMS = [
    { icon: '📋', label: 'Orders' },
    { icon: '🪪', label: 'My Details' },
    { icon: '📍', label: 'Delivery Address' },
    { icon: '💳', label: 'Payment Methods' },
    { icon: '🏷️', label: 'Promo Card' },
    { icon: '🔔', label: 'Notifications' },
    { icon: '❓', label: 'Help' },
    { icon: 'ℹ️', label: 'About' },
];

// ── Bottom Tab (giống HomeScreen) ─────────────────────────────────────────────
const TABS = [
    { icon: '🏠', label: 'Shop' },
    { icon: '🔍', label: 'Explore' },
    { icon: '🛒', label: 'Cart' },
    { icon: '❤️', label: 'Favourite' },
    { icon: '👤', label: 'Account' },
];

function BottomTab({ onNavigate }) {
    const screens = ['home', 'explore', 'cart', 'favourite', 'account'];
    return (
        <View style={s.bottomTab}>
            {TABS.map((t, i) => {
                const isActive = i === 4; // Account tab
                return (
                    <TouchableOpacity
                        key={t.label}
                        style={s.tabItem}
                        onPress={() => onNavigate && onNavigate(screens[i])}
                    >
                        <Text style={s.tabIcon}>{t.icon}</Text>
                        <Text style={[s.tabLabel, isActive && s.tabLabelActive]}>
                            {t.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AccountScreen({ onNavigate, currentUser, onLogout }) {
    const name = currentUser?.name ?? 'Afsar Hossen';
    const email = currentUser?.email ?? 'imshuvo97@gmail.com';

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            Alert.alert('Đăng xuất', 'Chức năng logout chưa được kết nối.');
        }
    };

    return (
        <SafeAreaView style={s.safe}>
            {/* Header */}
            <View style={s.header}>
                <Text style={s.headerTitle}>Account</Text>
            </View>

            <ScrollView
                contentContainerStyle={s.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile row */}
                <View style={s.profileRow}>
                    <View style={s.avatarBox}>
                        <Text style={s.avatarEmoji}>🧑</Text>
                    </View>
                    <View style={s.profileInfo}>
                        <View style={s.nameRow}>
                            <Text style={s.profileName}>{name}</Text>
                            <TouchableOpacity style={s.editBtn}>
                                <Text style={s.editIcon}>✏️</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={s.profileEmail}>{email}</Text>
                    </View>
                </View>

                {/* Menu list */}
                <View style={s.menuCard}>
                    {MENU_ITEMS.map((item, index) => (
                        <TouchableOpacity
                            key={item.label}
                            style={[
                                s.menuItem,
                                index < MENU_ITEMS.length - 1 && s.menuItemBorder,
                            ]}
                            activeOpacity={0.6}
                            onPress={() => {
                                if (item.label === 'Orders') onNavigate && onNavigate('orders');
                            }}
                        >
                            <View style={s.menuLeft}>
                                <Text style={s.menuIcon}>{item.icon}</Text>
                                <Text style={s.menuLabel}>{item.label}</Text>
                            </View>
                            <Text style={s.menuChevron}>›</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Log Out button */}
                <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.75}>
                    <Text style={s.logoutIcon}>⇤</Text>
                    <Text style={s.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <View style={{ height: 24 }} />
            </ScrollView>

            {/* Bottom Tab */}
            <BottomTab onNavigate={onNavigate} />
        </SafeAreaView>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F2F3F2',
    },

    // Header
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: '#F2F3F2',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#181725',
    },

    scroll: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },

    // Profile
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    avatarBox: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    avatarEmoji: { fontSize: 28 },
    profileInfo: { flex: 1 },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#181725',
        marginRight: 6,
    },
    editBtn: { padding: 2 },
    editIcon: { fontSize: 14 },
    profileEmail: {
        fontSize: 13,
        color: '#7C7C7C',
    },

    // Menu card
    menuCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F2F3F2',
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        fontSize: 18,
        marginRight: 14,
        width: 24,
        textAlign: 'center',
    },
    menuLabel: {
        fontSize: 15,
        color: '#181725',
        fontWeight: '500',
    },
    menuChevron: {
        fontSize: 22,
        color: '#B3B3B3',
        fontWeight: '300',
    },

    // Log Out
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#E2E2E2',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 1,
    },
    logoutIcon: {
        fontSize: 18,
        color: GREEN,
        marginRight: 10,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: GREEN,
    },

    // Bottom Tab
    bottomTab: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E2E2E2',
        paddingVertical: 8,
        paddingBottom: 12,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: { fontSize: 20 },
    tabLabel: {
        fontSize: 10,
        color: '#B3B3B3',
        marginTop: 3,
    },
    tabLabelActive: {
        color: GREEN,
        fontWeight: '600',
    },
});