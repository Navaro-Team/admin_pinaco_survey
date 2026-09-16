import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

class AiConfigService {
  async getConfig() {
    const response = await clientService.get('/ai-classification-config');
    return parseCommonHttpResult(response);
  }

  async updateConfig(data: { provider?: string; modelName?: string; apiKey?: string; isActive?: boolean }) {
    const response = await clientService.put('/ai-classification-config', data);
    return parseCommonHttpResult(response);
  }
}

export const aiConfigService = new AiConfigService();
