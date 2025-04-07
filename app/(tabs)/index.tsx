import React, { useState, useEffect } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    Text,
    Dimensions,
    SafeAreaView
} from 'react-native';
import { ProductDto } from '@/types/models';
import api from '@/services/api';
import Haiku from '@/components/Haiku';
import Notification from '@/components/Notification';
import { ParallaxBackground } from '@/components/ParallaxBackground';
import { ProductsCarousel } from "@/components/ProductsCarousel";
import { commonStyles } from "@/styles/Common";

const { width, height } = Dimensions.get('window');

interface NotificationItem {
    id: number;
    message: string;
    type: 'success' | 'error';
}

interface ProductsState {
    popular: ProductDto[];
    new: ProductDto[];
    discounted: ProductDto[];
    total: number;
    loading: boolean;
    error: string | null;
}

export default function HomeScreen() {
    const [products, setProducts] = useState<ProductsState>({
        popular: [],
        new: [],
        discounted: [],
        total: 0,
        loading: true,
        error: null,
    });
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const fetchProducts = async () => {
        try {
            setProducts(prev => ({ ...prev, loading: true, error: null }));

            const [popularResponse, newResponse, discountedResponse] = await Promise.all([
                api.get<{ items?: ProductDto[], total?: number }>('/products', {
                    params: {
                        sort: 'averageRating',
                        order: 'DESC',
                        page: 1,
                        take: 6,
                    },
                }),
                api.get<{ items?: ProductDto[], total?: number }>('/products', {
                    params: {
                        sort: 'productId',
                        order: 'DESC',
                        page: 1,
                        take: 6,
                    },
                }),
                api.get<{ items?: ProductDto[], total?: number }>('/products', {
                    params: {
                        page: 1,
                        take: 6,
                    },
                }),
            ]);

            if (!popularResponse.data?.items || !newResponse.data?.items || !discountedResponse.data?.items) {
                throw new Error('Неверный формат данных от сервера');
            }

            setProducts({
                popular: popularResponse.data.items || [],
                new: newResponse.data.items || [],
                discounted: discountedResponse.data.items || [],
                total: popularResponse.data.total || 0,
                loading: false,
                error: null,
            });
        } catch (error) {
            console.error('Ошибка получения товаров:', error);
            const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка при загрузке товаров';

            setProducts({
                popular: [],
                new: [],
                discounted: [],
                total: 0,
                loading: false,
                error: errorMessage,
            });

            addNotification(errorMessage, 'error');
        }
    };

    const addNotification = (message: string, type: 'success' | 'error') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeNotification(id), 3000);
    };

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (products.loading) {
        return (
            <View style={[commonStyles.loadingContainer, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#8b0000" />
            </View>
        );
    }

    if (products.error) {
        return (
            <View style={[commonStyles.errorContainer, styles.errorContainer]}>
                <Text style={commonStyles.errorText}>{products.error}</Text>
                <Text style={commonStyles.retryText} onPress={fetchProducts}>
                    Попробовать снова
                </Text>
            </View>
        );
    }

    const renderCarouselOrMessage = (products: ProductDto[], title: string) => {
        if (!products || products.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyMessage}>Нет товаров в категории "{title}"</Text>
                </View>
            );
        }
        return (
            <View style={styles.carouselWrapper}>
                <ProductsCarousel products={products} />
            </View>
        );
    };

    return (
        <SafeAreaView style={commonStyles.screenContainer}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Популярные товары */}
                <View style={styles.section}>
                    <ParallaxBackground
                        title="ПОПУЛЯРНОЕ"
                        image={require('@/assets/images/popular-bg.jpg')}
                    />
                    <Haiku theme="ПОПУЛЯРНОЕ" />
                    {renderCarouselOrMessage(products.popular, 'ПОПУЛЯРНОЕ')}
                </View>

                {/* Новые товары */}
                <View style={styles.section}>
                    <ParallaxBackground
                        title="НОВОЕ"
                        image={require('@/assets/images/new-bg.jpg')}
                    />
                    <Haiku theme="НОВОЕ" />
                    {renderCarouselOrMessage(products.new, 'НОВОЕ')}
                </View>

                {/* Товары по акции */}
                <View style={styles.section}>
                    <ParallaxBackground
                        title="АКЦИЯ"
                        image={require('@/assets/images/discounts-bg.jpg')}
                    />
                    <Haiku theme="АКЦИЯ" />
                    {renderCarouselOrMessage(products.discounted, 'АКЦИЯ')}
                </View>
            </ScrollView>

            {/* Уведомления */}
            <View style={styles.notificationsWrapper}>
                {notifications.map(n => (
                    <Notification
                        key={n.id}
                        message={n.message}
                        type={n.type}
                        onClose={() => removeNotification(n.id)}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 30,
    },
    section: {
        marginBottom: 30,
    },
    carouselWrapper: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
    loadingContainer: {
        backgroundColor: '#fff',
    },
    errorContainer: {
        backgroundColor: '#fff',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 10,
    },
    notificationsWrapper: {
        position: 'absolute',
        top: 10,
        right: 10,
        left: 10,
        zIndex: 1000,
    },
});