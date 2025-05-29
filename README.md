# VibeNews

A modern news website built with Next.js, TypeScript, and Tailwind CSS. VibeNews provides a clean and intuitive interface for accessing the latest news across various categories.

## Features

- Responsive design optimized for all devices
- Modern UI with smooth transitions and animations
- Category-based news organization
- Featured articles section
- Latest news grid layout
- Dark mode support
- RSS feed integration with multiple news sources
- Proxy service for reliable feed fetching

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- React
- Node.js
- RSS Parser

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vibenews.git
cd vibenews
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the variables as needed:
```bash
# Development
URL=http://localhost:3000

# Production
URL=https://your-domain.com
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
vibenews/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── proxy/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── config/
│   │   └── newsSources.ts
│   └── lib/
│       └── feedService.ts
├── public/
│   └── images/
├── .env.example
├── .env.local (not in repo)
├── package.json
└── README.md
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

- `URL`: The base URL of your application. Used for server-side feed fetching.
  - Development: `http://localhost:3000`
  - Production: Your domain (e.g., `https://vibenews.com`)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
