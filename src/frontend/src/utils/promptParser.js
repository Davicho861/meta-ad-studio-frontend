// Simple prompt parser to extract flags like --ar, --seed, --negative
function parsePrompt(raw) {
  if (!raw || typeof raw !== 'string') return { prompt: '', params: {} };

  const parts = raw.match(/(?:["'].+?["']|[^\s])+|\s+/g) || [];
  // We'll use a simple tokenization by spaces but respect quoted strings
  const tokens = [];
  let buffer = '';
  let inQuotes = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === '"' || ch === "'") {
      inQuotes = !inQuotes;
      buffer += ch;
      continue;
    }
    if (!inQuotes && ch === ' ') {
      if (buffer.length) tokens.push(buffer);
      buffer = '';
      continue;
    }
    buffer += ch;
  }
  if (buffer.length) tokens.push(buffer);

  const params = {};
  const promptWords = [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.startsWith('--')) {
      const key = t.slice(2);
      // If next token exists and doesn't start with --, treat as value
      const next = tokens[i + 1];
      if (next && !next.startsWith('--')) {
        params[key] = stripQuotes(next);
        i++;
      } else {
        params[key] = true;
      }
    } else {
      promptWords.push(t);
    }
  }

  const prompt = promptWords.join(' ').trim();

  // Map some known aliases
  const mapped = {};
  if (params.ar) mapped.aspect_ratio = params.ar;
  if (params.seed) mapped.seed = Number(params.seed) || params.seed;
  if (params.negative) mapped.negative_prompt = params.negative;
  if (params['no']) mapped.negative_prompt = params['no'];

  // include unknown params under params
  return { prompt, params: Object.assign({}, params, mapped) };
}

function stripQuotes(s) {
  if (!s) return s;
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

export { parsePrompt };
