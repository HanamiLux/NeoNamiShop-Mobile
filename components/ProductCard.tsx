import React, {useState} from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { productCardStyles } from '@/styles/ProductCard';
import { RootStackParamList } from '@/types/navigation';
import { ProductDto } from "@/types/models";

export const ProductCard = ({ product }: { product: ProductDto }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [imgError, setImgError] = useState(false);
    // Преобразуем рейтинг в число с обработкой всех случаев
    const numericRating = product.averageRating !== null
        ? typeof product.averageRating === 'string'
            ? parseFloat(product.averageRating)
            : product.averageRating
        : 0;

    // Проверка на наличие изображений
    const imageUri = product.imagesUrl?.length > 0
        ? product.imagesUrl[0]
        : require('@/assets/images/no_image.webp');

    return (
        <Pressable
            style={productCardStyles.card}
            onPress={() => navigation.navigate('product', { product })}
        >
            <View style={productCardStyles.imageContainer}>
                <Image
                    source={imgError || !imageUri
                        ? require('@/assets/images/no_image.webp')
                        : { uri: imageUri }}
                    style={productCardStyles.image}
                    onError={() => setImgError(true)}
                />
                <Text style={productCardStyles.title}>{product.productName}</Text>
            </View>
            <View style={productCardStyles.info}>
                <View style={productCardStyles.ratingContainer}>
                    <StarRatingDisplay
                        rating={numericRating}
                        starSize={16}
                        color="#8b0000"
                        emptyColor="#8b0000"
                    />
                    <Text style={productCardStyles.ratingText}>
                        {numericRating.toFixed(1)}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};