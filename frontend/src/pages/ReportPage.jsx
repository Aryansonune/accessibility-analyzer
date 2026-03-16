// src/pages/ReportPage.jsx

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import IssueCard from "../components/IssueCard";

export default function ReportPage() {

  const { state } = useLocation();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);

  useEffect(() => {

    if (state?.result) {

      setReport(state);

      sessionStorage.setItem(
        "a11y_last_report",
        JSON.stringify(state)
      );

    } else {

      const stored = sessionStorage.getItem("a11y_last_report");

      if (stored) {
        setReport(JSON.parse(stored));
      }

    }

  }, [state]);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Analyzer
        </button>

      </div>
    );
  }

  const { result, url } = report;

  const errors = result.errors || [];
  const warnings = result.warnings || [];
  const tips = result.suggestions || [];

  const total = errors.length + warnings.length + tips.length;

  // -----------------------------
  // Download JSON
  // -----------------------------

  function downloadJSON() {

    const data = { url, result };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "accessibility-report.json";

    link.click();
  }

  // -----------------------------
  // Download TXT
  // -----------------------------

  function downloadTXT() {

    const lines = [];

    lines.push(`Accessibility Report for ${url}`);
    lines.push("");

    if (errors.length) {
      lines.push("Errors:");
      errors.forEach(e => lines.push(`- ${e.message}`));
      lines.push("");
    }

    if (warnings.length) {
      lines.push("Warnings:");
      warnings.forEach(w => lines.push(`- ${w.message}`));
      lines.push("");
    }

    if (tips.length) {
      lines.push("Tips:");
      tips.forEach(t => lines.push(`- ${t.message}`));
    }

    const blob = new Blob(
      [lines.join("\n")],
      { type: "text/plain" }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "accessibility-report.txt";

    link.click();
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}

      <div className="bg-white border-b">

        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">

          <button
            onClick={() => navigate(-1)}
            className="text-slate-500"
          >
            ←
          </button>

          <div>

            <div className="text-lg font-bold">
              Analysis Report
            </div>

            <div className="text-sm text-slate-500">
              {url}
            </div>

          </div>

          <div className="ml-auto flex gap-3">

            <button
              onClick={downloadJSON}
              className="px-3 py-2 border rounded-lg bg-white hover:shadow-sm text-sm"
            >
              Download JSON
            </button>

            <button
              onClick={downloadTXT}
              className="px-3 py-2 border rounded-lg bg-white hover:shadow-sm text-sm"
            >
              Download TXT
            </button>

          </div>

        </div>

      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Summary */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow">

            <div className="text-4xl font-bold">
              {total}
            </div>

            <div className="text-sm text-slate-500">
              Total Issues
            </div>

          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-red-200">

            <div className="text-4xl font-bold text-red-600">
              {errors.length}
            </div>

            <div className="text-sm text-slate-500">
              Errors
            </div>

          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-yellow-200">

            <div className="text-4xl font-bold text-yellow-600">
              {warnings.length}
            </div>

            <div className="text-sm text-slate-500">
              Warnings
            </div>

          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-blue-200">

            <div className="text-4xl font-bold text-blue-600">
              {tips.length}
            </div>

            <div className="text-sm text-slate-500">
              Tips
            </div>

          </div>

        </div>

        {/* Issue Cards */}

        <div className="grid md:grid-cols-3 gap-6">

          <IssueCard
            title="Errors"
            items={errors}
            color="red"
          />

          <IssueCard
            title="Warnings"
            items={warnings}
            color="yellow"
          />

          <IssueCard
            title="Tips"
            items={tips}
            color="blue"
          />

        </div>
      </div>
    </div>
  );
}