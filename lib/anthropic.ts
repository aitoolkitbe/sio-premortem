import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY is niet ingesteld. Voeg de key toe in de Vercel-omgeving.',
    );
  }
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

export function getModel(): string {
  return process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
}

/**
 * Haal een messages-call op en geef de tekst terug.
 * Gooit een nette fout bij non-text content.
 */
export async function textComplete(options: {
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const anthropic = getAnthropic();
  const response = await anthropic.messages.create({
    model: getModel(),
    max_tokens: options.maxTokens ?? 4096,
    temperature: options.temperature ?? 0.4,
    system: options.system,
    messages: [{ role: 'user', content: options.user }],
  });

  const text = response.content
    .map((block) => (block.type === 'text' ? block.text : ''))
    .join('');

  if (!text.trim()) {
    throw new Error('Leeg antwoord van het model.');
  }

  return text.trim();
}

/**
 * Haal JSON uit een antwoord. Als het model ondanks instructies toch een
 * markdown-codeblok rond plakte, strippen we dat eerst.
 */
export function extractJson<T>(raw: string): T {
  let trimmed = raw.trim();

  // strip ```json ... ``` of ``` ... ```
  if (trimmed.startsWith('```')) {
    trimmed = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim();
  }

  // Zoek het eerste { en laatste } als een fallback
  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    trimmed = trimmed.slice(first, last + 1);
  }

  try {
    return JSON.parse(trimmed) as T;
  } catch (err) {
    throw new Error(
      `Kon JSON niet parsen uit model-antwoord. Eerste 200 tekens: ${trimmed.slice(0, 200)}`,
    );
  }
}
