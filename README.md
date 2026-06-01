# LigalSakhi

A React frontend project for the Women Helper UI. This repository currently includes the main UI component and generated favicon assets.

## Favicon

The project favicon was generated from `src/Logo.jpeg` and added as:

- `public/favicon.ico`
- `public/favicon-32x32.png`

## Run locally

1. Install Node.js (version 18 or later recommended).
2. Open a terminal at the project root: `d:\Programming\Projects\LigalSakhi`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   returexport default function WomenHelperUI() {
  const [slide, setSlide] = useState(0);
  const [return (
  <div style={{ background: "#f4f6f9", minHeight: "100vh" }}>
    <h1 style={{ textAlign: "center", paddingTop: "80px" }}>Hello, Ligal Sakhi!</h1>
  </div>
);
   ```
5. Open the app in a browser at the address shown by Vite, typically `http://localhost:5173`.

## Build for production

```bash
npm run build
```

## Notes

- The app entry point is `src/main.jsx`.
- The main component is `src/App.jsx`, which renders `src/components/WomenHelperUI.jsx`.
- If you want the favicon shown in the browser tab, keep `public/favicon.ico` in place and use the Vite dev server.
