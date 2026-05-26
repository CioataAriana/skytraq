import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useFlights } from '../hooks/useFlights';
import styles from '../styles/FlightDetail.module.css';

export default function FlightDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  // 1. Ensure you pull the ASYNC version from your hook
  const { fetchFlightById, deleteFlight } = useFlights();

  // 2. Add loading and state management
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. Asynchronously fetch the data
useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchFlightById(id);
        setFlight(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load flight:", err);
        navigate('/dashboard');
      }
    }
    loadData();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // <--- ONLY include 'id' here.

  // 4. Show a loading screen so it doesn't try to render null
  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading flight details...</div>;
  if (!flight) return null;

  function handleDelete() {
    if (window.confirm(`Are you sure you want to delete this flight?`)) {
      deleteFlight(flight.id);
      navigate('/dashboard');
    }
  }

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    // ✨ FIX: Chop off the time payload at the 'T' before splitting the date!
    const justDate = dateStr.split('T')[0]; 
    const [y, m, d] = justDate.split('-');
    return `${d}.${m}.${y}`;
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <Navbar />

      <div className={styles.body}>
        <div className={styles.card}>
          <div className={styles.headerWrap}>
            <div>
              <h1 className={styles.pageTitle}>Flight Details</h1>
              <div className={styles.pageDate}>{formatDate(flight.date)}</div>
            </div>
            <div className={`${styles.statusBadge} ${styles[flight.status?.toLowerCase()] || styles.scheduled}`}>
              {flight.status}
            </div>
          </div>
          
          {/* ... The rest of your JSX template remains exactly the same ... */}
          <div className={styles.topSection}>
            {/* Takeoff Box */}
            <div className={styles.dataBox}>
              <div className={styles.dataBoxTitle}>TAKEOFF</div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Day/Night</span>
                <span className={styles.dataValue}>{flight.takeoffDayNight || 'Day'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Fuel</span>
                <span className={styles.dataValue}>{flight.takeoffFuel || '—'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Weight</span>
                <span className={styles.dataValue}>{flight.takeoffWeight || '—'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Perform</span>
                <span className={styles.dataValue}>{flight.takeoffPerform || 'Normal'}</span>
              </div>
            </div>

            {/* Landing Box */}
            <div className={styles.dataBox}>
              <div className={styles.dataBoxTitle}>LANDING</div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Day/Night</span>
                <span className={styles.dataValue}>{flight.landingDayNight || 'Day'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Fuel</span>
                <span className={styles.dataValue}>{flight.landingFuel || '—'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Weight</span>
                <span className={styles.dataValue}>{flight.landingWeight || '—'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Perform</span>
                <span className={styles.dataValue}>{flight.landingPerform || 'Normal'}</span>
              </div>
            </div>

             {/* Info Grid Box */}
             <div className={styles.infoBox}>
              <div className={styles.infoGrid}>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>DEPARTURE</span>
                  <span className={styles.infoValue}>{flight.origin} ({flight.departureTime})</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>ARRIVAL</span>
                  <span className={styles.infoValue}>{flight.destination} ({flight.arrivalTime})</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>AIRLINE</span>
                  <span className={styles.infoValue}>{flight.airline?.name || '—'}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>AIRCRAFT</span>
                  <span className={styles.infoValue}>{flight.aircraft || '—'}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>ROLE</span>
                  <span className={styles.infoValue}>{flight.role || '—'}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>STATUS</span>
                  <span className={styles.infoValue} style={{textTransform: 'capitalize'}}>{flight.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.notesSection}>
            <div className={styles.dataLabel} style={{marginBottom: '8px', display: 'block'}}>Notes:</div>
            <div className={styles.notesBox}>{flight.notes || "No notes available."}</div>
          </div>

          <div className={styles.actions}>
            <button className={styles.btnEdit} onClick={() => navigate(`/flights/${id}/edit`)}>Edit</button>
            <button className={styles.btnDelete} onClick={handleDelete}>Delete</button>
            <button className={styles.btnBack} onClick={() => navigate('/dashboard')}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}