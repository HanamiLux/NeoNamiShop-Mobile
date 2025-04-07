import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16,
        marginTop: 32,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#ff4444',
        fontSize: 18,
        textAlign: 'center',
    },
    searchInput: {
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 14,
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#8b0000',
    },
    productsGrid: {
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    contentContainer: {
        paddingBottom: 40,
    },

    categoriesContainer: {
        paddingBottom: 10,
        marginBottom: 20,
    },
    categoryTab: {
        height: 40,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#333',
        marginRight: 10,
        minWidth: 70, // Минимальная ширина для кнопки
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeCategoryTab: {
        backgroundColor: '#8b0000',
        borderColor: '#8b0000',
    },
    categoryTabText: {
        color: '#fff',
        fontSize: 14,
    },
});