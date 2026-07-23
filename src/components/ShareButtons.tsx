'use client';

import { useState } from 'react';
import { Facebook, Twitter, Link2, Check, Share2 } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const postUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/blog/${slug}`
    : '';
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(title);

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const zaloUrl = `https://zalo.me/share?link=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const shareLinks = [
    { label: 'Facebook', icon: Facebook, href: facebookUrl, bg: 'hover:bg-[#1877F2]', color: 'text-[#1877F2]' },
    { label: 'Zalo', icon: Share2, href: zaloUrl, bg: 'hover:bg-[#0068FF]', color: 'text-[#0068FF]' },
    { label: 'X', icon: Twitter, href: twitterUrl, bg: 'hover:bg-black', color: 'text-black' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Chia sẻ:</span>
      <div className="flex items-center gap-2">
        {shareLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chia sẻ lên ${link.label}`}
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:text-white hover:shadow-md ${link.bg} ${link.color}`}
            >
              <Icon className="h-4 w-4" />
            </a>
          );
        })}
        <button
          onClick={handleCopy}
          aria-label="Sao chép link"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-brand-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:shadow-md"
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
        </button>
        {copied && (
          <span className="text-xs font-medium text-green-600 animate-fade-in">Đã sao chép!</span>
        )}
      </div>
    </div>
  );
}
