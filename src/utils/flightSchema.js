// ✨ Safe ID Generator: Uses crypto if available, otherwise falls back to a math generator
const generateSafeId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // The fallback for when you are on an IP address (HTTP)
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export function createFlight(data) {
  return {
    id:                  generateSafeId(), 
    flightNumber:        data.flightNumber        ?? '',
    origin:              data.origin              ?? '',
    destination:         data.destination         ?? '',
    date:                data.date                ?? '',
    departureTime:       data.departureTime       ?? '',
    arrivalTime:         data.arrivalTime         ?? '',
    airline:             data.airline             ?? '',
    role:                data.role                ?? 'PIC',
    status:              data.status              ?? 'scheduled',
    aircraft:            data.aircraft            ?? '',
    takeoffDayNight:     data.takeoffDayNight     ?? 'Day',
    takeoffFuel:         data.takeoffFuel         ?? '',
    takeoffWeight:       data.takeoffWeight       ?? '',
    takeoffPerform:      data.takeoffPerform      ?? 'Normal',
    landingDayNight:     data.landingDayNight     ?? 'Day',
    landingFuel:         data.landingFuel         ?? '',
    landingWeight:       data.landingWeight       ?? '',
    landingPerform:      data.landingPerform      ?? 'Normal',
    notes:               data.notes               ?? '',
    createdAt:           new Date().toISOString(),
  }
}