# ShopHub — Premium eCommerce Demo 🚀

A high-performance, feature-rich eCommerce application built with **Next.js 16**, **TypeScript**, and **Redux Toolkit**. Designed with a focus on premium UI/UX, scalability, and clean architecture.

![ShopHub Banner](https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200&h=400)

## 🌟 Key Features

### Core eCommerce (Spec Compliant)
- **Dynamic Product Grid**: Real-time fetching from DummyJSON with on-scroll infinite pagination.
- **Global Search**: Instant search across all products with debounced API integration.
- **Category Discovery**: Specialized filtering by category with persistent URL state.
- **Favorites System**: robust favoriting logic managed via Redux with ID-only persistence for performance.
- **Full CRUD Support**: Create, Edit, and Delete products with immediate UI feedback and API integration.
- **Product Details**: Deep-dive views with rich galleries, dynamic variant selectors, and ranked recommendations.

### "Beyond-the-Spec" Bonuses 💎
- **Premium UI/UX**: Custom design system featuring glassmorphism, subtle animations (Framer Motion), and modern typography.
- **Mock Authentication**: Secure-session based login flow to access the management features.
- **Dark Mode**: High-contrast dark theme toggle with global state persistence.
- **Toast Notifications**: Real-time action feedback using `Sonner`.
- **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop experiences.
- **Clean Architecture**: Layered folder structure (Hooks, Sections, Shared Components) for maximum maintainability.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **API Client**: [Axios](https://axios-http.com/)
- **Feedback**: [Sonner](https://sonner.steveneyard.com/)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm / yarn / pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ecommerce-shop.git
   cd ecommerce-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```text
src/
├── app/             # App Router pages & layouts
├── components/      # UI components
│   ├── layout/      # App shell (Header, Footer, etc.)
│   ├── products/    # Feature-specific (sections vs ui)
│   ├── shared/      # Cross-cutting reusables
│   └── ui/          # Shadcn primitives
├── hooks/           # Specialized custom hooks (useProducts, useAuth)
├── lib/             # API clients, types, and constants
└── store/           # Redux store configuration & slices
```

---

*This project was built as a technical demonstration for [Interviewer/Company Name].*
