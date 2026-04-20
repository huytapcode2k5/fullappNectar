import React from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
    Image, FlatList, Alert,
} from 'react-native';
import { useCart } from '../CartContext';

const GREEN = '#5DAF6A';

// ── Bottom Tab ────────────────────────────────────────────────────────────────
const tabs = [
    { icon: '🏠', label: 'Shop' },
    { icon: '🔍', label: 'Explore' },
    { icon: '🛒', label: 'Cart' },
    { icon: '❤️', label: 'Favourite' },
    { icon: '👤', label: 'Account' },
];

function BottomTab({ onNavigate }) {
    const { cartCount } = useCart();
    const screens = ['home', 'explore', 'cart', 'favourite', 'account'];
    return (
        <View style={s.bottomTab}>
            {tabs.map((t, i) => {
                const isActive = i === 2;
                return (
                    <TouchableOpacity
                        key={i} style={s.tabItem}
                        onPress={() => onNavigate && onNavigate(screens[i])}
                    >
                        <View>
                            <Text style={s.tabIcon}>{t.icon}</Text>
                            {/* Badge giỏ hàng */}
                            {i === 2 && cartCount > 0 && (
                                <View style={s.badge}>
                                    <Text style={s.badgeText}>
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={[s.tabLabel, isActive && s.tabLabelActive]}>{t.label}</Text>
                        {isActive && <View style={s.tabDot} />}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// ── Cart Item ─────────────────────────────────────────────────────────────────
function CartItem({ item }) {
    const { updateQty, removeFromCart } = useCart();

    const confirmRemove = () => {
        Alert.alert(
            'Xóa sản phẩm',
            `Bỏ "${item.name}" khỏi giỏ?`,
            [
                { text: 'Huỷ', style: 'cancel' },
                { text: 'Xóa', style: 'destructive', onPress: () => removeFromCart(item.id) },
            ]
        );
    };

    return (
        <View style={s.item}>
            <Image source={item.image} style={s.img} resizeMode="contain" />

            <View style={{ flex: 1 }}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.desc}>{item.desc}</Text>

                <View style={s.row}>
                    {/* Nút tăng / giảm */}
                    <View style={s.qtyBox}>
                        <TouchableOpacity
                            style={s.qtyBtnBox}
                            onPress={() => updateQty(item.id, -1)}
                        >
                            <Text style={s.qtyBtnText}>−</Text>
                        </TouchableOpacity>

                        <Text style={s.qty}>{item.qty}</Text>

                        <TouchableOpacity
                            style={s.qtyBtnBox}
                            onPress={() => updateQty(item.id, +1)}
                        >
                            <Text style={s.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={s.price}>${(item.price * item.qty).toFixed(2)}</Text>
                </View>
            </View>

            {/* Nút xóa */}
            <TouchableOpacity onPress={confirmRemove} style={s.removeBtn}>
                <Text style={s.remove}>✕</Text>
            </TouchableOpacity>
        </View>
    );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyCart({ onNavigate }) {
    return (
        <View style={s.empty}>
            <Text style={s.emptyIcon}>🛒</Text>
            <Text style={s.emptyTitle}>Giỏ hàng trống</Text>
            <Text style={s.emptyDesc}>Hãy thêm sản phẩm từ trang chủ</Text>
            <TouchableOpacity style={s.shopBtn} onPress={() => onNavigate('home')}>
                <Text style={s.shopBtnText}>Mua sắm ngay</Text>
            </TouchableOpacity>
        </View>
    );
}

// ── Main CartScreen ───────────────────────────────────────────────────────────
export default function CartScreen({ onNavigate }) {
    const { cart, cartTotal, checkout } = useCart();

    const handleCheckout = () => {
        if (cart.length === 0) return;
        Alert.alert(
            'Xác nhận đặt hàng',
            `Tổng thanh toán: $${cartTotal.toFixed(2)}`,
            [
                { text: 'Huỷ', style: 'cancel' },
                {
                    text: 'Đặt hàng',
                    onPress: () => {
                        checkout();
                        Alert.alert('✅ Đặt hàng thành công!', 'Đơn hàng của bạn đã được ghi nhận.', [
                            { text: 'Xem đơn hàng', onPress: () => onNavigate('orders') },
                            { text: 'Tiếp tục mua', onPress: () => onNavigate('home') },
                        ]);
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={s.safe}>
            <Text style={s.title}>My Cart</Text>

            {cart.length === 0 ? (
                <EmptyCart onNavigate={onNavigate} />
            ) : (
                <>
                    <FlatList
                        data={cart}
                        keyExtractor={i => i.id}
                        renderItem={({ item }) => <CartItem item={item} />}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ItemSeparatorComponent={() => <View style={s.separator} />}
                    />

                    <TouchableOpacity style={s.checkout} onPress={handleCheckout}>
                        <Text style={s.checkoutText}>Go to Checkout</Text>
                        <View style={s.totalBadge}>
                            <Text style={s.total}>${cartTotal.toFixed(2)}</Text>
                        </View>
                    </TouchableOpacity>
                </>
            )}

            <BottomTab onNavigate={onNavigate} />
        </SafeAreaView>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },

    title: {
        fontSize: 20, fontWeight: '800',
        textAlign: 'center', marginVertical: 14,
    },

    // Item
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    img: { width: 64, height: 64, marginRight: 12, borderRadius: 8 },
    name: { fontWeight: '700', fontSize: 15, color: '#181725' },
    desc: { color: '#888', fontSize: 12, marginTop: 2 },
    row: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginTop: 10,
    },
    qtyBox: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: '#E2E2E2',
        borderRadius: 10, overflow: 'hidden',
    },
    qtyBtnBox: {
        width: 32, height: 32,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#F8F8F8',
    },
    qtyBtnText: { fontSize: 18, color: '#181725', fontWeight: '600' },
    qty: { width: 32, textAlign: 'center', fontWeight: '700', fontSize: 15 },
    price: { fontWeight: '800', fontSize: 16, color: '#181725' },
    removeBtn: { padding: 6, marginLeft: 8 },
    remove: { fontSize: 16, color: '#ccc' },
    separator: { height: 1, backgroundColor: '#F2F3F2', marginHorizontal: 4 },

    // Empty
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 80 },
    emptyIcon: { fontSize: 64, marginBottom: 16 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: '#181725', marginBottom: 6 },
    emptyDesc: { fontSize: 14, color: '#7C7C7C', marginBottom: 24 },
    shopBtn: {
        backgroundColor: GREEN, paddingHorizontal: 32,
        paddingVertical: 14, borderRadius: 12,
    },
    shopBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

    // Checkout
    checkout: {
        backgroundColor: GREEN, padding: 16, borderRadius: 14,
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 76, marginTop: 8,
    },
    checkoutText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    totalBadge: {
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
    },
    total: { color: '#fff', fontWeight: '700', fontSize: 15 },

    // Bottom Tab
    bottomTab: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', backgroundColor: '#fff',
        borderTopWidth: 1, borderTopColor: '#eee',
        paddingBottom: 16, paddingTop: 10,
    },
    tabItem: { flex: 1, alignItems: 'center' },
    tabIcon: { fontSize: 20 },
    tabLabel: { fontSize: 11, color: '#aaa' },
    tabLabelActive: { color: GREEN, fontWeight: '700' },
    tabDot: {
        width: 4, height: 4, borderRadius: 2,
        backgroundColor: GREEN, marginTop: 2,
    },
    badge: {
        position: 'absolute', top: -4, right: -8,
        backgroundColor: '#E53935', borderRadius: 8,
        minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center',
    },
    badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});