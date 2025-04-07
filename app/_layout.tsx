import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import HomeScreen from '@/app/(tabs)';
import CatalogScreen from '@/app/(tabs)/catalog';
import ProfileScreen from '@/app/(tabs)/profile';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { commonStyles } from '@/styles/Common';
import CartScreen from "@/app/(tabs)/cart";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductScreen from "@/app/(tabs)/product";
import { RootStackParamList } from "@/types/navigation";
import AuthModal from '@/components/AuthModal';
import {PaperProvider} from "react-native-paper";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

function Tabs() {
    const { user } = useAuth();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#000',
                    borderTopColor: '#8b0000'
                },
                tabBarActiveTintColor: '#8b0000',
                tabBarInactiveTintColor: '#666',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Catalog"
                component={CatalogScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                    tabBarLabel: user ? user.login : 'Profile'
                }}
            />
        </Tab.Navigator>
    );
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        'Takashimura': require('../assets/fonts/Takashimura-RUS.otf'),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <PaperProvider>
        <View style={commonStyles.screenContainer}>
            <StatusBar backgroundColor="#000" style="light" />
            <AuthProvider>
                <CartProvider>
                    <NavigationContainer>
                        <Stack.Navigator
                            screenOptions={{
                                headerShown: false,
                                headerTitleStyle: {
                                    fontFamily: 'Takashimura',
                                    color: '#8b0000'
                                }
                            }}
                        >
                            <Stack.Screen name="Tabs" component={Tabs} />
                            <Stack.Screen
                                name="product"
                                component={ProductScreen}
                                options={({ route }) => ({
                                    title: (route.params as RootStackParamList['product']).product.productName,
                                    headerShown: false,
                                })}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                    <AuthModal />
                </CartProvider>
            </AuthProvider>
        </View>
        </PaperProvider>
    );
}