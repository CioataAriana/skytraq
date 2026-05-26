import { calcDuration } from '../../utils/formatters'
import { AirlineDropdown } from './AirlineDropdown'

export default function FlightForm({ values, errors, onChange, onSubmit, onCancel, submitLabel, styles }) {
  const duration = calcDuration(values.departureTime, values.arrivalTime)

  return (
    <form onSubmit={onSubmit} noValidate>
      
      {/* ── Flight Number & Date ── */}
      <div className={styles.row2}>
        <div className={styles.field}>
          <div className={styles.label}>Flight Number</div>
          <input
            className={`${styles.input} ${errors.flightNumber ? styles.inputError : ''}`}
            name="flightNumber" type="text"
            value={values.flightNumber || ''} onChange={onChange} placeholder="e.g. RO401"
            style={{ textTransform: 'uppercase' }}
          />
          <div className={styles.errorSpace}>{errors.flightNumber && <span className={styles.errorText} style={{color: '#e74c3c', fontSize: '11px', fontWeight: 'bold'}}>{errors.flightNumber}</span>}</div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>Date</div>
          <input
            className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
            name="date" type="date"
            value={values.date || ''} onChange={onChange}
          />
          <div className={styles.errorSpace}>{errors.date && <span className={styles.errorText} style={{color: '#e74c3c', fontSize: '11px', fontWeight: 'bold'}}>{errors.date}</span>}</div>
        </div>
      </div>

      {/* ── Airline & Aircraft ── */}
      <div className={styles.row2}>
        <div className={styles.field}>
          <div className={styles.label}>Airline</div>
          
          {/* ✨ CLEAN: Using your reusable component */}
          <AirlineDropdown 
            value={values.airlineId || ''} 
            onChange={onChange}
            className={`${styles.input || styles.select} ${errors.airlineId ? styles.inputError : ''}`}
          />
          
          <div className={styles.errorSpace}>{errors.airlineId && <span className={styles.errorText} style={{color: '#e74c3c', fontSize: '11px', fontWeight: 'bold'}}>{errors.airlineId}</span>}</div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>Aircraft</div>
          <div className={styles.inputWrap}>
            <input
              className={styles.input}
              name="aircraft" type="text"
              value={values.aircraft || ''} onChange={onChange}
              placeholder="YR-ABC (A320)"
            />
          </div>
          <div className={styles.errorSpace}></div>
        </div>
      </div>

      {/* ── Departure & Arrival ── */}
      <div className={styles.row2}>
        <div className={styles.field}>
          <div className={styles.label}>Departure</div>
          <div className={styles.splitInputWrap}>
            <input
              className={`${styles.input} ${errors.origin ? styles.inputError : ''}`}
              name="origin" type="text" maxLength={4}
              value={values.origin || ''} onChange={onChange} placeholder="LROP"
            />
            <input
              className={`${styles.input} ${errors.departureTime ? styles.inputError : ''}`}
              name="departureTime" type="time"
              value={values.departureTime || ''} onChange={onChange}
            />
          </div>
          <div className={styles.splitErrorWrap} style={{ display: 'flex', gap: '8px' }}>
            <div style={{flex: 1}}>{errors.origin && <span className={styles.errorText} style={{color: '#e74c3c', fontSize: '11px', fontWeight: 'bold'}}>{errors.origin}</span>}</div>
            <div style={{flex: 1}}>{errors.departureTime && <span className={styles.errorText} style={{color: '#e74c3c', fontSize: '11px', fontWeight: 'bold'}}>{errors.departureTime}</span>}</div>
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>Arrival</div>
          <div className={styles.splitInputWrap}>
            <input
              className={`${styles.input} ${errors.destination ? styles.inputError : ''}`}
              name="destination" type="text" maxLength={4}
              value={values.destination || ''} onChange={onChange} placeholder="EVRA"
            />
            <input
              className={`${styles.input} ${errors.arrivalTime ? styles.inputError : ''}`}
              name="arrivalTime" type="time"
              value={values.arrivalTime || ''} onChange={onChange}
            />
          </div>
          <div className={styles.splitErrorWrap} style={{ display: 'flex', gap: '8px' }}>
            <div style={{flex: 1}}>{errors.destination && <span className={styles.errorText} style={{color: '#e74c3c', fontSize: '11px', fontWeight: 'bold'}}>{errors.destination}</span>}</div>
            <div style={{flex: 1}}>{errors.arrivalTime && <span className={styles.errorText} style={{color: '#e74c3c', fontSize: '11px', fontWeight: 'bold'}}>{errors.arrivalTime}</span>}</div>
          </div>
        </div>
      </div>

      {/* ── Takeoff & Landing Panels ── */}
      <div className={styles.twoBoxRow}>
        <div className={styles.dataBox}>
          <div className={styles.dataBoxTitle}>TAKEOFF</div>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>Day/Night</span>
            <select className={styles.dataSelect} name="takeoffDayNight" value={values.takeoffDayNight || 'Day'} onChange={onChange}>
              <option value="Day">Day</option>
              <option value="Night">Night</option>
            </select>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>Fuel(kg)</span>
            <input className={styles.dataInput} name="takeoffFuel" value={values.takeoffFuel || ''} onChange={onChange}  />
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>Weight(kg)</span>
            <input className={styles.dataInput} name="takeoffWeight" value={values.takeoffWeight || ''} onChange={onChange}  />
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>Perform</span>
            <select className={styles.dataSelect} name="takeoffPerform" value={values.takeoffPerform || 'Normal'} onChange={onChange}>
              <option value="Normal">Normal</option>
              <option value="Reduced">Reduced</option>
              <option value="Full">Full</option>
            </select>
          </div>
        </div>

        <div className={styles.dataBox}>
          <div className={styles.dataBoxTitle}>LANDING</div>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>Day/Night</span>
            <select className={styles.dataSelect} name="landingDayNight" value={values.landingDayNight || 'Day'} onChange={onChange}>
              <option value="Day">Day</option>
              <option value="Night">Night</option>
            </select>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>Fuel(kg)</span>
            <input className={styles.dataInput} name="landingFuel" value={values.landingFuel || ''} onChange={onChange}  />
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>Weight(kg)</span>
            <input className={styles.dataInput} name="landingWeight" value={values.landingWeight || ''} onChange={onChange} />
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>Perform</span>
            <select className={styles.dataSelect} name="landingPerform" value={values.landingPerform || 'Normal'} onChange={onChange}>
              <option value="Normal">Normal</option>
              <option value="Reduced">Reduced</option>
              <option value="Full">Full</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Flt Time, Role, Status & Notes ── */}
      <div className={styles.roleNotesRow}>
        <div className={styles.leftCol || styles.field}>
          
          <div className={styles.field} style={{ marginBottom: '14px' }}>
            <div className={styles.label}>Flt Time</div>
            <input
              className={`${styles.input} ${styles.inputReadonly}`}
              type="text" value={duration} readOnly placeholder="00:00"
            />
          </div>

          <div className={styles.field} style={{ marginBottom: '14px' }}>
            <div className={styles.label}>Role</div>
            <select className={styles.input || styles.select} name="role" value={values.role || 'PIC'} onChange={onChange}>
              <option value="PIC">PIC</option>
              <option value="Co-Plt">Co-Plt</option>
              <option value="Instr">Instr</option>
            </select>
          </div>
          
          <div className={styles.field}>
            <div className={styles.label}>Status</div>
            <select className={styles.input || styles.select} name="status" value={values.status || 'completed'} onChange={onChange}>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className={styles.rightCol || styles.field}>
          <div className={styles.field} style={{ height: '100%' }}>
            <div className={styles.label}>Notes:</div>
            <div className={styles.inputWrap} style={{height: '100%'}}>
              <textarea
                className={styles.textarea}
                name="notes"
                value={values.notes || ''}
                onChange={onChange}
                placeholder="Route optimized for wind..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <button type="button" className={styles.btnCancel} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.btnSave}>
          {submitLabel || 'Save'}
        </button>
      </div>
    </form>
  )
}