import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
        marginTop: 30
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -18 }],
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navLeft: {
        left: 10,
        backgroundColor: 'rgba(139, 0, 0, 0.5)',
    },
    navRight: {
        right: 10,
        backgroundColor: 'rgba(139, 0, 0, 0.5)',
    },
    indicatorsContainer: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        alignSelf: 'center',
        gap: 6,
    },
    indicator: {
        width: 24,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    activeIndicator: {
        backgroundColor: '#8b0000',
    },
    section: {
        marginBottom: 24,
    },
    productTitle: {
        fontSize: 28,
        color: '#fff',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 32,
        color: '#fff',
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ratingText: {
        fontSize: 16,
        color: '#fff',
    },
    quantitySection: {
        marginVertical: 16,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginTop: 12,
    },
    quantityButton: {
        backgroundColor: '#1a1a1a',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
    },
    quantitySymbol: {
        fontSize: 24,
        color: '#fff',
    },
    quantityValue: {
        fontSize: 20,
        color: '#fff',
        minWidth: 40,
        textAlign: 'center',
    },
    actionsSection: {
        flexDirection: 'row',
        gap: 12,
        marginVertical: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#8b0000',
    },
    cartButton: {
        flex: 1,
    },
    favoriteButton: {
        width: 60,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
    sectionTitle: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 16,
    },
    reviewInput: {
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 12,
        minHeight: 100,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#8b0000',
        textAlignVertical: 'top',
        marginBottom: 12,
    },
    reviewCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    reviewAuthor: {
        color: '#fff',
    },
    reviewDate: {
        color: '#666',
    },
    reviewText: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
    },
    recommendationsContainer: {
        gap: 12,
    },
    recommendationItem: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
    },
    recommendationImage: {
        width: 200,
        height: 200,
    },
    recommendationInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    recommendationTitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 4,
    },
    recommendationPrice: {
        color: '#8b0000',
        fontSize: 16,
    },
    pressableWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
});