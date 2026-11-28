export type ViewLocation = {
  lon: number;
  lat: number;
  city: string;
  region: string;
  colo: string;
};

export type coloLocation = {
  iata: string;
  lon: number;
  lat: number;
  city: string;
  region: string;
  cca2: string;
};

export const newColos: coloLocation[] = [
  {
    iata: 'MAA',
    lon: 80.2333,
    lat: 13.0833,
    city: 'Chennai',
    region: 'Tamil Nadu',
    cca2: 'IN',
  },
  {
    iata: 'BOM',
    lon: 72.8681,
    lat: 19.0886,
    city: 'Mumbai',
    region: 'Maharashtra',
    cca2: 'IN',
  },
  {
    iata: 'DEL',
    lon: 77.1025,
    lat: 28.7041,
    city: 'New Delhi',
    region: 'Delhi',
    cca2: 'IN',
  },
  {
    iata: 'HYD',
    lon: 78.4744,
    lat: 17.385,
    city: 'Hyderabad',
    region: 'Telangana',
    cca2: 'IN',
  },
  {
    iata: 'BLR',
    lon: 77.5946,
    lat: 12.9716,
    city: 'Bengaluru',
    region: 'Karnataka',
    cca2: 'IN',
  },
  {
    iata: 'CCU',
    lon: 88.4458,
    lat: 22.6547,
    city: 'Kolkata',
    region: 'West Bengal',
    cca2: 'IN',
  },
];
