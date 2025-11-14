# UpTrade - AI-Powered Trading Intelligence Platform

A modern, beautiful landing page for UpTrade, built with Next.js 14, React 19, and cutting-edge UI libraries. Features stunning animations, glassmorphism effects, and a fully responsive design.

## 🚀 Features

- **Next.js 14** with App Router
- **React 19** for the latest features
- **Tailwind CSS 4.1.9** for styling
- **Framer Motion** for smooth animations
- **Three.js** for 3D graphics
- **shadcn/ui** component system
- **Radix UI** for accessible components
- **Aurora background effects**
- **Fully responsive** design
- **Dark theme** optimized for finance

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun** package manager

## 🛠️ Installation

1. **Navigate to the project directory:**

```bash
cd frontend/uptrade-website
```

2. **Install dependencies:**

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using pnpm (recommended):
```bash
pnpm install
```

Using bun:
```bash
bun install
```

## 🎯 Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🏗️ Build

Create a production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

## 🚀 Production

Start the production server:

```bash
npm start
# or
yarn start
# or
pnpm start
# or
bun start
```

## 📦 Key Dependencies

### Core Framework
- `next`: 14.2.25
- `react`: 19
- `react-dom`: 19

### UI Components
- `@radix-ui/*`: Accessible UI components
- `lucide-react`: Icon library
- `shadcn/ui`: Component system

### Styling
- `tailwindcss`: 4.1.9
- `tailwindcss-animate`: Animation utilities
- `next-themes`: Dark mode support

### Animation
- `framer-motion`: 12.23.22
- `motion`: 12.23.22

### 3D Graphics
- `three`: 0.180.0
- `ogl`: 1.0.11
- `postprocessing`: 6.37.8

### Forms & Validation
- `react-hook-form`
- `zod`
- `@hookform/resolvers`

### Analytics
- `@vercel/analytics`
- `@vercel/speed-insights`

## 📁 Project Structure

```
uptrade-website/
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Home page
├── components/
│   ├── ui/                   # Reusable UI components (buttons, cards, etc.)
│   ├── Aurora.tsx            # Animated background component
│   ├── RotatingText.tsx      # Text rotation animation
│   ├── glassmorphism-nav.tsx # Navigation bar
│   ├── hero-section.tsx      # Hero section
│   ├── features-section.tsx  # Features showcase
│   ├── ai-analysis-section.tsx # AI capabilities
│   ├── performance-section.tsx # Performance stats
│   ├── pricing-section.tsx   # Pricing tiers
│   ├── testimonials-section.tsx # User testimonials
│   ├── cta-section.tsx       # Call-to-action
│   └── footer.tsx            # Footer
├── lib/
│   └── utils.ts              # Utility functions
├── hooks/
│   ├── use-mobile.ts         # Mobile detection hook
│   └── use-toast.ts          # Toast notifications
├── public/                   # Static assets
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🎨 Customization

### Colors

The color scheme uses blue gradients optimized for financial applications. You can customize colors in `app/globals.css`:

```css
:root {
  --primary: oklch(0.7 0.15 142);  /* Blue primary color */
  --background: oklch(0.05 0 0);    /* Dark background */
  /* ... other color variables */
}
```

### Animations

All animations are defined in `app/globals.css` using CSS keyframes and can be easily customized.

### Content

Update content in the component files:
- Hero text: `components/hero-section.tsx`
- Features: `components/features-section.tsx`
- Pricing: `components/pricing-section.tsx`
- Testimonials: `components/testimonials-section.tsx`

## 🔧 Configuration Files

- **next.config.mjs**: Next.js configuration
- **postcss.config.mjs**: PostCSS configuration for Tailwind
- **tsconfig.json**: TypeScript configuration
- **components.json**: shadcn/ui configuration

## 📱 Responsive Design

The landing page is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## ⚡ Performance

- Server-side rendering (SSR)
- Optimized images
- Code splitting
- Lazy loading
- Vercel Analytics & Speed Insights

## 🐛 Troubleshooting

### TypeScript Errors

If you encounter TypeScript errors during build, they are configured to be ignored in `next.config.mjs`:

```javascript
typescript: {
  ignoreBuildErrors: true,
}
```

### Node Version

Ensure you're using Node.js 18.x or higher:

```bash
node --version
```

## 📄 License

This project is built for UpTrade platform.

## 🤝 Support

For support, please contact the development team or create an issue in the repository.

## 🎉 Credits

Built with:
- Template inspiration from Cliste
- UI components from shadcn/ui
- Icons from Lucide React
- Animations from Framer Motion

---

**Happy Trading! 📈**
