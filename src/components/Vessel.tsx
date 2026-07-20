interface VesselProps {
  percent: number; // 0-100
  color: string;
  label: string;
  value: string;
}

export default function Vessel({ percent, color, label, value }: VesselProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="vessel">
      <div className="vessel-glass">
        <div
          className="vessel-fill"
          style={{ height: `${clamped}%`, background: color }}
        />
        <div className="vessel-notch" style={{ bottom: '25%' }} />
        <div className="vessel-notch" style={{ bottom: '50%' }} />
        <div className="vessel-notch" style={{ bottom: '75%' }} />
      </div>
      <div className="vessel-readout">
        <span className="vessel-value">{value}</span>
        <span className="vessel-label">{label}</span>
      </div>
    </div>
  );
}
