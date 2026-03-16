// src/components/IssueCard.jsx
import React from "react";

/**
 * IssueCard
 * Props:
 * - title: string (card title, e.g. "Errors")
 * - items: array of strings OR objects like { message, wcag, fix, type }
 * - color: 'red' | 'yellow' | 'green' | 'blue'  (defaults to 'blue')
 */
export default function IssueCard({ title, items = [], color = "blue" }) {
  // Tailwind-friendly concrete classes (avoid dynamic class strings)
  const colorMap = {
    red: {
      bg: "bg-red-50",
      border: "border-red-100",
      text: "text-red-600",
      badgeBg: "bg-red-50",
      badgeText: "text-red-600",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      text: "text-yellow-600",
      badgeBg: "bg-yellow-50",
      badgeText: "text-yellow-600",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-600",
      badgeBg: "bg-green-50",
      badgeText: "text-green-600",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-600",
      badgeBg: "bg-blue-50",
      badgeText: "text-blue-600",
    },
  };

  const classes = colorMap[color] || colorMap.blue;

  // helper: normalize incoming item to { text, wcag, fix, type }
  const normalize = (raw, fallbackType) => {
    if (!raw) return null;
    if (typeof raw === "string") {
      return { text: raw, wcag: "", fix: "", type: fallbackType || "tip" };
    }
    // object
    const text = raw.message || raw.text || raw.title || raw.msg || "";
    const wcag = raw.wcag || raw.guideline || raw.rule || "";
    const fix = raw.fix || raw.suggestion || raw.recommendation || raw.repair || "";
    const type = raw.type || fallbackType || "tip";
    return { text: text || JSON.stringify(raw), wcag, fix, type };
  };

  // icons by type
  const Icon = ({ type }) => {
    if (type === "error") {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2l8 14H4L12 2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (type === "warning") {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2l8 14H4L12 2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    // tip / suggestion
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  };

  return (
    <div className={`rounded-lg p-4 ${classes.bg} ${classes.border} border`}>
      <h3 className={`font-bold ${classes.text} mb-3`}>
        {title} <span className="text-sm text-slate-500 ml-2">({items?.length ?? 0})</span>
      </h3>

      <ul className="space-y-3">
        {items && items.length > 0 ? (
          items.map((raw, i) => {
            const item = normalize(raw, color === "red" ? "error" : color === "yellow" ? "warning" : "tip");
            if (!item) return null;
            return (
              <li key={i} className="bg-white rounded-lg p-3 border shadow-sm">
                <div className="flex gap-3 items-start">
                  <div className={`${classes.text} pt-1`}>
                    <Icon type={item.type} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="font-medium text-slate-800 break-all">{item.text}
                      </div>
                      <div className="ml-auto">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${classes.badgeBg} ${classes.badgeText}`}>
                          {item.type === "error" ? "Error" : item.type === "warning" ? "Warning" : "Tip"}
                        </span>
                      </div>
                    </div>

                    {item.wcag ? (
                      <div className="mt-2 text-sm text-slate-400 break-all">WCAG: {item.wcag}</div>
                    ) : null}

                    {item.fix ? (
                      <div className="mt-2 text-sm text-green-600 break-all">💡 {item.fix}</div>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <li className="text-sm text-slate-500 break-all">No issues
            className="bg-white rounded-lg p-3 border shadow-sm max-w-full"
          </li>
        )}
      </ul>
    </div>
  );
}