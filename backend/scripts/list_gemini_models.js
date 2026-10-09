const key = process.env.GEMINI_API_KEY;
if (!key) {
  const dotenv = await import('dotenv');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_KEY_MISSING');
  process.exit(1);
}

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
const body = await res.json();
if (!res.ok) {
  console.error('LIST_MODELS_FAILED', res.status, body.error?.message || 'unknown');
  process.exit(1);
}

const names = (body.models || [])
  .filter((m) => (m.supportedGenerationMethods || []).includes('generateContent'))
  .map((m) => m.name.replace(/^models\//, ''));

console.log('GENERATE_CONTENT_MODELS');
for (const name of names) console.log(name);
