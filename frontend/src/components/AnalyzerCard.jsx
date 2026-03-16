// src/components/AnalyzerCard.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AnalyzerCard() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const navigate = useNavigate();

  const persistAndNavigate = (data, urlForReport) => {
    try {
      sessionStorage.setItem(
        "a11y_last_report",
        JSON.stringify({ result: data, url: urlForReport })
      );
    } catch (e) {
      console.warn("sessionStorage write failed", e);
    }

    navigate("/report", { state: { result: data, url: urlForReport } });
  };

  const analyze = async () => {
    setStatusText("");

    if (!url || !String(url).trim()) {
      setStatusText("Please enter a URL (e.g. https://example.com)");
      return;
    }

    setLoading(true);

    let requestUrl = url.trim();

    try {
      new URL(requestUrl);
    } catch (_) {
      requestUrl = "https://" + requestUrl;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/analyze",
        { url: requestUrl },
        { timeout: 20000 }
      );

      if (res?.data?.error) {
        setStatusText(String(res.data.error));
        return;
      }

      const data = res?.data;

      const hasSummary =
        data && typeof data.summary === "object" && data.summary !== null;

      const hasArrays =
        data &&
        (Array.isArray(data.errors) ||
          Array.isArray(data.warnings) ||
          Array.isArray(data.suggestions));

      if (!data || !hasSummary || !hasArrays) {
        setStatusText(
          "Unexpected response from server. The API must return a report object."
        );
        console.error("Unexpected analyze response:", res?.data);
        return;
      }

      // Navigate to report page
      persistAndNavigate(data, requestUrl);
    } catch (err) {
      console.error("Analyze request failed:", err);

      const serverMsg =
        err?.response?.data?.error || err?.response?.data || err?.message;

      setStatusText(
        serverMsg
          ? `Error: ${serverMsg}`
          : "Network error contacting backend. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const onUpload = async (evt) => {
    const file = evt.target.files?.[0];
    if (!file) return;

    setStatusText("");
    setLoading(true);

    try {
      await file.text();
      setStatusText(
        "File loaded. To analyze uploaded HTML, add a backend endpoint that accepts raw HTML."
      );
    } catch (e) {
      console.error("File read error:", e);
      setStatusText("Failed to read uploaded file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-card bg-white rounded-2xl p-8 shadow-soft">
      <div>
        <div className="flex-1">
          <label className="sr-only">Website URL</label>

          <div className="flex items-center gap-3">
            <div className="flex items-center px-3 py-2 rounded border bg-slate-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c2.5 2.5 2.5 17.5 0 20m0-20c-2.5 2.5-2.5 17.5 0 20M2 12h20"
                />
              </svg>
            </div>

            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={loading}
            />

            <button
              onClick={analyze}
              className="ml-2 bg-a11yBlue text-white px-5 py-2 rounded-lg shadow hover:bg-blue-500 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze →"}
            </button>
          </div>

          <div className="mt-6 border-t pt-4 text-center text-sm text-slate-400">
            OR UPLOAD HTML
          </div>

          <label className="mt-4 block cursor-pointer">
            <div className="mt-4 rounded-lg border-2 border-dashed border-slate-200 p-10 text-center bg-slate-50">
              <div className="text-slate-500">
                Click to upload an HTML file
              </div>
              <input
                type="file"
                accept=".html"
                onChange={onUpload}
                className="hidden"
              />
            </div>
          </label>

          {statusText && (
            <div className="mt-4 text-sm text-amber-600">
              {statusText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}