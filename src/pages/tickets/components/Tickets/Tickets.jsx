import styles from './Tickets.module.css';
import { ShowCard } from '@shared/ShowCard';

export const Tickets = ({
                          tickets,
                          loading,
                          page,
                          setPage,
                          limit,
                        }) => {
  const isEmpty = !loading && tickets.length === 0;

  return (
      <div className={styles.wrapper}>
        {loading ? (
            <div className={styles.state}>
              <span className={styles.spinner}></span>
              <span>Загрузка билетов...</span>
            </div>
        ) : isEmpty ? (
            <div className={styles.empty}>
              <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 6h18M9 10v4M15 10v4M5 6h14v12H5V6z" strokeLinecap="round"/>
                <path d="M3 6l3-4h12l3 4" strokeLinecap="round"/>
              </svg>
              <span>Билеты не найдены</span>
              <span className={styles.emptyHint}>Попробуйте изменить фильтры</span>
            </div>
        ) : (
            <>
              <div className={styles.grid}>
                {tickets.map((ticket) => (
                    <ShowCard
                        key={ticket.id}
                        id={ticket.id}
                        title={ticket.title}
                        image={ticket.posterUrl}
                        date={ticket.eventDate}
                        price={ticket.price}
                        quantity={ticket.quantity}
                    />
                ))}
              </div>

              <div className={styles.stats}>
                Показано <strong>{tickets.length}</strong> из{" "}
                <strong>{page * limit - (limit - tickets.length)}</strong>
              </div>
            </>
        )}

        <div className={styles.pagination}>
          <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
          >
            ← Назад
          </button>

          <div className={styles.pageInfo}>
            <span className={styles.pageCurrent}>{page}</span>
            <span className={styles.pageSeparator}>/</span>
            <span className={styles.pageTotal}>
            {tickets.length < limit ? page : page + 1}
          </span>
          </div>

          <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => p + 1)}
              disabled={tickets.length < limit}
          >
            Далее →
          </button>
        </div>
      </div>
  );
};