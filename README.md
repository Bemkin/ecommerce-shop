# ShopHub — Premium eCommerce Demo 🚀

A high-performance, feature-rich eCommerce application built with **Next.js 16**, **TypeScript**, and **Redux Toolkit**. Designed with a focus on premium UI/UX, scalability, and clean architecture.

![ShopHub Banner](https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200&h=400)

## 🌟 Key Features

### Core eCommerce (100% Spec Compliant)
- **[x] Dynamic Product Grid**: Real-time fetching from DummyJSON with on-scroll infinite pagination.
- **[x] Global Search**: Instant search across all products with debounced API integration.
- **[x] Category Discovery**: Specialized filtering by category with persistent URL state.
- **[x] Favorites System**: Robust favoriting logic managed via Redux with ID-only persistence for performance.
- **[x] Full CRUD Support**: Create, Edit (via `PUT`), and Delete products with immediate UI feedback.
- **[x] Product Details**: Deep-dive views with rich galleries, dynamic variant selectors, and ranked recommendations.
- **[x] Shopping Bag**: Fully functional side-drawer cart with persistence, quantity controls, and subtotal calculation.

### "Beyond-the-Spec" Bonuses 💎
- **Premium UI/UX**: Custom design system featuring glassmorphism, staggered animations (Framer Motion), and modern typography.
- **Mock Authentication**: Secure-session based login flow to access management features.
- **Dark Mode**: High-contrast dark theme toggle with global state persistence.
- **Toast Notifications**: Real-time action feedback using `Sonner`.
- **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop experiences.
- **Developer Experience**: Strictly typed with TypeScript and comprehensive architectural documentation.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **API Client**: [Axios](https://axios-http.com/) (with Global Interceptors)
- **Feedback**: [Sonner](https://sonner.steveneyard.com/)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm / yarn / pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bemkin/ecommerce-shop.git
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

## 🏗️ Architecture & Best Practices

The project follows a **Layered Feature-Based Architecture**, ensuring that logic is separated from presentation and that components are easily testable.

### Folder Structure
- `src/app`: Handles routing and layout using Next.js App Router conventions.
- `src/components/products`: Organized into `sections/` (complex layouts) and `ui/` (reusable primitives).
- `src/hooks`: High-level business logic extracted into custom hooks (e.g., `useProducts` for infinite scroll).
- `src/store`: Centralized state management using Redux Toolkit slices with persistence.
- `src/lib`: Domain types, API clients (Axios), and utility functions.

### Key Decisions
- **Persistence**: Favorites and Auth state are persisted across sessions (`localStorage` / `sessionStorage`).
- **Performance**: Categories are fetched once at the root level and shared via Redux to prevent "waterfall" API calls.
- **Type Safety**: 100% TypeScript coverage with custom interfaces for API responses.
---
*Verified Spec-Compliant eCommerce Prototype*
