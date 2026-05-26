import styles from '../../styles/Dashboard.module.css'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const justDate = dateStr.split('T')[0] 
  const [y, m, d] = justDate.split('-')
  return `${d}.${m}.${y}`
}

function calcDuration(dep, arr) {
  if (!dep || !arr) return '—'
  const [dh, dm] = dep.split(':').map(Number)
  const [ah, am] = arr.split(':').map(Number)
  let total = ah * 60 + am - (dh * 60 + dm)
  
  if (total < 0) total += 1440; // Reparația pentru noapte
  
  if (total <= 0) return '—'
  return `${String(Math.floor(total / 60)).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`
}

export default function FlightRow({ flight, onView, onEdit, onDelete }) {
  return (
    <tr>
      <td>{formatDate(flight.date)}</td>
      {/* ✨ FIXED: Safely reads the airline object's name from Prisma */}
      <td>{flight.airline?.name || '—'}</td>
      <td>{flight.origin} → {flight.destination}</td>
      <td>{calcDuration(flight.departureTime, flight.arrivalTime)}</td>
      <td>{flight.role}</td>
      
      <td>
        <span className={`${styles.statusBadge} ${styles[flight.status]}`}>
          {flight.status}
        </span>
      </td>

      <td>
        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            title="View details"
            onClick={() => onView(flight.id)}
          >
            👁
          </button>
          <button
            className={styles.iconBtn}
            title="Edit"
            onClick={() => onEdit(flight.id)}
          >
            ✏️
          </button>
          <button
            className={`${styles.iconBtn} ${styles.deleteIcon}`}
            title="Delete Flight"
            onClick={() => onDelete(flight.id)} 
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  )
}