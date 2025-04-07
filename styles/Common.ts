import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        marginBottom: 20,
        textAlign: 'center',
    },
    retryText: {
        fontSize: 16,
        color: 'blue',
        textDecorationLine: 'underline',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 16,
        paddingHorizontal: 16,
    },
    buttonBase: {
        borderWidth: 2,
        borderColor: '#8b0000',
        borderRadius: 15,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.9)'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16
    }
});