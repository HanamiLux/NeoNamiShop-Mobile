import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    FlatList,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import axios from 'axios';
import { ProductDto, CategoryDto } from '@/types/models';
import api from '@/services/api';
import {styles} from "@/styles/CatalogScreen";
import {ProductCard} from "@/components/ProductCard";

const { width } = Dimensions.get('window');

const CatalogScreen = () => {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories')
                ]);

                setProducts(productsResponse.data.items);
                setCategories(categoriesResponse.data.items);
            } catch (err) {
                setError('Ошибка загрузки данных');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'all' ||
            product.category?.categoryName === activeCategory;
        const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const renderCategoryTab = (category: CategoryDto | 'all') => {
        const isActive = category === 'all' ?
            activeCategory === 'all' :
            activeCategory === (category as CategoryDto).categoryName;

        return (
            <Pressable
                key={category === 'all' ? 'all' : (category as CategoryDto).categoryId}
                style={[styles.categoryTab, isActive && styles.activeCategoryTab]}
                onPress={() => setActiveCategory(category === 'all' ? 'all' : (category as CategoryDto).categoryName)}
            >
                <Text style={styles.categoryTabText}>
                    {category === 'all' ? 'Все' : (category as CategoryDto).categoryName}
                </Text>
            </Pressable>
        );
    };

    const renderProductItem = ({ item }: { item: ProductDto }) => (
        <ProductCard product={item} />
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8b0000" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Поиск товаров..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
            >
                {renderCategoryTab('all')}
                {categories.map(renderCategoryTab)}
            </ScrollView>

            <FlatList
                data={filteredProducts}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.productId.toString()}
                numColumns={2}
                columnWrapperStyle={styles.productsGrid}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default CatalogScreen;