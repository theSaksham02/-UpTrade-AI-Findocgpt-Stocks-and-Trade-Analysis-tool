'use client'

export function Pricing() {
    return (
        <section className="py-20 px-4 bg-[#0b0e14]">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-12">Stop Paying for Legacy Terminals</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#2a2e39]">
                                <th className="py-4 pl-4 text-[#868993] font-medium uppercase text-xs tracking-wider">Feature</th>
                                <th className="py-4 text-[#868993] font-medium uppercase text-xs tracking-wider">Bloomberg</th>
                                <th className="py-4 text-[#868993] font-medium uppercase text-xs tracking-wider">TradingView Pro</th>
                                <th className="py-4 pr-4 text-[#2962FF] font-bold uppercase text-xs tracking-wider">UpTrade</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-[#2a2e39]/50 hover:bg-[#1e222d] transition-colors">
                                <td className="py-4 pl-4 font-medium text-white">Cost per Year</td>
                                <td className="py-4 text-[#f23645]">$24,000</td>
                                <td className="py-4 text-white">$720</td>
                                <td className="py-4 pr-4 text-[#089981] font-bold">$0 (Free Beta)</td>
                            </tr>
                            <tr className="border-b border-[#2a2e39]/50 hover:bg-[#1e222d] transition-colors">
                                <td className="py-4 pl-4 font-medium text-white">Real-Time Data</td>
                                <td className="py-4 text-[#089981]">✓ Included</td>
                                <td className="py-4 text-white">Extra fees</td>
                                <td className="py-4 pr-4 text-[#089981] font-bold">✓ Included</td>
                            </tr>
                            <tr className="border-b border-[#2a2e39]/50 hover:bg-[#1e222d] transition-colors">
                                <td className="py-4 pl-4 font-medium text-white">Sentiment Overlay</td>
                                <td className="py-4 text-[#f23645]">✗ Text only</td>
                                <td className="py-4 text-[#f23645]">✗ No</td>
                                <td className="py-4 pr-4 text-[#089981] font-bold">✓ Real-time VisualX</td>
                            </tr>
                            <tr className="border-b border-[#2a2e39]/50 hover:bg-[#1e222d] transition-colors">
                                <td className="py-4 pl-4 font-medium text-white">Divergence Alerts</td>
                                <td className="py-4 text-[#f23645]">✗ Manual setup</td>
                                <td className="py-4 text-[#f23645]">✗ Price only</td>
                                <td className="py-4 pr-4 text-[#089981] font-bold">✓ Auto-Detection</td>
                            </tr>
                            <tr className="border-b border-[#2a2e39]/50 hover:bg-[#1e222d] transition-colors">
                                <td className="py-4 pl-4 font-medium text-white">Multi-Factor AI Review</td>
                                <td className="py-4 text-[#089981]">✓</td>
                                <td className="py-4 text-[#f23645]">✗</td>
                                <td className="py-4 pr-4 text-[#089981] font-bold">✓ TradeX Engine</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
