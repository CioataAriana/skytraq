import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import Navbar from '../components/common/Navbar'
import styles from '../styles/Landing.module.css'

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/register')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <Navbar />

      <main className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.logoWrap}>
            <img src="/logo.png" alt="SkyTraq" className={styles.heroLogo} />
          </div>

          <h1 className={styles.tagline}>
            Track every flight. <br /> Fly smarter
          </h1>

          <p className={styles.description}>
            SkyTraq is a digital pilot logbook that allows
            pilots to record and manage their flights.
          </p>

          <button className={styles.ctaBtn} onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </main>
    </div>
  )
}