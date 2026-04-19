// screens/BeveragesScreen.js
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    SafeAreaView, StatusBar, Image,
} from 'react-native';

const GREEN = '#5DAF6A';

const beverages = [
    { id: '1', name: 'Diet Coke', desc: '355ml, Price', price: '$1.99', image: require('../assets/coke.png') },
    { id: '2', name: 'Sprite Can', desc: '325ml, Price', price: '$1.50', image: require('../assets/sprite.png') },
    { id: '3', name: 'Apple & Grape Juice', desc: '2L, Price', price: '$15.99', image: require('../assets/appjuice.png') },
    { id: '4', name: 'Orange Juice', desc: '2L, Price', price: '$15.99', image: require('../assets/mangojuice.png') },
    { id: '5', name: 'Coca Cola Can', desc: '325ml, Price', price: '$4.99', image: require('../assets/coca.png') },
    { id: '6', name: 'Pepsi Can', desc: '330ml, Price', price: '$4.99', image: require('../assets/pepsi.png') },
];

function ProductCard({ item }) {
    const [added, setAdded] = useState(false);
    return (
        <View style={s.card}>
            <View style={s.imgBox}>
                <Image source={item.image} style={s.img} resizeMode="contain" />
            </View>
            <Text style={s.name}>{item.name}</Text>
            <Text style={s.desc}>{item.desc}</Text>
            <View style={s.footer}>
                <Text style={s.price}>{item.price}</Text>
                <TouchableOpacity
                    style={[s.addBtn, added && s.addBtnActive]}
                    onPress={() => setAdded(!added)}
                >
                    <Text style={s.addBtnText}>{added ? '✓' : '+'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function BeveragesScreen({ onBack, onNavigate }) {
    return (
        <SafeAreaView style={s.safe}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity style={s.backBtn} onPress={onBack}>
                    <Text style={s.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={s.headerTitle}>Beverages</Text>
                <TouchableOpacity style={s.filterBtn}>
                    <Text style={s.filterIcon} onPress={() => onNavigate && onNavigate('filter')}>⇅</Text>
                </TouchableOpacity>
            </View>

            {/* Product grid */}
            <FlatList
                data={beverages}
                keyExtractor={i => i.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.listContent}
                columnWrapperStyle={s.row}
                renderItem={({ item }) => <ProductCard item={item} />}
            />
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F3F2',
    },
    backBtn: {
        width: 40, height: 40,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: { fontSize: 24, color: '#333', fontWeight: '300' },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '800',
        color: '#181725',
    },
    filterBtn: {
        width: 40, height: 40,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterIcon: { fontSize: 18, color: '#333' },

    listContent: {
        paddingHorizontal: 12,
        paddingTop: 16,
        paddingBottom: 24,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 14,
    },

    card: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#EBEBEB',
        padding: 14,
    },
    imgBox: {
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    img: { width: 80, height: 80 },
    name: {
        fontSize: 14,
        fontWeight: '700',
        color: '#181725',
        marginBottom: 2,
    },
    desc: {
        fontSize: 12,
        color: '#7C7C7C',
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: { fontSize: 16, fontWeight: '800', color: '#181725' },
    addBtn: {
        backgroundColor: GREEN,
        width: 34, height: 34,
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
});