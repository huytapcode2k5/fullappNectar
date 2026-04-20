import React from 'react';
import {
    View, Text, StyleSheet, SafeAreaView,
    FlatList, TouchableOpacity,
} from 'react-native';
import { useCart } from '../CartContext';

// ── Bottom Tab ────────────────────────────────────────────────────────────────
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
            {TABS.map((t, i) => (
                <TouchableOpacity
                    key={t.label}
                    style={s.tabItem}
                    onPress={() => onNavigate && onNavigate(screens[i])}
                >
                    <Text style={s.tabIcon}>{t.icon}</Text>
                    <Text style={s.tabLabel}>{t.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const GREEN = '#5DAF6A';

// ── Format ngày giờ ───────────────────────────────────────────────────────────
function formatDate(isoString) {
    const d = new Date(isoString);
    const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    return `${date} lúc ${time}`;
}

// ── Order Card ────────────────────────────────────────────────────────────────
function OrderCard({ order, index }) {
    const itemCount = order.items.reduce((s, i) => s + i.qty, 0);

    return (
        <View style={s.card}>
            {/* Header đơn hàng */}
            <View style={s.cardHeader}>
                <View>
                    <Text style={s.orderId}>Đơn hàng #{order.id.slice(-6)}</Text>
                    <Text style={s.orderDate}>{formatDate(order.createdAt)}</Text>
                </View>
                <View style={s.statusBadge}>
                    <Text style={s.statusText}>✅ Đã đặt</Text>
                </View>
            </View>

            {/* Danh sách sản phẩm */}
            <View style={s.divider} />
            {order.items.map((item, i) => (
                <View key={i} style={s.itemRow}>
                    <Text style={s.itemName}>
                        {item.name}
                        <Text style={s.itemQty}> × {item.qty}</Text>
                    </Text>
                    <Text style={s.itemPrice}>${(item.price * item.qty).toFixed(2)}</Text>
                </View>
            ))}

            {/* Tổng tiền */}
            <View style={s.divider} />
            <View style={s.totalRow}>
                <Text style={s.totalLabel}>{itemCount} sản phẩm · Tổng cộng</Text>
                <Text style={s.totalValue}>${order.total.toFixed(2)}</Text>
            </View>
        </View>
    );
}

// ── Empty ─────────────────────────────────────────────────────────────────────
function EmptyOrders({ onBack }) {
    return (
        <View style={s.empty}>
            <Text style={s.emptyIcon}>📦</Text>
            <Text style={s.emptyTitle}>Chưa có đơn hàng nào</Text>
            <Text style={s.emptyDesc}>Hãy đặt hàng để xem lịch sử ở đây</Text>
            <TouchableOpacity style={s.shopBtn} onPress={onBack}>
                <Text style={s.shopBtnText}>Mua sắm ngay</Text>
            </TouchableOpacity>
        </View>
    );
}

// ── Main OrdersScreen ─────────────────────────────────────────────────────────
export default function OrdersScreen({ onNavigate, onBack }) {
    const { orders } = useCart();

    return (
        <SafeAreaView style={s.safe}>
            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity onPress={onBack || (() => onNavigate('account'))} style={s.backBtn}>
                    <Text style={s.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={s.title}>Đơn hàng của tôi</Text>
                <View style={{ width: 32 }} />
            </View>

            {orders.length === 0 ? (
                <EmptyOrders onBack={() => onNavigate('home')} />
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={o => o.id}
                    renderItem={({ item, index }) => <OrderCard order={item} index={index} />}
                    contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                />
            )}

            <BottomTab onNavigate={onNavigate} />
        </SafeAreaView>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F2F3F2' },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff',
        borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
    },
    backBtn: { width: 32, height: 32, justifyContent: 'center' },
    backIcon: { fontSize: 28, color: '#181725', fontWeight: '300' },
    title: { fontSize: 18, fontWeight: '700', color: '#181725' },

    // Card
    card: {
        backgroundColor: '#fff', borderRadius: 16,
        padding: 16,
        shadowColor: '#000', shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 }, shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    },
    orderId: { fontSize: 15, fontWeight: '700', color: '#181725' },
    orderDate: { fontSize: 12, color: '#7C7C7C', marginTop: 3 },
    statusBadge: {
        backgroundColor: '#E8F5E9', borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 4,
    },
    statusText: { fontSize: 12, color: GREEN, fontWeight: '600' },

    divider: { height: 1, backgroundColor: '#F2F3F2', marginVertical: 12 },

    itemRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 6,
    },
    itemName: { fontSize: 14, color: '#181725', flex: 1 },
    itemQty: { color: '#7C7C7C' },
    itemPrice: { fontSize: 14, fontWeight: '700', color: '#181725' },

    totalRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    totalLabel: { fontSize: 13, color: '#7C7C7C' },
    totalValue: { fontSize: 17, fontWeight: '800', color: GREEN },

    // Empty
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyIcon: { fontSize: 64, marginBottom: 16 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: '#181725', marginBottom: 6 },
    emptyDesc: { fontSize: 14, color: '#7C7C7C', marginBottom: 24 },
    shopBtn: {
        backgroundColor: GREEN, paddingHorizontal: 32,
        paddingVertical: 14, borderRadius: 12,
    },
    shopBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

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
});