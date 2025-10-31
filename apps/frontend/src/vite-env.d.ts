/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_GOOGLE_ALLOWED_DOMAINS?: string; // Comma-separated domains for admin Google sign-in
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
