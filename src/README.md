# Victory Pizza - Restaurant Website

A modern, responsive restaurant website built with React, TypeScript, and Vite.

## Features

- 🌓 Dark/Light theme toggle
- 🌍 Bilingual support (Finnish/English)
- 📱 Fully responsive design
- 🍕 Interactive menu with categories
- 🖼️ Image gallery with lightbox
- 📍 Integrated Google Maps
- ☎️ Call-to-action buttons for easy ordering
- ⚡ Fast performance with Vite

## Project Structure

```
src/
├── components/          # React components
│   ├── Contact.tsx     # Contact section with map
│   ├── FoodGally.tsx   # Food gallery with images
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Hero section
│   ├── ImageWithFallback.tsx  # Image component with error handling
│   └── MenuGrid.tsx    # Menu display with categories
├── data/
│   └── menuData.ts     # Restaurant menu data
├── App.tsx             # Main app component
├── main.tsx            # Entry point
├── index.html          # HTML template
├── index.css           # Global styles (Tailwind)
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies

```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm preview
```

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons

## Restaurant Information

- **Name**: Victory Pizza
- **Address**: Puustellinpolku 25, 00410 Helsinki
- **Phone**: 046 842 0302
- **Email**: victory.pizza.fi@gmail.com
- **Hours**: Monday - Sunday, 11:00 - 22:00

## License

This project uses components from [shadcn/ui](https://ui.shadcn.com/) under MIT license and photos from [Unsplash](https://unsplash.com).

---

Built with ❤️ for Victory Pizza
