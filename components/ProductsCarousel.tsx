import React, { useState } from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { ProductCard } from './ProductCard';
import { ProductDto } from '@/types/models';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { carouselStyles } from "@/styles/ProductsCarousel";

const { width: screenWidth } = Dimensions.get('window');

interface ProductsCarouselProps {
    products: ProductDto[];
}

export const ProductsCarousel = ({ products }: ProductsCarouselProps) => {
    const [isScrolling, setIsScrolling] = useState(false);

    const onScrollBegin = () => {
        setIsScrolling(true);
    };

    const onScrollEnd = () => {
        setIsScrolling(false);
    };

    return (
        <GestureHandlerRootView style={carouselStyles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                onScrollBeginDrag={onScrollBegin}
                onScrollEndDrag={onScrollEnd}
            >
                {products.map((product) => (
                    <ProductCard
                        key={product.productId}
                        product={product}
                    />
                ))}
            </ScrollView>
        </GestureHandlerRootView>
    );
};