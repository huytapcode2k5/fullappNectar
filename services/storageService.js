/**
 * services/storageService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Toàn bộ thao tác AsyncStorage của app được tập trung tại đây.
 *
 * Quy tắc:
 *  - Mọi hàm đều async/await
 *  - Mọi hàm đều có try/catch — không để lỗi storage làm crash app
 *  - Dữ liệu lưu dạng JSON (JSON.stringify khi ghi, JSON.parse khi đọc)
 *  - Trả về { data, error } để caller tự xử lý khi cần
 *
 * Phân nhóm:
 *  AUTH    → user, token
 *  CART    → danh sách sản phẩm trong giỏ
 *  ORDERS  → lịch sử đơn hàng
 * ─────────────────────────────────────────────────────────────────────────────
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ═══════════════════════════════════════════════════════════════════════════════
// KEYS — tất cả key lưu AsyncStorage đặt ở đây, tránh magic string rải rác
// ═══════════════════════════════════════════════════════════════════════════════
export const STORAGE_KEYS = {
    // Auth
    USER: '@nectar_user',
    TOKEN: '@nectar_token',

    // Cart & Orders
    CART: '@nectar_cart',
    ORDERS: '@nectar_orders',
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS nội bộ
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Đọc 1 key, trả về giá trị đã parse JSON.
 * Nếu key không tồn tại → trả về null.
 * Nếu lỗi → trả về defaultValue.
 */
async function getItem(key, defaultValue = null) {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (raw === null) return defaultValue;
        return JSON.parse(raw);
    } catch (error) {
        console.error(`[storageService] getItem("${key}") lỗi:`, error);
        return defaultValue;
    }
}

/**
 * Ghi 1 key với giá trị đã stringify JSON.
 * Trả về true nếu thành công, false nếu lỗi.
 */
async function setItem(key, value) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`[storageService] setItem("${key}") lỗi:`, error);
        return false;
    }
}

/**
 * Xóa nhiều key cùng lúc.
 * Trả về true nếu thành công, false nếu lỗi.
 */
async function removeItems(keys) {
    try {
        await AsyncStorage.multiRemove(keys);
        return true;
    } catch (error) {
        console.error(`[storageService] removeItems(${keys}) lỗi:`, error);
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Lưu thông tin user + token sau khi đăng nhập / đăng ký thành công.
 *
 * @param {{ id, name, email }} user
 * @param {string} token
 * @returns {Promise<boolean>} true nếu lưu thành công
 *
 * @example
 *   const ok = await authStorage.save(user, token);
 */
export const authStorage = {

    async save(user, token) {
        try {
            await AsyncStorage.multiSet([
                [STORAGE_KEYS.USER, JSON.stringify(user)],
                [STORAGE_KEYS.TOKEN, JSON.stringify(token)],
            ]);
            return true;
        } catch (error) {
            console.error('[storageService] authStorage.save lỗi:', error);
            return false;
        }
    },

    /**
     * Đọc user + token khi app khởi động (dùng cho auto-login).
     *
     * @returns {Promise<{ user: object|null, token: string|null }>}
     *
     * @example
     *   const { user, token } = await authStorage.load();
     *   if (user && token) navigateTo('home');
     */
    async load() {
        try {
            const results = await AsyncStorage.multiGet([
                STORAGE_KEYS.USER,
                STORAGE_KEYS.TOKEN,
            ]);

            const safeParse = (value) => {
                try {
                    return JSON.parse(value);
                } catch {
                    return null;
                }
            };

            const user = results[0][1] ? safeParse(results[0][1]) : null;
            const token = results[1][1] ? safeParse(results[1][1]) : null;

            return { user, token };

        } catch (error) {
            console.error('[storageService] authStorage.load lỗi:', error);
            return { user: null, token: null };
        }
    },

    /**
     * Xóa toàn bộ dữ liệu auth (dùng khi logout).
     *
     * @returns {Promise<boolean>}
     *
     * @example
     *   await authStorage.clear();
     */
    async clear() {
        return removeItems([STORAGE_KEYS.USER, STORAGE_KEYS.TOKEN]);
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CART SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Quản lý giỏ hàng trong AsyncStorage.
 * Format lưu: Array<{ id, name, desc, price, image, qty }>
 *
 * @example
 *   const items = await cartStorage.load();
 *   await cartStorage.save(updatedCart);
 *   await cartStorage.clear();
 */
export const cartStorage = {

    /**
     * Đọc toàn bộ giỏ hàng.
     * @returns {Promise<Array>} mảng items, [] nếu chưa có hoặc lỗi
     */
    async load() {
        return getItem(STORAGE_KEYS.CART, []);
    },

    /**
     * Ghi toàn bộ giỏ hàng (ghi đè).
     * @param {Array} cartItems
     * @returns {Promise<boolean>}
     */
    async save(cartItems) {
        return setItem(STORAGE_KEYS.CART, cartItems);
    },

    /**
     * Xóa sạch giỏ hàng.
     * @returns {Promise<boolean>}
     */
    async clear() {
        return setItem(STORAGE_KEYS.CART, []);
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ORDERS SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Quản lý lịch sử đơn hàng trong AsyncStorage.
 * Format lưu: Array<{ id, items, total, createdAt }>
 *
 * @example
 *   const orders = await ordersStorage.load();
 *   await ordersStorage.addOrder(newOrder);
 */
export const ordersStorage = {

    /**
     * Đọc toàn bộ danh sách đơn hàng.
     * @returns {Promise<Array>} mảng orders, [] nếu chưa có hoặc lỗi
     */
    async load() {
        return getItem(STORAGE_KEYS.ORDERS, []);
    },

    /**
     * Thêm 1 đơn hàng mới vào đầu danh sách (mới nhất lên trước).
     *
     * @param {{ id, items, total, createdAt }} order
     * @returns {Promise<boolean>}
     *
     * @example
     *   const order = {
     *     id: Date.now().toString(),
     *     items: cart,
     *     total: cartTotal,
     *     createdAt: new Date().toISOString(),
     *   };
     *   await ordersStorage.addOrder(order);
     */
    async addOrder(order) {
        try {
            const existing = await getItem(STORAGE_KEYS.ORDERS, []);
            const updated = [order, ...existing];  // mới nhất lên đầu
            return setItem(STORAGE_KEYS.ORDERS, updated);
        } catch (error) {
            console.error('[storageService] ordersStorage.addOrder lỗi:', error);
            return false;
        }
    },

    /**
     * Ghi đè toàn bộ danh sách đơn hàng.
     * @param {Array} orders
     * @returns {Promise<boolean>}
     */
    async save(orders) {
        return setItem(STORAGE_KEYS.ORDERS, orders);
    },

    /**
     * Xóa toàn bộ lịch sử đơn hàng.
     * @returns {Promise<boolean>}
     */
    async clear() {
        return setItem(STORAGE_KEYS.ORDERS, []);
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CLEAR ALL — xóa toàn bộ dữ liệu app (dùng khi logout hoàn toàn)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Xóa TẤT CẢ dữ liệu của app khỏi AsyncStorage.
 * Dùng khi người dùng logout và muốn reset hoàn toàn.
 *
 * @returns {Promise<boolean>}
 *
 * @example
 *   await clearAllStorage();
 */
export async function clearAllStorage() {
    return removeItems(Object.values(STORAGE_KEYS));
}