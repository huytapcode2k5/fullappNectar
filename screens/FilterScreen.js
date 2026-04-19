import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, SafeAreaView
} from 'react-native';

const GREEN = '#5DAF6A';

export default function FilterScreen({ onApply, onClose }) {
    const [category, setCategory] = useState('Eggs');
    const [brand, setBrand] = useState('Cocola');

    const Item = ({ label, selected, onPress }) => (
        <TouchableOpacity style={s.item} onPress={onPress}>
            <View style={[s.checkbox, selected && s.checked]}>
                {selected && <Text style={s.tick}>✓</Text>}
            </View>
            <Text style={[s.label, selected && { color: GREEN }]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={s.container}>

            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity onPress={onClose}>
                    <Text style={s.close}>✕</Text>
                </TouchableOpacity>
                <Text style={s.title}>Filters</Text>
                <View style={{ width: 20 }} />
            </View>

            {/* Box trắng */}
            <View style={s.card}>

                {/* Categories */}
                <Text style={s.section}>Categories</Text>

                <Item label="Eggs"
                    selected={category === 'Eggs'}
                    onPress={() => setCategory('Eggs')}
                />
                <Item label="Noodles & Pasta"
                    selected={category === 'Noodles'}
                    onPress={() => setCategory('Noodles')}
                />
                <Item label="Chips & Crisps"
                    selected={category === 'Chips'}
                    onPress={() => setCategory('Chips')}
                />
                <Item label="Fast Food"
                    selected={category === 'Fast'}
                    onPress={() => setCategory('Fast')}
                />

                {/* Brand */}
                <Text style={s.section}>Brand</Text>

                <Item label="Individual Collection"
                    selected={brand === 'Indi'}
                    onPress={() => setBrand('Indi')}
                />
                <Item label="Cocola"
                    selected={brand === 'Cocola'}
                    onPress={() => setBrand('Cocola')}
                />
                <Item label="Ifad"
                    selected={brand === 'Ifad'}
                    onPress={() => setBrand('Ifad')}
                />
                <Item label="Kazi Farms"
                    selected={brand === 'Kazi'}
                    onPress={() => setBrand('Kazi')}
                />

            </View>

            {/* Button */}
            <TouchableOpacity style={s.btn} onPress={onApply}>
                <Text style={s.btnText}>Apply Filter</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}
const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F3F2', // nền xám giống hình
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    close: {
        fontSize: 22,
        color: '#181725',
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#181725',
    },

    // BOX TRẮNG BO GÓC
    card: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 15,
        borderRadius: 25,
        padding: 20,
    },

    section: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 10,
        marginBottom: 10,
        color: '#181725',
    },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },

    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: '#ccc',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    checked: {
        backgroundColor: GREEN,
        borderColor: GREEN,
    },

    tick: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },

    label: {
        fontSize: 14,
        color: '#181725',
    },

    btn: {
        backgroundColor: GREEN,
        margin: 20,
        padding: 18,
        borderRadius: 18,
        alignItems: 'center',
    },

    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});