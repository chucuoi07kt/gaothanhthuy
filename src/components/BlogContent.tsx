'use client';

import { useEffect, useMemo, useRef } from 'react';
import parse, { type DOMNode, type Element, type HTMLReactParserOptions } from 'html-react-parser';
import hljs from 'highlight.js/lib/common';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogContentHandle {
  getToc: () => TocItem[];
}

interface BlogContentProps {
  html: string;
  onTocReady?: (toc: TocItem[]) => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function BlogContent({ html, onTocReady }: BlogContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const toc = useMemo(() => {
    const items: TocItem[] = [];
    if (!html) return items;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div id="__root">${html}</div>`, 'text/html');
      const headings = doc.querySelectorAll('#__root h1, #__root h2, #__root h3, #__root h4, #__root h5, #__root h6');

      headings.forEach((h) => {
        const level = parseInt(h.tagName[1], 10);
        const text = h.textContent || '';
        if (!text.trim()) return;
        let id = h.id || slugify(text);
        if (!id) id = `heading-${items.length}`;
        h.id = id;
        items.push({ id, text: text.trim(), level });
      });

      return items;
    } catch {
      return items;
    }
  }, [html]);

  useEffect(() => {
    onTocReady?.(toc);
  }, [toc, onTocReady]);

  // Post-process: syntax highlight + responsive tables + lazy images
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // Wrap tables
    root.querySelectorAll('table').forEach((table) => {
      if (table.parentElement?.classList.contains('table-wrap')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrap my-6';
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // Lazy-load images + responsive
    root.querySelectorAll('img').forEach((img) => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      img.classList.add('rounded-xl', 'w-full', 'h-auto');
      if (!img.alt) img.alt = 'Hình ảnh bài viết';
    });

    // Syntax highlight code blocks
    root.querySelectorAll('pre code').forEach((block) => {
      try {
        hljs.highlightElement(block as HTMLElement);
      } catch {
        // skip if language not detected
      }
    });

    // Make links open in new tab safely
    root.querySelectorAll('a').forEach((a) => {
      const href = a.getAttribute('href');
      if (href && (href.startsWith('http://') || href.startsWith('https://')) && !a.getAttribute('target')) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }, [html]);

  const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      if (domNode.type !== 'tag') return;

      const el = domNode as Element;
      // Add heading IDs during parse as fallback
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(el.name)) {
        const text = extractText(el);
        if (text && !el.attribs.id) {
          el.attribs.id = slugify(text) || `heading-${text.length}`;
        }
      }
    },
  };

  return (
    <div
      ref={containerRef}
      className="prose prose-blog max-w-none prose-headings:scroll-mt-24 prose-headings:font-display prose-headings:text-brand-900 prose-p:leading-relaxed prose-a:text-brand-700 prose-a:no-underline hover:prose-a:underline prose-strong:text-brand-900 prose-blockquote:border-l-brand-500 prose-blockquote:bg-brand-50/40 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-code:rounded prose-code:bg-brand-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-brand-700 prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-xl prose-pre:border prose-pre:border-border/20 prose-img:shadow-soft"
    >
      {parse(html || '<p>Nội dung đang được cập nhật...</p>', options)}
    </div>
  );
}

function extractText(node: DOMNode): string {
  if (node.type === 'text') return (node as unknown as { data: string }).data;
  if (node.type === 'tag') {
    const el = node as Element;
    return (el.children || []).map((child) => extractText(child as DOMNode)).join('');
  }
  return '';
}
