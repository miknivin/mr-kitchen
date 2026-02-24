
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
}

interface CartState {
    items: CartItem[];
    totalAmount: number;
}

// Load cart from localStorage (client-only)
const readCartFromStorage = (): CartState => {
    try {
        const saved = localStorage.getItem("mrkitchen_cart");
        if (!saved) return { items: [], totalAmount: 0 };
        return JSON.parse(saved) as CartState;
    } catch {
        return { items: [], totalAmount: 0 };
    }
};

// Save cart to localStorage
const saveCartToStorage = (state: CartState) => {
    try {
        if (typeof window !== "undefined") {
            localStorage.setItem("mrkitchen_cart", JSON.stringify(state));
        }
    } catch {
        // ignore storage errors
    }
};

// Always start empty — client will rehydrate via useEffect
const initialState: CartState = { items: [], totalAmount: 0 };

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                (item) => item.id === action.payload.id && item.size === action.payload.size
            );
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            state.totalAmount = state.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
            saveCartToStorage({ items: state.items, totalAmount: state.totalAmount });
        },
        removeFromCart: (state, action: PayloadAction<{ id: string; size?: string }>) => {
            state.items = state.items.filter(
                (item) => !(item.id === action.payload.id && item.size === action.payload.size)
            );
            state.totalAmount = state.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
            saveCartToStorage({ items: state.items, totalAmount: state.totalAmount });
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            saveCartToStorage({ items: [], totalAmount: 0 });
        },
        // Rehydrate from localStorage after client mount
        updateCartQuantity: (state, action: PayloadAction<{ id: string; size?: string; quantity: number }>) => {
            const item = state.items.find(
                (item) => item.id === action.payload.id && item.size === action.payload.size
            );
            if (item) {
                item.quantity = action.payload.quantity;
            }
            state.totalAmount = state.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
            saveCartToStorage({ items: state.items, totalAmount: state.totalAmount });
        },
        hydrateCart: (_state, action: PayloadAction<CartState>) => {
            return action.payload;
        },
    },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart, hydrateCart } = cartSlice.actions;
export default cartSlice.reducer;
