import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import {CategoryDto, FeedbackDto, OrderedProductDto, ProductDto} from "@/types/models";

interface CartItem {
    productId: number;
    productName: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: number;
    imagesUrl: string[];
    averageRating: number | string | null;
    totalFeedbacks: number;
    imageUrl: string;
    maxQuantity: number;
    category?: CategoryDto;
    orderedProducts?: OrderedProductDto[]; // Хс зачем, но пусть будет пока
    feedbacks?: FeedbackDto[];
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    updateQuantity: (productId: number, newQuantity: number) => void;
    removeItem: (productId: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType>(null!);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const loadCart = async () => {
            const cart = await SecureStore.getItemAsync('cart');
            if (cart) setItems(JSON.parse(cart));
        };
        loadCart();
    }, []);

    const saveCart = async (cartItems: CartItem[]) => {
        await SecureStore.setItemAsync('cart', JSON.stringify(cartItems));
    };

    const addToCart = (item: CartItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.productId === item.productId);
            const newItems = existing
                ? prev.map(i =>
                    i.productId === item.productId
                        ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxQuantity) }
                        : i
                )
                : [...prev, item];
            saveCart(newItems);
            return newItems;
        });
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        setItems(prev => {
            const newItems = prev.map(item =>
                item.productId === productId
                    ? { ...item, quantity: Math.max(1, Math.min(newQuantity, item.maxQuantity)) }
                    : item
            );
            saveCart(newItems);
            return newItems;
        });
    };

    const removeItem = (productId: number) => {
        setItems(prev => {
            const newItems = prev.filter(item => item.productId !== productId);
            saveCart(newItems);
            return newItems;
        });
    };

    const clearCart = () => {
        setItems([]);
        SecureStore.deleteItemAsync('cart');
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                updateQuantity,
                removeItem,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);