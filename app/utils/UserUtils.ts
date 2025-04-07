import AsyncStorage from '@react-native-async-storage/async-storage';

export default class UserUtils {
    static async getUserId(): Promise<string | null> {
        try {
            const userId = await AsyncStorage.getItem('userId');
            return userId && /^[0-9a-fA-F-]{36}$/.test(userId) ? userId : null;
        } catch (error) {
            console.error('Failed to get user ID:', error);
            return null;
        }
    }

    static async setUserId(userId: string): Promise<void> {
        try {
            await AsyncStorage.setItem('userId', userId);
        } catch (error) {
            console.error('Failed to set user ID:', error);
        }
    }

    static async removeUserId(): Promise<void> {
        try {
            await AsyncStorage.removeItem('userId');
        } catch (error) {
            console.error('Failed to remove user ID:', error);
        }
    }
}