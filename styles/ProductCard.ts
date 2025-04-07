import { StyleSheet } from 'react-native';

export const productCardStyles = StyleSheet.create({
    card: {
        width: 180,
        borderRadius: 15,
        backgroundColor: 'black',
        marginHorizontal: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    imageContainer: {
        height: 240,
        borderRadius: 15,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    title: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    info: {
        padding: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#666',
    },
});

