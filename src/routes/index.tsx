import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Loading } from "@/components/Loading";
import { UploadZone } from "@/components/UploadZone";
import { HowItWorks } from "@/components/HowItWorks";
import { ColumnMapper } from "@/components/ColumnMapper";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { parseFile, type ParseResult } from "@/lib/parsers";
import type { ColumnMapping } from "@/lib/aggregators";
import { autoDetect } from "@/lib/autoDetect";

export const Route = createFileRoute("/")({
  component: App,
  head: () => ({
    meta: [
      { title: "SalesIQ — Turn Your Sales Data Into Insights" },
      { name: "description", content: "Upload your CSV or JSON sales file and get instant analytics in your browser. No account, no upload, no tracking." },
    ],
  }),
});

type View = "home" | "how" | "mapper" | "dashboard";

function App() {
  const [view, setView] = useState<View>("home");
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File, maxRows?: number) => {
    setError(null);
    setLoading(true);
    try {
      const result = await parseFile(file, maxRows);
      setParsed(result);
      const detected = autoDetect(result);
      if (detected.mapping) {
        setMapping(detected.mapping);
        setView("dashboard");
      } else {
        setMapping(null);
        setView("mapper");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse file.");
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    setView("home");
    setError(null);
  };

  const uploadNew = () => {
    setParsed(null);
    setMapping(null);
    setError(null);
    setView("home");
  };

  const navCurrent = view === "how" ? "how" : "home";
  const showUploadNew = view === "dashboard";

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        current={navCurrent}
        onNavigate={(p) => {
          if (p === "home") goHome();
          else setView("how");
        }}
        showUploadNew={showUploadNew}
        onUploadNew={uploadNew}
      />

      {view === "home" && (
        <main className="mx-auto max-w-7xl px-6 py-12 sm:py-20 animate-fade-in">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card">
              <span className="h-2 w-2 rounded-full bg-success" /> 100% local · no upload · no account
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Turn Your Sales Data <br className="hidden sm:block" />
              Into <span className="text-gradient">Insights</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Upload your CSV or JSON — we'll auto-detect the columns and instantly show your sales trends, customer behavior, and top products. No account needed. Your data never leaves your browser.
            </p>
          </div>

          <div className="mt-12">
            {loading ? (
              <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-12 shadow-card">
                <Loading />
              </div>
            ) : (
              <UploadZone onUpload={handleUpload} error={error} />
            )}
          </div>
        </main>
      )}

      {view === "how" && <HowItWorks onUpload={goHome} />}

      {view === "mapper" && parsed && (
        <ColumnMapper
          parsed={parsed}
          onConfirm={(m) => { setMapping(m); setView("dashboard"); }}
          onBack={goHome}
        />
      )}

      {view === "dashboard" && parsed && mapping && (
        <Dashboard parsed={parsed} mapping={mapping} onUploadNew={uploadNew} />
      )}
    </div>
  );
}
