import { createContext, useContext, useReducer } from 'react'
import { createFlight } from '../utils/flightSchema'

const FlightContext = createContext(null)

const SAMPLE_FLIGHTS = [
  createFlight({ flightNumber: 'RO401', origin: 'LROP', destination: 'EVRA', date: '2026-03-12', departureTime: '07:00', arrivalTime: '09:30', airline: 'TAROM',    role: 'Co-Plt', status: 'completed', aircraft: 'YR-ABC (A320)', takeoffDayNight: 'Day', takeoffFuel: '18.400kg', takeoffWeight: '195.000kg', takeoffPerform: 'Normal', landingDayNight: 'Day', landingFuel: '9.400kg', landingWeight: '120.000kg', landingPerform: 'Normal', notes: 'Route optimized for wind. Smooth flight, approach on track.' }),
  createFlight({ flightNumber: 'RO402', origin: 'EVRA', destination: 'LROP', date: '2026-03-12', departureTime: '11:00', arrivalTime: '13:45', airline: 'TAROM',    role: 'Co-Plt', status: 'completed', aircraft: 'YR-ABC (A320)', takeoffDayNight: 'Day', takeoffFuel: '16.000kg', takeoffWeight: '188.000kg', takeoffPerform: 'Normal', landingDayNight: 'Day', landingFuel: '8.200kg', landingWeight: '115.000kg', landingPerform: 'Normal', notes: '' }),
  createFlight({ flightNumber: 'RO501', origin: 'LROP', destination: 'LIRA', date: '2026-03-13', departureTime: '08:00', arrivalTime: '10:50', airline: 'TAROM',    role: 'PIC',    status: 'completed', aircraft: 'YR-BCD (B737)', takeoffDayNight: 'Day', takeoffFuel: '17.500kg', takeoffWeight: '190.000kg', takeoffPerform: 'Normal', landingDayNight: 'Day', landingFuel: '9.100kg', landingWeight: '118.000kg', landingPerform: 'Normal', notes: '' }),
  createFlight({ flightNumber: 'RO502', origin: 'LIRA', destination: 'LROP', date: '2026-03-13', departureTime: '12:00', arrivalTime: '15:15', airline: 'TAROM',    role: 'PIC',    status: 'completed', aircraft: 'YR-BCD (B737)', takeoffDayNight: 'Day', takeoffFuel: '16.800kg', takeoffWeight: '185.000kg', takeoffPerform: 'Normal', landingDayNight: 'Day', landingFuel: '7.900kg', landingWeight: '112.000kg', landingPerform: 'Normal', notes: '' }),
  createFlight({ flightNumber: 'RO601', origin: 'LRCL', destination: 'OPPO', date: '2026-03-14', departureTime: '09:00', arrivalTime: '12:30', airline: 'Wizz Air', role: 'PIC',    status: 'completed', aircraft: 'HA-LWG (A321)', takeoffDayNight: 'Day', takeoffFuel: '19.200kg', takeoffWeight: '200.000kg', takeoffPerform: 'Normal', landingDayNight: 'Day', landingFuel: '10.100kg', landingWeight: '125.000kg', landingPerform: 'Normal', notes: '' }),
  createFlight({ flightNumber: 'RO602', origin: 'OPPO', destination: 'LRCL', date: '2026-03-14', departureTime: '14:00', arrivalTime: '18:00', airline: 'Wizz Air', role: 'PIC',    status: 'completed', aircraft: 'HA-LWG (A321)', takeoffDayNight: 'Day', takeoffFuel: '18.000kg', takeoffWeight: '196.000kg', takeoffPerform: 'Normal', landingDayNight: 'Day', landingFuel: '8.800kg', landingWeight: '119.000kg', landingPerform: 'Normal', notes: '' }),
  createFlight({ flightNumber: 'RO701', origin: 'LRTM', destination: 'EKCH', date: '2026-03-16', departureTime: '06:00', arrivalTime: '07:42', airline: 'Ryanair',  role: 'Co-Plt', status: 'completed', aircraft: 'EI-DCL (B737)', takeoffDayNight: 'Night', takeoffFuel: '15.200kg', takeoffWeight: '182.000kg', takeoffPerform: 'Normal', landingDayNight: 'Day', landingFuel: '7.500kg', landingWeight: '110.000kg', landingPerform: 'Normal', notes: '' }),
  createFlight({ flightNumber: 'RO702', origin: 'EKCH', destination: 'LRTM', date: '2026-03-16', departureTime: '10:00', arrivalTime: '12:12', airline: 'Ryanair',  role: 'Co-Plt', status: 'completed', aircraft: 'EI-DCL (B737)', takeoffDayNight: 'Day', takeoffFuel: '14.800kg', takeoffWeight: '179.000kg', takeoffPerform: 'Normal', landingDayNight: 'Day', landingFuel: '7.200kg', landingWeight: '108.000kg', landingPerform: 'Normal', notes: '' }),
  createFlight({ flightNumber: 'RO801', origin: 'LROP', destination: 'EGLL', date: '2026-03-18', departureTime: '08:00', arrivalTime: '10:30', airline: 'TAROM',    role: 'PIC',    status: 'scheduled', aircraft: 'YR-ABC (A320)', takeoffDayNight: 'Day', takeoffFuel: '', takeoffWeight: '', takeoffPerform: 'Normal', landingDayNight: 'Day', landingFuel: '', landingWeight: '', landingPerform: 'Normal', notes: '' }),
  createFlight({ flightNumber: 'RO802', origin: 'EGLL', destination: 'LROP', date: '2026-03-18', departureTime: '14:00', arrivalTime: '18:00', airline: 'TAROM',    role: 'PIC',    status: 'scheduled', aircraft: 'YR-ABC (A320)', takeoffDayNight: 'Day', takeoffFuel: '', takeoffWeight: '', takeoffPerform: 'Normal', landingDayNight: 'Day', landingFuel: '', landingWeight: '', landingPerform: 'Normal', notes: '' }),
]

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':    return [...state, createFlight(action.payload)]
    case 'UPDATE': return state.map(f => f.id === action.payload.id ? { ...f, ...action.payload } : f)
    case 'DELETE': return state.filter(f => f.id !== action.payload)
    default:       return state
  }
}

export function FlightProvider({ children }) {
  const [flights, dispatch] = useReducer(reducer, SAMPLE_FLIGHTS)
  return (
    <FlightContext.Provider value={{ flights, dispatch }}>
      {children}
    </FlightContext.Provider>
  )
}

export function useFlightContext() {
  return useContext(FlightContext)
}