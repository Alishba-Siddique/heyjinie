// src/services/pagination.service.ts

import { HttpService } from "./base.service";

class PaginationService extends HttpService {
  private readonly prefix: string = "admin";

  async fetchCategories(): Promise<any> {
    try {
      const response = await this.get(`${this.prefix}/category`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  }

  async fetchProducts(categoryId: string, page: number, limit: number): Promise<any> {
    try {
      const response = await this.get(`${this.prefix}/product`, {
        params: {
          category_id: categoryId,
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw error;
    }
  }
}

export const paginationService = new PaginationService();