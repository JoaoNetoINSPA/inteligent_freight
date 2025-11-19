import { apiService } from './api';

export interface Package {
  id: number;
  company_id: number;
  order_id: string;
  order_item_id?: number;
  customer_id?: string;
  customer_unique_id?: string;
  customer_zip_code_prefix?: number;
  customer_city?: string;
  customer_state?: string;
  product_id?: string;
  product_category_name?: string;
  product_name_length?: number;
  product_description_length?: number;
  product_photos_qty?: number;
  product_weight_g?: number;
  product_length_cm?: number;
  product_height_cm?: number;
  product_width_cm?: number;
  seller_id?: string;
  seller_city?: string;
  seller_state?: string;
  seller_zip_code_prefix?: number;
  payment_type?: string;
  payment_sequential?: number;
  payment_installments?: number;
  installments_price?: number;
  price?: number;
  freight_value?: number;
  payment_value?: number;
  shipping_limit_date?: string;
  order_purchase_timestamp?: string;
  order_approved_at?: string;
  order_delivered_carrier_date?: string;
  order_delivered_customer_date?: string;
  order_estimated_delivery_date?: string;
  shipping_duration?: number;
  day_of_purchase?: number;
  month_of_purchase?: number;
  year_of_purchase?: number;
  month_year_of_purchase?: string;
  order_status?: string;
  order_unique_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePackageData {
  order_id: string;
  customer_city?: string;
  customer_state?: string;
  customer_zip_code_prefix?: number;
  seller_city?: string;
  seller_state?: string;
  seller_zip_code_prefix?: number;
  product_weight_g?: number;
  product_length_cm?: number;
  product_height_cm?: number;
  product_width_cm?: number;
  freight_value?: number;
  payment_type?: string;
  order_status?: string;
  [key: string]: any;
}

export const packageService = {
  async getAll(): Promise<Package[]> {
    const response = await apiService.get<Package[]>('/packages');
    return response.data || [];
  },

  async getById(id: number): Promise<Package> {
    const response = await apiService.get<Package>(`/packages/${id}`);
    if (!response.data) {
      throw new Error('Package not found');
    }
    return response.data;
  },

  async create(data: CreatePackageData): Promise<number> {
    const response = await apiService.post<{ package_id: number }>(
      '/packages',
      data
    );
    
    return response.data?.package_id || 0;
  },

  async update(id: number, data: Partial<CreatePackageData>): Promise<void> {
    await apiService.put(`/packages/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    await apiService.delete(`/packages/${id}`);
  },
};

