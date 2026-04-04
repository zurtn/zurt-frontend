import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Use destructive (red) only for backend 400/500; use warning for other errors. */
export function getToastVariantForApiError(err: unknown): "destructive" | "warning" {
  const status = (err as { statusCode?: number; response?: { status?: number } })?.statusCode
    ?? (err as { response?: { status?: number } })?.response?.status;
  if (typeof status === "number" && (status === 400 || status >= 500)) return "destructive";
  return "warning";
}

/** Format number as Brazilian currency (e.g. R$ 15.000,00) */
export function formatCurrencyBR(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Parse Brazilian currency string to number (accepts "R$ 15.000,00", "15000", "15.000,50", etc.) */
export function parseCurrencyBR(str: string): number {
  if (typeof str !== "string" || str.trim() === "") return 0;
  const cleaned = str
    .replace(/\s/g, "")
    .replace(/R\$/gi, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return parseFloat(cleaned) || 0;
}

/**
 * Download a message attachment with auth. Fetches with Bearer token, then triggers a file download.
 * @param fullUrl - Full URL to the attachment (e.g. getApiBaseUrl().replace(/\/api\/?$/, "") + attachmentUrl)
 * @param filename - Suggested filename for the download
 * @returns Promise that resolves when download has started, rejects on fetch error
 */
export async function downloadMessageAttachment(
  fullUrl: string,
  filename: string
): Promise<void> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(fullUrl, { method: "GET", headers, credentials: "include" });
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${res.statusText}`);

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "attachment";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
