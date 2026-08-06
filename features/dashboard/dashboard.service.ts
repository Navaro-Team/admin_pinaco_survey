import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

class DashboardService {
  async getAreas() {
    const response = await clientService.get("/dashboard/areas");
    return parseCommonHttpResult(response);
  }

  async getDashboardOverview(payload: {
    region: string
    staff: string
    businessType: string
    categories: string[]
  }) {
    const params: Record<string, string> = {};
    if (payload.region) params.region = payload.region;
    if (payload.staff) params.staff = payload.staff;
    if (payload.businessType) params.business_type = payload.businessType;
    if (payload.categories?.length) params.categories = payload.categories.join(",");

    const response = await clientService.get("/dashboard", params);
    return parseCommonHttpResult(response);
  }

  async getDashboardPricing(payload: {
    region: string
    staff: string
    businessType: string
  }) {
    const params: Record<string, string> = {};
    if (payload.region) params.region = payload.region;
    if (payload.staff) params.staff = payload.staff;
    if (payload.businessType) params.business_type = payload.businessType;

    const response = await clientService.get("/dashboard/pricing", params);
    return parseCommonHttpResult(response);
  }

  async getDashboardVolume(payload: {
    region: string
    staff: string
    businessType: string
  }) {
    const params: Record<string, string> = {};
    if (payload.region) params.region = payload.region;
    if (payload.staff) params.staff = payload.staff;
    if (payload.businessType) params.business_type = payload.businessType;

    const response = await clientService.get("/dashboard/volume", params);
    return parseCommonHttpResult(response);
  }

  async getDashboardDistribution(payload: {
    region: string
    staff: string
    businessType: string
  }) {
    const params: Record<string, string> = {};
    if (payload.region) params.region = payload.region;
    if (payload.staff) params.staff = payload.staff;
    if (payload.businessType) params.business_type = payload.businessType;

    const response = await clientService.get("/dashboard/distribution", params);
    return parseCommonHttpResult(response);
  }

  async getBusinessOutcome(payload: {
    region: string
    staff: string
    businessType: string
    categories: string[]
    page: number
    limit?: number
  }) {
    const params: Record<string, string> = {};
    if (payload.region) params.region = payload.region;
    if (payload.staff) params.staff = payload.staff;
    if (payload.businessType) params.business_type = payload.businessType;
    if (payload.categories?.length) params.categories = payload.categories.join(",");
    params.page = String(payload.page);
    params.limit = String(payload.limit ?? 20);

    const response = await clientService.get("/dashboard/business-outcome", params);
    return parseCommonHttpResult(response);
  }

  async getPricingTable(payload: {
    region: string
    staff: string
    businessType: string
    page: number
    limit?: number
  }) {
    const params: Record<string, string> = {};
    if (payload.region) params.region = payload.region;
    if (payload.staff) params.staff = payload.staff;
    if (payload.businessType) params.business_type = payload.businessType;
    params.page = String(payload.page);
    params.limit = String(payload.limit ?? 20);

    const response = await clientService.get("/dashboard/pricing-table", params);
    return parseCommonHttpResult(response);
  }

  async getInventoryHealth(payload: {
    region: string
    staff: string
    businessType: string
    categories: string[]
    page: number
    limit?: number
  }) {
    const params: Record<string, string> = {};
    if (payload.region) params.region = payload.region;
    if (payload.staff) params.staff = payload.staff;
    if (payload.businessType) params.business_type = payload.businessType;
    if (payload.categories?.length) params.categories = payload.categories.join(",");
    params.page = String(payload.page);
    params.limit = String(payload.limit ?? 20);

    const response = await clientService.get("/dashboard/inventory-health", params);
    return parseCommonHttpResult(response);
  }
}

export const dashboardService = new DashboardService();