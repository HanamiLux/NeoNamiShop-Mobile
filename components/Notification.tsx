import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface NotificationProps {
    message: string;
    type: 'error' | 'success';
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(true);
    const opacity = useState(new Animated.Value(1))[0]; // For fade-in and fade-out animation

    useEffect(() => {
        const timer = setTimeout(() => {
            // Fade out the notification
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();

            setTimeout(onClose, 2000); // Call onClose after the animation ends
        }, 3000);

        return () => clearTimeout(timer); // Clear timeout if component unmounts
    }, [onClose, opacity]);

    return (
        <Animated.View
            style={[
                styles.notification,
                { opacity },
                type === 'success' ? styles.success : styles.error,
            ]}
        >
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    notification: {
        position: 'absolute',
        top: 50,
        left: '10%',
        right: '10%',
        padding: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    success: {
        backgroundColor: 'green',
    },
    error: {
        backgroundColor: 'red',
    },
    message: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Notification;
