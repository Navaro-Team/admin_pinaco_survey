export interface Store {
  id: string;
  code: string;
  type: string;
  name: string;
  phone: string;
  location: any;
  province: string;
  region: string;
  area: string;
  regionCode: string;
  salesScale: number;
  isActive: boolean;
  locationId: string;
  createdAt: string;
  updatedAt: string;
}

export function parseStore(data: any): Store {
  return {
    id: data.id,
    code: data.code,
    type: data.type,
    name: data.name,
    phone: data.phone,
    location: data.location,
    province: data.province,
    region: data.region,
    area: data.area,
    regionCode: data.regionCode,
    salesScale: data.salesScale,
    isActive: data.isActive,
    locationId: data.locationId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function parseStores(data: any): Store[] {
  if (!Array.isArray(data)) return [];
  return data.map(parseStore);
}