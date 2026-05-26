import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import FlightTable from '../components/flights/FlightTable';
import { useFlights } from '../hooks/useFlights';
import { useAuth } from '../store/AuthContext'; 
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user } = useAuth(); 
  const { fetchFlights, deleteFlight, fetchStats } = useFlights();

  const [flights, setFlights] = useState([]);
  const [stats, setStats] = useState({ totalFlightHours: 0, totalFlightMinutes: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const isDeletingRef = useRef(false);

  useEffect(() => {
    //  Wait until we have a real User ID
    const actualUserId = user?.id || user?.user?.id;
    if (!actualUserId) {
      return; 
    }

    async function loadData() {
      setLoading(true);
      try {
        const flightData = await fetchFlights(page, 8);
        setFlights(flightData.data || []);
        setTotalPages(flightData.totalPages || 1);

        const statsData = await fetchStats();
        setStats(statsData || { totalFlightHours: 0, totalFlightMinutes: 0 });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false); // ✨ Turns off the loading screen
      }
    }
    
    loadData();
  
  }, [page, location.key, user]); // Listens for page, url, and user changes!

  async function handleDelete(id) {
    if (isDeletingRef.current) return; 
    isDeletingRef.current = true; 

    setTimeout(async () => {
      if (window.confirm("Delete this flight?")) {
        try {
          await deleteFlight(id);
          const flightData = await fetchFlights(page, 8);
          setFlights(flightData.data || []);
          setTotalPages(flightData.totalPages || 1);
          
          const statsData = await fetchStats();
          setStats(statsData || { totalFlightHours: 0, totalFlightMinutes: 0 });
        } catch (err) {
          console.error("Delete failed", err);
        }
      }
      isDeletingRef.current = false; 
    }, 10); 
  }

  function pageNumbers() {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <Navbar />

      <div className={styles.body}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.title}>Logbook</div>
            <button className={styles.btnAdd} onClick={() => navigate('/flights/add')}>+ Add Flight</button>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
          ) : (
            <FlightTable
              flights={flights}
              onView={id => navigate(`/flights/${id}`)}
              onEdit={id => navigate(`/flights/${id}/edit`, { state: { from: '/dashboard' } })}
              onDelete={handleDelete}
            />
          )}

          <div className={styles.footer}>
            <div className={styles.pagination}>
              <button className={styles.pageNav} onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
              {pageNumbers().map((n, i) =>
                n === '...' ? <span key={`dot-${i}`} className={styles.pageDots}>...</span> : (
                  <button key={n} className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ''}`} onClick={() => setPage(n)}>{n}</button>
                )
              )}
              <button className={styles.pageNav} onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
            </div>

            <div className={styles.totalHrs}>
              <div className={styles.totalHrsContent}>
                <span className={styles.totalHrsTime}>
                  {String(stats?.totalFlightHours ?? 0).padStart(2, '0')}:{String(stats?.totalFlightMinutes ?? 0).padStart(2, '0')}            
               </span>
                <span className={styles.totalHrsLabel}>Total flight hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}