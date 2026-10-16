import UpTradeTerminal from '@/components/uptrade-terminal/terminal'

export const metadata = { title: 'UpTrade Terminal · Backtest' }

export default function TradeXPage() {
    return <UpTradeTerminal defaultPanel="backtest" />
}
