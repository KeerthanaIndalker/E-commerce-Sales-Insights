interface Props {
  onUpload: () => void;
}

export function HowItWorks({ onUpload }: Props) {
  const steps = [
    {
      title: "Upload Your File",
      desc: "Drag and drop or browse to upload your sales data file. Supports CSV and JSON formats. Your data is processed entirely in your browser and never sent to any server.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5 7.5 12M12 7.5v9" />
      ),
    },
    {
      title: "Configure Your Data",
      desc: "Optionally set a maximum number of rows to analyse. Useful for large files where you want faster performance. Leave blank to analyse everything.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 12h12M10 18h4" />
      ),
    },
    {
      title: "Map Your Columns",
      desc: "After upload, tell the app which columns in your file represent the date, revenue, product name, and customer ID. Works with any column naming convention — your file doesn't need to follow any specific format.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v18M9.75 3v18M15.75 3v18M3.75 9h18M3.75 15h18" />
      ),
    },
    {
      title: "Analyse and Download",
      desc: "Instantly see KPI cards, sales trend charts, product performance, customer behaviour breakdowns, and a searchable data table. Filter by date range and download reports as CSV or PDF anytime.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l3-3 4 4 5-6M16 6h4v4" />
      ),
    },
  ];

  const faqs = [
    { q: "Is my data stored anywhere?", a: "No. All processing happens in your browser using JavaScript. Nothing is uploaded to any server." },
    { q: "What if my CSV has different column names?", a: "The column mapper lets you assign which column means what. Any naming works." },
    { q: "How large a file can I upload?", a: "Depends on your browser and device. For best performance on files over 50,000 rows, use the row limit setting." },
    { q: "What file formats are supported?", a: "CSV files with headers in row 1, and JSON files as an array of objects or an object with a data array." },
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">How It Works</h1>
        <p className="mt-4 text-lg text-muted-foreground">Get from raw data to insights in 4 simple steps.</p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {steps.map((s, i) => (
          <div key={i} className="group rounded-2xl border bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-elevated">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-hero shadow-glow">
                <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {s.icon}
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">Step {i + 1}</div>
                <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="group rounded-xl border bg-card p-5 shadow-card">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold">
                {f.q}
                <span className="ml-4 text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-14 text-center">
        <button
          onClick={onUpload}
          className="rounded-md gradient-hero px-6 py-3 text-base font-semibold text-primary-foreground shadow-elevated transition-smooth hover:opacity-90"
        >
          Upload Your File
        </button>
      </div>
    </main>
  );
}
