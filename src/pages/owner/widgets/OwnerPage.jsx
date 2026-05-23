import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../OwnerPage.module.css";

import { ownerApi } from "../api/api";

import {
    Users,
    Ticket,
    BadgePercent,
    ShoppingBag,
    FileText,
    MessageSquare,
    Trash2,
    Pencil,
    Save,
    X,
    Plus,
    Search,
    ChevronRight,
    Star,
    Calendar,
    DollarSign,
    Package,
    User,
    Mail,
    Hash,
} from "lucide-react";

export const OwnerPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState("tickets");

    const [users, setUsers] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [orders, setOrders] = useState([]);
    const [documents, setDocuments] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [ticketForm, setTicketForm] = useState({
        title: "",
        description: "",
        price: "",
        eventDate: "",
        posterUrl: "",
        quantity: "",
        promotionId: "",
    });

    const [promotionForm, setPromotionForm] = useState({
        title: "",
        description: "",
        discount: "",
    });

    const fetchAll = async () => {
        try {
            setLoading(true);

            const me = await ownerApi.me();

            if (
                me.firstName !== "admin" ||
                me.lastName !== "admin" ||
                me.email !== "admin@admin.com"
            ) {
                navigate("/");
                return;
            }

            const [
                usersData,
                ticketsData,
                promotionsData,
                reviewsData,
                ordersData,
                documentsData,
            ] = await Promise.all([
                ownerApi.getUsers(),
                ownerApi.getTickets(),
                ownerApi.getPromotions(),
                ownerApi.getReviews(),
                ownerApi.getOrders(),
                ownerApi.getDocuments(),
            ]);

            setUsers(usersData);
            setTickets(ticketsData);
            setPromotions(promotionsData);
            setReviews(reviewsData);
            setOrders(ordersData);
            setDocuments(documentsData);
        } catch (err) {
            console.error(err);
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const createTicket = async () => {
        try {
            const payload = {
                ...ticketForm,
                price: Number(ticketForm.price),
                quantity: Number(ticketForm.quantity),
                promotionId: ticketForm.promotionId
                    ? Number(ticketForm.promotionId)
                    : null,
                eventDate: ticketForm.eventDate
                    ? new Date(ticketForm.eventDate).toISOString()
                    : null,
            };

            console.log(payload);

            await ownerApi.createTicket(payload);

            fetchAll();
        } catch (err) {
            console.log(err.response?.data);
        }
    };

    const createPromotion = async () => {
        await ownerApi.createPromotion(promotionForm);

        setPromotionForm({
            title: "",
            description: "",
            discount: "",
        });

        fetchAll();
    };

    const getFilteredData = () => {
        if (!searchTerm) {
            if (activeTab === "tickets") return tickets;
            if (activeTab === "users") return users;
            if (activeTab === "reviews") return reviews;
            if (activeTab === "orders") return orders;
            if (activeTab === "documents") return documents;
            if (activeTab === "promotions") return promotions;
            return [];
        }

        const term = searchTerm.toLowerCase();

        if (activeTab === "tickets") {
            return tickets.filter(t =>
                t.title?.toLowerCase().includes(term) ||
                t.description?.toLowerCase().includes(term)
            );
        }
        if (activeTab === "users") {
            return users.filter(u =>
                u.firstName?.toLowerCase().includes(term) ||
                u.lastName?.toLowerCase().includes(term) ||
                u.email?.toLowerCase().includes(term)
            );
        }
        if (activeTab === "reviews") {
            return reviews.filter(r =>
                r.content?.toLowerCase().includes(term) ||
                r.order?.ticket?.title?.toLowerCase().includes(term)
            );
        }
        if (activeTab === "orders") {
            return orders.filter(o =>
                o.id?.toString().includes(term) ||
                o.ticket?.title?.toLowerCase().includes(term) ||
                o.user?.firstName?.toLowerCase().includes(term)
            );
        }
        if (activeTab === "documents") {
            return documents.filter(d =>
                d.type?.toLowerCase().includes(term) ||
                d.order?.ticket?.title?.toLowerCase().includes(term)
            );
        }
        if (activeTab === "promotions") {
            return promotions.filter(p =>
                p.title?.toLowerCase().includes(term) ||
                p.description?.toLowerCase().includes(term)
            );
        }
        return [];
    };

    const filteredData = getFilteredData();

    if (loading) {
        return (
            <div className={styles.loader}>
                <div className={styles.spinner}></div>
                <span>Загрузка панели управления...</span>
            </div>
        );
    }

    const tabs = [
        { id: "tickets", label: "Турниры", icon: Ticket, count: tickets.length },
        { id: "users", label: "Пользователи", icon: Users, count: users.length },
        { id: "reviews", label: "Отзывы", icon: MessageSquare, count: reviews.length },
        { id: "orders", label: "Заказы", icon: ShoppingBag, count: orders.length },
        { id: "documents", label: "Документы", icon: FileText, count: documents.length },
        { id: "promotions", label: "Акции", icon: BadgePercent, count: promotions.length },
    ];

    return (
        <div className={styles.wrapper}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
                <div className={styles.logo}>
                    <Ticket size={28} />
                    <span>Admin Panel</span>
                </div>
                <div className={styles.nav}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ""}`}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setSearchTerm("");
                            }}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                            <span className={styles.count}>{tab.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.content}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1>
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h1>
                        <span className={styles.totalCount}>
                            {filteredData.length} {filteredData.length === 1 ? "элемент" : "элементов"}
                        </span>
                    </div>
                    <div className={styles.searchWrapper}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder={`Поиск ${tabs.find(t => t.id === activeTab)?.label?.toLowerCase()}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Sections */}
                {activeTab === "tickets" && (
                    <>
                        {/* Create Form */}
                        <div className={styles.createCard}>
                            <div className={styles.createHeader}>
                                <Plus size={20} />
                                <h2>Создать новый Турнир</h2>
                            </div>
                            <div className={styles.createForm}>
                                <input
                                    placeholder="Название мероприятия"
                                    value={ticketForm.title}
                                    onChange={(e) =>
                                        setTicketForm({ ...ticketForm, title: e.target.value })
                                    }
                                />
                                <textarea
                                    placeholder="Описание"
                                    value={ticketForm.description}
                                    onChange={(e) =>
                                        setTicketForm({ ...ticketForm, description: e.target.value })
                                    }
                                />
                                <div className={styles.formRow}>
                                    <input
                                        type="number"
                                        placeholder="Цена"
                                        value={ticketForm.price}
                                        onChange={(e) =>
                                            setTicketForm({ ...ticketForm, price: e.target.value })
                                        }
                                    />
                                    <input
                                        type="number"
                                        placeholder="Количество"
                                        value={ticketForm.quantity}
                                        onChange={(e) =>
                                            setTicketForm({ ...ticketForm, quantity: e.target.value })
                                        }
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <input
                                        type="datetime-local"
                                        value={ticketForm.eventDate}
                                        onChange={(e) =>
                                            setTicketForm({ ...ticketForm, eventDate: e.target.value })
                                        }
                                    />
                                    <input
                                        type="number"
                                        placeholder="Promotion ID (опционально)"
                                        value={ticketForm.promotionId}
                                        onChange={(e) =>
                                            setTicketForm({ ...ticketForm, promotionId: e.target.value })
                                        }
                                    />
                                </div>
                                <input
                                    placeholder="URL постера"
                                    value={ticketForm.posterUrl}
                                    onChange={(e) =>
                                        setTicketForm({ ...ticketForm, posterUrl: e.target.value })
                                    }
                                />
                                <button onClick={createTicket}>
                                    <Plus size={16} />
                                    Создать Турнир
                                </button>
                            </div>
                        </div>

                        {/* Tickets Grid */}
                        <div className={styles.grid}>
                            {filteredData.map((ticket) => (
                                <div key={ticket.id} className={styles.card}>
                                    <div className={styles.cardImage}>
                                        <img src={ticket.posterUrl} alt={ticket.title} />
                                        <span className={styles.cardId}>#{ticket.id}</span>
                                    </div>
                                    <div className={styles.cardBody}>
                                        {editingId === ticket.id ? (
                                            <div className={styles.editForm}>
                                                <input type="text" defaultValue={ticket.title} placeholder="Название" />
                                                <textarea defaultValue={ticket.description} placeholder="Описание" />
                                                <input type="number" defaultValue={ticket.price} placeholder="Цена" />
                                                <input type="number" defaultValue={ticket.quantity} placeholder="Количество" />
                                            </div>
                                        ) : (
                                            <>
                                                <h3>{ticket.title}</h3>
                                                <p className={styles.descriptionText}>{ticket.description}</p>
                                                <div className={styles.cardMeta}>
                                                    <span><DollarSign size={14} /> {ticket.price} ₽</span>
                                                    <span><Package size={14} /> {ticket.quantity} шт.</span>
                                                </div>
                                                {ticket.promotion && (
                                                    <span className={styles.promoBadge}>
                                                        <BadgePercent size={12} /> {ticket.promotion.discount}%
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className={styles.cardActions}>
                                        {editingId === ticket.id ? (
                                            <>
                                                <button className={styles.saveBtn} onClick={() => setEditingId(null)}>
                                                    <Save size={16} />
                                                </button>
                                                <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className={styles.editBtn} onClick={() => setEditingId(ticket.id)}>
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={async () => {
                                                        await ownerApi.deleteTicket(ticket.id);
                                                        fetchAll();
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === "users" && (
                    <div className={styles.grid}>
                        {filteredData.map((user) => (
                            <div key={user.id} className={styles.userCard}>
                                <div className={styles.userAvatar}>
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </div>
                                <div className={styles.userInfo}>
                                    <h3>{user.firstName} {user.lastName}</h3>
                                    <p><Mail size={14} /> {user.email}</p>
                                    <p className={styles.userId}>ID: {user.id}</p>
                                </div>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={async () => {
                                        await ownerApi.deleteUser(user.id);
                                        fetchAll();
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "reviews" && (
                    <div className={styles.grid}>
                        {filteredData.map((review) => (
                            <div key={review.id} className={styles.reviewCard}>
                                <div className={styles.reviewHeader}>
                                    <div className={styles.reviewAuthor}>
                                        <div className={styles.authorAvatar}>
                                            {review.order?.user?.firstName?.[0] || "A"}
                                        </div>
                                        <div>
                                            <strong>{review.order?.user?.firstName || "Аноним"} {review.order?.user?.lastName || ""}</strong>
                                            <span className={styles.reviewTicket}>
                                                <Ticket size={12} /> {review.order?.ticket?.title || "Не указано"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.reviewRating}>
                                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                        <Star size={14} color="#4b5563" />
                                    </div>
                                </div>
                                <p className={styles.reviewContent}>{review.content}</p>
                                <div className={styles.reviewActions}>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={async () => {
                                            await ownerApi.deleteReview(review.id);
                                            fetchAll();
                                        }}
                                    >
                                        <Trash2 size={16} />
                                        <span>Удалить отзыв</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className={styles.grid}>
                        {filteredData.map((order) => (
                            <div key={order.id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <span className={styles.orderId}>Заказ #{order.id}</span>
                                    <span className={styles.orderStatus}>Оплачен</span>
                                </div>
                                <div className={styles.orderBody}>
                                    <div className={styles.orderInfo}>
                                        <Ticket size={16} />
                                        <span>{order.ticket?.title || "Турнир удалён"}</span>
                                    </div>
                                    <div className={styles.orderInfo}>
                                        <User size={16} />
                                        <span>{order.user?.firstName} {order.user?.lastName}</span>
                                    </div>
                                    <div className={styles.orderPrice}>
                                        {order.totalPrice} ₽
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "documents" && (
                    <div className={styles.grid}>
                        {filteredData.map((doc) => (
                            <div key={doc.id} className={styles.docCard}>
                                <div className={styles.docHeader}>
                                    <FileText size={20} />
                                    <span className={styles.docType}>{doc.type}</span>
                                    <span className={styles.docId}>#{doc.id}</span>
                                </div>
                                <div className={styles.docBody}>
                                    <p><strong>Событие:</strong> {doc.order?.ticket?.title || "Н/Д"}</p>
                                    <p><strong>Клиент:</strong> {doc.order?.user?.firstName} {doc.order?.user?.lastName}</p>
                                    <p><strong>Заказ:</strong> #{doc.order?.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "promotions" && (
                    <>
                        <div className={styles.createCard}>
                            <div className={styles.createHeader}>
                                <Plus size={20} />
                                <h2>Создать акцию</h2>
                            </div>
                            <div className={styles.createForm}>
                                <input
                                    placeholder="Название акции"
                                    value={promotionForm.title}
                                    onChange={(e) =>
                                        setPromotionForm({ ...promotionForm, title: e.target.value })
                                    }
                                />
                                <textarea
                                    placeholder="Описание"
                                    value={promotionForm.description}
                                    onChange={(e) =>
                                        setPromotionForm({ ...promotionForm, description: e.target.value })
                                    }
                                />
                                <input
                                    type="number"
                                    placeholder="Размер скидки (%)"
                                    value={promotionForm.discount}
                                    onChange={(e) =>
                                        setPromotionForm({ ...promotionForm, discount: e.target.value })
                                    }
                                />
                                <button onClick={createPromotion}>
                                    <Plus size={16} />
                                    Создать акцию
                                </button>
                            </div>
                        </div>

                        <div className={styles.grid}>
                            {filteredData.map((promotion) => (
                                <div key={promotion.id} className={styles.promoCard}>
                                    <div className={styles.promoIcon}>
                                        <BadgePercent size={28} />
                                        <span className={styles.promoDiscount}>{promotion.discount}%</span>
                                    </div>
                                    <div className={styles.promoBody}>
                                        {editingId === promotion.id ? (
                                            <div className={styles.editForm}>
                                                <input type="text" defaultValue={promotion.title} placeholder="Название" />
                                                <textarea defaultValue={promotion.description} placeholder="Описание" />
                                                <input type="number" defaultValue={promotion.discount} placeholder="Скидка" />
                                            </div>
                                        ) : (
                                            <>
                                                <h3>{promotion.title}</h3>
                                                <p>{promotion.description}</p>
                                                <span className={styles.promoPercent}>-{promotion.discount}%</span>
                                            </>
                                        )}
                                    </div>
                                    <div className={styles.cardActions}>
                                        {editingId === promotion.id ? (
                                            <>
                                                <button className={styles.saveBtn} onClick={() => setEditingId(null)}>
                                                    <Save size={16} />
                                                </button>
                                                <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className={styles.editBtn} onClick={() => setEditingId(promotion.id)}>
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={async () => {
                                                        await ownerApi.deletePromotion(promotion.id);
                                                        fetchAll();
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};