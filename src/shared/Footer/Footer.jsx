import styles from './Footer.module.css';

export const Footer = () => {
  return (
      <footer className={styles.footer} id="contacts">
        <div className={styles.container}>
          <div className={styles.top}>
            <div>
              <h2 className={styles.logo}>TourneyHub</h2>

              <p className={styles.description}>
                Современная платформа для организации
                киберспортивных турниров и соревнований.
              </p>
            </div>

            <div className={styles.links}>
              <div>
                <h4>Платформа</h4>
                <a href="/">Турниры</a>
                <a href="/">Команды</a>
                <a href="/">Статистика</a>
              </div>

              <div>
                <h4>Компания</h4>
                <a href="/">О нас</a>
                <a href="/">Контакты</a>
                <a href="/">Поддержка</a>
              </div>
            </div>
          </div>

          <div className={styles.bottom}>
            <span>© 2026 TourneyHub. Все права защищены.</span>
          </div>
        </div>
      </footer>
  );
};