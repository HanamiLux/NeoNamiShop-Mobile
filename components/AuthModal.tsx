import React, {useCallback, useState} from 'react';
import { Modal, View, Text, Pressable, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import api from "@/services/api";
import { Portal } from 'react-native-paper';

const AuthModal = () => {
    const {
        isAuthModalOpen,
        closeAuthModal,
        authError,
        isLoading,
        contextLogin,
    } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const handleChangeEmail = useCallback((text: string) => {
        setEmail(text);
    }, []);

    const [password, setPassword] = useState('');
    const [login, setLogin] = useState('');
    const [inputErrors, setInputErrors] = useState({
        email: '',
        password: '',
        login: ''
    });

    const validateForm = () => {
        let isValid = true;
        const errors = {
            email: '',
            password: '',
            login: ''
        };

        // Email validation
        if (!email.trim()) {
            errors.email = 'Email обязателен';
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            errors.email = 'Неверный формат email';
            isValid = false;
        }

        // Password validation
        if (!password) {
            errors.password = 'Пароль обязателен';
            isValid = false;
        } else if (password.length < 6) {
            errors.password = 'Пароль должен быть не менее 6 символов';
            isValid = false;
        }

        // Login validation for registration
        if (!isLogin) {
            if (!login.trim()) {
                errors.login = 'Логин обязателен';
                isValid = false;
            } else if (login.length < 3) {
                errors.login = 'Логин должен быть не менее 3 символов';
                isValid = false;
            }
        }

        setInputErrors(errors);
        return isValid;
    };

    const handleAuth = async () => {
        if (!validateForm()) return;
        const errors = {
            email: '',
            password: '',
            login: ''
        };

        try {
            const endpoint = isLogin ? 'login' : '';
            const response = await api.post(
                `/users/${endpoint}`,
                {
                    email,
                    password,
                    ...(!isLogin && { login })
                }
            );

            if(response.data.message === "Пользователя нет в системе") {
                errors.password = 'Пользователя нет в системе';
                setInputErrors(errors)
            }

            if (response.data.user) {
                await AsyncStorage.multiSet([
                    ['userId', response.data.user.userId],
                    ['email', response.data.user.email],
                    ['login', response.data.user.login],
                    ['role', response.data.user.roleName]
                ]);

                contextLogin(response.data.user);
                closeAuthModal();
                setInputErrors({ email: '', password: '', login: '' });
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message
                || error.message
                || 'Ошибка сервера';
            contextLogin(null, errorMessage);
        }
    };

    const handleSwitchMode = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setLogin('');
        setInputErrors({
            email: '',
            password: '',
            login: ''
        });
    };

    return (
        <Portal>
            <Modal
                visible={isAuthModalOpen}
                animationType="fade"
                transparent
                onRequestClose={closeAuthModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Pressable
                            style={styles.closeButton}
                            onPress={closeAuthModal}
                        >
                            <Text style={styles.closeText}>×</Text>
                        </Pressable>

                        <Text style={styles.title}>
                            {isLogin ? 'Вход' : 'Регистрация'}
                        </Text>

                        {authError && (
                            <Text style={styles.errorText}>{authError}</Text>
                        )}

                        {!isLogin && (
                            <>
                                <TextInput
                                    style={[styles.input, !!inputErrors.login && styles.inputError]}
                                    placeholder="Логин"
                                    placeholderTextColor="#666"
                                    value={login}
                                    onChangeText={setLogin}
                                    autoCapitalize="none"
                                />
                                {inputErrors.login ? (
                                    <Text style={styles.errorFieldText}>
                                        {inputErrors.login}
                                    </Text>
                                ) : null}
                            </>
                        )}

                        <TextInput
                            style={[styles.input, !!inputErrors.email && styles.inputError]}
                            placeholder="Email"
                            placeholderTextColor="#666"
                            value={email}
                            onChangeText={handleChangeEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        {inputErrors.email ? (
                            <Text style={styles.errorFieldText}>
                                {inputErrors.email}
                            </Text>
                        ) : null}

                        <TextInput
                            style={[styles.input, !!inputErrors.password && styles.inputError]}
                            placeholder="Пароль"
                            placeholderTextColor="#666"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        {inputErrors.password ? (
                            <Text style={styles.errorFieldText}>
                                {inputErrors.password}
                            </Text>
                        ) : null}

                        <Pressable
                            style={styles.authButton}
                            onPress={handleAuth}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>
                                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                                </Text>
                            )}
                        </Pressable>

                        <Pressable
                            style={styles.switchButton}
                            onPress={handleSwitchMode}
                        >
                            <Text style={styles.switchText}>
                                {isLogin
                                    ? 'Нет аккаунта? Зарегистрируйтесь'
                                    : 'Уже есть аккаунт? Войдите'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        ...StyleSheet.absoluteFillObject

    },
    modalContent: {
        width: '95%',
        maxWidth: 400,
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        borderColor: '#8b0000',
        borderWidth: 2,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        color: '#fff',
        fontSize: 16,
        backgroundColor: '#2a2a2a'
    },
    inputError: {
        borderColor: '#ff4444'
    },
    authButton: {
        backgroundColor: '#8b0000',
        padding: 14,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500'
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        padding: 5,
        zIndex: 1
    },
    closeText: {
        color: '#8b0000',
        fontSize: 28,
        lineHeight: 28
    },
    errorText: {
        color: '#ff4444',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center'
    },
    switchButton: {
        marginTop: 15
    },
    switchText: {
        color: '#8b0000',
        fontSize: 14,
        textDecorationLine: 'underline'
    },
    errorFieldText: {
        color: '#ff4444',
        fontSize: 12,
        alignSelf: 'flex-start',
        marginLeft: 15,
        marginBottom: 10,
        width: '100%',
    },
});

export default AuthModal;