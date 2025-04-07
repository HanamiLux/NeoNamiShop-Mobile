import { StyleSheet } from 'react-native';

export const notificationStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1000,
    },
    notification: {
        padding: 12,
        borderRadius: 8,
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    success: {
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
    },
    error: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
    },
    text: {
        fontSize: 14,
    },
});
