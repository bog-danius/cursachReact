import styles from './Header.module.css';
import { Button } from '@shared/Button';
import { TournamentsPage } from '@pages/tournaments';

export const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <a href="/" className={styles.logo}>
                    TourneyHub
                </a>

                <nav className={styles.nav}>
                    <a href="#features">Функции</a>
                    <a href="./TournamentsPage">Турниры</a>
                    <a href="./AuthPage">Аналитика</a>
                    <a href="#contacts">Контакты</a>
                </nav>

                <div className={styles.actions}>
                    <button className={styles.login}>
                        Войти
                    </button>

                    <Button text="Начать" />
                </div>

                <button className={styles.burger}>
                    ☰
                </button>
            </div>
        </header>
    );
};