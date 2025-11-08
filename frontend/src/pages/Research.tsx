/**
 * Research Page - SEC Filings and Company Research
 */
import { useState } from 'react';
import { Search, FileText, Download, Calendar } from 'lucide-react';

export default function Research() {
  const [symbol, setSymbol] = useState('AAPL');
  const [filings, setFilings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Generate mock SEC filings data
    const mockFilings = generateMockFilings();
    setFilings(mockFilings);
    setLoading(false);
  };

  const generateMockFilings = () => {
    return [
      {
        type: '10-K',
        description: 'Annual Report',
        filingDate: '2024-10-28',
        period: 'FY 2024',
        url: '#',
        summary: 'Comprehensive annual financial statements and business overview'
      },
      {
        type: '10-Q',
        description: 'Quarterly Report',
        filingDate: '2024-08-02',
        period: 'Q3 2024',
        url: '#',
        summary: 'Quarterly financial performance and operations update'
      },
      {
        type: '10-Q',
        description: 'Quarterly Report',
        filingDate: '2024-05-02',
        period: 'Q2 2024',
        url: '#',
        summary: 'Second quarter results and management discussion'
      },
      {
        type: '8-K',
        description: 'Current Report',
        filingDate: '2024-07-25',
        period: 'Event Date: 2024-07-25',
        url: '#',
        summary: 'Material events announcement and earnings release'
      },
      {
        type: 'DEF 14A',
        description: 'Proxy Statement',
        filingDate: '2024-03-15',
        period: '2024 Annual Meeting',
        url: '#',
        summary: 'Shareholder meeting information and proposals'
      }
    ];
  };

  const getFilingTypeColor = (type: string) => {
    if (type === '10-K') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (type === '10-Q') return 'bg-green-100 text-green-800 border-green-200';
    if (type === '8-K') return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient">SEC Filings Research</h1>
        <p className="mt-2 text-text-secondary">Access company filings and regulatory documents</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1 search-premium">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent-blue w-5 h-5 z-10" />
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter stock symbol (e.g., AAPL)"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-premium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <FileText className="w-5 h-5 mr-2" />
            {loading ? 'Loading...' : 'Search Filings'}
          </button>
        </div>
      </form>

      {/* Filing Types Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-blue-900 mb-3">📋 SEC Filing Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-blue-900">10-K</p>
            <p className="text-blue-800">Annual comprehensive report with audited financials</p>
          </div>
          <div>
            <p className="font-medium text-blue-900">10-Q</p>
            <p className="text-blue-800">Quarterly financial report (unaudited)</p>
          </div>
          <div>
            <p className="font-medium text-blue-900">8-K</p>
            <p className="text-blue-800">Current report of material events</p>
          </div>
        </div>
      </div>

      {/* Filings List */}
      {filings.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Filings - {symbol}</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filings.map((filing, idx) => (
              <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${getFilingTypeColor(filing.type)}`}>
                        {filing.type}
                      </span>
                      <h3 className="font-semibold text-gray-900">{filing.description}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{filing.summary}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Filed: {filing.filingDate}
                      </span>
                      <span>•</span>
                      <span>Period: {filing.period}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('In production, this would download the actual SEC filing')}
                    className="ml-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center text-sm font-medium text-gray-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filings.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No filings loaded</p>
          <p className="text-sm text-gray-400">Enter a stock symbol and click "Search Filings" to view SEC documents</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This is demo data for illustration. In production, connect to SEC EDGAR API for real filings.
          Visit <a href="https://www.sec.gov/edgar" target="_blank" rel="noopener noreferrer" className="underline">SEC.gov</a> for official documents.
        </p>
      </div>
    </div>
  );
}
