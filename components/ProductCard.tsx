import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { productCardStyles } from '@/styles/ProductCard';
import { RootStackParamList } from '@/types/navigation';
import {ProductDto} from "@/types/models";

export const ProductCard = ({ product }: {product: ProductDto}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <Pressable
            style={productCardStyles.card}
            onPress={() => navigation.navigate('product', { product: product })}
        >
            <View style={productCardStyles.imageContainer}>
                <Image source={{ uri: product.imagesUrl[0] }} style={productCardStyles.image} />
                <Text style={productCardStyles.title}>{product.productName}</Text>
            </View>
            <View style={productCardStyles.info}>
                <View style={productCardStyles.ratingContainer}>
                    <StarRatingDisplay
                        rating={product.averageRating}
                        starSize={16}
                        color="#ffc107"
                        emptyColor="#8b0000"
                    />
                    <Text style={productCardStyles.ratingText}>
                        {product.averageRating.toFixed(1)}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};
