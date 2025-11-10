/**
 * TransactionCard Component - Corona Style
 * Transaction history item with date, type, amount, and status
 */

interface TransactionCardProps {
  date: string;
  type: string;
  amount: string;
  status: 'completed' | 'pending' | 'rejected';
  onClick?: () => void;
}

export default function TransactionCard({ 
  date, 
  type, 
  amount, 
  status,
  onClick 
}: TransactionCardProps) {
  const statusConfig = {
    completed: {
      bg: 'bg-status-success/20',
      text: 'text-status-success',
      label: 'Completed'
    },
    pending: {
      bg: 'bg-status-warning/20',
      text: 'text-status-warning',
      label: 'Pending'
    },
    rejected: {
      bg: 'bg-status-danger/20',
      text: 'text-status-danger',
      label: 'Rejected'
    }
  };

  const config = statusConfig[status];

  return (
    <div 
      className="flex items-center justify-between p-4 bg-primary-surface rounded-xl border border-border/30 hover:border-accent-purple/50 transition-all duration-200 group cursor-pointer"
      onClick={onClick}
    >
      <div>
        <p className="font-semibold text-text-primary group-hover:text-accent-purple transition-colors duration-200">
          {type}
        </p>
        <p className="text-sm text-text-muted mt-1">{date}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg text-accent-purple">{amount}</p>
        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      </div>
    </div>
  );
}
