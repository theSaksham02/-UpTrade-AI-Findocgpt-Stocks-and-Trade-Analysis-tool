/**
 * Portfolio Page
 * Displays the user's current stock holdings and performance.
 */
import { useState, useEffect } from 'react';
import { tradingAPI } from '../services/api';
import { Card } from '../components/ui/Card';
import { Table, Badge } from '../components/ui/Table';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

export default function Portfolio() {
  const [positions, setPositions] = useState<any[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [todayPL, setTodayPL] = useState(0);
  const [totalPL, setTotalPL] = useState(0);
  const [sortKey, setSortKey] = useState('symbol');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      const posRes = await tradingAPI.getPositions();
      const accountRes = await tradingAPI.getPaperAccount();
      
      const formattedPositions = posRes.data.map((pos: any) => ({
        ...pos,
        market_value: parseFloat(pos.market_value),
        unrealized_pl: parseFloat(pos.unrealized_pl),
        unrealized_plpc: parseFloat(pos.unrealized_plpc) * 100,
        today_pl: parseFloat(pos.unrealized_intraday_pl),
        today_plpc: parseFloat(pos.unrealized_intraday_plpc) * 100,
      }));

      setPositions(formattedPositions);
      setPortfolioValue(parseFloat(accountRes.data.equity));
      setTodayPL(parseFloat(accountRes.data.equity) - parseFloat(accountRes.data.last_equity));
      setTotalPL(parseFloat(accountRes.data.equity) - 100000); // Assuming 100k initial capital
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
    }
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedPositions = [...positions].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const headers = [
    { key: 'symbol', label: 'Symbol', sortable: true },
    { key: 'qty', label: 'Quantity', sortable: true },
    { key: 'market_value', label: 'Market Value', sortable: true },
    { key: 'unrealized_pl', label: 'Total P&L', sortable: true },
    { key: 'unrealized_plpc', label: 'Total P&L (%)', sortable: true },
    { key: 'today_pl', label: "Today's P&L", sortable: true },
  ];

  const renderRow = (pos: any) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-bold text-gradient">{pos.symbol}</div>
        <div className="text-sm text-text-muted">{pos.asset_class}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{pos.qty}</td>
      <td className="px-6 py-4 whitespace-nowrap text-text-secondary">${pos.market_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td className={`px-6 py-4 whitespace-nowrap font-semibold ${pos.unrealized_pl >= 0 ? 'text-status-success' : 'text-status-danger'}`}>
        ${pos.unrealized_pl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap font-semibold ${pos.unrealized_plpc >= 0 ? 'text-status-success' : 'text-status-danger'}`}>
        {pos.unrealized_plpc.toFixed(2)}%
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge color={pos.today_pl >= 0 ? 'success' : 'danger'}>
          ${pos.today_pl.toFixed(2)} ({pos.today_plpc.toFixed(2)}%)
        </Badge>
      </td>
    </>
  );

  return (
    <div>
      <h1 className="text-4xl font-bold text-gradient mb-8">My Portfolio</h1>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-text-muted mb-2">Portfolio Value</h3>
          <p className="text-3xl font-bold text-gradient flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            {portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </Card>
        <Card>
          <h3 className="text-text-muted mb-2">Today's P&L</h3>
          <p className={`text-3xl font-bold flex items-center gap-2 ${todayPL >= 0 ? 'text-status-success' : 'text-status-danger'}`}>
            {todayPL >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
            {todayPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </Card>
        <Card>
          <h3 className="text-text-muted mb-2">Total P&L</h3>
          <p className={`text-3xl font-bold flex items-center gap-2 ${totalPL >= 0 ? 'text-status-success' : 'text-status-danger'}`}>
            {totalPL >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
            {totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </Card>
      </div>

      {/* Positions Table */}
      <Card padding="none">
        <div className="p-6 border-b border-border/30">
          <h2 className="text-xl font-bold text-gradient">Current Positions</h2>
        </div>
        <Table 
          headers={headers} 
          data={sortedPositions} 
          renderRow={renderRow}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />
      </Card>
    </div>
  );
}
