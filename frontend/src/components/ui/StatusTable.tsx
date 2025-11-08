/**
 * Status Table Component - Corona Inspired
 * Used for creating tables with progress bars.
 */
import { Card } from './Card';

interface StatusTableProps {
  title: string;
  headers: string[];
  data: {
    id: string | number;
    values: (string | number)[];
    progress: number;
    progressColor: string;
  }[];
}

export function StatusTable({ title, headers, data }: StatusTableProps) {
  return (
    <Card>
      <h2 className="text-xl font-bold text-gradient mb-6">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/30">
              {headers.map((header, index) => (
                <th key={index} className="p-4 text-sm font-semibold text-text-muted uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b border-border/30 last:border-none hover:bg-primary-surface transition-colors">
                {row.values.map((value, index) => (
                  <td key={index} className="p-4 text-text-primary whitespace-nowrap">
                    {value}
                  </td>
                ))}
                <td className="p-4">
                  <div className="w-full bg-primary-hover rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${row.progressColor}`}
                      style={{ width: `${row.progress}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
