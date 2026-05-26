import FlightRow from './FlightRow'
import styles from '../../styles/Dashboard.module.css'

export default function FlightTable({ flights, onView, onEdit, onDelete }) {
  return (
    <div className={styles.tableWrap} style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Airline</th>
            <th>Route</th>
            <th>Duration</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>✈</div>
                  <div className={styles.emptyTitle}>No flights yet</div>
                  <div className={styles.emptyText}>
                    Add your first flight to get started.
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            flights.map(f => (
              <FlightRow
                key={f.id}
                flight={f}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}