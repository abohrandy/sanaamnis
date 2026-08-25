/**
 * Delivery zones close enough to a pickup location to have a fixed delivery
 * fee, supplied directly by the client. Picking one of these adds a known fee
 * to the order at checkout; any address outside this list falls back to the
 * "quoted after checkout, settled separately" flow instead.
 */

export interface DeliveryZone {
  slug: string;
  city: "Port Harcourt" | "Abuja (FCT)" | "Lagos Island";
  area: string;
  fee: number;
}

const CITY_PREFIX: Record<DeliveryZone["city"], string> = {
  "Port Harcourt": "ph",
  "Abuja (FCT)": "abj",
  "Lagos Island": "lag",
};

function zone(city: DeliveryZone["city"], area: string, fee: number): DeliveryZone {
  const slug = `${CITY_PREFIX[city]}-${area
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
  return { slug, city, area, fee };
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  // Port Harcourt
  zone("Port Harcourt", "Rumuokoro", 4000),
  zone("Port Harcourt", "Eneka", 4000),
  zone("Port Harcourt", "Rumuodara", 4500),
  zone("Port Harcourt", "Rukpokwu", 4500),
  zone("Port Harcourt", "Rumuodumaya", 4000),
  zone("Port Harcourt", "Eliozu", 4000),
  zone("Port Harcourt", "Tank", 5000),
  zone("Port Harcourt", "Choba", 5000),
  zone("Port Harcourt", "Woji", 4000),
  zone("Port Harcourt", "Mgbuoba", 4000),
  zone("Port Harcourt", "NTA Road", 4000),
  zone("Port Harcourt", "Rumuola", 3500),
  zone("Port Harcourt", "Rumuokwuta", 3500),
  zone("Port Harcourt", "Abuloma", 3000),
  zone("Port Harcourt", "Amadi", 3000),
  zone("Port Harcourt", "Trans Amadi", 3000),
  zone("Port Harcourt", "Ikokwu", 3000),
  zone("Port Harcourt", "Mile 1", 2500),
  zone("Port Harcourt", "Mile 2", 2500),
  zone("Port Harcourt", "Mile 3", 3000),
  zone("Port Harcourt", "Lagos Bus Stop", 3500),
  zone("Port Harcourt", "Agreey Road", 3500),
  zone("Port Harcourt", "Borokiri", 4000),
  zone("Port Harcourt", "Agip", 4000),
  zone("Port Harcourt", "Ada George", 4000),
  zone("Port Harcourt", "Wimpy", 3500),

  // Abuja (FCT)
  zone("Abuja (FCT)", "Jabi", 2500),
  zone("Abuja (FCT)", "Wuye", 2500),
  zone("Abuja (FCT)", "Maitama", 3000),
  zone("Abuja (FCT)", "Wuse 2", 2500),
  zone("Abuja (FCT)", "Wuse Zone 1-7", 2500),
  zone("Abuja (FCT)", "Life Camp", 2500),
  zone("Abuja (FCT)", "Kado", 2500),
  zone("Abuja (FCT)", "Mabushi", 2500),
  zone("Abuja (FCT)", "Idu", 3000),
  zone("Abuja (FCT)", "Gwarimpa", 3000),
  zone("Abuja (FCT)", "Katampe", 3000),
  zone("Abuja (FCT)", "Lugbe", 4500),
  zone("Abuja (FCT)", "Dawaki", 3500),
  zone("Abuja (FCT)", "Kubwa", 5000),
  zone("Abuja (FCT)", "Maraba/Nyanya", 6000),
  zone("Abuja (FCT)", "Asokoro", 4000),
  zone("Abuja (FCT)", "Prince and Princess", 3000),
  zone("Abuja (FCT)", "Gaduwa", 2500),
  zone("Abuja (FCT)", "Garki", 3000),
  zone("Abuja (FCT)", "Gudu", 2500),
  zone("Abuja (FCT)", "Guzape", 3500),
  zone("Abuja (FCT)", "Galadimawa", 3000),
  zone("Abuja (FCT)", "Games Village", 2800),
  zone("Abuja (FCT)", "Lokogoma", 2500),
  zone("Abuja (FCT)", "Apo Resettlement", 2500),
  zone("Abuja (FCT)", "Durumi", 2500),

  // Lagos Island
  zone("Lagos Island", "VI", 5000),
  zone("Lagos Island", "Ikoyi", 5000),
  zone("Lagos Island", "Lekki", 5000),
  zone("Lagos Island", "Ikate", 4500),
  zone("Lagos Island", "Maruwa", 4500),
  zone("Lagos Island", "Salem", 4000),
  zone("Lagos Island", "Jakande", 4000),
  zone("Lagos Island", "Agungi", 3500),
  zone("Lagos Island", "Igbeafon", 3500),
  zone("Lagos Island", "Chevron", 3500),
  zone("Lagos Island", "Orchid Road", 4000),
  zone("Lagos Island", "Ikota Vila", 3500),
  zone("Lagos Island", "VGC", 3500),
  zone("Lagos Island", "Off Addo Road", 4000),
  zone("Lagos Island", "Badore", 4000),
  zone("Lagos Island", "Adesanya", 3000),
  zone("Lagos Island", "Thomas", 2500),
  zone("Lagos Island", "Ogombo", 5000),
  zone("Lagos Island", "Off Lagos Business School", 4000),
  zone("Lagos Island", "Songotedo", 4000),
  zone("Lagos Island", "Awoyaya", 5000),
  zone("Lagos Island", "Lawkowe", 5000),
  zone("Lagos Island", "Abijo", 5000),
  zone("Lagos Island", "Amen Estate", 7000),
  zone("Lagos Island", "Epe", 7000),
];

export function findDeliveryZone(slug: string): DeliveryZone | undefined {
  return DELIVERY_ZONES.find((z) => z.slug === slug);
}
