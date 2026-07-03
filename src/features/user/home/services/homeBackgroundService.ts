import axiosPublic from "../../../../lib/axiosPublic";

export interface HomeBackground {
  id: number;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CACHE_TTL_MS = 60_000;

let activeCache: { expiresAt: number; data: HomeBackground[] } | null = null;
let inFlightRequest: Promise<HomeBackground[]> | null = null;

export async function getActiveHomeBackgrounds(): Promise<HomeBackground[]> {
  const now = Date.now();

  if (activeCache && activeCache.expiresAt > now) {
    return activeCache.data;
  }

  if (!inFlightRequest) {
    inFlightRequest = axiosPublic
      .get<{ data: HomeBackground[] }>("/home-background/active")
      .then((response) => {
        const data = response.data.data ?? [];
        activeCache = {
          data,
          expiresAt: Date.now() + CACHE_TTL_MS,
        };
        return data;
      })
      .finally(() => {
        inFlightRequest = null;
      });
  }

  return inFlightRequest;
}
