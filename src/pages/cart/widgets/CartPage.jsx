import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, ShoppingBag, ArrowLeft, ShieldCheck, CreditCard } from 'lucide-react';
import { ticketsApi, ordersApi, cartApi } from '../api/api';
import { authApi } from '../../auth/api/auth';
import { OrderCheckout } from '../components/OrderCheckout';
import { OrderSuccess } from '../components/OrderSuccess';
import styles from './CartPage.module.css';

export const CartPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState(null);

  const getDiscountedPrice = (ticket) => {
    const originalPrice = ticket?.price || 0;
    const discountPercent = ticket?.promotion?.discount || 0;

    if (discountPercent > 0) {
      return Math.round(originalPrice * (1 - discountPercent / 100));
    }
    return originalPrice;
  };

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        setError(null);

        const userData = await authApi.me();
        if (!userData) {
          navigate('/auth');
          return;
        }
        setUser(userData);

        const items = await cartApi.getByUserId(userData.id);

        if (!items || items.length === 0) {
          setError('Ваша корзина пуста.');
          return;
        }

        for (const item of items) {
          const ticketData = await ticketsApi.getById(item.ticketId);

          if (!ticketData) {
            setError('Информация о билете не найдена');
            return;
          }

          if (ticketData.quantity <= 0) {
            setError(`Билетов на мероприятие "${ticketData.title}" больше нет в наличии`);
            return;
          }

          if (item.quantity > ticketData.quantity) {
            setError(`Недостаточно билетов на "${ticketData.title}". Доступно: ${ticketData.quantity} шт.`);
            return;
          }

          item.ticket = ticketData;
        }

        setCartItems(items);
      } catch (err) {
        setError('Ошибка при загрузке данных корзины');
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [navigate]);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + getDiscountedPrice(item.ticket) * (item.quantity || 1), 0);
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      const updates = [];
      for (const item of cartItems) {
        const currentTicket = await ticketsApi.getById(item.ticketId);
        if (item.quantity > currentTicket.quantity) {
          setError(`Ошибка: билеты на "${currentTicket.title}" закончились или их количество изменилось. Доступно: ${currentTicket.quantity} шт.`);
          return;
        }
        updates.push({
          id: item.ticketId,
          newQuantity: currentTicket.quantity - item.quantity
        });
      }

      const response = await ordersApi.create({
        userId: user.id,
        items: cartItems.map(item => ({
          ticketId: item.ticketId,
          quantity: item.quantity,
          price: getDiscountedPrice(item.ticket)
        })),
        totalPrice: calculateTotal()
      });

      await Promise.all(
          updates.map(upd => ticketsApi.update(upd.id, { quantity: upd.newQuantity }))
      );

      await Promise.all(
          cartItems.map(item => cartApi.remove(item.id))
      );

      setOrderSuccess(response);
    } catch (err) {
      setError(err?.response?.data?.message || 'Не удалось совершить покупку');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
        <div className={styles.center}>
          <div className={styles.loaderWrapper}>
            <Loader className={styles.spin} />
            <span className={styles.loaderText}>Проверка доступности мест...</span>
          </div>
        </div>
    );
  }

  if (error && cartItems.length === 0) {
    return (
        <div className={styles.center}>
          <div className={styles.errorContainer}>
            <div className={styles.error}>{error}</div>
            <button className={styles.homeButton} onClick={() => navigate('/')}>Вернуться на главную</button>
          </div>
        </div>
    );
  }

  return (
      <div className={styles.wrapper}>
        {/* Навигационный хэдер страницы */}
        <div className={styles.pageHeader}>
          <button className={styles.backButtonInline} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            <span>Назад к афише</span>
          </button>
          <div className={styles.headerTitleBlock}>
            <ShoppingBag size={20} className={styles.accentIcon} />
            <h1 className={styles.mainTitle}>
              {!orderSuccess ? 'Оформление заказа' : 'Заказ успешно оплачен'}
            </h1>
          </div>
        </div>

        {/* Основной двухпанельный контейнер */}
        <div className={`${styles.splitLayout} ${orderSuccess ? styles.successLayoutSingle : ''}`}>
          {!orderSuccess ? (
              <>
                {/* Левая панель: Список билетов и кастомные элементы ввода */}
                <div className={styles.leftMainPanel}>
                  <OrderCheckout
                      cartItems={cartItems}
                      totalPrice={calculateTotal()}
                      error={error}
                      isProcessing={isProcessing}
                      onCheckout={handleCheckout}
                  />
                </div>

                {/* Правая панель: Сводный биллинг-виджет */}
                <div className={styles.rightStickyPanel}>
                  <div className={styles.billingCard}>
                    <div className={styles.billingHeader}>
                      <CreditCard size={18} className={styles.billingIcon} />
                      <h3>Резюме транзакции</h3>
                    </div>

                    <div className={styles.billingDetailsRow}>
                      <span>Всего билетов:</span>
                      <span className={styles.billingDetailsValue}>
                    {cartItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0)} шт.
                  </span>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.totalRow}>
                      <span>Итого к оплате</span>
                      <span className={styles.totalValue}>{calculateTotal()} ₽</span>
                    </div>

                    {error && <div className={styles.inlineError}>{error}</div>}

                    <button
                        className={styles.payButton}
                        onClick={handleCheckout}
                        disabled={isProcessing}
                    >
                      {isProcessing ? (
                          <>
                            <Loader className={styles.spinSmall} size={16} />
                            <span>Авторизация платежа...</span>
                          </>
                      ) : (
                          <span>Подтвердить и оплатить</span>
                      )}
                    </button>

                    <div className={styles.secureNotice}>
                      <ShieldCheck size={14} />
                      <span>Безопасное соединение. Билеты придут на вашу почту.</span>
                    </div>
                  </div>
                </div>
              </>
          ) : (
              /* Контейнер в случае успешного заказа */
              <div className={styles.successFullContainer}>
                <OrderSuccess
                    orderSuccess={orderSuccess}
                    cartItems={cartItems}
                    totalPrice={calculateTotal()}
                    user={user}
                />
              </div>
          )}
        </div>
      </div>
  );
};