const imageCache = new Map<string, string>();

const genericFallback = "/images/vehicles/generic-car.jpg";

type VehicleImageRule = {
  make: string;
  modelTokens: string[];
  image: string;
};

const vehicleImageRules: VehicleImageRule[] = [
  { make: "toyota", modelTokens: ["corolla"], image: "/images/vehicles/toyota-corolla.jpg" },
  { make: "volkswagen", modelTokens: ["gol"], image: "/images/vehicles/volkswagen-gol.jpg" },
  { make: "chevrolet", modelTokens: ["onix"], image: "/images/vehicles/chevrolet-onix.jpg" },
  { make: "nissan", modelTokens: ["sentra"], image: "/images/vehicles/nissan-sentra.jpg" },
  { make: "renault", modelTokens: ["megane", "mégane"], image: "/images/vehicles/renault-megane.jpg" },
  { make: "peugeot", modelTokens: ["2008"], image: "/images/vehicles/peugeot-2008.jpg" },
  { make: "ford", modelTokens: ["focus"], image: "/images/vehicles/ford-focus.jpg" }
];

const fallbackByMake: Record<string, string> = {
  toyota: "/images/vehicles/toyota-corolla.jpg",
  volkswagen: "/images/vehicles/volkswagen-gol.jpg",
  chevrolet: "/images/vehicles/chevrolet-onix.jpg",
  nissan: "/images/vehicles/nissan-sentra.jpg",
  renault: "/images/vehicles/renault-megane.jpg",
  peugeot: "/images/vehicles/peugeot-2008.jpg",
  ford: "/images/vehicles/ford-focus.jpg"
};

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ");
}

function resolveDeterministicImage(makeInput: string, modelInput: string) {
  const make = normalize(makeInput);
  const model = normalize(modelInput);

  const byModelRule = vehicleImageRules.find((rule) => {
    if (rule.make !== make) return false;
    return rule.modelTokens.some((token) => model.includes(normalize(token)));
  });

  if (byModelRule) return byModelRule.image;

  return fallbackByMake[make] || genericFallback;
}

export async function vehicleImageUrl(params: { make: string; model: string; year?: number | null }) {
  const cacheKey = `${normalize(params.make)}::${normalize(params.model)}`;
  const cached = imageCache.get(cacheKey);
  if (cached) return cached;

  const resolved = resolveDeterministicImage(params.make, params.model);
  imageCache.set(cacheKey, resolved);
  return resolved;
}
