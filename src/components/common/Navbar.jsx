import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import styles from '../../styles/Navbar.module.css'

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/')
  }

  function active(path) {
    return location.pathname.startsWith(path) ? styles.linkActive : ''
  }

  return (
    <nav className={styles.nav}>

      {/* Brand / Logo */}
      <button className={styles.brand} onClick={() => navigate('/')}>
        <img src="/logo.png" alt="SkyTraq" className={styles.brandLogo} />
      </button>

      {/* Center nav links */}
      <div className={styles.links}>
        <button
          className={`${styles.link} ${location.pathname === '/' ? styles.linkActive : ''}`}
          onClick={() => navigate('/')}
        >
          Home Page
        </button>
        <div className={styles.divider} />
        <button
          className={`${styles.link} ${active('/dashboard') || active('/flights') ? styles.linkActive : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          Logbook
        </button>
      </div>

      {/* Right side: User info & Auth button */}
      <div className={styles.right}>
        {user && <span className={styles.user}>Hi, {user.name}</span>}
        
        {user ? (
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <button className={styles.logoutBtn} onClick={() => navigate('/login')}>
            Log in
          </button>
        )}
        <div className={styles.avatar}>👤</div>
      </div>

    </nav>
  )
}