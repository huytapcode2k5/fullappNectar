import React, { useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView,
    TouchableOpacity, Image, FlatList
} from 'react-native';

const GREEN = '#5DAF6A';

// DATA
const cartData = [
    {
        id: '1',
        name: 'Bell Pepper Red',
        desc: '1kg, Price',
        price: 4.99,
        image: require('../assets/ot.png'),
    },
    {
        id: '2',
        name: 'Egg Chicken Red',
        desc: '4pcs, Price',
        price: 1.99,
        image: require('../assets/egg.png'),
    },
    {
        id: '3',
        name: 'Organic Bananas',
        desc: '12kg, Price',
        price: 3.0,
        image: require('../assets/banana.png'),
    },
    {
        id: '4',
        name: 'Ginger',
        desc: '250gm, Price',
        price: 2.99,
        image: require('../assets/gung.png'),
    },
];

// ITEM
function CartItem({ item }) {
    const [qty, setQty] = useState(1);

    return (
        <View style={s.item}>
            <Image source={item.image} style={s.img} />

            <View style={{ flex: 1 }}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.desc}>{item.desc}</Text>

                <View style={s.row}>
                    <View style={s.qtyBox}>
                        <TouchableOpacity onPress={() => qty > 1 && setQty(qty - 1)}>
                            <Text style={s.qtyBtn}>-</Text>
                        </TouchableOpacity>

                        <Text style={s.qty}>{qty}</Text>

                        <TouchableOpacity onPress={() => setQty(qty + 1)}>
                            <Text style={s.qtyBtn}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={s.price}>${(item.price * qty).toFixed(2)}</Text>
                </View>
            </View>

            <TouchableOpacity>
                <Text style={s.remove}>✕</Text>
            </TouchableOpacity>
        </View>
    );
}

// MAIN
export default function CartScreen({ onNavigate }) {
    const total = cartData.reduce((sum, i) => sum + i.price, 0);

    return (
        <SafeAreaView style={s.safe}>
            <View style={{ flex: 1 }}>
                <Text style={s.title}>My Cart</Text>

                <FlatList
                    data={cartData}
                    keyExtractor={i => i.id}
                    renderItem={({ item }) => <CartItem item={item} />}
                />
            </View>

            <TouchableOpacity style={s.checkout}>
                <Text style={s.checkoutText}>Go to Checkout</Text>
                <Text style={s.total}>${total.toFixed(2)}</Text>
            </TouchableOpacity>

            <BottomTab active={2} onNavigate={onNavigate} />
        </SafeAreaView>
    );
}

// BOTTOM TAB
const tabs = [
    { icon: '🏠', label: 'Shop' },
    { icon: '🔍', label: 'Explore' },
    { icon: '🛒', label: 'Cart' },
    { icon: '❤️', label: 'Favourite' },
    { icon: '👤', label: 'Account' },
];

function BottomTab({ active, onNavigate }) {
    return (
        <View style={s.bottomTab}>
            {tabs.map((t, i) => {
                const screens = ['home', 'explore', 'cart', 'favourite', 'account'];

                return (
                    <TouchableOpacity
                        key={i}
                        style={s.tabItem}
                        onPress={() => onNavigate && onNavigate(screens[i])}
                    >
                        <Text style={s.tabIcon}>{t.icon}</Text>
                        <Text style={[s.tabLabel, active === i && s.tabLabelActive]}>
                            {t.label}
                        </Text>
                        {active === i && <View style={s.tabDot} />}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// STYLE
const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff', padding: 16 },

    title: {
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 10,
    },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    img: { width: 60, height: 60, marginRight: 10 },

    name: { fontWeight: '700' },
    desc: { color: '#888', fontSize: 12 },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        alignItems: 'center',
    },

    qtyBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        paddingHorizontal: 10,
    },

    qtyBtn: { fontSize: 18, paddingHorizontal: 8 },
    qty: { marginHorizontal: 6 },

    price: { fontWeight: '700' },

    remove: { fontSize: 18, color: '#aaa' },

    checkout: {
        backgroundColor: GREEN,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 70,
    },

    checkoutText: { color: '#fff', fontWeight: '700' },
    total: { color: '#fff', fontWeight: '700' },

    bottomTab: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingBottom: 16,
        paddingTop: 10,
    },

    tabItem: { flex: 1, alignItems: 'center' },
    tabIcon: { fontSize: 20 },
    tabLabel: { fontSize: 11, color: '#aaa' },
    tabLabelActive: { color: GREEN, fontWeight: '700' },
    tabDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: GREEN,
        marginTop: 2,
    },
});