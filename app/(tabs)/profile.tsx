import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TextInput,
    Pressable,
    ActivityIndicator,
    FlatList,
    StyleSheet, Platform, KeyboardAvoidingView,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import Notification from '@/components/Notification';
import { ParallaxBackground } from '@/components/ParallaxBackground';
import { localStyles } from "@/styles/ProfileScreen";
import Constants from "expo-constants";
import CartScreen from "@/app/(tabs)/cart";
import {ProductDto, Role} from "@/types/models";
import {RootStackParamList} from "@/types/navigation";
import {NavigationProp, useNavigation} from "@react-navigation/native";

interface Review {
    id: number;
    product: string;
    text: string;
    productId: number;
    rating: number;
}

interface Order {
    orderId: number;
    date: string;
    status: string;
    address: string;
    total: number;
    products: Array<{
        productId: number,
        orderedProductId: number;
        productName: string;
        quantity: number;
        priceAtOrder: number;
        imagesUrlAtOrder: string[];
    }>;
}

const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'completed': return '#4CAF50';
        case 'pending': return '#FFC107';
        case 'cancelled': return '#8b0000';
        case 'shipped': return '#006b8b';
        case 'processing': return '#b700ff';
        default: return '#fff';
    }
};

const getStatus = (status: string): string => {
    switch (status.toLowerCase()) {
        case "completed":
            return "Завершен";
        case "pending":
            return "В ожидании";
        case "cancelled":
            return "Отменен";
        case "shipped":
            return "В пути";
        case "processing":
            return "В обработке";
        default:
            return "";
    }
};

