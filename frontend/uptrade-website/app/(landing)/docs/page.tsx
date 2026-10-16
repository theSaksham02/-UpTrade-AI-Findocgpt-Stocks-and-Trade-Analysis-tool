import Link from 'next/link'

export const metadata = { title: 'Docs · UpTrade' }

const SECTIONS = [
    { id: 'terminal', title: 'Using the terminal' },
    { id: 'shortcuts', title: 'Keyboard shortcuts' },
    { id: 'model', title: 'How the model works' },
    { id: 'score', title: 'The UpTrade score' },
    { id: 'anomalies', title: 'Anomaly markers' },
    { id: 'backtests', title: 'Backtests' },
    { id: 'data', title: 'Data sources' },
    { id: 'account', title: 'Accounts & watchlist' },
]

const SHORTCUTS: [string, string][] = [
    ['⌘K / Ctrl+K', 'Symbol search'],
    ['Start typing a letter', 'Opens search with that letter'],
    ['Alt+T', 'Trend line tool'],
    ['Alt+H', 'Horizontal line tool'],
    ['Esc', 'Cancel the current tool'],
]

function H2({ id, children }: { id: string; children: React.ReactNode }) {
    return <h2 id={id} className="scroll-mt-24 border-t border-[#ecebe6]/15 pt-8 font-display text-4xl text-[#ecebe6]">{children}</h2>
}
const P = ({ children }: { children: React.ReactNode }) => <p className="mt-4 text-[15px] leading-7 text-[#ecebe6]/70">{children}</p>
const Code = ({ children }: { children: React.ReactNode }) => <code className="rounded bg-[#ecebe6]/[0.07] px-1.5 py-0.5 font-mono text-[13px] text-[#ecebe6]">{children}</code>

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-[#0a0b0d] text-[#ecebe6]">
            <div className="mx-auto grid max-w-[1100px] gap-12 px-5 pb-24 pt-14 md:grid-cols-[200px_1fr] md:px-8">
                <nav className="md:sticky md:top-24 md:h-fit" aria-label="On this page">
                    <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ecebe6]/45">Docs</div>
                    <ul className="mt-4 space-y-2 text-sm">
                        {SECTIONS.map((s) => <li key={s.id}><a href={`#${s.id}`} className="text-[#ecebe6]/60 hover:text-[#ecebe6]">{s.title}</a></li>)}
                    </ul>
                </nav>

                <article className="max-w-2xl space-y-14">
                    <header>
                        <h1 className="font-display text-5xl leading-[1.02] md:text-6xl">How UpTrade works</h1>
                        <P>Everything the terminal shows, and exactly how each number is calculated. If something here doesn’t match what you see, <Link href="/contact" className="text-[#ecebe6] underline underline-offset-4">tell us</Link>.</P>
                    </header>

                    <section>
                        <H2 id="terminal">Using the terminal</H2>
                        <P>Open <Link href="/app" className="text-[#ecebe6] underline underline-offset-4">the terminal</Link> and search for any stock, ETF, index or crypto pair. The toolbar picks the interval (5m to 1M), chart type (candles, hollow, Heikin Ashi, bars, line, area) and indicators: volume, SMA 20/50/200, EMA 20, Bollinger Bands, and RSI and MACD in their own panes.</P>
                        <P>The layout buttons show 1, 2 or 4 charts; click a chart to make it active. The right panel holds your watchlist, the selected symbol’s details, and three tabs: <em>UpTrade AI</em> (score, forecast, signals, anomalies), <em>News</em> (headline sentiment) and <em>Backtest</em>. On a phone, open it from the button in the bottom bar.</P>
                        <P>Forecast and anomaly markers are calculated on daily bars, so they appear on the 1D interval. Your layout, indicators and watchlist are saved in your browser.</P>
                    </section>

                    <section>
                        <H2 id="shortcuts">Keyboard shortcuts</H2>
                        <table className="mt-5 w-full text-sm">
                            <tbody>
                                {SHORTCUTS.map(([k, v]) => (
                                    <tr key={k} className="border-b border-[#ecebe6]/8"><td className="py-2.5 pr-6 font-mono text-[#ecebe6]">{k}</td><td className="py-2.5 text-[#ecebe6]/65">{v}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section>
                        <H2 id="model">How the model works</H2>
                        <P>The forecast is an <Code>ARIMA(5,1,0)</Code> model: it looks at the last five daily price changes to predict the next one, and repeats that 30 times. It’s fitted on up to the last 756 daily closes (about three years) for each symbol, every time you open it.</P>
                        <P>The dashed line is the forecast. The dotted lines are a 95% band: the range the model expects the price to stay within, given how noisy its own past errors were. On most liquid stocks and indices the forecast is close to flat and the band is wide. That’s an honest result — short-horizon price changes are hard to predict — so treat the band as the main information, not the line.</P>
                        <P>The 30-day signal uses fixed thresholds on the forecast’s projected change: above +5% is <em>Strong Buy</em>, above +1.5% <em>Buy</em>, below −5% <em>Strong Sell</em>, below −1.5% <em>Sell</em>, otherwise <em>Hold</em>.</P>
                    </section>

                    <section>
                        <H2 id="score">The UpTrade score</H2>
                        <P>A 0–100 composite of four factors, each also shown on its own:</P>
                        <ul className="mt-4 space-y-2 text-[15px] leading-7 text-[#ecebe6]/70">
                            <li><span className="text-[#ecebe6]">Technical (35%)</span> — five checks worth 20 points each: price above the 50-day average, above the 200-day average, 50-day above 200-day, MACD histogram positive, RSI between 40 and 70 (half credit outside that range).</li>
                            <li><span className="text-[#ecebe6]">Momentum (30%)</span> — a blend of 1-, 3- and 6-month returns, weighted 20/30/50.</li>
                            <li><span className="text-[#ecebe6]">Risk (15%)</span> — lower one-year volatility scores higher.</li>
                            <li><span className="text-[#ecebe6]">Forecast (20%)</span> — the ARIMA projected change, scaled.</li>
                        </ul>
                        <P>A score of 65 or more is labelled <em>Bullish</em>, 35 or less <em>Bearish</em>, and anything between <em>Neutral</em>.</P>
                    </section>

                    <section>
                        <H2 id="anomalies">Anomaly markers</H2>
                        <P>On daily charts, an arrow marks a day whose price move was more than three standard deviations away from the previous 30 days. A dot marks a day whose volume was more than 2.5 standard deviations above its 30-day average. They point you at days worth reading about; they aren’t signals.</P>
                    </section>

                    <section>
                        <H2 id="backtests">Backtests</H2>
                        <P>The strategy tester runs on up to five years of daily data. Each strategy is either fully invested or in cash. A decision made at a day’s close is filled at the next day’s price, so no strategy sees the future, and every trade pays a fee (10 basis points by default).</P>
                        <ul className="mt-4 space-y-2 text-[15px] leading-7 text-[#ecebe6]/70">
                            <li><span className="text-[#ecebe6]">UpTrade ARIMA</span> — refits the model every 21 days on the previous 500 days; invested when its 5-day forecast is up.</li>
                            <li><span className="text-[#ecebe6]">SMA 50/200</span> — invested while the 50-day average is above the 200-day.</li>
                            <li><span className="text-[#ecebe6]">MACD crossover</span> — invested while MACD is above its signal line.</li>
                            <li><span className="text-[#ecebe6]">RSI 30/70</span> — buys when RSI drops below 30, sells when it rises above 70.</li>
                        </ul>
                        <P>Results are compared with simply buying and holding. Past results don’t predict future ones.</P>
                    </section>

                    <section>
                        <H2 id="data">Data sources</H2>
                        <P>Prices, history, symbol search and headlines come from Yahoo Finance. Quotes can be delayed — by 15 minutes or more on some exchanges — and occasionally a symbol has missing bars or no volume. Headline sentiment uses a finance-specific word list (or the FinBERT model when it’s enabled).</P>
                    </section>

                    <section>
                        <H2 id="account">Accounts & watchlist</H2>
                        <P>You don’t need an account to use anything. If you <Link href="/signup?next=/dashboard" className="text-[#ecebe6] underline underline-offset-4">create one</Link>, we store your email and your watchlist symbols so the list follows you between devices; your <Link href="/dashboard" className="text-[#ecebe6] underline underline-offset-4">dashboard</Link> and the terminal share it. To delete your account and data, use the <Link href="/contact" className="text-[#ecebe6] underline underline-offset-4">contact form</Link>.</P>
                        <p className="mt-8 font-mono text-[11px] text-[#ecebe6]/40">UpTrade is a research tool. Nothing on this site is investment advice.</p>
                    </section>
                </article>
            </div>
        </div>
    )
}
