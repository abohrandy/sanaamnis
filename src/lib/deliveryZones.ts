/**
 * Delivery zones close enough to have a fixed delivery fee, supplied
 * directly by the client. Picking one of these adds a known fee to the
 * order at checkout; any address outside this list falls back to the
 * "quoted after checkout, settled separately" flow instead.
 *
 * Lagos Island and Port Harcourt are broken into named sub-corridors
 * (e.g. "Sangotedo & Environs") since the client's own list groups them
 * that way — the checkout UI uses these as <optgroup> labels under each
 * city. Abuja and Lagos Mainland have no sub-corridors, just a flat list.
 */

export type DeliveryCity = "Lagos Island" | "Lagos Mainland" | "Abuja" | "Port Harcourt";

export const DELIVERY_CITIES: DeliveryCity[] = ["Lagos Island", "Lagos Mainland", "Abuja", "Port Harcourt"];

export interface DeliveryZone {
  slug: string;
  city: DeliveryCity;
  /** Named corridor within the city, e.g. "Sangotedo & Environs". Undefined for flat city lists. */
  subregion?: string;
  area: string;
  fee: number;
}

let counter = 0;
function zone(city: DeliveryCity, subregion: string | undefined, area: string, fee: number): DeliveryZone {
  counter += 1;
  const base = `${city}-${subregion ?? ""}-${area}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return { slug: `${base}-${counter}`, city, subregion, area, fee };
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  // ---------------------------------------------------------------------
  // Lagos Island Coverage
  // ---------------------------------------------------------------------
  zone("Lagos Island", "Ajah & Immediate Environs", "Thomas Estate", 2000),
  zone("Lagos Island", "Ajah & Immediate Environs", "Ajah", 2000),
  zone("Lagos Island", "Ajah & Immediate Environs", "Ajah Market", 2000),
  zone("Lagos Island", "Ajah & Immediate Environs", "Addo Road", 3000),
  zone("Lagos Island", "Ajah & Immediate Environs", "Ado/Badore", 4000),
  zone("Lagos Island", "Ajah & Immediate Environs", "Langbasa", 3500),
  zone("Lagos Island", "Ajah & Immediate Environs", "Badore", 4000),
  zone("Lagos Island", "Ajah & Immediate Environs", "Abraham Adesanya", 2000),
  zone("Lagos Island", "Ajah & Immediate Environs", "Ogombo", 4000),
  zone("Lagos Island", "Ajah & Immediate Environs", "Okun-Ajah", 4000),
  zone("Lagos Island", "Ajah & Immediate Environs", "Lekki Scheme 2", 2500),
  zone("Lagos Island", "Ajah & Immediate Environs", "Ilasan", 3000),
  zone("Lagos Island", "Ajah & Immediate Environs", "Ikota", 4000),
  zone("Lagos Island", "Ajah & Immediate Environs", "Ikota Villa Estate", 2500),
  zone("Lagos Island", "Ajah & Immediate Environs", "VGC", 2500),
  zone("Lagos Island", "Ajah & Immediate Environs", "Agungi", 3000),
  zone("Lagos Island", "Ajah & Immediate Environs", "Chevron", 3000),
  zone("Lagos Island", "Ajah & Immediate Environs", "Chevron Drive", 3000),
  zone("Lagos Island", "Ajah & Immediate Environs", "Lekki Conservation Centre Axis", 3500),
  zone("Lagos Island", "Ajah & Immediate Environs", "Orchid Road", 3500),
  zone("Lagos Island", "Ajah & Immediate Environs", "Mega Chicken / Ikota Axis", 2500),

  zone("Lagos Island", "Sangotedo & Environs", "Sangotedo", 3000),
  zone("Lagos Island", "Sangotedo & Environs", "Novare Lekki Mall / Shoprite Sangotedo", 3000),
  zone("Lagos Island", "Sangotedo & Environs", "Monastery Road", 3000),
  zone("Lagos Island", "Sangotedo & Environs", "Abaijo", 4000),
  zone("Lagos Island", "Sangotedo & Environs", "Majidun / Majidun-Awoyaya Axis", 4000),
  zone("Lagos Island", "Sangotedo & Environs", "Awoyaya", 4500),
  zone("Lagos Island", "Sangotedo & Environs", "Lakowe", 4500),
  zone("Lagos Island", "Sangotedo & Environs", "Bogije", 5000),
  zone("Lagos Island", "Sangotedo & Environs", "Ibeju-Lekki", 7000),
  zone("Lagos Island", "Sangotedo & Environs", "Eleko", 7000),

  zone("Lagos Island", "Lekki Axis", "Osapa London", 3500),
  zone("Lagos Island", "Lekki Axis", "Osapa", 3500),
  zone("Lagos Island", "Lekki Axis", "Ologolo", 3500),
  zone("Lagos Island", "Lekki Axis", "Igbo Efon", 3500),
  zone("Lagos Island", "Lekki Axis", "Jakande / Jakande Roundabout", 3500),
  zone("Lagos Island", "Lekki Axis", "Chisco", 4000),
  zone("Lagos Island", "Lekki Axis", "Elegushi", 4500),
  zone("Lagos Island", "Lekki Axis", "Ikate", 4500),
  zone("Lagos Island", "Lekki Axis", "Lekki Phase 1", 5000),
  zone("Lagos Island", "Lekki Axis", "Admiralty Way", 5000),
  zone("Lagos Island", "Lekki Axis", "Admiralty Road", 5000),
  zone("Lagos Island", "Lekki Axis", "Freedom Way", 5000),
  zone("Lagos Island", "Lekki Axis", "Marwa / Lekki Phase 1 Gate", 4500),
  zone("Lagos Island", "Lekki Axis", "Oniru", 5500),

  zone("Lagos Island", "Victoria Island", "Victoria Island", 6000),
  zone("Lagos Island", "Victoria Island", "1004 Estate", 6000),
  zone("Lagos Island", "Victoria Island", "Ligali Ayorinde", 5500),
  zone("Lagos Island", "Victoria Island", "Adeola Odeku", 6000),
  zone("Lagos Island", "Victoria Island", "Ahmadu Bello Way", 6000),
  zone("Lagos Island", "Victoria Island", "Ajose Adeogun", 6000),
  zone("Lagos Island", "Victoria Island", "Kofo Abayomi", 6000),
  zone("Lagos Island", "Victoria Island", "Sanusi Fafunwa", 6000),
  zone("Lagos Island", "Victoria Island", "Ozumba Mbadiwe", 6000),
  zone("Lagos Island", "Victoria Island", "Eko Hotel Axis", 6000),
  zone("Lagos Island", "Victoria Island", "Bar Beach / Eko Atlantic Axis", 6500),
  zone("Lagos Island", "Victoria Island", "Eko Atlantic City", 6500),

  zone("Lagos Island", "Ikoyi", "Ikoyi", 6500),
  zone("Lagos Island", "Ikoyi", "Falomo", 6500),
  zone("Lagos Island", "Ikoyi", "Awolowo Road, Ikoyi", 6500),
  zone("Lagos Island", "Ikoyi", "Bourdillon", 7000),
  zone("Lagos Island", "Ikoyi", "Queens Drive", 7000),
  zone("Lagos Island", "Ikoyi", "Alexander Avenue", 7000),
  zone("Lagos Island", "Ikoyi", "Banana Island", 7500),
  zone("Lagos Island", "Ikoyi", "Old Ikoyi", 7000),
  zone("Lagos Island", "Ikoyi", "Parkview Estate", 7000),
  zone("Lagos Island", "Ikoyi", "Dolphin Estate", 7000),
  zone("Lagos Island", "Ikoyi", "Obalende", 7000),

  zone("Lagos Island", "Lagos Island / Marina Axis", "Lagos Island", 7000),
  zone("Lagos Island", "Lagos Island / Marina Axis", "Onikan", 7000),
  zone("Lagos Island", "Lagos Island / Marina Axis", "TBS", 7000),
  zone("Lagos Island", "Lagos Island / Marina Axis", "CMS", 7000),
  zone("Lagos Island", "Lagos Island / Marina Axis", "Marina", 7000),
  zone("Lagos Island", "Lagos Island / Marina Axis", "Broad Street", 7000),
  zone("Lagos Island", "Lagos Island / Marina Axis", "Balogun Market", 7000),
  zone("Lagos Island", "Lagos Island / Marina Axis", "Idumota", 7500),
  zone("Lagos Island", "Lagos Island / Marina Axis", "Adeniji Adele", 7500),
  zone("Lagos Island", "Lagos Island / Marina Axis", "Campbell Street", 7000),
  zone("Lagos Island", "Lagos Island / Marina Axis", "Tinubu Square", 7000),

  zone("Lagos Island", "Further Lekki–Epe Axis", "Awoyaya", 4000),
  zone("Lagos Island", "Further Lekki–Epe Axis", "Lakowe", 4500),
  zone("Lagos Island", "Further Lekki–Epe Axis", "Bogije", 5000),
  zone("Lagos Island", "Further Lekki–Epe Axis", "Eluju", 5500),
  zone("Lagos Island", "Further Lekki–Epe Axis", "Ibeju-Lekki", 5500),
  zone("Lagos Island", "Further Lekki–Epe Axis", "Eleko", 6500),
  zone("Lagos Island", "Further Lekki–Epe Axis", "Akodo", 7000),
  zone("Lagos Island", "Further Lekki–Epe Axis", "Dangote Refinery Axis", 8000),
  zone("Lagos Island", "Further Lekki–Epe Axis", "Lekki Free Trade Zone", 8000),
  zone("Lagos Island", "Further Lekki–Epe Axis", "Lekki Deep Sea Port Axis", 8500),
  zone("Lagos Island", "Further Lekki–Epe Axis", "Epe", 10000),

  // ---------------------------------------------------------------------
  // Abuja — from our office address (flat list, no sub-corridors)
  // ---------------------------------------------------------------------
  zone("Abuja", undefined, "Dakibiyu", 2500),
  zone("Abuja", undefined, "Jabi", 2500),
  zone("Abuja", undefined, "Jabi Lake", 2500),
  zone("Abuja", undefined, "Jabi Lake Mall", 2500),
  zone("Abuja", undefined, "Utako", 2500),
  zone("Abuja", undefined, "Wuye", 2500),
  zone("Abuja", undefined, "Life Camp", 2500),
  zone("Abuja", undefined, "Kafe", 2500),
  zone("Abuja", undefined, "Mabushi", 2500),
  zone("Abuja", undefined, "Kado", 2500),
  zone("Abuja", undefined, "Jahi", 2500),
  zone("Abuja", undefined, "Banex", 2500),
  zone("Abuja", undefined, "Wuse 1", 2500),
  zone("Abuja", undefined, "Wuse 2", 2500),
  zone("Abuja", undefined, "Wuse Zone 3", 2500),
  zone("Abuja", undefined, "Wuse Zone 4", 2500),
  zone("Abuja", undefined, "Wuse Zone 5", 2500),
  zone("Abuja", undefined, "Wuse Zone 6", 2500),
  zone("Abuja", undefined, "Wuse Zone 7", 2500),
  zone("Abuja", undefined, "Gwarinpa 1st–3rd", 2500),
  zone("Abuja", undefined, "Gwarinpa 4th–7th Avenues", 3000),
  zone("Abuja", undefined, "Katampe", 2500),
  zone("Abuja", undefined, "Katampe Extension", 2800),
  zone("Abuja", undefined, "Idu Industrial Area", 3500),
  zone("Abuja", undefined, "Central Area", 3000),
  zone("Abuja", undefined, "Maitama", 3000),
  zone("Abuja", undefined, "Maitama Extension", 3500),
  zone("Abuja", undefined, "Transcorp Hilton Axis", 3000),
  zone("Abuja", undefined, "Minister's Hill", 2800),
  zone("Abuja", undefined, "Dawaki", 3500),
  zone("Abuja", undefined, "Dutse Alhaji", 4000),
  zone("Abuja", undefined, "Mpape", 3800),
  zone("Abuja", undefined, "Idu Railway Station", 3500),
  zone("Abuja", undefined, "Asokoro", 4000),
  zone("Abuja", undefined, "Aya", 4000),
  zone("Abuja", undefined, "Kubwa", 4000),
  zone("Abuja", undefined, "Kubwa 2/1", 4000),
  zone("Abuja", undefined, "Kubwa 2/2", 4500),
  zone("Abuja", undefined, "Kubwa 2/3", 4500),
  zone("Abuja", undefined, "Kubwa 2/4", 4500),
  zone("Abuja", undefined, "Arab Road, Kubwa", 5000),
  zone("Abuja", undefined, "Dutse Baupma", 4500),
  zone("Abuja", undefined, "Byazhin", 5500),
  zone("Abuja", undefined, "Dei-Dei", 5500),
  zone("Abuja", undefined, "Karu", 5500),
  zone("Abuja", undefined, "Nyanya", 5500),
  zone("Abuja", undefined, "Jikwoyi", 5500),
  zone("Abuja", undefined, "Zuba", 6700),
  zone("Abuja", undefined, "Mararaba", 6000),
  zone("Abuja", undefined, "Kurudu", 6500),
  zone("Abuja", undefined, "Orozo", 7500),
  zone("Abuja", undefined, "Bwari", 6000),
  zone("Abuja", undefined, "Karshi", 7000),
  zone("Abuja", undefined, "Nnamdi Azikiwe International Airport", 8000),
  zone("Abuja", undefined, "Airport Domestic Terminal", 8000),
  zone("Abuja", undefined, "Airport International Terminal", 8000),
  zone("Abuja", undefined, "Gwagwalada", 10000),
  zone("Abuja", undefined, "Uniabuja Main Campus", 10000),

  // ---------------------------------------------------------------------
  // Lagos Mainland (flat list, no sub-corridors)
  // ---------------------------------------------------------------------
  zone("Lagos Mainland", undefined, "Heritage Estate / Isheri-Olofin", 2000),
  zone("Lagos Mainland", undefined, "Egbeda", 2000),
  zone("Lagos Mainland", undefined, "Akowonjo", 2500),
  zone("Lagos Mainland", undefined, "Gowon Estate", 2000),
  zone("Lagos Mainland", undefined, "Idimu", 2000),
  zone("Lagos Mainland", undefined, "Shasha", 2500),
  zone("Lagos Mainland", undefined, "Mosan", 3000),
  zone("Lagos Mainland", undefined, "Abesan Estate", 3000),
  zone("Lagos Mainland", undefined, "Iyana Ipaja", 3000),
  zone("Lagos Mainland", undefined, "Ipaja", 4000),
  zone("Lagos Mainland", undefined, "Dopemu", 3000),
  zone("Lagos Mainland", undefined, "Ejigbo", 3500),
  zone("Lagos Mainland", undefined, "Ikotun", 3500),
  zone("Lagos Mainland", undefined, "Ayobo", 4000),
  zone("Lagos Mainland", undefined, "Igando", 3000),
  zone("Lagos Mainland", undefined, "Agege", 3000),
  zone("Lagos Mainland", undefined, "Isolo", 3500),
  zone("Lagos Mainland", undefined, "Oshodi", 4000),
  zone("Lagos Mainland", undefined, "Abule Egba", 4500),
  zone("Lagos Mainland", undefined, "Meiran", 4000),
  zone("Lagos Mainland", undefined, "Ajao Estate", 3500),
  zone("Lagos Mainland", undefined, "Murtala Muhammed Airport", 3500),
  zone("Lagos Mainland", undefined, "Iju-Ishaga", 4000),
  zone("Lagos Mainland", undefined, "Ikeja", 4500),
  zone("Lagos Mainland", undefined, "Allen Avenue", 4500),
  zone("Lagos Mainland", undefined, "Opebi", 4500),
  zone("Lagos Mainland", undefined, "Computer Village", 4500),
  zone("Lagos Mainland", undefined, "Ogba", 4500),
  zone("Lagos Mainland", undefined, "Ifako-Ijaiye", 4500),
  zone("Lagos Mainland", undefined, "Alausa", 4500),
  zone("Lagos Mainland", undefined, "Ilupeju", 4500),
  zone("Lagos Mainland", undefined, "Mushin", 4500),
  zone("Lagos Mainland", undefined, "Oregun", 5000),
  zone("Lagos Mainland", undefined, "Maryland", 5000),
  zone("Lagos Mainland", undefined, "Anthony", 5000),
  zone("Lagos Mainland", undefined, "Ojodu", 5000),
  zone("Lagos Mainland", undefined, "Omole", 5000),
  zone("Lagos Mainland", undefined, "Orile", 5000),
  zone("Lagos Mainland", undefined, "Iganmu", 5000),
  zone("Lagos Mainland", undefined, "Mile 2", 5000),
  zone("Lagos Mainland", undefined, "Ojota", 5500),
  zone("Lagos Mainland", undefined, "Gbagada", 5500),
  zone("Lagos Mainland", undefined, "Magodo", 5500),
  zone("Lagos Mainland", undefined, "Berger", 6000),
  zone("Lagos Mainland", undefined, "Ketu", 5500),
  zone("Lagos Mainland", undefined, "Surulere", 5500),
  zone("Lagos Mainland", undefined, "Fadeyi", 5500),
  zone("Lagos Mainland", undefined, "Jibowu", 5500),
  zone("Lagos Mainland", undefined, "Onipanu", 5500),
  zone("Lagos Mainland", undefined, "Palm Grove", 5500),
  zone("Lagos Mainland", undefined, "Amuwo-Odofin", 5500),
  zone("Lagos Mainland", undefined, "Festac Town", 5500),
  zone("Lagos Mainland", undefined, "Mile 12", 6000),
  zone("Lagos Mainland", undefined, "Yaba", 6000),
  zone("Lagos Mainland", undefined, "Shomolu", 6000),
  zone("Lagos Mainland", undefined, "Bariga", 6000),
  zone("Lagos Mainland", undefined, "Costain", 6000),
  zone("Lagos Mainland", undefined, "Satellite Town", 6500),
  zone("Lagos Mainland", undefined, "Ebute Metta", 6500),
  zone("Lagos Mainland", undefined, "Oyingbo", 6500),
  zone("Lagos Mainland", undefined, "Ajegunle", 6500),
  zone("Lagos Mainland", undefined, "Iwaya", 6500),
  zone("Lagos Mainland", undefined, "Unilag / Akoka", 6500),
  zone("Lagos Mainland", undefined, "Apapa", 7000),
  zone("Lagos Mainland", undefined, "Owode-Onirin / Ikorodu Axis", 7500),
  zone("Lagos Mainland", undefined, "Ikorodu Agric", 8000),
  zone("Lagos Mainland", undefined, "Ikorodu Garage / Ikorodu Town", 10000),

  // ---------------------------------------------------------------------
  // Port Harcourt
  // ---------------------------------------------------------------------
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "Ogbunabali / Ogunabali", 2000),
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "Garrison", 2000),
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "D-Line", 2000),
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "Waterlines", 2000),
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "Old GRA", 2500),
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "New GRA", 3000),
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "GRA Phase 1", 3000),
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "GRA Phase 2", 3000),
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "GRA Phase 3", 3000),
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "GRA Phase 4", 3000),
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "Aba Road", 2000),
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "Stadium Road", 2500),
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "Elekahia", 2500),
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "Rumuomasi", 2500),
  zone("Port Harcourt", "Ogbunabali & Central Port Harcourt", "Rumuola", 2500),

  zone("Port Harcourt", "Trans Amadi / Woji Axis", "Trans Amadi", 3000),
  zone("Port Harcourt", "Trans Amadi / Woji Axis", "Nkpogu", 2000),
  zone("Port Harcourt", "Trans Amadi / Woji Axis", "Odili Road / Peter Odili Road", 3000),
  zone("Port Harcourt", "Trans Amadi / Woji Axis", "Abuloma", 2500),
  zone("Port Harcourt", "Trans Amadi / Woji Axis", "Amadi-Ama", 2000),
  zone("Port Harcourt", "Trans Amadi / Woji Axis", "Woji", 3000),
  zone("Port Harcourt", "Trans Amadi / Woji Axis", "Odili Road Estates", 3000),
  zone("Port Harcourt", "Trans Amadi / Woji Axis", "Okuru-Ama", 3000),
  zone("Port Harcourt", "Trans Amadi / Woji Axis", "Oginigba", 3000),
  zone("Port Harcourt", "Trans Amadi / Woji Axis", "Rainbow Town", 2500),

  zone("Port Harcourt", "Rumuigbo / Rumuokwuta Axis", "Rumuigbo", 3500),
  zone("Port Harcourt", "Rumuigbo / Rumuokwuta Axis", "Rumuokwuta", 3000),
  zone("Port Harcourt", "Rumuigbo / Rumuokwuta Axis", "Rumueme", 3000),
  zone("Port Harcourt", "Rumuigbo / Rumuokwuta Axis", "Mile 1", 2000),
  zone("Port Harcourt", "Rumuigbo / Rumuokwuta Axis", "Mile 2 / Diobu", 2000),
  zone("Port Harcourt", "Rumuigbo / Rumuokwuta Axis", "Mile 3", 2500),
  zone("Port Harcourt", "Rumuigbo / Rumuokwuta Axis", "Agip", 3000),
  zone("Port Harcourt", "Rumuigbo / Rumuokwuta Axis", "Mgbuoba", 3500),
  zone("Port Harcourt", "Rumuigbo / Rumuokwuta Axis", "Ada George", 3000),
  zone("Port Harcourt", "Rumuigbo / Rumuokwuta Axis", "Rumuepirikom", 3000),

  zone("Port Harcourt", "Rumuokoro / Eliozu Axis", "Rumuokoro", 3500),
  zone("Port Harcourt", "Rumuokoro / Eliozu Axis", "Rumuodara", 3500),
  zone("Port Harcourt", "Rumuokoro / Eliozu Axis", "Eliozu", 3500),
  zone("Port Harcourt", "Rumuokoro / Eliozu Axis", "Rumuodomaya", 4000),
  zone("Port Harcourt", "Rumuokoro / Eliozu Axis", "Artillery", 3500),
  zone("Port Harcourt", "Rumuokoro / Eliozu Axis", "Rumukrushi", 3500),
  zone("Port Harcourt", "Rumuokoro / Eliozu Axis", "Rumuibekwe", 3500),
  zone("Port Harcourt", "Rumuokoro / Eliozu Axis", "Rumuokwurusi", 3500),
  zone("Port Harcourt", "Rumuokoro / Eliozu Axis", "Rukpokwu", 4000),
  zone("Port Harcourt", "Rumuokoro / Eliozu Axis", "Eneka", 4000),

  zone("Port Harcourt", "Iwofe / Ada George Axis", "Iwofe", 3000),
  zone("Port Harcourt", "Iwofe / Ada George Axis", "Ada George", 3000),
  zone("Port Harcourt", "Iwofe / Ada George Axis", "Mgbuoba", 3500),
  zone("Port Harcourt", "Iwofe / Ada George Axis", "Ozuoba", 3500),
  zone("Port Harcourt", "Iwofe / Ada George Axis", "Rumuekeni", 4000),
  zone("Port Harcourt", "Iwofe / Ada George Axis", "Rumuolumeni", 3500),
  zone("Port Harcourt", "Iwofe / Ada George Axis", "Eagle Island", 3000),

  zone("Port Harcourt", "University / Choba Axis", "Rivers State University", 2500),
  zone("Port Harcourt", "University / Choba Axis", "Nkpolu", 3500),
  zone("Port Harcourt", "University / Choba Axis", "Mgbuoba", 3500),
  zone("Port Harcourt", "University / Choba Axis", "Ozuoba", 3500),
  zone("Port Harcourt", "University / Choba Axis", "Alakahia", 4500),
  zone("Port Harcourt", "University / Choba Axis", "University of Port Harcourt / Uniport", 5000),
  zone("Port Harcourt", "University / Choba Axis", "Choba", 5000),
  zone("Port Harcourt", "University / Choba Axis", "Choba Market", 5000),

  zone("Port Harcourt", "Elelenwo / Akpajo / Oyigbo Axis", "Elelenwo", 3500),
  zone("Port Harcourt", "Elelenwo / Akpajo / Oyigbo Axis", "Elimgbu", 4000),
  zone("Port Harcourt", "Elelenwo / Akpajo / Oyigbo Axis", "Akpajo", 4000),
  zone("Port Harcourt", "Elelenwo / Akpajo / Oyigbo Axis", "Iriebe", 5000),
  zone("Port Harcourt", "Elelenwo / Akpajo / Oyigbo Axis", "Oyigbo", 5000),
  zone("Port Harcourt", "Elelenwo / Akpajo / Oyigbo Axis", "Afam Road Axis", 5000),

  zone("Port Harcourt", "Other Port Harcourt Areas", "Borokiri", 3500),
  zone("Port Harcourt", "Other Port Harcourt Areas", "Township", 3500),
  zone("Port Harcourt", "Other Port Harcourt Areas", "Old Port Harcourt Township", 3500),
  zone("Port Harcourt", "Other Port Harcourt Areas", "Nembe Waterside", 3000),
  zone("Port Harcourt", "Other Port Harcourt Areas", "Abonnema Wharf", 3500),
  zone("Port Harcourt", "Other Port Harcourt Areas", "Amadi Flats", 2000),
  zone("Port Harcourt", "Other Port Harcourt Areas", "Azubuike Estate", 2000),
  zone("Port Harcourt", "Other Port Harcourt Areas", "Shell RA", 3500),
  zone("Port Harcourt", "Other Port Harcourt Areas", "Rivers State Secretariat", 3000),
  zone("Port Harcourt", "Other Port Harcourt Areas", "Garden City Mall", 2500),
  zone("Port Harcourt", "Other Port Harcourt Areas", "Pleasure Park", 3000),

  zone("Port Harcourt", "Airport Axis", "Omagwa", 7000),
  zone("Port Harcourt", "Airport Axis", "Port Harcourt International Airport", 8000),
];

export function findDeliveryZone(slug: string): DeliveryZone | undefined {
  return DELIVERY_ZONES.find((z) => z.slug === slug);
}

export function zonesForCity(city: DeliveryCity): DeliveryZone[] {
  return DELIVERY_ZONES.filter((z) => z.city === city);
}
