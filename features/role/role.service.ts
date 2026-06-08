import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

class RoleService {
  async getRoles() {
    const response = await clientService.get("/roles");
    return parseCommonHttpResult(response);
  }
}

export const roleService = new RoleService();