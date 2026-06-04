// lib/groq.ts
// Cliente Groq. SERVER-SIDE ONLY — solo importar desde app/api/chat/route.ts.
// Nunca importar en componentes cliente: GROQ_API_KEY no está disponible en el browser.

import Groq from 'groq-sdk';

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const GROQ_MODEL = 'llama-3.3-70b-versatile';
