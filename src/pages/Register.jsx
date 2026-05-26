import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../store/AuthContext';
import { validateRegistration, isValid } from '../utils/validation';
import styles from '../styles/Register.module.css';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [values, setValues] = useState({ fullName: '', email: '', password: '', license: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: '' })); // Clear error as user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    const validationErrs = validateRegistration(values);
    if (!isValid(validationErrs)) {
      setErrors(validationErrs);
      return;
    }
    setErrors({});

    const success = register(values.email, values.password, values.fullName, values.license);
    if (success) {
      navigate('/dashboard'); 
    } else {
      setAuthError('Registration failed. Please try again.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <Navbar />

      <div className={styles.body}>
        <div className={styles.card}>
          <button className={styles.closeBtn} onClick={() => navigate('/')}>✕</button>
          <h2 className={styles.title}>Register</h2>
          <p className={styles.subtitle}>Join SkyTraq and start logging</p>

          {authError && <div style={{ color: '#e74c3c', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', marginBottom: '14px' }}>{authError}</div>}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Full Name:</label>
              <div className={styles.inputWrapper}>
                <span className={styles.icon}>👤</span>
                <input
                  name="fullName" type="text" placeholder="Bruce Wayne"
                  className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                  style={errors.fullName ? { borderColor: '#e74c3c' } : {}}
                  value={values.fullName} onChange={handleChange}
                />
              </div>
              {errors.fullName && <span style={{color: '#e74c3c', fontSize: '12px', marginTop: '4px', fontWeight: '600'}}>{errors.fullName}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email:</label>
              <div className={styles.inputWrapper}>
                <span className={styles.icon}>✉️</span>
                <input
                  name="email" type="email" placeholder="your@email.com"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  style={errors.email ? { borderColor: '#e74c3c' } : {}}
                  value={values.email} onChange={handleChange}
                />
              </div>
              {errors.email && <span style={{color: '#e74c3c', fontSize: '12px', marginTop: '4px', fontWeight: '600'}}>{errors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password:</label>
              <div className={styles.inputWrapper}>
                <span className={styles.icon}>🔒</span>
                <input
                  name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••••"
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  style={errors.password ? { borderColor: '#e74c3c' } : {}}
                  value={values.password} onChange={handleChange}
                />
                <button type="button" className={styles.toggleBtn} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span style={{color: '#e74c3c', fontSize: '12px', marginTop: '4px', fontWeight: '600'}}>{errors.password}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Pilot License (Optional):</label>
              <div className={styles.inputWrapper}>
                <span className={styles.icon}>🪪</span>
                <input
                  name="license" type="text" placeholder="RO.FCL.006299"
                  className={`${styles.input} ${errors.license ? styles.inputError : ''}`}
                  style={errors.license ? { borderColor: '#e74c3c' } : {}}
                  value={values.license} onChange={handleChange}
                />
              </div>
              {errors.license && <span style={{color: '#e74c3c', fontSize: '12px', marginTop: '4px', fontWeight: '600'}}>{errors.license}</span>}
            </div>

            <button type="submit" className={styles.btnPrimary} style={{marginTop: '12px'}}>Register</button>
          </form>

          <div className={styles.footer}>
            Already have an account? <Link to="/login" className={styles.link}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}