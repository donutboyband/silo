// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // No code blocks on the site, and Shiki's inline styles would break the CSP.
  markdown: { syntaxHighlight: false },
  security: {
    // Astro writes a Content-Security-Policy <meta> into every page, with
    // hashes for the styles and scripts it emits. Everything else is
    // locked to this origin: no third-party fonts, images or frames.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self'",
        "font-src 'self'",
        // Cloudflare Web Analytics beacon reports here
        "connect-src 'self' https://cloudflareinsights.com",
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'none'",
      ],
      // Cloudflare injects its Web Analytics beacon into every page on the zone
      scriptDirective: {
        resources: ["'self'", 'https://static.cloudflareinsights.com'],
      },
    },
  },
});
