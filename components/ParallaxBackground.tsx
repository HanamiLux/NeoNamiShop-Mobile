import React from 'react';
import { View, Text, ImageBackground, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import {parallaxStyles} from "@/styles/ParallaxBackground";

const { height } = Dimensions.get('window');

interface ParallaxBackgroundProps {
    title: string;
    image: any;
}

export const ParallaxBackground = ({ title, image }: ParallaxBackgroundProps) => {
    const scrollY = useSharedValue(0);

    const getFontSize = (text: string): number => {
        return text === 'ПОПУЛЯРНОЕ' ? 50 : 80;
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: scrollY.value * 0.5 }],
        };
    });

    return (
        <View style={parallaxStyles.container}>
            <ImageBackground
                source={image}
                style={parallaxStyles.imageBackground}
                resizeMode="cover"
            >
                <Animated.View
                    style={[
                        parallaxStyles.overlay,
                        animatedStyle
                    ]}
                />

                <Text style={[parallaxStyles.title, { fontSize: getFontSize(title) }]}>
                    {title}
                </Text>
            </ImageBackground>
        </View>
    );
};
