import { useEffect, useRef } from "react";

/**
 * Renders a captured static page (HTML/CSS/JS snapshot) literally, preserving
 * the original DOM, styles and scripts. The page is fetched from /dp/...,
 * its body nodes are injected, its stylesheet linked, and its scripts
 * executed in document order with relative URLs resolved against the page's
 * captured base path.
 */
export function CapturedPage({ base }: { base: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const hostEl = hostRef.current;
    if (!hostEl) return;
    const host: HTMLDivElement = hostEl;
    const cssLinks: HTMLLinkElement[] = [];

    async function run() {
      let html: string;
      try {
        const res = await fetch(`${base}/index.html`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        html = await res.text();
      } catch {
        if (!cancelled) {
          host.innerHTML =
            '<div style="padding:48px;text-align:center;font-family:system-ui">Não foi possível carregar esta página.</div>';
        }
        return;
      }
      if (cancelled) return;

      const doc = new DOMParser().parseFromString(html, "text/html");
      if (doc.title) document.title = doc.title;

      // Page stylesheet (captured next to index.html).
      try {
        const cssRes = await fetch(`${base}/styles.css`, { method: "HEAD" });
        if (cssRes.ok && !cancelled) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = `${base}/styles.css`;
          link.dataset["capturedPage"] = base;
          document.head.appendChild(link);
          cssLinks.push(link);
        }
      } catch {
        /* stylesheet optional */
      }
      if (cancelled) return;

      // Inject captured body nodes literally.
      host.innerHTML = "";
      const frag = document.createDocumentFragment();
      Array.from(doc.body.childNodes).forEach((n) => frag.appendChild(n));
      host.appendChild(frag);

      // Execute captured scripts in order, resolving relative URLs.
      const scripts = Array.from(doc.querySelectorAll("script"));
      for (const s of scripts) {
        if (cancelled) break;
        const el = document.createElement("script");
        for (const attr of Array.from(s.attributes)) {
          if (attr.name === "src") continue;
          el.setAttribute(attr.name, attr.value);
        }
        const src = s.getAttribute("src");
        if (src) {
          el.src = /^(https?:)?\/\//.test(src)
            ? src
            : new URL(src, window.location.origin + base + "/").pathname +
              new URL(src, window.location.origin + base + "/").search;
        } else {
          el.textContent = s.textContent;
        }
        const settled = new Promise<void>((resolve) => {
          el.onload = () => resolve();
          el.onerror = () => resolve(); // never block the page on a bad asset
        });
        host.appendChild(el);
        const sync = !s.hasAttribute("async") && !s.hasAttribute("defer") && el.type !== "module";
        if (sync) await settled;
      }
    }

    run();
    return () => {
      cancelled = true;
      cssLinks.forEach((l) => l.remove());
      host.innerHTML = "";
    };
  }, [base]);

  return <div ref={hostRef} data-captured-page={base} style={{ minHeight: "100vh" }} />;
}
