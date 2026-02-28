const labelMap = {
  pending: 'Pending',
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  delivered: 'Delivered',
};

const StatusBadge = ({ status }) => {
  const label = labelMap[status] || status;

  return (
    <span
      className={`status-badge status-badge--${status || 'default'}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;

