/**
 * Enhanced Table Component - Corona Inspired
 * For displaying sortable, filterable data with premium styling.
 */
import { ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TableProps {
  headers: { key: string; label: string; sortable?: boolean }[];
  data: any[];
  renderRow: (row: any) => ReactNode;
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
}

export function Table({ headers, data, renderRow, onSort, sortKey, sortDirection }: TableProps) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="min-w-full divide-y divide-border/30">
        <thead className="bg-primary-surface">
          <tr>
            {headers.map((header) => (
              <th 
                key={header.key} 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider"
              >
                {header.sortable ? (
                  <button 
                    onClick={() => onSort && onSort(header.key)}
                    className="flex items-center gap-2 group"
                  >
                    {header.label}
                    <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                      {sortKey === header.key ? (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                ) : (
                  header.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-primary-hover transition-colors">
              {renderRow(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface BadgeProps {
  color: 'success' | 'warning' | 'danger' | 'info';
  children: ReactNode;
}

/**
 * Badge for displaying status labels within the table.
 */
export function Badge({ color, children }: BadgeProps) {
  const colorClasses = {
    success: 'bg-status-success/20 text-status-success',
    warning: 'bg-status-warning/20 text-status-warning',
    danger: 'bg-status-danger/20 text-status-danger',
    info: 'bg-accent-blue/20 text-accent-blue',
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${colorClasses[color]}`}>
      {children}
    </span>
  );
}
