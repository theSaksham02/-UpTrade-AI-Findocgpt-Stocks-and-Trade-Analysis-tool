/**
 * Chart Component - Reusable wrapper for Recharts
 * Provides styled charts for the dashboard.
 */
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// --- CHART STYLES & CONFIG ---
const COLORS = {
  primary: '#8884d8',
  secondary: '#82ca9d',
  accent: '#ffc658',
  danger: '#ff8042',
  blue: '#3b82f6',
  purple: '#a855f7',
  gold: '#f59e0b',
  success: '#22c55e',
};

const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: 'rgba(10, 10, 25, 0.8)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(128, 128, 128, 0.2)',
    borderRadius: '12px',
    color: '#cbd5e1',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  },
  labelStyle: {
    color: '#f8fafc',
    fontWeight: 'bold',
  },
};

const chartAxisStyle = {
  tick: { fill: '#94a3b8', fontSize: 12 },
  axisLine: { stroke: '#475569' },
  tickLine: { stroke: '#475569' },
};

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={chartTooltipStyle.contentStyle} className="p-3">
        <p style={chartTooltipStyle.labelStyle}>{label}</p>
        {payload.map((pld: any, index: number) => (
          <div key={index} style={{ color: pld.color }}>
            {pld.name}: <strong>{pld.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- CHART TYPES ---

// 1. Area Chart
interface DashboardAreaChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
}
export const DashboardAreaChart = ({ data, dataKey, xAxisKey }: DashboardAreaChartProps) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
      <XAxis dataKey={xAxisKey} {...chartAxisStyle} />
      <YAxis {...chartAxisStyle} />
      <Tooltip content={<CustomTooltip />} />
      <Area type="monotone" dataKey={dataKey} stroke={COLORS.purple} fillOpacity={1} fill="url(#colorUv)" />
    </AreaChart>
  </ResponsiveContainer>
);

// 2. Bar Chart
interface DashboardBarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
}
export const DashboardBarChart = ({ data, dataKey, xAxisKey }: DashboardBarChartProps) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
      <XAxis dataKey={xAxisKey} {...chartAxisStyle} />
      <YAxis {...chartAxisStyle} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Bar dataKey={dataKey} fill={COLORS.blue} />
    </BarChart>
  </ResponsiveContainer>
);

// 3. Line Chart
interface DashboardLineChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
}
export const DashboardLineChart = ({ data, dataKey, xAxisKey }: DashboardLineChartProps) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
      <XAxis dataKey={xAxisKey} {...chartAxisStyle} />
      <YAxis {...chartAxisStyle} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Line type="monotone" dataKey={dataKey} stroke={COLORS.accent} strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

// 4. Pie Chart (Doughnut)
interface DashboardPieChartProps {
  data: { name: string; value: number }[];
}
const PIE_COLORS = [COLORS.purple, COLORS.blue, COLORS.gold, COLORS.success, COLORS.danger];

export const DashboardPieChart = ({ data }: DashboardPieChartProps) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);
