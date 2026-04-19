import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, Image, FlatList, SafeAreaView, StatusBar,
} from 'react-native';

const GREEN = '#5DAF6A';
const LIGHT_GREEN = '#EAF6EC';

// ── Dummy data ──────────────────────────────────────────
const exclusiveOffers = [
    { id: '1', name: 'Organic Bananas', desc: '7pcs, Pricag', price: '$4.99', image: require('../assets/banana.png') },
    { id: '2', name: 'Red Apple', desc: '1kg, Pricag', price: '$4.99', image: require('../assets/apple.png') },

];

const bestSelling = [
    { id: '1', name: 'Ớt', desc: '1kg, Pricag', price: '$4.99', image: require('../assets/ot.png') },
    { id: '2', name: 'Gừng', desc: '1kg, Pricag', price: '$4.99', image: require('../assets/gung.png') },
];

const groceries = [
    { id: '1', name: 'Pulses', color: '#FFF3E0', image: require('../assets/pulses.png') },
    { id: '2', name: 'Rice', color: '#F3E5F5', image: require('../assets/rice.png') },

];

const meatItems = [
    { id: '1', name: 'Beef Bone', desc: '1kg, Pricag', price: '$4.99', image: require('../assets/beef.png') },
    { id: '2', name: 'Broiler Chicken', desc: '1kg, Pricag', price: '$4.99', image: require('../assets/chicken.png') },

];


// ── Sub-components ──────────────────────────────────────

function SectionHeader({ title, onSeeAll }) {
    return (
        <View style={s.sectionHeader}>

            <Text style={s.sectionTitle}>{title}</Text>
            <TouchableOpacity onPress={onSeeAll}>
                <Text style={s.seeAll}>See all</Text>
            </TouchableOpacity>
        </View>

    );
}

