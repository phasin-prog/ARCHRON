// Cloudflare R2 — S3-compatible client
// R2 uses S3 API with custom endpoint
// Env vars: R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME

import { S3Client } from "@aws-sdk/client-s3";

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}

let _client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (_client) return _client;

  _client = new S3Client({
    region: "auto",
    endpoint: requireEnv("R2_ENDPOINT"),
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
    forcePathStyle: true,
  });

  return _client;
}

export function getR2Bucket(): string {
  return requireEnv("R2_BUCKET_NAME");
}

export function getR2PublicUrl(key: string): string {
  // Cloudflare R2 public bucket URL pattern:
  // If using a custom domain: https://assets.archron.app/{key}
  // If using R2.dev: https://{bucket}.{account-id}.r2.cloudflarestorage.com/{key}
  // Use NEXT_PUBLIC_R2_PUBLIC_URL env for the base URL
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (base) return `${base.replace(/\/$/, "")}/${key}`;
  
  // Fallback: construct from endpoint
  const bucket = requireEnv("R2_BUCKET_NAME");
  const endpoint = requireEnv("R2_ENDPOINT");
  const url = new URL(endpoint);
  return `${url.protocol}//${bucket}.${url.hostname}/${key}`;
}