"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Adham Sameh",
    role: "Day Trader",
    image: "AS",
    rating: 5,
    text: "UpTrade's AI has completely transformed my trading strategy. The accuracy of predictions is incredible, and I've seen a 40% increase in my portfolio since switching.",
  },
  {
    name: "Ted",
    role: "Investment Manager",
    image: "TD",
    rating: 5,
    text: "The risk management tools are second to none. UpTrade has helped me protect my clients' portfolios while maximizing returns. It's an essential tool in my arsenal.",
  },
  {
    name: "Pride",
    role: "Quantitative Analyst",
    image: "PR",
    rating: 5,
    text: "As a quant analyst, I'm impressed by the sophistication of UpTrade's algorithms. The real-time data processing and predictive models are truly cutting-edge.",
  },
  {
    name: "Abir",
    role: "Crypto Trader",
    image: "AB",
    rating: 5,
    text: "The 24/7 market monitoring is a game-changer for crypto trading. I never miss an opportunity, and the AI alerts have saved me from several potential losses.",
  },
  {
    name: "Samuel",
    role: "Portfolio Manager",
    image: "SM",
    rating: 5,
    text: "UpTrade's sentiment analysis gives me insights that would take hours to gather manually. It's like having a team of analysts working around the clock.",
  },
  {
    name: "Shrey Soral",
    role: "Swing Trader",
    image: "SS",
    rating: 5,
    text: "The educational resources combined with AI-powered recommendations helped me become a profitable trader in just 3 months. Best investment I've made.",
  },
]

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="testimonials" className="py-20 px-4 relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Loved by <span className="text-blue-400">Traders</span> Worldwide
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Join thousands of satisfied traders who have transformed their trading with UpTrade
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <Quote className="w-10 h-10 text-blue-400/30 mb-4" />
              <p className="text-white/80 mb-6 leading-relaxed">{testimonial.text}</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold mr-4">
                  {testimonial.image}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-white/60 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-current mx-1" />
              ))}
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">4.9/5 Average Rating</h3>
            <p className="text-white/70 text-lg">
              Based on 10,000+ reviews from traders worldwide. Trusted by professionals and beginners alike.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
