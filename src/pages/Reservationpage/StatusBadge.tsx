// StatusBadge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { color: 'bg-green-500', text: '✓ Active' };
      case 'extended':
        return { color: 'bg-blue-500', text: '✓ Extended' };
      case 'cancelled':
        return { color: 'bg-red-500', text: '⊘ Cancelled' };
      case 'completed':
        return { color: 'bg-gray-500', text: '✓ Completed' };
      default:
        return { color: 'bg-blue-500', text: '◉ New' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`${config.color} text-white px-3 py-1 rounded text-xs font-semibold inline-flex items-center`}>
      {config.text}
    </span>
  );
};

export default StatusBadge