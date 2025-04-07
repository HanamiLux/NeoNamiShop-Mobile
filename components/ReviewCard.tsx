import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import icon library for React Native

interface Review {
    id: number;
    productId: number;
    product: string;
    text: string;
    rating: number;
}

interface ReviewCardProps {
    review: Review;
    onNavigate: (productId: number) => void; // Function to handle navigation
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onNavigate }) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onNavigate(review.productId)}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.productName}>{review.product}</Text>
                    <Text style={styles.price}>15000₽</Text>
                </View>
                <View style={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <MaterialCommunityIcons
                            key={star}
                            name="star"
                            size={20}
                            color={star <= review.rating ? 'yellow' : 'gray'}
                        />
                    ))}
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 16,
        backgroundColor: 'white',
        marginBottom: 16,
        elevation: 3, // For shadow on Android
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    content: {
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 16,
        fontWeight: '500',
    },
    stars: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    reviewText: {
        fontSize: 14,
        color: 'gray',
    },
});
