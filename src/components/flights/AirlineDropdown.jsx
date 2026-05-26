import { useAirlines } from '../../hooks/useAirlines';

export const AirlineDropdown = ({ value, onChange, required = true, className }) => {
  const { airlines, loading } = useAirlines();

  if (loading) return <select disabled className={className}><option>Loading...</option></select>;

  return (
    <select 
      name="airlineId" 
      value={value || ''} 
      onChange={onChange} 
      required={required}
      className={className}
    >
      <option value="">Select airline...</option>
      {airlines.map((a) => (
        <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
      ))}
    </select>
  );
};