/**
 * CartContext.js
 * Đặt file này ở thư mục gốc project (cùng cấp với App.js)
 *
 * Cung cấp:
 *  - cart        : danh sách sản phẩm trong giỏ  [{ id, name, desc, price, image, qty }]
 *  - orders      : danh sách đơn hàng đã checkout [{ id, items, total, createdAt }]
 *  - addToCart   : thêm / tăng số lượng sản phẩm
 *  - removeFromCart  : xóa hẳn 1 item
 *  - updateQty   : tăng / giảm số lượng
 *  - clearCart   : xóa toàn bộ giỏ
 *  - checkout    : lưu đơn hàng mới, xóa giỏ
 *  - cartCount   : tổng số lượng (badge icon)
 *  - cartTotal   : tổng tiền
 */

import React, {
    createContext, useContext, useEffect, useReducer, useCallback,
} from 'react';
import { cartStorage, ordersStorage } from './services/storageService';

// ── Initial State ──────────────────────────────────────────────────────────────
const initialState = {
    cart: [],
    orders: [],
    hydrated: false,   // đã load từ storage chưa
};

// ── Reducer ────────────────────────────────────────────────────────────────────
function reducer(state, action) {
    switch (action.type) {

        case 'HYDRATE':
            return { ...state, cart: action.cart, orders: action.orders, hydrated: true };

        case 'ADD_TO_CART': {
            const existing = state.cart.find(i => i.id === action.item.id);
            const newCart = existing
                ? state.cart.map(i =>
                    i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
                )
                : [...state.cart, { ...action.item, qty: 1 }];
            return { ...state, cart: newCart };
        }

        case 'REMOVE_FROM_CART':
            return { ...state, cart: state.cart.filter(i => i.id !== action.id) };

        case 'UPDATE_QTY': {
            const newCart = state.cart
                .map(i => i.id === action.id ? { ...i, qty: i.qty + action.delta } : i)
                .filter(i => i.qty > 0);   // qty = 0 → xóa
            return { ...state, cart: newCart };
        }

        case 'CLEAR_CART':
            return { ...state, cart: [] };

        case 'CHECKOUT': {
            const order = {
                id: Date.now().toString(),
                items: state.cart,
                total: state.cart.reduce((s, i) => s + i.price * i.qty, 0),
                createdAt: new Date().toISOString(),
            };
            return { ...state, cart: [], orders: [order, ...state.orders] };
        }

        default:
            return state;
    }
}

// ── Context ────────────────────────────────────────────────────────────────────
const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // ── Load từ storageService khi khởi động ──
    useEffect(() => {
        async function hydrate() {
            const cart = await cartStorage.load();
            const orders = await ordersStorage.load();
            dispatch({ type: 'HYDRATE', cart, orders });
        }
        hydrate();
    }, []);

    // ── Tự động lưu cart khi thay đổi ──
    useEffect(() => {
        if (!state.hydrated) return;
        cartStorage.save(state.cart);
    }, [state.cart, state.hydrated]);

    // ── Tự động lưu orders khi thay đổi ──
    useEffect(() => {
        if (!state.hydrated) return;
        ordersStorage.save(state.orders);
    }, [state.orders, state.hydrated]);

    // ── Actions ──
    const addToCart = useCallback(item => dispatch({ type: 'ADD_TO_CART', item }), []);
    const removeFromCart = useCallback(id => dispatch({ type: 'REMOVE_FROM_CART', id }), []);
    const updateQty = useCallback((id, delta) => dispatch({ type: 'UPDATE_QTY', id, delta }), []);
    const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
    const checkout = useCallback(() => dispatch({ type: 'CHECKOUT' }), []);

    // ── Derived ──
    const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
    const cartTotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);

    return (
        <CartContext.Provider value={{
            cart: state.cart,
            orders: state.orders,
            hydrated: state.hydrated,
            addToCart,
            removeFromCart,
            updateQty,
            clearCart,
            checkout,
            cartCount,
            cartTotal,
        }}>
            {children}
        </CartContext.Provider>
    );
}

// ── Hook tiện dụng ─────────────────────────────────────────────────────────────
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart phải dùng bên trong <CartProvider>');
    return ctx;
}