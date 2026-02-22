# Hex Grid Number Triangulation

A React-based web application that displays an interactive grid of hexagons (7 rows × 8 columns). Users can assign numbers to each hex, and the app computes triangulation points where three or more number "ranges" intersect.

## Features

- **Interactive Hex Grid**: 7 rows × 7-8 columns (alternating row sizes)
- **Number Assignment**: Click any hex to assign a number (1-12)
- **Drag & Drop**: Drag numbers between hexes
- **Triangulation**: Hexes covered by 3+ ranges turn green and display source numbers
- **Persistent Storage**: State is saved to localStorage
- **Range Calculation**: Range = ceil(N/2), using cube distance on hex grid

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### GitHub Pages (Automatic)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the `main` branch.

**Setup:**
1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. Push to `main` branch - deployment happens automatically

### Manual Deployment

If you prefer to deploy manually:

```bash
npm run build
npm run deploy
```

**Note:** Make sure the `base` path in `vite.config.ts` matches your repository name. Currently set to `/Coldhaven-33-Helper/` - update if your repo name is different.

## How It Works

1. **Grid Layout**: Pointy-top hexagons in an odd-r offset layout
2. **Range Calculation**: For a number N, range = ceil(N/2)
3. **Distance**: Uses cube coordinates for accurate hex distance calculation
4. **Intersections**: Hexes covered by exactly 3 or more different number ranges are highlighted in green

## Technologies

- React + TypeScript
- Vite
- Tailwind CSS
- SVG for hex rendering
