import { useNavigate } from 'react-router-dom';
import { CheckCircle, FileText, Download, ArrowLeft } from 'lucide-react';
import { generateDOCX, generatePDF } from '../documentHelpers';
import styles from './CartPage.module.css';

export const OrderSuccess = ({ orderSuccess, cartItems, totalPrice, user }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.successBlock}>
            {/* Иконка успеха с пульсирующим свечением */}
            <div className={styles.successIconWrapper}>
                <CheckCircle size={52} className={styles.successIcon} />
                <div className={styles.successGlowRing}></div>
            </div>

            <h1 className={styles.title}>Заказ успешно оформлен!</h1>

            <p className={styles.successText}>
                Регистрационный номер транзакции: <strong className={styles.orderToken}>#{orderSuccess.id}</strong>.
                Благодарим за покупку! Цифровые ассеты сформированы и готовы к выгрузке.
            </p>

            {/* Интерактивная зона скачивания документов */}
            <div className={styles.downloadActions}>
                <button
                    className={styles.downloadButton}
                    onClick={() => generateDOCX(orderSuccess, cartItems, totalPrice, user)}
                >
                    <div className={styles.downloadBtnLeft}>
                        <FileText size={18} className={styles.docIconDocx} />
                        <span>Скачать билеты (DOCX)</span>
                    </div>
                    <Download size={15} className={styles.downloadArrow} />
                </button>

                <button
                    className={styles.downloadButton}
                    onClick={() => generatePDF(orderSuccess, cartItems, totalPrice, user)}
                >
                    <div className={styles.downloadBtnLeft}>
                        <FileText size={18} className={styles.docIconPdf} />
                        <span>Скачать билеты (PDF)</span>
                    </div>
                    <Download size={15} className={styles.downloadArrow} />
                </button>
            </div>

            <div className={styles.successDivider} />

            {/* Кнопка возврата на главную */}
            <button className={styles.homeButton} onClick={() => navigate('/')}>
                <ArrowLeft size={14} />
                <span>Вернуться на главную</span>
            </button>
        </div>
    );
};