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
    Easing,
    ActivityIndicator
} from 'react-native';
import {Heart, ShoppingCart, Star, ChevronLeft, ChevronRight} from 'lucide-react-native';
import {useCart} from "@/contexts/CartContext";
import {RootStackParamList} from "@/types/navigation";
import {useRoute, RouteProp, useNavigation, NavigationProp} from '@react-navigation/native';
import {useAuth} from "@/contexts/AuthContext";
import {styles} from "@/styles/ProductScreen";
import {ProductDto, FeedbackDto} from "@/types/models";
import api from "@/services/api";
import Notification from "@/components/Notification";
import {Rating} from 'react-native-ratings';

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
    const [reviewRating, setReviewRating] = useState(0);
    const [reviews, setReviews] = useState<FeedbackDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [loadingRandomProducts, setLoadingRandomProducts] = useState(true);
    const [activeNotification, setActiveNotification] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);

    const cartButtonAnim = useRef(new Animated.Value(0)).current;
    const favoriteButtonAnim = useRef(new Animated.Value(0)).current;
    const reviewButtonAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get<{ items: FeedbackDto[] }>(
                    `/feedbacks/product/${product.productId}`
                );

                const reviewsWithLogins = await Promise.all(
                    response.data.items.map(async review => {
                        const userResponse = await api.get(`/users/${review.userId}`);
                        return {
                            ...review,
                            userLogin: userResponse.data.login
                        } as FeedbackDto;
                    })
                );

                setReviews(reviewsWithLogins);
            } catch (error) {
                console.error('Ошибка при загрузке отзывов:', error);
                showNotification('Ошибка загрузки отзывов', 'error');
            }
        };

        fetchReviews();
    }, [product.productId]);

    useEffect(() => {
        const checkReviewConditions = async () => {
            if (!user?.userId) {
                setCanReview(false);
                return;
            }

            try {
                const ordersResponse = await api.get<{ items: any[] }>(
                    `/orders/user/${user.userId}`
                );

                const hasAccess = ordersResponse.data.items.some(
                    order => order.products?.some(
                        (item: any) => item.productId === product.productId
                    ) && order.status === 'completed'
                );

                const userReview = reviews.find(review => review.userId === user.userId);
                setCanReview(hasAccess);
                setHasReviewed(!!userReview);
            } catch (error) {
                console.error('Ошибка проверки доступа:', error);
                setCanReview(false);
            }
        };
        checkReviewConditions();
    }, [user?.userId, product.productId, reviews]);
    useEffect(() => {
        const fetchRandomProducts = async () => {
            try {
                const response = await api.get<{ items: ProductDto[] }>('/products', {
                    params: {
                        page: 1,
                        take: 100 // Берем больше товаров для случайной выборки
                    }
                });

                // Фильтруем текущий товар и товары без изображений
                const filteredProducts = response.data.items.filter(p =>
                    p.productId !== product.productId &&
                    p.imagesUrl?.length > 0
                );

                // Выбираем 3 случайных товара
                const shuffled = [...filteredProducts]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3);

                setRandomProducts(shuffled);
            } catch (error) {
                console.error('Ошибка загрузки похожих товаров:', error);
                showNotification('Не удалось загрузить похожие товары', 'error');
            }
        };

        fetchRandomProducts();
    }, [product.productId]);

    useEffect(() => {
        const fetchRandomProducts = async () => {
            try {
                setLoadingRandomProducts(true);

                const response = await api.get<{ items: ProductDto[] }>('/products', {
                    params: {
                        page: 1,
                        take: 100,
                    }
                });

                const filteredProducts = response.data.items.filter(p =>
                    p.productId !== product.productId &&
                    p.imagesUrl?.length > 0 &&
                    p.categoryId === product.categoryId // Товары из той же категории
                );

                const randomSelection = filteredProducts.length > 3
                    ? [...filteredProducts]
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 3)
                    : filteredProducts;

                setRandomProducts(randomSelection);
            } catch (error) {
                console.error('Ошибка загрузки похожих товаров:', error);
                showNotification('Не удалось загрузить похожие товары', 'error');
            } finally {
                setLoadingRandomProducts(false);
            }
        };

        fetchRandomProducts();
    }, [product.productId, product.categoryId]);

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
                averageRating: product.averageRating ?? 0,
                categoryId: product.categoryId,
                description: product.description,
                imagesUrl: product.imagesUrl,
                totalFeedbacks: product.totalFeedbacks,
            });
            showNotification('Товар добавлен в корзину', 'success');
        } catch (error) {
            showNotification('Ошибка при добавлении в корзину', 'error');
        }
    };

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

    const handleReviewSubmit = async () => {
        if (!reviewText.trim() || reviewRating === 0) return;
        if (!user) {
            openAuthModal();
            return;
        }

        try {
            setLoading(true);
            const newReview = {
                productId: product.productId,
                rate: reviewRating,
                content: reviewText
            };

            const response = await api.post('/feedbacks', newReview, {
                params: {userId: user.userId}
            });

            setReviews(prev => [response.data, ...prev]);
            setHasReviewed(true);
            setReviewText('');
            setReviewRating(0);
            showNotification('Отзыв успешно опубликован', 'success');
        } catch (error) {
            console.error('Ошибка при отправке отзыва:', error);
            showNotification('Ошибка отправки отзыва', 'error');
        } finally {
            setLoading(false);
        }
    };

    const numericRating = product.averageRating !== null
        ? typeof product.averageRating === 'string'
            ? parseFloat(product.averageRating)
            : product.averageRating
        : 0;

    const ratingText = !isNaN(numericRating)
        ? numericRating.toFixed(1)
        : '0.0';

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
            style={mergedStyles.container}
            contentContainerStyle={mergedStyles.contentContainer}
        >
            {activeNotification && (
                <Notification
                    message={activeNotification.message}
                    type={activeNotification.type}
                    onClose={() => setActiveNotification(null)}
                />
            )}

            <View style={sstyles.galleryContainer}>
                <Image
                    source={{uri: product.imagesUrl?.[currentImageIndex]}}
                    style={mergedStyles.mainImage}
                    resizeMode="contain"
                />

                <Pressable
                    style={[mergedStyles.navButton, mergedStyles.navLeft]}
                    onPress={handlePrevSlide}
                >
                    <ChevronLeft size={24} color="white"/>
                </Pressable>

                <Pressable
                    style={[mergedStyles.navButton, mergedStyles.navRight]}
                    onPress={handleNextSlide}
                >
                    <ChevronRight size={24} color="white"/>
                </Pressable>

                <View style={mergedStyles.indicatorsContainer}>
                    {product.imagesUrl?.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                mergedStyles.indicator,
                                index === currentImageIndex && mergedStyles.activeIndicator
                            ]}
                        />
                    ))}
                </View>
            </View>

            <View style={mergedStyles.section}>
                <Text style={mergedStyles.productTitle}>{product.productName}</Text>
                <Text style={mergedStyles.productPrice}>
                    {product.price.toLocaleString()}₽
                </Text>

                <View style={mergedStyles.ratingContainer}>
                    <Star size={20} fill="#8b0000" color="#8b0000"/>
                    <Text style={mergedStyles.ratingText}>
                        {numericRating.toFixed(1)} ({product.totalFeedbacks} отзывов)
                    </Text>
                </View>

                <Text style={mergedStyles.productDescription}>
                    {product.description}
                </Text>
            </View>

            <View style={mergedStyles.quantitySection}>
                <Text style={mergedStyles.sectionTitle}>Количество</Text>
                <View style={mergedStyles.quantityControls}>
                    <Pressable
                        style={mergedStyles.quantityButton}
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        <Text style={mergedStyles.quantitySymbol}>-</Text>
                    </Pressable>

                    <Text style={mergedStyles.quantityValue}>{quantity}</Text>

                    <Pressable
                        style={mergedStyles.quantityButton}
                        onPress={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    >
                        <Text style={mergedStyles.quantitySymbol}>+</Text>
                    </Pressable>
                </View>
            </View>

            <View style={mergedStyles.actionsSection}>
                <Animated.View
                    style={[
                        mergedStyles.actionButton,
                        mergedStyles.cartButton,
                        {backgroundColor: getButtonColor(cartButtonAnim)}
                    ]}
                >
                    <Pressable
                        onPressIn={() => animateButton(cartButtonAnim, 1)}
                        onPressOut={() => animateButton(cartButtonAnim, 0)}
                        onPress={handleAddToCart}
                        style={mergedStyles.pressableWrapper}
                    >
                        <ShoppingCart size={20} color="#fff"/>
                        <Text style={mergedStyles.actionButtonText}>В корзину</Text>
                    </Pressable>
                </Animated.View>

                <Animated.View
                    style={[
                        mergedStyles.actionButton,
                        mergedStyles.favoriteButton,
                        {backgroundColor: getButtonColor(favoriteButtonAnim)}
                    ]}
                >
                    <Pressable
                        onPressIn={() => animateButton(favoriteButtonAnim, 1)}
                        onPressOut={() => animateButton(favoriteButtonAnim, 0)}
                        style={mergedStyles.pressableWrapper}
                    >
                        <Heart size={20} color="#fff"/>
                    </Pressable>
                </Animated.View>
            </View>

            <View style={mergedStyles.section}>
                <Text style={mergedStyles.sectionTitle}>Отзывы</Text>

                {canReview && !hasReviewed ? (
                    <View style={mergedStyles.reviewInputContainer}>
                        <Rating
                            type="star"
                            ratingCount={5}
                            imageSize={30}
                            minValue={1}
                            startingValue={reviewRating}
                            onFinishRating={(value: number) => setReviewRating(value)}
                            tintColor="#1a1a1a"
                            style={mergedStyles.ratingStars}
                        />

                        <TextInput
                            style={mergedStyles.reviewInput}
                            multiline
                            numberOfLines={4}
                            placeholder="Оставьте подробный отзыв..."
                            value={reviewText}
                            onChangeText={setReviewText}
                            placeholderTextColor="#666"
                        />

                        <Animated.View
                            style={[
                                mergedStyles.actionButton,
                                {backgroundColor: getButtonColor(reviewButtonAnim)}
                            ]}
                        >
                            <Pressable
                                onPressIn={() => animateButton(reviewButtonAnim, 1)}
                                onPressOut={() => animateButton(reviewButtonAnim, 0)}
                                onPress={handleReviewSubmit}
                                style={mergedStyles.pressableWrapper}
                                disabled={loading || !reviewText.trim() || reviewRating === 0}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff"/>
                                ) : (
                                    <Text style={mergedStyles.actionButtonText}>Опубликовать отзыв</Text>
                                )}
                            </Pressable>
                        </Animated.View>
                    </View>
                ) : hasReviewed ? (
                    <Text style={mergedStyles.reviewMessage}>Вы уже оставили отзыв на этот товар</Text>
                ) : (
                    <Text style={mergedStyles.reviewMessage}>Отзывы могут оставлять только покупатели товара</Text>
                )}

                {reviews.map((review) => (
                    <View key={review.feedbackId} style={mergedStyles.reviewCard}>
                        <View style={mergedStyles.reviewHeader}>
                            <Text style={mergedStyles.reviewAuthor}>{review.userLogin}</Text>
                            <View style={mergedStyles.reviewRatingContainer}>
                                <Rating
                                    type="star"
                                    ratingCount={5}
                                    imageSize={15}
                                    readonly
                                    startingValue={review.rate}
                                    tintColor="#1a1a1a"
                                />
                                <Text style={mergedStyles.reviewDate}>
                                    {new Date(review.date).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                        <Text style={mergedStyles.reviewText}>{review.content}</Text>
                    </View>
                ))}
            </View>

            <View style={mergedStyles.section}>
                <Text style={mergedStyles.sectionTitle}>Похожие товары</Text>

                {loadingRandomProducts ? (
                    <ActivityIndicator size="small" color="#8b0000" />
                ) : (
                    <View style={mergedStyles.recommendationsContainer}>
                        {randomProducts.map((item, index) => (
                            <Pressable
                                key={`${item.productId}-${index}`}
                                style={mergedStyles.recommendationItem}
                                onPress={() => navigation.navigate('product', { product: item })}
                            >
                                <Image
                                    source={{ uri: item.imagesUrl[0] }}
                                    style={mergedStyles.recommendationImage}
                                    resizeMode="cover"
                                />
                                <View style={mergedStyles.recommendationInfo}>
                                    <Text
                                        style={mergedStyles.recommendationTitle}
                                        numberOfLines={1}
                                    >
                                        {item.productName}
                                    </Text>
                                    <Text style={mergedStyles.recommendationPrice}>
                                        {item.price.toLocaleString()}₽
                                    </Text>
                                    <View style={mergedStyles.recommendationRating}>
                                        <Star size={12} color="#8b0000" />
                                        <Text style={mergedStyles.ratingTextSmall}>
                                            {Number(item.averageRating ?? 0).toFixed(1)}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}

                        {randomProducts.length === 0 && (
                            <Text style={mergedStyles.noProductsText}>
                                Нет похожих товаров
                            </Text>
                        )}
                    </View>
                )}
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

const additionalStyles = StyleSheet.create({
    reviewInputContainer: {
        marginBottom: 20,
    },
    ratingStars: {
        paddingVertical: 10,
        alignSelf: 'flex-start',
    },
    reviewMessage: {
        color: '#666',
        marginBottom: 15,
        fontSize: 14,
    },
    reviewRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    recommendationRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    ratingTextSmall: {
        fontSize: 12,
        color: '#8b0000',
    },
    productDescription: {
        color: '#ccc',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 10,
    },
    noProductsText: {
        color: '#666',
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 14,
    },
});


const mergedStyles = StyleSheet.create({
    ...styles,
    ...additionalStyles
});