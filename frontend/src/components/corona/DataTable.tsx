/**
 * DataTable Component - Corona Style
 * Premium data table with checkboxes, badges, and actions
 */
import { useState } from 'react';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
}

export interface TableRow {
  id: string | number;
  [key: string]: any;
}

interface DataTableProps {
  columns: TableColumn[];
  data: TableRow[];
  onRowClick?: (row: TableRow) => void;
  selectable?: boolean;
}

export default function DataTable({ columns, data, onRowClick, selectable = false }: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map(row => row.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (id: string | number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === data.length);
  };

  const renderCellValue = (value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (value.type === 'badge') {
        const badgeColors = {
          success: 'bg-status-success/20 text-status-success',
          warning: 'bg-status-warning/20 text-status-warning',
          danger: 'bg-status-danger/20 text-status-danger',
          info: 'bg-accent-blue/20 text-accent-blue'
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColors[value.variant as keyof typeof badgeColors] || badgeColors.info}`}>
            {value.label}
          </span>
        );
      }
      if (value.type === 'image') {
        return (
          <div className="flex items-center gap-3">
            {value.src && (
              <img src={value.src} alt={value.alt || ''} className="w-8 h-8 rounded-full" />
            )}
            {value.label && <span>{value.label}</span>}
          </div>
        );
      }
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/30">
            {selectable && (
              <th className="p-4 text-left">
                <input 
                  type="checkbox" 
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-border bg-primary-surface checked:bg-gradient-blue cursor-pointer"
                />
              </th>
            )}
            {columns.map((column) => (
              <th 
                key={column.key}
                className="p-4 text-left text-sm font-semibold text-text-muted uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr 
              key={row.id}
              className={`border-b border-border/20 hover:bg-primary-hover transition-colors cursor-pointer group ${
                index % 2 === 0 ? 'bg-primary-surface/30' : ''
              }`}
              onClick={() => onRowClick?.(row)}
            >
              {selectable && (
                <td className="p-4">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.has(row.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectRow(row.id);
                    }}
                    className="w-4 h-4 rounded border-border bg-primary-surface checked:bg-gradient-blue cursor-pointer"
                  />
                </td>
              )}
              {columns.map((column) => (
                <td key={column.key} className="p-4 text-text-secondary group-hover:text-text-primary transition-colors">
                  {renderCellValue(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
