import { CreditCard, Ticket, Calendar, Tag } from 'lucide-react';
import styles from './CartPage.module.css';

export const OrderCheckout = ({ cartItems, totalPrice, error, isProcessing, onCheckout }) => {
    return (
        <>
            {/* Мелкий технический подзаголовок вместо огромного H1 */}
            <div className={styles.checkoutMetaHeader}>
                <span className={styles.checkoutStatusBadge}>Проверка состава</span>
                <span className={styles.itemsCounter}>Позиций в списке: {cartItems.length}</span>
            </div>

            {/* Список билетов в виде технологичных карточек */}
            <div className={styles.itemsListGrid}>
                {cartItems.map((item) => (
                    <div key={item.id} className={styles.checkoutTicketCard}>
                        <div className={styles.ticketCardHeader}>
                            <div className={styles.ticketIconContainer}>
                                <Ticket size={16} />
                            </div>
                            <h2 className={styles.ticketCheckoutTitle}>{item.ticket?.title}</h2>
                        </div>

                        <div className={styles.ticketDetailsMetaGrid}>
                            <div className={styles.metaDetailCell}>
                                <Calendar size={13} className={styles.metaCellIcon} />
                                <div className={styles.metaCellText}>
                                    <span className={styles.metaCellLabel}>Дата сеанса</span>
                                    <span className={styles.metaCellValue}>
                    {item.ticket?.eventDate ? new Date(item.ticket.eventDate).toLocaleDateString('ru-RU') : 'Не указана'}
                  </span>
                                </div>
                            </div>

                            <div className={styles.metaDetailCell}>
                                <Tag size={13} className={styles.metaCellIcon} />
                                <div className={styles.metaCellText}>
                                    <span className={styles.metaCellLabel}>Тариф и объем</span>
                                    <span className={styles.metaCellValue}>
                    {item.ticket?.price} ₽ × {item.quantity} шт.
                  </span>
                                </div>
                            </div>
                        </div>

                        {/* Мягкий индикатор персональной скидки, если она присутствует */}
                        {item.ticket?.promotion?.discount > 0 && (
                            <div className={styles.discountBadgeInline}>
                                Активирована скидка {item.ticket.promotion.discount}%
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Мобильный блок итогов (скрыт на десктопе через медиа-запросы в CSS) */}
            <div className={styles.mobileBillingSummary}>
                <div className={styles.divider} />
                <div className={styles.totalRow}>
                    <span>К оплате:</span>
                    <span className={styles.totalValue}>{totalPrice} ₽</span>
                </div>

                {error && <div className={styles.inlineError}>{error}</div>}

                <button
                    className={styles.payButton}
                    onClick={onCheckout}
                    disabled={isProcessing}
                >
                    <CreditCard size={18} />
                    <span>{isProcessing ? 'Обработка платежа...' : 'Оплатить заказ'}</span>
                </button>
            </div>
        </>
    );
};