function ProductCard({ item, onPress }) {
    const [added, setAdded] = useState(false);
    return (
        <TouchableOpacity style={s.productCard} onPress={() => onPress && onPress(item)}>
            <View style={s.productImgBox}>
                <Image source={item.image} style={s.productImg} resizeMode="contain" />
            </View>
            <Text style={s.productName}>{item.name}</Text>
            <Text style={s.productDesc}>{item.desc}</Text>
            <View style={s.productFooter}>
                <Text style={s.productPrice}>{item.price}</Text>
                <TouchableOpacity
                    style={[s.addBtn, added && s.addBtnActive]}
                    onPress={() => setAdded(!added)}
                >
                    <Text style={s.addBtnText}>{added ? '✓' : '+'}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

function GroceryChip({ item }) {
    return (
        <TouchableOpacity style={[s.groceryChip, { backgroundColor: item.color }]}>
            <Image source={item.image} style={s.groceryImg} resizeMode="contain" />
            <Text style={s.groceryName}>{item.name}</Text>
        </TouchableOpacity>
    );
}

function Banner({ item }) {
    return (
        <View style={[s.banner, { backgroundColor: item.bg }]}>
            <View style={s.bannerText}>
                <Text style={s.bannerTitle}>{item.title}</Text>
                <Text style={s.bannerSub}>{item.sub}</Text>
            </View>
            <Image source={item.image} style={s.bannerImg} resizeMode="contain" />
        </View>
    );
}

// ── Bottom Tab ──────────────────────────────────────────
const tabs = [
    { icon: '🏠', label: 'Shop' },
    { icon: '🔍', label: 'Explore' },
    { icon: '🛒', label: 'Cart' },
    { icon: '❤️', label: 'Favourite' },
    { icon: '👤', label: 'Account' },
];

function BottomTab({ active, setActive, onNavigate }) {
    return (
        <View style={s.bottomTab}>
            {tabs.map((t, i) => (
                <TouchableOpacity key={t.label} style={s.tabItem} onPress={() => {
                    setActive(i);

                    const screens = ['home', 'explore', 'cart', 'favourite', 'account'];

                    if (screens[i]) {
                        onNavigate && onNavigate(screens[i]);
                    }
                }}>
                    <Text style={s.tabIcon}>{t.icon}</Text>
                    <Text style={[s.tabLabel, active === i && s.tabLabelActive]}>{t.label}</Text>
                    {active === i && <View style={s.tabDot} />}
                </TouchableOpacity>
            ))}
        </View>
    );
}

// ── Main HomeScreen ─────────────────────────────────────
export default function HomeScreen({ setScreen }) {
    const [activeTab, setActiveTab] = useState(0);
    const [searchText, setSearchText] = useState('');

    return (
        <SafeAreaView style={s.safe}>
            <StatusBar barStyle="dark-content" />
            <View style={s.root}>
                <ScrollView
                    style={s.scroll}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 90 }}
                >
                    {/* Location bar */}
                    <View style={s.locationBar}>
                        <View style={s.centerBox}>
                            <Text style={s.carrotEmoji}>🥕</Text>

                            <View style={s.locationRow}>
                                <Text style={s.locationPin}>📍</Text>
                                <Text style={s.locationText}>Dhaka, Banassre</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={s.cartIcon}>
                            <Text style={{ fontSize: 20 }}>🛒</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search bar */}
                    <View style={s.searchBar}>
                        <Text style={s.searchIcon}>🔍</Text>
                        <TextInput
                            style={s.searchInput}
                            placeholder="Search Store"
                            placeholderTextColor="#aaa"
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>

                    {/* Banner carousel */}
                    <FlatList
                        //data={banners}
                        keyExtractor={b => b.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={s.bannerList}
                        renderItem={({ item }) => <Banner item={item} />}
                    />

                    {/* Exclusive Offer */}
                    <SectionHeader title="Exclusive Offer" onSeeAll={() => { }} />
                    <FlatList
                        data={exclusiveOffers}
                        keyExtractor={i => i.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        renderItem={({ item }) => (
                            <ProductCard
                                item={item}
                                onPress={() => {
                                    if (item.name.includes('Apple')) {
                                        setScreen('productDetail');
                                    }
                                }}
                            />
                        )}
                    />

                    {/* Best Selling */}
                    <SectionHeader title="Best Selling" onSeeAll={() => { }} />
                    <FlatList
                        data={bestSelling}
                        keyExtractor={i => i.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        renderItem={({ item }) => <ProductCard item={item} />}
                    />

                    {/* Groceries */}
                    <SectionHeader title="Groceries" onSeeAll={() => { }} />
                    <FlatList
                        data={groceries}
                        keyExtractor={i => i.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
                        renderItem={({ item }) => <GroceryChip item={item} />}
                    />

                    {/* Meat / Protein */}
                    <View style={{ height: 16 }} />
                    <FlatList
                        data={meatItems}
                        keyExtractor={i => i.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        renderItem={({ item }) => <ProductCard item={item} />}
                    />
                </ScrollView>

                <BottomTab
                    active={activeTab}
                    setActive={setActiveTab}
                    onNavigate={setScreen}
                />
            </View>
        </SafeAreaView>
    );
}

// ── Styles ──────────────────────────────────────────────
const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    root: { flex: 1 },
    scroll: { flex: 1 },

    locationBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 10,
    },

    centerBox: {
        flex: 1,
        alignItems: 'center',
    },

    carrotEmoji: {
        fontSize: 28,
        marginBottom: 5,
    },

    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    locationPin: {
        marginRight: 5,
    },

    locationText: {
        fontSize: 14,
        fontWeight: '600',
    },

    cartIcon: {
        position: 'absolute',
        right: 20,
        top: 10,
    },

    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#F2F3F2',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    searchIcon: { fontSize: 16, marginRight: 8 },
    searchInput: { flex: 1, fontSize: 14, color: '#222' },

    bannerList: { paddingHorizontal: 16, marginBottom: 20 },
    banner: {
        width: 320,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    bannerText: { flex: 1 },
    bannerTitle: { fontSize: 18, fontWeight: '800', color: '#222', marginBottom: 4 },
    bannerSub: { fontSize: 13, color: '#555' },
    bannerImg: { width: 100, height: 100 },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 4,
    },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#181725' },
    seeAll: { fontSize: 14, color: GREEN, fontWeight: '600' },

    productCard: {
        width: 152,
        backgroundColor: '#fff',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#EBEBEB',
        padding: 14,
        marginRight: 12,
        marginBottom: 4,
    },
    productImgBox: {
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        height: 96,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    productImg: { width: 72, height: 72 },
    productName: { fontSize: 14, fontWeight: '700', color: '#181725', marginBottom: 2 },
    productDesc: { fontSize: 12, color: '#7C7C7C', marginBottom: 10 },
    productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    productPrice: { fontSize: 16, fontWeight: '800', color: '#181725' },
    addBtn: {
        backgroundColor: GREEN,
        width: 34,
        height: 34,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 5,
    },
    addBtnActive: { backgroundColor: '#222' },
    addBtnText: { color: '#fff', fontSize: 20, lineHeight: 24, fontWeight: '600' },

    groceryChip: {
        width: 180,
        height: 100,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    groceryImg: { width: 56, height: 56, marginRight: 10 },
    groceryName: { fontSize: 15, fontWeight: '700', color: '#333' },

    bottomTab: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingBottom: 16,
        paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 12,
    },
    tabItem: { flex: 1, alignItems: 'center', position: 'relative' },
    tabIcon: { fontSize: 20, marginBottom: 2 },
    tabLabel: { fontSize: 11, color: '#aaa', fontWeight: '500' },
    tabLabelActive: { color: GREEN, fontWeight: '700' },
    tabDot: {
        position: 'absolute',
        bottom: -10,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: GREEN,
    },
});