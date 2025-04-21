import React, {useState, useRef, useEffect} from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    ScrollView,
    TextInput,
    StyleSheet,
    Dimensions,
    Animated,
    Easing
} from 'react-native';
import {Heart, ShoppingCart, Star, ChevronLeft, ChevronRight} from 'lucide-react-native';
import {useCart} from "@/contexts/CartContext";
import {RootStackParamList} from "@/types/navigation";
import {useRoute, RouteProp, useNavigation, NavigationProp} from '@react-navigation/native';
import {useAuth} from "@/contexts/AuthContext";
import {styles} from "@/styles/ProductScreen";
import {ProductDto} from "@/types/models";
import api from "@/services/api";
import Notification from "@/components/Notification";

const {width} = Dimensions.get('window');

export default function ProductScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const {user, openAuthModal} = useAuth();
    const route = useRoute<RouteProp<RootStackParamList, 'product'>>();
    const {product} = route.params;
    const [randomProducts, setRandomProducts] = useState<ProductDto[]>([]);
    const {addToCart} = useCart();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [reviewText, setReviewText] = useState('');
    const [reviews] = useState([
        {id: 1, author: 'Пользователь 1', rating: 5, text: 'Отличный товар!', date: '2024-03-15'},
        {
            id: 2,
            author: 'Пользователь 2',
            rating: 4,
            text: 'Хороший товар, но есть небольшие недочеты',
            date: '2024-03-14'
        }
    ]);

    // Анимационные значения для кнопок
    const cartButtonAnim = useRef(new Animated.Value(0)).current;
    const favoriteButtonAnim = useRef(new Animated.Value(0)).current;
    const reviewButtonAnim = useRef(new Animated.Value(0)).current;

    const handleAddToCart = () => {
        if (!user) {
            openAuthModal();
            return;
        }
        try {
            addToCart({
                productId: product.productId,
                productName: product.productName,
                price: product.price,
                quantity: quantity,
                imageUrl: product.imagesUrl?.[0] || '',
                maxQuantity: product.quantity,
                category: undefined,
                averageRating: product.averageRating,
                categoryId: product.categoryId,
                description: product.description,
                imagesUrl: product.imagesUrl,
                totalFeedbacks: 0,

            });
            showNotification('Товар добавлен в корзину', 'success');
        } catch (error) {
            showNotification('Ошибка при добавлении в корзину', 'error');
        }
    };

    const [activeNotification, setActiveNotification] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setActiveNotification({message, type});
        setTimeout(() => setActiveNotification(null), 3000);
    };

    const handleNextSlide = () => {
        if (product.imagesUrl?.length) {
            setCurrentImageIndex((prev) => (prev + 1) % product.imagesUrl.length);
        }
    };

    const handlePrevSlide = () => {
        if (product.imagesUrl?.length) {
            setCurrentImageIndex((prev) => (prev - 1 + product.imagesUrl.length) % product.imagesUrl.length);
        }
    };

    const handleReviewSubmit = () => {
        if (!user) {
            openAuthModal();
            return;
        }
        showNotification('Отзыв оставлен', 'success');
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                const allProducts = response.data.items;
                const filtered = allProducts.filter((p: ProductDto) =>
                    p.productId !== product.productId
                );
                // Выбираем 3 случайных товара
                const shuffled = [...filtered].sort(() => 0.5 - Math.random());
                setRandomProducts(shuffled.slice(0, 3));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [product.productId]);

    const handleRecommendationPress = (item: ProductDto) => {
        navigation.navigate('product', {product: item});
    };

    const animateButton = (anim: Animated.Value, toValue: number) => {
        Animated.timing(anim, {
            toValue,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    };

    const getButtonColor = (anim: Animated.Value) => {
        return anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(139, 0, 0, 0.37)', '#8b0000']
        });
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            {activeNotification && (
                <Notification
                    message={activeNotification.message}
                    type={activeNotification.type}
                    onClose={() => setActiveNotification(null)}
                />
            )}
            {/* Галерея изображений */}
            <View style={sstyles.galleryContainer}>
                <Image
                    source={{uri: product.imagesUrl?.[currentImageIndex]}}
                    style={styles.mainImage}
                    resizeMode="contain"
                />

                <Pressable
                    style={[styles.navButton, styles.navLeft]}
                    onPress={handlePrevSlide}
                >
                    <ChevronLeft size={24} color="white"/>
                </Pressable>

                <Pressable
                    style={[styles.navButton, styles.navRight]}
                    onPress={handleNextSlide}
                >
                    <ChevronRight size={24} color="white"/>
                </Pressable>

                <View style={styles.indicatorsContainer}>
                    {product.imagesUrl?.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                index === currentImageIndex && styles.activeIndicator
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* Основная информация */}
            <View style={styles.section}>
                <Text style={styles.productTitle}>{product.productName}</Text>
                <Text style={styles.productPrice}>
                    {product.price.toLocaleString()}₽
                </Text>

                <View style={styles.ratingContainer}>
                    <Star size={20} fill="yellow" color="#8b0000"/>
                    <Text style={styles.ratingText}>
                        {product.averageRating.toFixed(1)} ({product.totalFeedbacks} отзывов)
                    </Text>
                </View>
            </View>

            {/* Управление количеством */}
            <View style={styles.quantitySection}>
                <Text style={styles.sectionTitle}>Количество</Text>
                <View style={styles.quantityControls}>
                    <Pressable
                        style={styles.quantityButton}
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        <Text style={styles.quantitySymbol}>-</Text>
                    </Pressable>

                    <Text style={styles.quantityValue}>{quantity}</Text>

                    <Pressable
                        style={styles.quantityButton}
                        onPress={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    >
                        <Text style={styles.quantitySymbol}>+</Text>
                    </Pressable>
                </View>
            </View>

            {/* Кнопки действий */}
            <View style={styles.actionsSection}>
                <Animated.View
                    style={[
                        styles.actionButton,
                        styles.cartButton,
                        {backgroundColor: getButtonColor(cartButtonAnim)}
                    ]}
                >
                    <Pressable
                        onPressIn={() => animateButton(cartButtonAnim, 1)}
                        onPressOut={() => animateButton(cartButtonAnim, 0)}
                        onPress={handleAddToCart}
                        style={styles.pressableWrapper}
                    >
                        <ShoppingCart size={20} color="#fff"/>
                        <Text style={styles.actionButtonText}>В корзину</Text>
                    </Pressable>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.actionButton,
                        styles.favoriteButton,
                        {backgroundColor: getButtonColor(favoriteButtonAnim)}
                    ]}
                >
                    <Pressable
                        onPressIn={() => animateButton(favoriteButtonAnim, 1)}
                        onPressOut={() => animateButton(favoriteButtonAnim, 0)}
                        style={styles.pressableWrapper}
                    >
                        <Heart size={20} color="#fff"/>
                    </Pressable>
                </Animated.View>
            </View>

            {/* Отзывы */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Отзывы</Text>

                <TextInput
                    style={styles.reviewInput}
                    multiline
                    numberOfLines={4}
                    placeholder="Оставьте отзыв..."
                    value={reviewText}
                    onChangeText={setReviewText}
                    placeholderTextColor="#666"
                />

                <Animated.View
                    style={[
                        styles.actionButton,
                        {backgroundColor: getButtonColor(reviewButtonAnim)}
                    ]}
                >
                    <Pressable
                        onPressIn={() => animateButton(reviewButtonAnim, 1)}
                        onPressOut={() => animateButton(reviewButtonAnim, 0)}
                        onPress={handleReviewSubmit}
                        style={styles.pressableWrapper}
                    >
                        <Text style={styles.actionButtonText}>Отправить отзыв</Text>
                    </Pressable>
                </Animated.View>

                {/* Список отзывов */}
                {reviews.map((review) => (
                    <View key={review.id} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.reviewAuthor}>{review.author}</Text>
                            <Text style={styles.reviewDate}>{review.date}</Text>
                        </View>
                        <Text style={styles.reviewText}>{review.text}</Text>
                    </View>
                ))}
            </View>

            {/* Похожие товары */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Похожие товары</Text>
                <View style={styles.recommendationsContainer}>
                    {randomProducts.map((item, index) => (
                        <Pressable
                            key={index}
                            style={styles.recommendationItem}
                            onPress={() => handleRecommendationPress(item)}
                        >
                            <Image
                                source={{uri: item.imagesUrl?.[0]}}
                                style={styles.recommendationImage}
                                resizeMode="cover"
                            />
                            <View style={styles.recommendationInfo}>
                                <Text
                                    style={styles.recommendationTitle}
                                    numberOfLines={1}
                                >
                                    {item.productName}
                                </Text>
                                <Text style={styles.recommendationPrice}>
                                    {item.price.toLocaleString()}₽
                                </Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
const sstyles = StyleSheet.create({
    galleryContainer: {
        height: width * 0.8,
        borderRadius: 12,
        backgroundColor: '#1a1a1a',
        marginBottom: 20,
        overflow: 'hidden',
    }
});