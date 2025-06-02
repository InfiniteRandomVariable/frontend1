# E-commerce Marketplace

This is a Next.js frontend for an e-commerce marketplace, designed to work with a separate backend API for a senior level engineering project with many years of top level experience. 

## Features

- Product browsing and searching
- Product details and reviews
- Shopping cart functionality
- Watchlist for saving products
- Checkout process
- Arbiter selection for dispute resolution

## Architecture

This application follows a clear separation between frontend and backend:

- **Frontend**: Next.js application that handles UI rendering and client-side logic
- **Backend**: Separate REST API that provides data and business logic

## Preview Mode

The application includes a preview mode that allows you to view and interact with the UI without connecting to a backend API. This is useful for development and demonstration purposes.

### How to Use Preview Mode

1. Set the `NEXT_PUBLIC_PREVIEW_MODE` environment variable to `true` in your `.env.local` file:

\`\`\`
NEXT_PUBLIC_PREVIEW_MODE=true
\`\`\`

2. Start the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

3. The application will use actual API calls instead of mock data as much as possible.

### Disabling Preview Mode

To disable preview mode and connect to the actual backend API:

1. Set the `NEXT_PUBLIC_PREVIEW_MODE` environment variable to `false` in your `.env.local` file:

\`\`\`
NEXT_PUBLIC_PREVIEW_MODE=false
\`\`\`

2. Make sure the `NEXT_PUBLIC_API_URL` environment variable is set to the correct backend API URL:

\`\`\`
NEXT_PUBLIC_API_URL=https://your-api-url.com
\`\`\`

## Development

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Create a `.env.local` file with the following variables:

\`\`\`
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_PREVIEW_MODE=true
\`\`\`

4. Start the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Building for Production

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

Then start the production server:

\`\`\`bash
npm run start
# or
yarn start

6. If possible, make all the file changes under App folder. Add new files to App folder. This is very important. 
7. Use Zustand and ReactQuery. 
