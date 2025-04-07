import React from 'react';
import '../styles/footer.css';
import {ParallaxBackground} from "./ParallaxBackground";

const Footer: React.FC = () => {
    return (
        <>
        <ParallaxBackground title="" image="/assets/images/footer-bg.jpg"/>
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3 className="footer-heading">О нас</h3>
                    <p className="footer-text">
                        Мы предлагаем широкий выбор японских товаров высочайшего качества
                    </p>
                </div>
                <div className="footer-section">
                    <h3 className="footer-heading">Контакты</h3>
                    <ul className="footer-list">
                        <li>Телефон: +7 (999) 123-45-67</li>
                        <li>Email: info@neonami.ru</li>
                        <li>Адрес: г. Москва, ул. Декабристов, 1</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3 className="footer-heading">Информация</h3>
                    <ul className="footer-list">
                        <li>Доставка</li>
                        <li>Оплата</li>
                        <li>Возврат</li>
                        <li>FAQ</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3 className="footer-heading">Мы в соцсетях</h3>
                    <ul className="footer-list">
                        <li>VK</li>
                        <li>Telegram</li>
                        <li>WhatsApp</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 NeoNami Store. Все права защищены.</p>
            </div>
        </footer>
        </>
    );
};

export default Footer;
