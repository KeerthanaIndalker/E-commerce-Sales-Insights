import { useState, useCallback } from "react";

interface Props {
  onUpload: (file: File, maxRows?: number) => void;
  error?: string | null;
}

export function UploadZone({ onUpload, error }: Props) {
  const [drag, setDrag] = useState(false);
  const [maxRowsStr, setMaxRowsStr] = useState("");

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const max = maxRowsStr.trim() ? parseInt(maxRowsStr, 10) : undefined;
    onUpload(file, max && max > 0 ? max : undefined);
  }, [maxRowsStr, onUpload]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <label
        htmlFor="file-input"
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`block cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-smooth bg-card shadow-card hover:shadow-elevated ${
          drag ? "border-primary bg-accent" : "border-border"
        }`}
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-hero shadow-glow">
          <svg className="h-8 w-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5 7.5 12M12 7.5v9" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-foreground">Drag and drop your CSV or JSON file here</p>
        <p className="mt-1 text-sm text-muted-foreground">or</p>
        <span className="mt-4 inline-flex items-center justify-center rounded-md gradient-hero px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elevated transition-smooth hover:opacity-90">
          Browse File
        </span>
        <p className="mt-4 text-xs text-muted-foreground">.csv and .json supported</p>
        <input
          id="file-input"
          type="file"
          accept=".csv,.json,application/json,text/csv"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {error && (
        <div className="mt-4 rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-xl border bg-card p-5 shadow-card">
        <label className="block text-sm font-medium text-foreground" htmlFor="max-rows">
          Max rows to analyse
        </label>
        <input
          id="max-rows"
          type="number"
          min={1}
          value={maxRowsStr}
          onChange={(e) => setMaxRowsStr(e.target.value)}
          placeholder="Leave blank to analyse all rows"
          className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Limit rows for faster performance on large files.
        </p>
      </div>

      <details className="mt-6 rounded-xl border bg-card p-5 shadow-card">
        <summary className="cursor-pointer text-sm font-semibold text-foreground">
          Supported file formats
        </summary>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li><span className="font-medium text-foreground">CSV:</span> must have headers in row 1.</li>
          <li><span className="font-medium text-foreground">JSON:</span> array of objects <code className="rounded bg-muted px-1">[ {`{...}`}, {`{...}`} ]</code> or <code className="rounded bg-muted px-1">{`{ data: [...] }`}</code>.</li>
        </ul>
      </details>
    </div>
  );
}
