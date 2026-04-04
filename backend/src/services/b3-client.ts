/**
 * B3 API Client — Área do Investidor (Certificação)
 * mTLS + OAuth 2.0 client_credentials
 */
import fs from "fs";
import https from "https";

const B3_TOKEN_URL = process.env.B3_TOKEN_URL || "";
const B3_TOKEN_SCOPE = process.env.B3_TOKEN_SCOPE || "";
const B3_CLIENT_ID = process.env.B3_CLIENT_ID || "";
const B3_CLIENT_SECRET = process.env.B3_CLIENT_SECRET || "";
const B3_CERT_PATH = process.env.B3_CERT_PATH || "";
const B3_KEY_PATH = process.env.B3_KEY_PATH || "";
const B3_BASE_URL = process.env.B3_BASE_URL || "";

// Token cache
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Get OAuth2 token via client_credentials grant.
 * Caches for 50 min (token expires in 60).
 */
export async function getB3Token(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: B3_CLIENT_ID,
    client_secret: B3_CLIENT_SECRET,
    scope: B3_TOKEN_SCOPE,
  }).toString();

  const res = await fetch(B3_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`B3 token error ${res.status}: ${text}`);
  }

  const data = JSON.parse(text);
  cachedToken = data.access_token;
  // Cache for 50 minutes
  tokenExpiresAt = Date.now() + 50 * 60 * 1000;

  console.log("[B3] Token obtained, expires in 50min");
  return cachedToken!;
}

/**
 * mTLS https.Agent — reads cert+key from disk.
 */
function createAgent(): https.Agent {
  return new https.Agent({
    cert: fs.readFileSync(B3_CERT_PATH),
    key: fs.readFileSync(B3_KEY_PATH),
    rejectUnauthorized: true,
  });
}

/**
 * Call B3 API with mTLS + Bearer token.
 */
export async function callB3Api(
  method: string,
  path: string,
  params?: Record<string, string>
): Promise<any> {
  const token = await getB3Token();
  const agent = createAgent();

  let url = `${B3_BASE_URL}${path}`;
  if (params && Object.keys(params).length > 0) {
    const qs = new URLSearchParams(params).toString();
    url += (url.includes("?") ? "&" : "?") + qs;
  }

  console.log(`[B3] >> ${method} ${url}`);

  // Node fetch doesn't support https.Agent directly — use undici dispatcher workaround
  // Instead, use native https.request for mTLS
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options: https.RequestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method,
      agent,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        console.log(`[B3] << ${res.statusCode} ${path}`);
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`B3 API ${res.statusCode}: ${data}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.end();
  });
}
