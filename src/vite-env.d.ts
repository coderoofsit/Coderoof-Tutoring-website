/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BREVO_API_KEY?: string;
	readonly VITE_BREVO_BASE_URL?: string;
	readonly VITE_BREVO_SENDER_EMAIL?: string;
	readonly VITE_BREVO_SENDER_NAME?: string;
	readonly VITE_BREVO_NOTIFICATION_EMAIL?: string;
	readonly VITE_BREVO_TEMPLATE_ID?: string;
	readonly VITE_BREVO_DEFAULT_TAGS?: string;
	readonly VITE_BREVO_REPLY_TO_EMAIL?: string;
	readonly VITE_BREVO_REPLY_TO_NAME?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
