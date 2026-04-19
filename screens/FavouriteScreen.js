import React from 'react';
import {
    View, Text, StyleSheet, SafeAreaView,
    FlatList, Image, TouchableOpacity
} from 'react-native';

const GREEN = '#5DAF6A';

const data = [
    {
        id: '1',
        name: 'Sprite Can',
        desc: '325ml, Price',
        price: '$1.50',
        image: require('../assets/sprite.png'),
    },
    {
        id: '2',
        name: 'Diet Coke',
        desc: '355ml, Price',
        price: '$1.99',
        image: require('../assets/coke.png'),
    },
    {
        id: '3',
        name: 'Apple & Grape Juice',
        desc: '2L, Price',
        price: '$15.50',
        image: require('../assets/appjuice.png'),
    },
    {
        id: '4',
        name: 'Coca Cola Can',
        desc: '325ml, Price',
        price: '$4.99',
        image: require('../assets/coca.png'),
    },
    {
        id: '5',
        name: 'Pepsi Can',
        desc: '330ml, Price',
        price: '$4.99',
        image: require('../assets/pepsi.png'),
    },
];

function Item({ item }) {
    return (
        <View style={s.item}>
            <Image source={item.image} style={s.img} />

            <View style={{ flex: 1 }}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.desc}>{item.desc}</Text>
            </View>

            <Text style={s.price}>{item.price}</Text>
            <Text style={s.arrow}>›</Text>
        </View>
    );
}

export default function FavouriteScreen({ onNavigate }) {
    return (
        <SafeAreaView style={s.safe}>
            <View style={{ flex: 1 }}>
                <Text style={s.title}>Favourite</Text>

                <FlatList
                    data={data}
                    keyExtractor={i => i.id}
                    renderItem={({ item }) => <Item item={item} />}
                />
            </View>

            <TouchableOpacity style={s.btn}>
                <Text style={s.btnText}>Add All To Cart</Text>
            </TouchableOpacity>

            <BottomTab active={3} onNavigate={onNavigate} />
        </SafeAreaView>
    );
}

// TAB
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

    img: { width: 50, height: 50, marginRight: 10 },

    name: { fontWeight: '700' },
    desc: { color: '#888', fontSize: 12 },

    price: { marginRight: 10, fontWeight: '600' },
    arrow: { fontSize: 18 },

    btn: {
        backgroundColor: GREEN,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 70,
    },

    btnText: { color: '#fff', fontWeight: '700' },

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