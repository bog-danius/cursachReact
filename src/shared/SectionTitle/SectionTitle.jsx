import styles from './SectionTitle.module.css';

export const SectionTitle = ({ subtitle, title, description }) => {
    return (
        <div className={styles.sectionTitle}>
            <span className={styles.subtitle}>{subtitle}</span>

            <h2 className={styles.title}>{title}</h2>

            <p className={styles.description}>{description}</p>
        </div>
    );
};