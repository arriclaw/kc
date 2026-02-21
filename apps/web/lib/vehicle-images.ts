const imageCache = new Map<string, string>();

const unsplashFallbackByMake: Record<string, string> = {
  toyota: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1600&q=80",
  volkswagen: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1600&q=80",
  chevrolet: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=80",
  ford: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=80",
  nissan: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1600&q=80",
  renault: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1600&q=80",
  peugeot: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1600&q=80",
  hyundai: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1600&q=80",
  kia: "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&w=1600&q=80"
};

const genericFallback = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80";

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");
}

async function wikipediaThumb(title: string): Promise<string | null> {
  const endpoint = new URL("https://en.wikipedia.org/w/api.php");
  endpoint.searchParams.set("action", "query");
  endpoint.searchParams.set("format", "json");
  endpoint.searchParams.set("prop", "pageimages");
  endpoint.searchParams.set("piprop", "thumbnail");
  endpoint.searchParams.set("pithumbsize", "1400");
  endpoint.searchParams.set("redirects", "1");
  endpoint.searchParams.set("titles", title);

  const response = await fetch(endpoint.toString(), { next: { revalidate: 86400 } });
  if (!response.ok) return null;

  const data = (await response.json()) as {
    query?: { pages?: Record<string, { thumbnail?: { source?: string } }> };
  };

  const pages = data.query?.pages;
  if (!pages) return null;

  for (const page of Object.values(pages)) {
    const source = page.thumbnail?.source;
    if (source && source.startsWith("https://upload.wikimedia.org/")) return source;
  }
  return null;
}

export async function vehicleImageUrl(params: { make: string; model: string; year?: number | null }) {
  const make = normalize(params.make);
  const model = normalize(params.model);
  const cacheKey = `${make}::${model}`;
  const cached = imageCache.get(cacheKey);
  if (cached) return cached;

  const candidates = [`${params.make} ${params.model} car`, `${params.make} ${params.model}`, params.make];

  for (const candidate of candidates) {
    try {
      const thumb = await wikipediaThumb(candidate);
      if (thumb) {
        imageCache.set(cacheKey, thumb);
        return thumb;
      }
    } catch {
      // Ignore remote failures and continue with deterministic fallback.
    }
  }

  const fallback = unsplashFallbackByMake[make] || genericFallback;
  imageCache.set(cacheKey, fallback);
  return fallback;
}
