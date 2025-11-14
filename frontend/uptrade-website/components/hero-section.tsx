import { Button } from "@/components/ui/button"
import RotatingText from "./RotatingText"
import { TrendingUp, LineChart, BarChart3 } from "lucide-react"

const ArrowRight = () => (
  <svg
    className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const Play = () => (
  <svg
    className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
    />
  </svg>
)

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-hero">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 mt-12 animate-fade-in-badge">
          <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
          AI-Powered Trading Intelligence
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 animate-fade-in-heading">
          <span className="text-foreground">Master the Market</span>
          <br />
          <span className="inline-flex items-center justify-center flex-wrap gap-2 mt-4 sm:mt-6 md:mt-8">
            <span className="text-foreground">with</span>
            <RotatingText
              texts={["AI Analysis", "Smart Insights", "Real-time Data", "Expert Strategy", "Precision Tools"]}
              mainClassName="px-2 sm:px-2 md:px-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white overflow-hidden py-1 sm:py-1 md:py-2 justify-center rounded-lg shadow-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-1 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-xl md:text-2xl text-white text-balance max-w-sm sm:max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0 animate-fade-in-subheading font-light">
          Transform your trading journey with cutting-edge AI technology. Get real-time market analysis, intelligent insights, and data-driven strategies to maximize your investment returns.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 sm:mb-16 animate-fade-in-buttons">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg group cursor-pointer relative overflow-hidden"
          >
            Start Trading Smarter
            <ArrowRight />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-4 text-lg font-medium border-border hover:bg-accent transition-all duration-200 hover:scale-105 group bg-transparent cursor-pointer"
          >
            <Play />
            Watch Demo
          </Button>
        </div>

        {/* Stats Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8 animate-fade-in-trust">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <LineChart className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">98.7%</div>
            <div className="text-sm text-white/70">Accuracy Rate</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">$2.5M+</div>
            <div className="text-sm text-white/70">Assets Analyzed</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">10K+</div>
            <div className="text-sm text-white/70">Active Traders</div>
          </div>
        </div>

        {/* Trust Indicators - Desktop */}
        <div className="text-center px-4 hidden sm:block overflow-hidden animate-fade-in-trust">
          <p className="text-sm text-white mb-6">Trusted by professional traders worldwide</p>
          <div className="relative overflow-hidden w-full max-w-4xl mx-auto">
            <div className="flex items-center gap-8 opacity-60 hover:opacity-80 transition-all duration-500 animate-slide-left">
              <div className="flex items-center gap-8 whitespace-nowrap">
                <div className="text-base sm:text-lg font-semibold">Bloomberg Terminal</div>
                <div className="text-base sm:text-lg font-semibold">Interactive Brokers</div>
                <div className="text-base sm:text-lg font-semibold">TD Ameritrade</div>
                <div className="text-base sm:text-lg font-semibold">E*TRADE</div>
                <div className="text-base sm:text-lg font-semibold">Fidelity</div>
              </div>
              <div className="flex items-center gap-8 whitespace-nowrap">
                <div className="text-base sm:text-lg font-semibold">Bloomberg Terminal</div>
                <div className="text-base sm:text-lg font-semibold">Interactive Brokers</div>
                <div className="text-base sm:text-lg font-semibold">TD Ameritrade</div>
                <div className="text-base sm:text-lg font-semibold">E*TRADE</div>
                <div className="text-base sm:text-lg font-semibold">Fidelity</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators - Mobile */}
        <div className="text-center px-4 mb-8 sm:hidden overflow-hidden animate-fade-in-trust">
          <p className="text-sm text-white mb-6">Trusted by professional traders</p>
          <div className="relative overflow-hidden w-full max-w-sm mx-auto">
            <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
            <div className="flex items-center gap-6 opacity-60 animate-slide-left-mobile">
              <div className="flex items-center gap-6 whitespace-nowrap">
                <div className="text-sm font-semibold">Bloomberg</div>
                <div className="text-sm font-semibold">Interactive Brokers</div>
                <div className="text-sm font-semibold">TD Ameritrade</div>
                <div className="text-sm font-semibold">E*TRADE</div>
              </div>
              <div className="flex items-center gap-6 whitespace-nowrap">
                <div className="text-sm font-semibold">Bloomberg</div>
                <div className="text-sm font-semibold">Interactive Brokers</div>
                <div className="text-sm font-semibold">TD Ameritrade</div>
                <div className="text-sm font-semibold">E*TRADE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
