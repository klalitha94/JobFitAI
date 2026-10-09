import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../src/config/config.js';

if (!config.geminiApiKey) {
  console.error('GEMINI_KEY_MISSING');
  process.exitCode = 1;
} else {
  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  const candidates = [
    config.geminiModel,
    'gemini-flash-latest',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite',
  ];
  const tried = new Set();
  let success = false;

  for (const modelName of candidates) {
    if (tried.has(modelName)) continue;
    tried.add(modelName);
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' },
      });
      const result = await model.generateContent(
        'Return JSON {"ok":true,"source":"gemini"} and nothing else.',
      );
      const text = result.response.text();
      console.log('GEMINI_SUCCESS_MODEL', modelName);
      console.log('GEMINI_RAW_LEN', text.length);
      console.log('GEMINI_BODY_OK', /"ok"\s*:\s*true/.test(text));
      success = true;
      break;
    } catch (error) {
      const msg = (error.message || '').replace(/\s+/g, ' ').slice(0, 220);
      console.log('GEMINI_TRY_FAIL', modelName, error.status || '', msg);
    }
  }

  if (!success) {
    console.error('GEMINI_ALL_ATTEMPTS_FAILED');
    process.exitCode = 1;
  }
}
