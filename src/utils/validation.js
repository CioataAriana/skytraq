// ── FLIGHT VALIDATION ──
export function validateFlight(data) {
  const errors = {}

  if (!data.flightNumber?.trim())
    errors.flightNumber = 'Flight number is required'
  else if (!/^[A-Z0-9]{2,8}$/.test(data.flightNumber.trim()))
    errors.flightNumber = 'Must be 2–8 uppercase letters/digits (e.g. RO401)'

  if (!data.origin?.trim())      errors.origin = 'Origin is required'
  if (!data.destination?.trim()) errors.destination = 'Destination is required'
  if (data.origin === data.destination && data.origin)
    errors.destination = 'Origin and destination must differ'

  if (!data.date) errors.date = 'Date is required'

  if (!data.departureTime) errors.departureTime = 'Departure time is required'
  if (!data.arrivalTime)   errors.arrivalTime = 'Arrival time is required'
  if (data.departureTime && data.arrivalTime && data.departureTime >= data.arrivalTime)
    errors.arrivalTime = 'Arrival must be after departure'

  // ✨ FIXED: Changed data.airline to data.airlineId
  if (!data.airlineId?.trim()) errors.airlineId = 'Airline is required'

  const validStatuses = ['scheduled', 'completed', 'cancelled']
  if (!validStatuses.includes(data.status))
    errors.status = 'Invalid status'

  return errors
}

// ── LOGIN VALIDATION ──
export function validateLogin(email, password) {
  const errors = {}
  
  if (!email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Invalid email format'
  }

  if (!password) {
    errors.password = 'Password is required'
  }

  return errors
}

// ── REGISTRATION VALIDATION ──
export function validateRegistration(data) {
  const errors = {}
  
  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required'
  } else if (data.fullName.trim().length < 3) {
    errors.fullName = 'Name must be at least 3 characters'
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format'
  }

  if (!data.password) {
    errors.password = 'Password is required'
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (data.license && !/^[A-Z]{2}\.FCL\.\d+$/i.test(data.license.trim())) {
    errors.license = 'Invalid format (e.g. RO.FCL.006299)'
  }

  return errors
}

export function isValid(errors) {
  return Object.keys(errors).length === 0
}