import {StyleSheet} from "react-native";

export const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    ordersList: {
        paddingHorizontal: 15,
        paddingBottom: 30,
    },

    notAuthContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    notAuthText: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    authButton: {
        backgroundColor: '#8b0000',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    authButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        borderBottomWidth: 1,
        borderColor: '#8b0000',
    },
    tabButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    activeTabButton: {
        borderBottomWidth: 2,
        borderColor: '#8b0000',
    },
    tabButtonText: {
        color: '#ccc',
        fontSize: 16,
    },
    activeTabButtonText: {
        color: '#8b0000',
        fontWeight: 'bold',
    },
    profileSection: {
        padding: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    userName: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    userEmail: {
        color: '#aaa',
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        color: '#fff',
        marginBottom: 5,
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: '#8b0000',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: '#fff',
        backgroundColor: '#1a1a1a',
    },
    errorText: {
        color: '#ff4444',
        marginTop: 5,
    },
    saveButton: {
        backgroundColor: '#8b0000',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    ordersSection: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 4,
    },
    orderCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#8b0000',
        padding: 15,
        marginBottom: 15,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    orderNumber: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 16,
    },
    orderStatus: {
        fontWeight: '500',
        fontSize: 16,
    },
    orderProductsContainer: {
        marginVertical: 10,
    },
    productItem: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
        backgroundColor: '#333',
    },
    productInfo: {
        justifyContent: 'center',
    },
    productName: {
        fontWeight: '500',
        color: '#fff',
        fontSize: 14,
    },
    productDetails: {
        color: '#ccc',
        fontSize: 12,
    },
    orderTotalContainer: {
        marginTop: 10,
    },
    orderTotal: {
        fontWeight: 'bold',
        textAlign: 'right',
        color: '#fff',
        fontSize: 16,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
    },
    paginationButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#8b0000',
        borderRadius: 8,
    },
    paginationButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    disabledButton: {
        opacity: 0.5,
    },
    paginationText: {
        color: '#fff',
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        color: '#ccc',
        marginTop: 20,
        fontSize: 16,
    },

    cartContainer: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    emptyCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyCartText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 10,
    },
    cartItems: {
        padding: 15,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    cartImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
    },
    cartInfo: {
        flex: 1,
    },
    cartTitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
    },
    cartPrice: {
        color: '#8b0000',
        fontSize: 14,
        marginBottom: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
    logoutButton: {
        backgroundColor: 'black',
        borderColor: '#8b0000',
        borderWidth: 1,
        padding: 12,
        marginVertical: 100,
        borderRadius: 8
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    },
    quantityText: {
        color: '#fff',
        marginHorizontal: 10,
        fontSize: 16,
    },
    deleteButton: {
        padding: 10,
    },
    cartFooter: {
        borderTopWidth: 1,
        borderTopColor: '#333',
        padding: 20,
    },
    totalText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    orderButton: {
        backgroundColor: '#8b0000',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    orderButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});