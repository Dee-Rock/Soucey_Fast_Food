# Soucey - Food Ordering & Delivery Website

A modern food ordering and delivery platform built for campus life in Ghana, featuring a beautiful pink-themed UI.

## Features

- **User Authentication**: Secure login and registration with Clerk
- **Food Ordering**: Browse and order from a variety of local and international cuisines
- **Restaurant Listings**: Discover restaurants and their menus
- **Cart Management**: Add items to cart, modify quantities, and checkout
- **Payment Options**: Multiple payment methods including card, mobile money, and cash on delivery
- **Responsive Design**: Beautiful UI that works on all devices

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Clerk
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/soucey.git
cd soucey
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

- `src/app`: Pages and layouts using Next.js App Router
- `src/components`: Reusable UI components
- `src/components/ui`: Shadcn UI components
- `src/lib`: Utility functions and shared code
- `public`: Static assets like images

## Deployment

The application can be deployed to platforms like Vercel, Netlify, or any other hosting service that supports Next.js applications.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [Clerk](https://clerk.dev/)
