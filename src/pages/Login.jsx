import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../store/AuthContext';
import { validateLogin, isValid } from '../utils/validation';
import styles from '../styles/Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation State
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

async function handleSubmit(e) {
  e.preventDefault();
  setAuthError('');
  
  const validationErrs = validateLogin(email, password);
  if (!isValid(validationErrs)) {
    setErrors(validationErrs);
    return;
  }

  // MUST await the login result
  const success = await login(email, password); 
  
  if (success) {
    navigate('/dashboard'); 
  } else {
    setAuthError('Invalid login credentials. Please try again.');
  }
}

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <Navbar />

      <div className={styles.body}>
        <div className={styles.card}>
          <button className={styles.closeBtn} onClick={() => navigate('/')}>✕</button>
          <h2 className={styles.title}>Login</h2>
          <p className={styles.subtitle}>Welcome back to SkyTraq</p>

          {authError && <div style={{ color: '#e74c3c', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', marginBottom: '14px' }}>{authError}</div>}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email:</label>
              <div className={styles.inputWrapper}>
                <span className={styles.icon}></span>
                <input
                  id="email" type="email" placeholder="your@email.com"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  style={errors.email ? { borderColor: '#e74c3c' } : {}}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})) }}
                />
              </div>
              {/* Inline Error Message */}
              {errors.email && <span style={{color: '#e74c3c', fontSize: '12px', marginTop: '4px', fontWeight: '600'}}>{errors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password:</label>
              <div className={styles.inputWrapper}>
                <span className={styles.icon}></span>
                <input
                  id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••••"
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  style={errors.password ? { borderColor: '#e74c3c' } : {}}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ''})) }}
                />
                <button type="button" className={styles.toggleBtn} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '' : ''}
                </button>
              </div>
              {/* Inline Error Message */}
              {errors.password && <span style={{color: '#e74c3c', fontSize: '12px', marginTop: '4px', fontWeight: '600'}}>{errors.password}</span>}
            </div>

            <button type="submit" className={styles.btnPrimary} style={{marginTop: '12px'}}>Login</button>
          </form>

          <div className={styles.footer}>
            Don't have an account? <Link to="/register" className={styles.link}>Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}