import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const parallaxStyles = StyleSheet.create({
    container: {
        height: height * 0.3,
        width: '100%',
        overflow: 'hidden',
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        position: 'absolute',
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});
