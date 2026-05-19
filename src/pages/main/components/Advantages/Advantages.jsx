import styles from './Advantages.module.css';
import {
  Swords,
  ChessQueen,
  Gamepad2,
  BowArrow,
} from 'lucide-react';

const advantages = [
  {
    id: 1,
    title: 'Мгновенное участие',
    text: 'Учавствуйте в онлайн турнирах за несколько кликов без очередей и ожидания.',
    icon: <Swords size={36} strokeWidth={1.5} />,
  },
  {
    id: 2,
    title: 'Выбор лучших турниров',
    text: 'Интерактивная схема зала поможет выбрать идеальные места для просмотра турниров.',
    icon: <ChessQueen size={36} strokeWidth={1.5} />,
  },
  {
    id: 3,
    title: 'Электронные билеты',
    text: 'Получайте билеты на email и показывайте их прямо со смартфона.',
    icon: <Gamepad2 size={36} strokeWidth={1.5} />,
  },
  {
    id: 4,
    title: 'Безопасная оплата',
    text: 'Все платежи защищены современными технологиями шифрования данных.',
    icon: <BowArrow size={36} strokeWidth={1.5} />,
  },
];

export const Advantages = () => {
  return (
    <section className={styles.section}>
      <div className={styles.top}>
        <span className={styles.subtitle}>Преимущества сервиса</span>

        <h2 className={styles.title}>
          Всё для комфортного бронирования билетов
        </h2>

        <p className={styles.description}>
          Мы сделали процесс покупки театральных билетов
          максимально удобным, быстрым и безопасным.
        </p>
      </div>

      <div className={styles.cards}>
        {advantages.map((item) => (
          <article className={styles.card} key={item.id}>
            <div className={styles.icon}>{item.icon}</div>

            <h3 className={styles.cardTitle}>
              {item.title}
            </h3>

            <p className={styles.cardText}>
              {item.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};