const ProfileScreen = () => {
    const { user, logout, openAuthModal } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'cart'>('profile');
    const [formData, setFormData] = useState({
        login: '',
        email: '',
        defaultAddress: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState({ profile: true, orders: true });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [notifications, setNotifications] = useState<
        Array<{ id: number; message: string; type: 'success' | 'error' }>
    >([]);

    useEffect(() => {
        if (!user?.userId) return;

        const fetchProfileData = async () => {
            try {
                if (!user) return;
                const [userResponse, reviewsResponse] = await Promise.all([
                    api.get(`/users/${user.userId}`),
                    api.get(`/feedbacks/user/${user.userId}`),
                ]);

                setFormData(prev => ({
                    ...prev,
                    login: userResponse.data.login,
                    email: userResponse.data.email,
                }));
                setReviews(reviewsResponse.data.items);
            } catch (error) {
                showNotification('Ошибка загрузки данных профиля', 'error');
            } finally {
                setLoading(prev => ({ ...prev, profile: false }));
            }
        };

        const fetchOrders = async () => {
            try {
                const response = await api.get(`/orders/user/${user.userId}`, {
                    params: { page: currentPage, take: 10 }
                });
                setOrders(response.data.items);
                setTotalPages(Math.ceil(response.data.total / 10));
            } catch (error) {
                showNotification('Ошибка загрузки заказов', 'error');
            } finally {
                setLoading(prev => ({ ...prev, orders: false }));
            }
        };

        fetchProfileData();
        fetchOrders();
    }, [user?.userId, currentPage]);

    useEffect(() => {
        if (activeTab !== 'orders' || !user?.userId) return;

        const fetchOrders = async () => {
            try {
                setLoading(prev => ({ ...prev, orders: true }));
                const response = await api.get(`/orders/user/${user.userId}`, {
                    params: { page: currentPage, take: 10 }
                });
                setOrders(response.data.items);
                setTotalPages(Math.ceil(response.data.total / 10));
            } catch (error) {
                showNotification('Ошибка загрузки заказов', 'error');
            } finally {
                setLoading(prev => ({ ...prev, orders: false }));
            }
        };

        fetchOrders();
    }, [activeTab, user?.userId, currentPage]);


    const showNotification = (message: string, type: 'success' | 'error') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const normalizeImageUrl = (url: string) => {
        return url.replace(/http:\/\/localhost:\d+/, Constants.expoConfig?.extra?.REACT_APP_SERVER_URL);
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (formData.newPassword && !formData.currentPassword) {
            newErrors.currentPassword = 'Требуется текущий пароль';
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdateProfile = async () => {
        if (!validateForm() || !user) return;
        try {
            const response = await api.get('/roles') as {"data": {items: Role[], total: number}};
            const roleId = response.data.items.find(item => item.roleName === user.roleName)?.roleId;
            await api.put(`/users/${String(user.userId)}?userId=${String(user.userId)}`, {
                login: formData.login,
                email: formData.email,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                roleId: roleId,
            });
            showNotification('Профиль успешно обновлен', 'success');
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
        } catch (error) {
            showNotification('Ошибка обновления профиля', 'error');
            console.log(error)
        }
    };



    const renderOrderItem = ({ item }: { item: Order }) => (
        <View style={localStyles.orderCard}>
            <View style={localStyles.orderHeader}>
                <Text style={localStyles.orderNumber}>Заказ #{item.orderId}</Text>
                <Text style={[localStyles.orderStatus, { color: getStatusColor(item.status) }]}>
                    {getStatus(item.status)}
                </Text>
            </View>
            <View style={localStyles.orderProductsContainer}>
                {item.products.map(product => {
                    const imageUrl = product.imagesUrlAtOrder?.[0];
                    const validUrl = imageUrl
                        ? normalizeImageUrl(imageUrl)
                        : require('@/assets/images/no_image.webp');

                    return (
                        <Pressable
                            key={product.orderedProductId}
                            onPress={async () => {
                                try {
                                    const response = await api.get(`/products/${product.productId}`);
                                    const productDto: ProductDto = response.data;
                                    productDto.imagesUrl = productDto.imagesUrl.map( it=> normalizeImageUrl(it))
                                    navigation.navigate('product', {
                                        product: productDto
                                    });
                                } catch (error) {
                                    console.error('Ошибка при получении продукта:', error);
                                }
                            }}
                        >
                            <View style={localStyles.productItem}>
                                <Image
                                    source={typeof validUrl === 'string' ? { uri: validUrl } : validUrl}
                                    style={localStyles.productImage}
                                    onError={() =>
                                        console.log(`Ошибка загрузки изображения ${validUrl.uri}`)
                                    }
                                    defaultSource={require('@/assets/images/no_image.webp')}
                                />
                                <View style={localStyles.productInfo}>
                                    <Text style={localStyles.productName}>{product.productName}</Text>
                                    <Text style={localStyles.productDetails}>
                                        Количество: {product.quantity}
                                    </Text>
                                    <Text style={localStyles.productDetails}>
                                        Цена: {product.priceAtOrder}₽
                                    </Text>
                                </View>
                            </View>
                        </Pressable>

                    );
                })}
            </View>
            <View style={localStyles.orderTotalContainer}>
                <Text style={localStyles.orderTotal}>Итого: {item.total}₽</Text>
            </View>
        </View>
    );

    if (!user) {
        return (
            <View style={localStyles.notAuthContainer}>
                <Text style={localStyles.notAuthText}>
                    Для просмотра профиля необходимо войти в аккаунт
                </Text>
                <Pressable
                    style={localStyles.authButton}
                    onPress={openAuthModal}
                >
                    <Text style={localStyles.authButtonText}>Войти</Text>
                </Pressable>
                {notifications.map(notification => (
                    <Notification
                        key={notification.id}
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotifications(prev =>
                            prev.filter(n => n.id !== notification.id)
                        )
                        }
                    />
                ))}
            </View>
        );
    }

    return (
        <View style={localStyles.container}>
            <ParallaxBackground
                title="ПРОФИЛЬ"
                image={require('@/assets/images/profile-bg.jpg')}
            />

            <View style={localStyles.tabs}>
                <Pressable
                    style={[
                        localStyles.tabButton,
                        activeTab === 'profile' && localStyles.activeTabButton,
                    ]}
                    onPress={() => setActiveTab('profile')}
                >
                    <Text style={[
                        localStyles.tabButtonText,
                        activeTab === 'profile' && localStyles.activeTabButtonText,
                    ]}>
                        Профиль
                    </Text>
                </Pressable>
                <Pressable
                    style={[
                        localStyles.tabButton,
                        activeTab === 'orders' && localStyles.activeTabButton,
                    ]}
                    onPress={() => setActiveTab('orders')}
                >
                    <Text style={[
                        localStyles.tabButtonText,
                        activeTab === 'orders' && localStyles.activeTabButtonText,
                    ]}>
                        Заказы
                    </Text>
                </Pressable>
                <Pressable
                    style={[
                        localStyles.tabButton,
                        activeTab === 'cart' && localStyles.activeTabButton,
                    ]}
                    onPress={() => setActiveTab('cart')}
                >
                    <Text style={[
                        localStyles.tabButtonText,
                        activeTab === 'cart' && localStyles.activeTabButtonText,
                    ]}>
                        Корзина
                    </Text>
                </Pressable>
            </View>

            {activeTab === 'profile'  && (
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                <ScrollView
                    style={localStyles.profileSection}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={localStyles.avatarContainer}>
                        <Image
                            source={require('@/assets/images/profile-bg.jpg')}
                            style={localStyles.avatar}
                        />
                        <Text style={localStyles.userName}>{formData.login}</Text>
                        <Text style={localStyles.userEmail}>{formData.email}</Text>
                    </View>

                    <View style={localStyles.formGroup}>
                        <Text style={localStyles.label}>Логин</Text>
                        <TextInput
                            style={localStyles.input}
                            value={formData.login}
                            onChangeText={text =>
                                setFormData(prev => ({ ...prev, login: text }))
                            }
                            placeholder="Введите логин"
                            placeholderTextColor="#666"
                        />
                    </View>

                    <View style={localStyles.formGroup}>
                        <Text style={localStyles.label}>Email</Text>
                        <TextInput
                            style={localStyles.input}
                            value={formData.email}
                            onChangeText={text =>
                                setFormData(prev => ({ ...prev, email: text }))
                            }
                            placeholder="Введите email"
                            placeholderTextColor="#666"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={localStyles.formGroup}>
                        <Text style={localStyles.label}>Текущий пароль</Text>
                        <TextInput
                            style={localStyles.input}
                            value={formData.currentPassword}
                            onChangeText={text =>
                                setFormData(prev => ({ ...prev, currentPassword: text }))
                            }
                            placeholder="Текущий пароль"
                            placeholderTextColor="#666"
                            secureTextEntry
                        />
                        {errors.currentPassword && (
                            <Text style={localStyles.errorText}>
                                {errors.currentPassword}
                            </Text>
                        )}
                    </View>

                    <View style={localStyles.formGroup}>
                        <Text style={localStyles.label}>Новый пароль</Text>
                        <TextInput
                            style={localStyles.input}
                            value={formData.newPassword}
                            onChangeText={text =>
                                setFormData(prev => ({ ...prev, newPassword: text }))
                            }
                            placeholder="Новый пароль"
                            placeholderTextColor="#666"
                            secureTextEntry
                        />
                    </View>

                    <View style={localStyles.formGroup}>
                        <Text style={localStyles.label}>Подтверждение пароля</Text>
                        <TextInput
                            style={localStyles.input}
                            value={formData.confirmPassword}
                            onChangeText={text =>
                                setFormData(prev => ({ ...prev, confirmPassword: text }))
                            }
                            placeholder="Подтвердите новый пароль"
                            placeholderTextColor="#666"
                            secureTextEntry
                        />
                        {errors.confirmPassword && (
                            <Text style={localStyles.errorText}>
                                {errors.confirmPassword}
                            </Text>
                        )}
                    </View>

                    <Pressable
                        style={localStyles.saveButton}
                        onPress={handleUpdateProfile}
                        disabled={loading.profile}
                    >
                        {loading.profile ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={localStyles.saveButtonText}>
                                Сохранить изменения
                            </Text>
                        )}
                    </Pressable>
                    <Pressable onPress={logout} style={localStyles.logoutButton}>
                        <Text style={localStyles.logoutText}>Выйти из аккаунта</Text>
                    </Pressable>
                </ScrollView>
                </KeyboardAvoidingView>
            )}
            {activeTab === 'orders'  && (
                <View style={localStyles.ordersSection}>
                    {loading.orders ? (
                        <ActivityIndicator size="large" color="#8b0000" />
                    ) : orders.length > 0 ? (
                        <FlatList
                            data={orders}
                            renderItem={renderOrderItem}
                            keyExtractor={item => item.orderId.toString()}
                            contentContainerStyle={localStyles.ordersList}
                            ListFooterComponent={
                                <View style={localStyles.pagination}>
                                    <Pressable
                                        style={[
                                            localStyles.paginationButton,
                                            currentPage === 1 && localStyles.disabledButton,
                                        ]}
                                        onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <Text style={localStyles.paginationButtonText}>
                                            Назад
                                        </Text>
                                    </Pressable>
                                    <Text style={localStyles.paginationText}>
                                        Страница {currentPage} из {totalPages}
                                    </Text>
                                    <Pressable
                                        style={[
                                            localStyles.paginationButton,
                                            currentPage === totalPages && localStyles.disabledButton,
                                        ]}
                                        onPress={() =>
                                            setCurrentPage(p => Math.min(totalPages, p + 1))
                                        }
                                        disabled={currentPage === totalPages}
                                    >
                                        <Text style={localStyles.paginationButtonText}>
                                            Вперед
                                        </Text>
                                    </Pressable>
                                </View>
                            }
                        />
                    ) : (
                        <Text style={localStyles.emptyText}>Нет заказов</Text>
                    )}
                </View>
            )}
            {activeTab === 'cart' && <CartScreen />}

            {notifications.map(notification => (
                <Notification
                    key={notification.id}
                    message={notification.message}
                    type={notification.type}
                    onClose={() =>
                        setNotifications(prev =>
                            prev.filter(n => n.id !== notification.id)
                        )
                    }
                />
            ))}
        </View>
    );
};

export default ProfileScreen;