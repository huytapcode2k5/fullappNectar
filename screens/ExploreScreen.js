import React, { useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView,
    TextInput, TouchableOpacity, FlatList,
    Image, ScrollView
} from 'react-native';

import { categories, products } from '../data/data';

const GREEN = '#53B175';

export default function ExploreScreen({ onNavigate }) {
    const [searchText, setSearchText] = useState('');

    const isSearching = searchText.trim().length > 0;

    const filtered = products.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <SafeAreaView style={s.container}>
            {/* TITLE */}
            <Text style={s.title}>Find Products</Text>

            {/* SEARCH */}
            <View style={s.searchBox}>
                <Text style={s.searchIcon}>🔍</Text>
                <TextInput
                    placeholder="Search Store"
                    value={searchText}
                    onChangeText={setSearchText}
                    style={s.input}
                />
            </View>

            {/* CONTENT */}
            {!isSearching ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={s.grid}>
                        {categories.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={[s.card, { backgroundColor: item.color }]}
                                activeOpacity={0.8}
                                onPress={() => {
                                    if (item.screen) {
                                        onNavigate(item.screen); // 👉 chuyển màn
                                    }
                                }}
                            >
                                <Image source={item.image} style={s.catImg} />
                                <Text style={s.catText}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <FlatList
                    key={isSearching ? 'search' : 'category'}
                    data={isSearching ? filtered : categories}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) =>
                        isSearching ? (
                            // PRODUCT
                            <View style={s.productCard}>
                                <View style={s.productCard}>
                                    <Image source={item.image} style={s.productImg} />

                                    <Text style={s.productName}>{item.name}</Text>
                                    <Text style={s.productCategory}>{item.category}</Text>

                                    <Text style={s.productPrice}>${item.price}</Text>
                                </View>
                            </View>
                        ) : (
                            // CATEGORY
                            <TouchableOpacity
                                style={[s.card, { backgroundColor: item.color }]}
                                onPress={() => item.screen && onNavigate(item.screen)}
                            >
                                <Image source={item.image} style={s.catImg} />
                                <Text>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    }
                />
            )}

            {/* BOTTOM TAB */}
            <BottomTab onNavigate={onNavigate} />
        </SafeAreaView>
    );
}

function BottomTab({ onNavigate }) {
    const screens = ['home', 'explore', 'cart', 'favourite', 'account'];
    const icons = ['🏠', '🔍', '🛒', '❤️', '👤'];

    return (
        <View style={s.tab}>
            {icons.map((icon, i) => (
                <TouchableOpacity
                    key={i}
                    onPress={() => onNavigate(screens[i])}
                >
                    <Text style={s.tabIcon}>{icon}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        marginVertical: 12,
        color: '#181725',
    },

    // SEARCH
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F3F2',
        marginHorizontal: 16,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10,
    },

    searchIcon: {
        fontSize: 16,
    },

    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
    },

    // GRID
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 10,
    },

    // CATEGORY CARD
    card: {
        width: '48%',
        height: 160,
        borderRadius: 18,
        padding: 12,
        marginBottom: 14,
        justifyContent: 'flex-end',
        alignItems: 'center',

        borderWidth: 1,
        borderColor: '#E2E2E2',

        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 5,
        elevation: 2,
    },

    catImg: {
        width: 90,
        height: 90,
        position: 'absolute',
        top: 15,
    },

    catText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#181725',
        textAlign: 'center',
    },

    // PRODUCT CARD (SEARCH)
    productCard: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        margin: 5,
        padding: 10,
        borderRadius: 12,
    },

    productImg: {
        width: 80,
        height: 80,
        alignSelf: 'center',
    },

    productName: {
        fontWeight: '700',
        marginTop: 5,
    },

    productCategory: {
        fontSize: 12,
        color: '#888',
    },

    productPrice: {
        marginTop: 5,
        fontWeight: '700',
    },

    // TAB
    tab: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
    },

    tabIcon: {
        fontSize: 18,
    },
});