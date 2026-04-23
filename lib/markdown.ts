/**
 * Piepkleine markdown → HTML renderer voor de deliverables.
 * Geen externe dependency: we ondersteunen enkel wat de acties-prompts produceren:
 * headers (##, ###), alinea's, vetgedrukt, cursief, ordered/unordered lists, blockquotes.
 * Voldoende voor scanbare weergave en PDF-print.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInline(s: string): string {
  let out = escapeHtml(s);
  // **bold**
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // *italic* or _italic_
  out = out.replace(/(?<!\*)\*(?!\*)([^\n*]+?)\*(?!\*)/g, '<em>$1</em>');
  out = out.replace(/(?<!_)_([^\n_]+?)_(?!_)/g, '<em>$1</em>');
  // `code`
  out = out.replace(/`([^`]+?)`/g, '<code>$1</code>');
  return out;
}

export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let inQuote = false;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      out.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  };
  const closeQuote = () => {
    if (inQuote) {
      out.push('</blockquote>');
      inQuote = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    // Empty line
    if (trimmed === '') {
      flushParagraph();
      closeList();
      closeQuote();
      continue;
    }

    // Headers
    const h = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (h) {
      flushParagraph();
      closeList();
      closeQuote();
      const level = h[1].length;
      out.push(`<h${level}>${renderInline(h[2])}</h${level}>`);
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushParagraph();
      closeList();
      if (!inQuote) {
        out.push('<blockquote>');
        inQuote = true;
      }
      out.push(`<p>${renderInline(trimmed.slice(2))}</p>`);
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      closeQuote();
      if (listType !== 'ul') {
        closeList();
        out.push('<ul>');
        listType = 'ul';
      }
      out.push(`<li>${renderInline(trimmed.replace(/^[-*]\s+/, ''))}</li>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      closeQuote();
      if (listType !== 'ol') {
        closeList();
        out.push('<ol>');
        listType = 'ol';
      }
      out.push(`<li>${renderInline(trimmed.replace(/^\d+\.\s+/, ''))}</li>`);
      continue;
    }

    // Default: paragraph line
    closeList();
    closeQuote();
    paragraph.push(trimmed);
  }

  flushParagraph();
  closeList();
  closeQuote();

  return out.join('\n');
}
