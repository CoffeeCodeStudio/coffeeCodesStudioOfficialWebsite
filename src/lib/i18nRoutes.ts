// Helpers for /en URL-prefix language strategy. Public, indexable routes
// have both a Swedish (default) and an English variant. Admin/portal/legal
// internal routes stay Swedish-only.

export const SITE_URL = "https://coffeecodestudio.se";

// Routes that have an English /en/* equivalent and emit hreflang.
export const LOCALIZED_PUBLIC_PATHS = [
  "/",
  "/frisor-goteborg",
  "/smaforetag-goteborg",
  "/integritetspolicy",
  "/cookiepolicy",
  "/anvandardvillkor",
];

export type Lang = "sv" | "en";

/** Detect language from a pathname. /en or /en/* → en, otherwise sv. */
export function detectLang(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "sv";
}

/** Strip the /en prefix, returning the canonical Swedish-side pathname. */
export function stripLangPrefix(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3); // "/en/foo" → "/foo"
  return pathname;
}

/** Build the equivalent pathname for a target language. */
export function pathForLang(pathname: string, lang: Lang): string {
  const base = stripLangPrefix(pathname);
  if (lang === "sv") return base;
  return base === "/" ? "/en" : `/en${base}`;
}

/** True if this pathname has both sv and en variants (eligible for hreflang). */
export function isLocalizedPath(pathname: string): boolean {
  return LOCALIZED_PUBLIC_PATHS.includes(stripLangPrefix(pathname));
}
