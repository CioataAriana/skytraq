export function formatTimeInput(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}:${digits.slice(2)}`
}

export function isValidTime(value) {
  if (!/^\d{2}:\d{2}$/.test(value)) return false
  const [h, m] = value.split(':').map(Number)
  return h >= 0 && h <= 23 && m >= 0 && m <= 59
}


export function calcDuration(dep, arr) {
  if (!dep || !arr) return '—';
  
  const [dh, dm] = dep.split(':').map(Number);
  const [ah, am] = arr.split(':').map(Number);
  
  let totalMinutes = (ah * 60 + am) - (dh * 60 + dm);
  
  if (totalMinutes < 0) {
    totalMinutes += 1440;
  }
  
  if (totalMinutes === 0) return '—';

  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}