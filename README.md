# SalesIQ — E-commerce Sales Insights Dashboard

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_Local-green)](https://github.com)

**SalesIQ** is a high-performance, privacy-focused e-commerce analytics dashboard. It allows you to transform raw sales data (CSV or JSON) into actionable insights instantly—without ever uploading your data to a server.

---

## Key Features

- **Local Processing:** Your data never leaves your browser. All parsing, processing, and visualization happen locally.
- **Intelligent Auto-Detection:** Automatically maps your CSV/JSON columns (Revenue, Date, Product Names, etc.) using smart heuristics.
- **Interactive Dashboards:** Visualize trends, customer behavior, and product performance with beautiful, responsive charts.
- **Custom Column Mapping:** If auto-detection isn't perfect, use the intuitive mapper to manually link your data fields.
- **PDF Export:** Generate professional reports of your sales insights with a single click.
- **Performance Optimized:** Leveraging **React 19** and **TanStack Start** for a near-instantaneous user experience.

---

## Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Routing & State:** [TanStack Start](https://tanstack.com/router/v1) (Router + Query)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Components:** [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **Visualizations:** [Recharts](https://recharts.org/)
- **Parsing:** [PapaParse](https://www.papaparse.com/)
- **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KeerthanaIndalker/E-commerce-Sales-Insights.git
   cd E-commerce-Sales-Insights
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## Deployment

### Deploy to Vercel

The easiest way to deploy this project is via the [Vercel Platform](https://vercel.com/new):

1.  Push your code to a GitHub repository.
2.  Import your repository into Vercel.
3.  Vercel will auto-detect the configuration via the `vercel.json` file.
4.  Click **Deploy**.

The project is configured to use the `.output` directory for deployment, which is where the production-ready server and assets are generated.

---

## Project Structure

```text
├── src/
│   ├── components/       # UI components (Radix + Lucide)
│   │   ├── dashboard/    # Specialized dashboard charts & cards
│   │   └── ui/           # Base shadcn-style components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Logic: Parsers, Aggregators, Auto-detection
│   ├── routes/           # TanStack Router pages
│   └── styles/           # Tailwind 4 global styles
├── public/               # Static assets
└── vite.config.ts        # Vite configuration
```

---

## Contributing

Contributions are welcome! If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Contact

**Keerthana Indalker** - [GitHub Profile](https://github.com/KeerthanaIndalker)

Project Link: [https://github.com/KeerthanaIndalker/E-commerce-Sales-Insights](https://github.com/KeerthanaIndalker/E-commerce-Sales-Insights)
