import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Trash2, Plus, Minus, Ticket, Calendar, X } from 'lucide-react';
import { authApi } from '../../auth/api/auth';
import { cartApi, favoritesApi } from './api'; 
import styles from './ChoicePage.module.css';

export const ChoicePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cart'); 

  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: 'success' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const fetchChoiceData = async () => {
    try {
      setLoading(true);
      const userData = await authApi.me();

      if (!userData) {
        navigate('/auth');
        return;
      }
      setUser(userData);

      const [cartData, favoritesData] = await Promise.all([
        cartApi.getByUserId(userData.id).catch(() => []),
        favoritesApi.getByUserId(userData.id).catch(() => [])
      ]);

      setCartItems(Array.isArray(cartData) ? cartData : []);
      setFavoriteItems(Array.isArray(favoritesData) ? favoritesData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChoiceData();
  }, [navigate]);

  const getDiscountedPrice = (ticket) => {
    const originalPrice = ticket?.price || 0;
    const discountPercent = ticket?.promotion?.discount || 0;
    
    if (discountPercent > 0) {
      return Math.round(originalPrice * (1 - discountPercent / 100));
    }
    return originalPrice;
  };

  const handleUpdateQuantity = async (item, delta) => {
    if (actionLoading) return;
    
    const currentQty = item.quantity || 1;
    const newQty = currentQty + delta;
    
    if (newQty < 1) return;

    try {
      setActionLoading(true);
      await cartApi.update(item.id, { quantity: Number(newQty) });
      
      setCartItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, quantity: newQty } : i))
      );
    } catch (err) {
      console.error(err);
      showNotification('Не удалось изменить количество билетов', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    if (actionLoading) return;
    try {
      setActionLoading(true);
      await cartApi.remove(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      showNotification('Билет удален из корзины', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Не удалось удалить товар из корзины', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (itemId) => {
    if (actionLoading) return;
    try {
      setActionLoading(true);
      await favoritesApi.remove(itemId);
      setFavoriteItems(prev => prev.filter(item => item.id !== itemId));
      showNotification('Удалено из избранного', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Не удалось удалить из избранного', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMoveToCart = async (favItem) => {
    if (actionLoading) return;
    try {
      setActionLoading(true);
      
      await cartApi.add({
        userId: Number(user.id),
        ticketId: Number(favItem.ticketId),
        quantity: 1
      });

      await favoritesApi.remove(favItem.id);
      setFavoriteItems(prev => prev.filter(item => item.id !== favItem.id));
      
      const freshCart = await cartApi.getByUserId(user.id).catch(() => []);
      setCartItems(Array.isArray(freshCart) ? freshCart : []);
      
      showNotification('Билет успешно перемещен в корзину!', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Не удалось переместить билет в корзину', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => (sum + (item.ticket?.price || 0) * (item.quantity || 1)), 0);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => (sum + getDiscountedPrice(item.ticket) * (item.quantity || 1)), 0);
  };

  const calculateTotalDiscount = () => {
    return calculateSubtotal() - calculateTotal();
  };

  if (loading) {
    return (
      <div className={styles.centerLayout}>
        <div className={styles.loader}>Загрузка ваших списков...</div>
      </div>
    );
  }

  return (
      <div className={styles.wrapper}>
        {toast.show && (
            <div className={`${styles.toast} ${styles[toast.type]}`}>
              <span>{toast.message}</span>
              <button
                  className={styles.toastClose}
                  onClick={() => setToast({ show: false, message: '', type: 'success' })}
              >
                <X size={16} />
              </button>
            </div>
        )}

        {/* Изменено: Хедер стал компактной навигационной панелью */}
        <div className={styles.dashHeader}>
          <button className={styles.backCircleBtn} onClick={() => navigate(-1)} title="Назад">
            <ArrowLeft size={20} />
          </button>
          <div className={styles.dashTitleBlock}>
            <span className={styles.subTitle}>Личный кабинет</span>
            <h1 className={styles.mainTitle}>Мой выбор</h1>
          </div>

          {/* Перенесли табы прямо в хедер для экономии места и монолитности */}
          <div className={styles.neonTabs}>
            <button
                className={`${styles.neonTab} ${activeTab === 'cart' ? styles.neonTabActive : ''}`}
                onClick={() => setActiveTab('cart')}
            >
              <span>Корзина</span>
              <div className={styles.tabCounter}>{cartItems.length}</div>
            </button>

            <button
                className={`${styles.neonTab} ${activeTab === 'favorites' ? styles.neonTabActive : ''}`}
                onClick={() => setActiveTab('favorites')}
            >
              <span>Избранное</span>
              <div className={styles.tabCounter}>{favoriteItems.length}</div>
            </button>
          </div>
        </div>

        <div className={styles.dashBody}>
          {activeTab === 'cart' ? (
              <div className={styles.cartDashboardGrid}>

                {/* Сетка карточек вместо списка */}
                {cartItems.length === 0 ? (
                    <div className={styles.emptyCyberBlock}>
                      <ShoppingCart size={64} className={styles.cyberIcon} />
                      <h2>Корзина пуста</h2>
                      <p>Вы еще не выбрали ни одного события для участия.</p>
                      <Link to="/" className={styles.cyberBtnPrimary}>Открыть афишу</Link>
                    </div>
                ) : (
                    <div className={styles.cyberGrid}>
                      {cartItems.map((item) => {
                        const discountPercent = item.ticket?.promotion?.discount || 0;
                        const hasDiscount = discountPercent > 0;
                        const finalPriceOne = getDiscountedPrice(item.ticket);

                        return (
                            <div key={item.id} className={styles.cyberCard}>
                              {/* Кнопка удаления теперь сверху карточки */}
                              <button
                                  className={styles.cardCloseCorner}
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  disabled={actionLoading}
                              >
                                <Trash2 size={14} />
                              </button>

                              <div className={styles.cyberCardHeader}>
                                <div className={styles.cyberBadgeContainer}>
                                  <Ticket size={20} />
                                  {hasDiscount && (
                                      <span className={styles.cyberDiscountLabel}>-{discountPercent}%</span>
                                  )}
                                </div>
                                <div className={styles.cyberCardDate}>
                                  <Calendar size={12} />
                                  <span>
                        {item.ticket?.eventDate
                            ? new Date(item.ticket.eventDate).toLocaleDateString('ru-RU')
                            : 'Дата не указана'}
                      </span>
                                </div>
                              </div>

                              <div className={styles.cyberCardBody}>
                                <h3>{item.ticket?.title || 'Билет на спектакль'}</h3>
                                <div className={styles.pricePerItem}>
                                  {finalPriceOne} ₽ <span className={styles.perItemText}>/ шт.</span>
                                </div>
                              </div>

                              {/* Нижняя часть карточки: управление количеством и итого по позиции */}
                              <div className={styles.cyberCardFooter}>
                                <div className={styles.cyberCounter}>
                                  <button
                                      onClick={() => handleUpdateQuantity(item, -1)}
                                      disabled={item.quantity <= 1 || actionLoading}
                                      className={styles.cntBtn}
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className={styles.cntValue}>{item.quantity || 1}</span>
                                  <button
                                      onClick={() => handleUpdateQuantity(item, 1)}
                                      disabled={actionLoading}
                                      className={styles.cntBtn}
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>

                                <div className={styles.itemSummaryPrice}>
                                  {hasDiscount && (
                                      <span className={styles.oldPriceSum}>
                          {(item.ticket?.price || 0) * (item.quantity || 1)} ₽
                        </span>
                                  )}
                                  <span className={styles.newPriceSum}>
                        {finalPriceOne * (item.quantity || 1)} ₽
                      </span>
                                </div>
                              </div>
                            </div>
                        );
                      })}
                    </div>
                )}

                {/* Компактный футуристичный виджет оплаты */}
                {cartItems.length > 0 && (
                    <div className={styles.cyberSummaryPanel}>
                      <div className={styles.panelHead}>Сумма заказа</div>

                      <div className={styles.panelRow}>
                        <span>Слоты ({cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0)} шт.)</span>
                        <span>{calculateSubtotal()} ₽</span>
                      </div>

                      {calculateTotalDiscount() > 0 && (
                          <div className={`${styles.panelRow} ${styles.discountText}`}>
                            <span>Промо-скидка</span>
                            <span>-{calculateTotalDiscount()} ₽</span>
                          </div>
                      )}

                      <div className={styles.panelDivider} />

                      <div className={styles.panelTotal}>
                        <span>К оплате:</span>
                        <span className={styles.glowTotal}>{calculateTotal()} ₽</span>
                      </div>

                      <button className={styles.cyberCheckoutBtn} onClick={() => navigate('/cart')}>
                        <span>Подтвердить транзакцию</span>
                      </button>
                    </div>
                )}
              </div>
          ) : (
              /* Экран ИЗБРАННОГО в том же плиточном стиле */
              <div className={styles.contentSection}>
                {favoriteItems.length === 0 ? (
                    <div className={styles.emptyCyberBlock}>
                      <Heart size={64} className={styles.cyberIcon} />
                      <h2>В избранном пусто</h2>
                      <p>Добавляйте события, чтобы не потерять их перед началом.</p>
                      <Link to="/" className={styles.cyberBtnPrimary}>Перейти к афише</Link>
                    </div>
                ) : (
                    <div className={styles.cyberGrid}>
                      {favoriteItems.map((item) => {
                        const discountPercent = item.ticket?.promotion?.discount || 0;
                        const hasDiscount = discountPercent > 0;
                        const finalPrice = getDiscountedPrice(item.ticket);

                        return (
                            <div key={item.id} className={styles.cyberCard}>
                              <button
                                  className={styles.cardCloseCorner}
                                  onClick={() => handleRemoveFromFavorites(item.id)}
                                  disabled={actionLoading}
                              >
                                <Trash2 size={14} />
                              </button>

                              <div className={styles.cyberCardHeader}>
                                <div className={styles.cyberBadgeContainer}>
                                  <Heart size={20} className={styles.favoriteActiveIcon} />
                                  {hasDiscount && (
                                      <span className={styles.cyberDiscountLabel}>-{discountPercent}%</span>
                                  )}
                                </div>
                                <div className={styles.cyberCardDate}>
                                  <Calendar size={12} />
                                  <span>
                        {item.ticket?.eventDate
                            ? new Date(item.ticket.eventDate).toLocaleDateString('ru-RU')
                            : 'Дата не указана'}
                      </span>
                                </div>
                              </div>

                              <div className={styles.cyberCardBody}>
                                <h3>{item.ticket?.title || 'Билет на спектакль'}</h3>
                                <div className={styles.priceMetaRow}>
                                  <span className={styles.newPriceSum}>{finalPrice} ₽</span>
                                  {hasDiscount && (
                                      <span className={styles.oldPriceSum}>{item.ticket.price} ₽</span>
                                  )}
                                </div>
                              </div>

                              <div className={styles.favCardFooter}>
                                <button
                                    className={styles.cyberBtnAction}
                                    onClick={() => handleMoveToCart(item)}
                                    disabled={actionLoading}
                                >
                                  <ShoppingCart size={14} />
                                  <span>Забрать в корзину</span>
                                </button>
                              </div>
                            </div>
                        );
                      })}
                    </div>
                )}
              </div>
          )}
        </div>
      </div>
  );
};