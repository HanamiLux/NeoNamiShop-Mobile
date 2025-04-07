import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

const Haiku = ({ theme }: { theme: 'ПОПУЛЯРНОЕ' | 'НОВОЕ' | 'АКЦИЯ' }) => {
    const getHaiku = () => {
        switch (theme) {
            case 'ПОПУЛЯРНОЕ':
                return [
                    "Все спешат купить",
                    "Выбор многих не случай",
                    "Мудрость толпы здесь"
                ];
            case 'НОВОЕ':
                return [
                    "Первый луч зари",
                    "Новинки появились",
                    "Мир удивлён вновь"
                ];
            case 'АКЦИЯ':
                return [
                    "Цены тают вмиг",
                    "Время скидок настало",
                    "Спеши за мечтой"
                ];
            default:
                return [
                    "Тихий шёпот строк",
                    "В воздухе витает смысл",
                    "Хайку молчит"
                ];
        }
    };

    return (
        <View style={styles.container}>
            <BlurView intensity={30} style={styles.blurContainer}>
                {getHaiku().map((line, index) => (
                    <Text key={index} style={styles.line}>
                        {line}
                    </Text>
                ))}
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        alignItems: 'flex-end',
    },
    blurContainer: {
        padding: 20,
        borderRadius: 20,
        overflow: 'hidden',
        width: '80%',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    line: {
        fontSize: 24,
        color: 'grey',
        textAlign: 'right',
        marginVertical: 8,
        fontFamily: 'Takashimura',
    },
});

export default Haiku;