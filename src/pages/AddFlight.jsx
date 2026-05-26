import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import FlightForm from '../components/flights/FlightForm'
import { useFlights } from '../hooks/useFlights'
import { validateFlight, isValid } from '../utils/validation'
import styles from '../styles/AddFlight.module.css'
import dashStyles from '../styles/Dashboard.module.css'

const EMPTY = {
  flightNumber: '', 
  date: '', origin: '', destination: '',
  departureTime: '', arrivalTime: '', 
  airlineId: '', 
  aircraft: '',
  role: 'PIC', status: 'completed',
  takeoffDayNight: 'Day', takeoffFuel: '', takeoffWeight: '', takeoffPerform: 'Normal',
  landingDayNight: 'Day', landingFuel: '', landingWeight: '', landingPerform: 'Normal',
  notes: '',
}

export default function AddFlight() {
  const navigate = useNavigate()
  const { addFlight } = useFlights()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    const normalizedValue = (name === 'origin' || name === 'destination' || name === 'flightNumber') 
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

    // Safely extract the ID from Local Storage
    const storedData = JSON.parse(localStorage.getItem('user'));
    const dynamicUserId = storedData?.user?.id || storedData?.id;

    if (!dynamicUserId) {
      alert("Error: No user logged in! Please log in again.");
      return;
    }

    const fixedData = {
      ...values,
      userId: dynamicUserId, 
      // Sent exactly as strings to keep backend Zod validation happy!
      takeoffFuel: values.takeoffFuel,
      takeoffWeight: values.takeoffWeight,
      landingFuel: values.landingFuel,
      landingWeight: values.landingWeight,
    };
    
    try {
      await addFlight(fixedData);
      navigate('/dashboard');
    } catch (err) {
      console.error("Failed to save flight:", err);
      alert("Failed to save flight. Check the console for details.");
    }
  }

  return (
    <div className={dashStyles.page}>
      <div className={dashStyles.bg} />
      <Navbar />

      <div className={dashStyles.body} style={{ filter: 'blur(4px)', pointerEvents: 'none' }}>
        <div className={dashStyles.card} style={{ minHeight: '600px' }}>
          <div className={dashStyles.header}>
            <div className={dashStyles.title}>Logbook</div>
          </div>
          <div className={dashStyles.tableWrap} style={{ height: '300px', background: '#f4f3f0' }}>
            <div style={{ height: '52px', background: '#7a9ccb' }} />
          </div>
        </div>
      </div>

      <div className={styles.overlay}>
        <div className={styles.modal}>
          <button className={styles.closeBtn} onClick={() => navigate('/dashboard')}>✕</button>

          <div className={styles.modalContent}>
            <div className={styles.headerTitle} style={{ marginBottom: '24px' }}>
              <div className={styles.title} style={{ fontSize: '16px', fontWeight: '700' }}>New Flight Entry</div>
            </div>

            <FlightForm 
              values={values}
              errors={errors}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/dashboard')}
              submitLabel="Save Flight"
              styles={styles} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}