import React, { useState } from 'react';
import { View, Text, Pressable, Image, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { localStyles } from "@/styles/ProfileScreen";
import api from "@/services/api";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "@/types/navigation";
import {ProductDto} from "@/types/models";

const CartScreen = () => {
    const { items, updateQuantity, removeItem, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    };

    const handleOrderSubmit = async () => {
        if (!user || items.length === 0) return;

        setLoading(true);
        try {
            const orderData = {
                address: "Tokyo, Betatestovaya 4-4-4 4-ku",
                total: calculateTotal(),
                products: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            };

            const response = await api.post(`/orders?userId=${user.userId}`, orderData);

            if (response.status === 201) {
                Alert.alert('Успех', 'Заказ успешно оформлен!');
                clearCart();
            }
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось оформить заказ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={localStyles.cartContainer}>
            {items.length === 0 ? (
                <View style={localStyles.emptyCart}>
                    <MaterialIcons name="remove-shopping-cart" size={40} color="#8b0000" />
                    <Text style={localStyles.emptyCartText}>Корзина пуста</Text>
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={({ item }) => (
                        <Pressable
                            key={item.productId}
                            onPress={() => navigation.navigate('product', { product: item as ProductDto })}
                            style={({ pressed }) => [localStyles.cartItem, { opacity: pressed ? 0.7 : 1 }]}
                        >
                            <View style={localStyles.cartItem}>
                                <Image
                                    source={{ uri: item.imageUrl || require('@/assets/images/no_image.webp') }}
                                    style={localStyles.cartImage}
                                    resizeMode="contain"
                                />
                                <View style={localStyles.cartInfo}>
                                    <Text style={localStyles.cartTitle}>
                                        {item.productName || 'Без названия'}
                                    </Text>
                                    <Text style={localStyles.cartPrice}>
                                        {(item.price || 0).toLocaleString()}₽
                                    </Text>
                                    <View style={localStyles.quantityContainer}>
                                        <Pressable
                                            onPress={() => updateQuantity(item.productId, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            style={localStyles.quantityButton}
                                        >
                                            <AntDesign name="minus" size={16} color="#fff" />
                                        </Pressable>
                                        <Text style={localStyles.quantityText}>{item.quantity}</Text>
                                        <Pressable
                                            onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                                            style={localStyles.quantityButton}
                                        >
                                            <AntDesign name="plus" size={16} color="#fff" />
                                        </Pressable>
                                    </View>
                                </View>
                                <Pressable
                                    onPress={() => removeItem(item.productId)}
                                    style={localStyles.deleteButton}
                                >
                                    <Feather name="trash-2" size={20} color="#8b0000" />
                                </Pressable>
                            </View>
                        </Pressable>
                    )}
                    contentContainerStyle={localStyles.cartItems}
                    style={{ flex: 1 }}
                />
            )}

            {items.length > 0 && (
                <View style={localStyles.cartFooter}>
                    <Text style={localStyles.totalText}>
                        Итого: {calculateTotal().toLocaleString()}₽
                    </Text>
                    <Pressable
                        onPress={handleOrderSubmit}
                        style={localStyles.orderButton}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={localStyles.orderButtonText}>Оформить заказ</Text>
                        )}
                    </Pressable>
                </View>
            )}
        </View>
    );
};

export default CartScreen;