import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import FlightForm from '../components/flights/FlightForm'
import { useFlights } from '../hooks/useFlights'
import { validateFlight, isValid } from '../utils/validation'
import styles from '../styles/EditFlight.module.css' 
import dashStyles from '../styles/Dashboard.module.css'

export default function EditFlight() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { fetchFlightById, updateFlight } = useFlights()

  const [values, setValues] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)

  const fromPath = location.state?.from || '/dashboard'

  useEffect(() => {
    let isMounted = true; 

    async function loadData() {
      try {
        const flightData = await fetchFlightById(id);
        
        console.log("RAW DATA FROM BACKEND:", flightData);
        if (isMounted) {
          if (flightData.date && flightData.date.includes('T')) {
            flightData.date = flightData.date.split('T')[0];
          }

          const sanitizedData = {};
          for (const key in flightData) {
            sanitizedData[key] = flightData[key] === null ? '' : flightData[key];
          }

          setValues(sanitizedData);
          setLoading(false);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    }

    loadData();

    return () => { isMounted = false; };
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target
    const normalizedValue = (['origin', 'destination', 'flightNumber'].includes(name)) 
      ? value.toUpperCase() 
      : value;
    
    setValues(prev => ({ ...prev, [name]: normalizedValue }))
    setErrors(prev => ({ ...prev, [name]: '' })) 
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrs = validateFlight(values)
    
    if (!isValid(validationErrs)) { 
      setErrors(validationErrs); 
      return; 
    }

    try {
      await updateFlight(id, values); 
      navigate(fromPath); 
    } catch (err) {
      alert("Failed to save changes. Check server logs.");
      console.error(err);
    }
  }

  if (loading || !values) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>

  return (
    <div className={dashStyles.page}>
      <div className={dashStyles.bg} />
      <Navbar />

      <div className={dashStyles.body} style={{ filter: 'blur(4px)', pointerEvents: 'none' }}>
        <div className={dashStyles.card} style={{ minHeight: '600px' }}>
          <div className={dashStyles.header}>
            <div className={dashStyles.title}>Logbook</div>
          </div>
          <div className={dashStyles.tableWrap} style={{ height: '300px', background: '#f4f3f0' }} />
        </div>
      </div>

      <div className={styles.overlay}>
        <div className={styles.modal}>
          <button className={styles.closeBtn} onClick={() => navigate(fromPath)}>✕</button>

          <div className={styles.modalContent}>
            <div className={styles.headerTitle} style={{ marginBottom: '24px' }}>
              <div className={styles.title} style={{ fontSize: '16px', fontWeight: '700' }}>Edit Flight Entry</div>
            </div>

            <FlightForm 
              values={values} 
              errors={errors}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={() => navigate(fromPath)}
              submitLabel="Save Changes"
              styles={styles} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}