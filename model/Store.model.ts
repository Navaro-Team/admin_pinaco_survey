export interface Store {
  id: string;
  code: string;
  type: string;
  name: string;
  phone: string;
  location: {
    address: string;
    position: {
      latitude: number;
      longitude: number;
    }
  },
  province: string;
  area: string;
  salesScale: number;
  locationId: string;
  contactPersonName: string;
  nppCode: string;
  nppName: string;
  salesEmployeeName: string;
  salesEmployeeCode: string;
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
    area: data.area,
    salesScale: data.salesScale,
    contactPersonName: data.contactPersonName,
    nppCode: data.nppCode,
    nppName: data.nppName,
    salesEmployeeName: data.salesEmployeeName,
    salesEmployeeCode: data.salesEmployeeCode,
    locationId: data.locationId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function parseStores(data: any): Store[] {
  if (!Array.isArray(data)) return [];
  return data.map(parseStore);
}