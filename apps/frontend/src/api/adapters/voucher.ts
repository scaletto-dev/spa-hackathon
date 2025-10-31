/**
 * Voucher API Adapter
 * Handles all voucher-related API calls for booking discounts
 */

import axios from 'axios';

// ============= Constants =============
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${BASE_URL}/api/v1`;

// ============= Types =============

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherValidationResult {
  valid: boolean;
  discount?: number;
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SuccessResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
  message?: string;
  timestamp: string;
}

// ============= API Functions =============

/**
 * Get all active vouchers
 * 
 * API: GET /api/v1/vouchers/active
 * Auth: Public
 * Response: { success: true, data: Voucher[], timestamp }
 */
export async function getActiveVouchers(): Promise<Voucher[]> {
  try {
    const response = await axios.get<SuccessResponse<Voucher[]>>(
      `${API_BASE_URL}/vouchers/active`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch active vouchers');
    }

    return response.data.data || [];
  } catch (error: any) {
    console.error('Get active vouchers error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vouchers');
  }
}

/**
 * Validate and calculate discount from voucher code
 * 
 * API: POST /api/v1/vouchers/validate
 * Auth: Public
 * Body: { code, purchaseAmount }
 * Response: { success: true, data: VoucherValidationResult, timestamp }
 */
export async function validateVoucher(
  code: string,
  purchaseAmount: number
): Promise<VoucherValidationResult> {
  try {
    const response = await axios.post<SuccessResponse<VoucherValidationResult>>(
      `${API_BASE_URL}/vouchers/validate`,
      {
        code: code.toUpperCase(),
        purchaseAmount,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to validate voucher');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Validate voucher error:', error);
    throw new Error(error.response?.data?.message || 'Failed to validate voucher');
  }
}

/**
 * Get voucher details by code
 * 
 * API: GET /api/v1/vouchers/code/:code
 * Auth: Public
 * Response: { success: true, data: Voucher, timestamp }
 */
export async function getVoucherByCode(code: string): Promise<Voucher> {
  try {
    const response = await axios.get<SuccessResponse<Voucher>>(
      `${API_BASE_URL}/vouchers/code/${code.toUpperCase()}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Voucher not found');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Get voucher error:', error);
    throw new Error(error.response?.data?.message || 'Voucher not found');
  }
}

// ============= Admin API Functions =============

/**
 * Admin: Create new voucher
 * 
 * API: POST /api/v1/admin/vouchers
 * Auth: Required (Bearer token + Admin role)
 * Body: Voucher data
 * Response: { success: true, data: Voucher, timestamp }
 */
export async function createVoucher(
  data: Omit<Voucher, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>
): Promise<Voucher> {
  try {
    const response = await axios.post<SuccessResponse<Voucher>>(
      `${API_BASE_URL}/admin/vouchers`,
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create voucher');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Create voucher error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create voucher');
  }
}

/**
 * Admin: Update voucher
 * 
 * API: PUT /api/v1/admin/vouchers/:id
 * Auth: Required (Bearer token + Admin role)
 * Body: Partial voucher data
 * Response: { success: true, data: Voucher, timestamp }
 */
export async function updateVoucher(
  id: string,
  data: Partial<Omit<Voucher, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Voucher> {
  try {
    const response = await axios.put<SuccessResponse<Voucher>>(
      `${API_BASE_URL}/admin/vouchers/${id}`,
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update voucher');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Update voucher error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update voucher');
  }
}

/**
 * Admin: Delete voucher
 * 
 * API: DELETE /api/v1/admin/vouchers/:id
 * Auth: Required (Bearer token + Admin role)
 * Response: { success: true, message, timestamp }
 */
export async function deleteVoucher(id: string): Promise<void> {
  try {
    const response = await axios.delete<SuccessResponse<null>>(
      `${API_BASE_URL}/admin/vouchers/${id}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete voucher');
    }
  } catch (error: any) {
    console.error('Delete voucher error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete voucher');
  }
}

/**
 * Admin: Get all vouchers with pagination
 * 
 * API: GET /api/v1/admin/vouchers?page&limit
 * Auth: Required (Bearer token + Admin role)
 * Response: { success: true, data: Voucher[], meta: PaginationMeta, timestamp }
 */
export async function getAllVouchers(
  page: number = 1,
  limit: number = 10
): Promise<{
  data: Voucher[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  try {
    const response = await axios.get<
      SuccessResponse<Voucher[]> & { meta: PaginationMeta }
    >(`${API_BASE_URL}/admin/vouchers`, {
      params: { page, limit },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch vouchers');
    }

    const meta = response.data.meta;
    return {
      data: response.data.data,
      total: meta.total,
      page: meta.page,
      limit: meta.limit,
      totalPages: meta.totalPages,
    };
  } catch (error: any) {
    console.error('Get all vouchers error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vouchers');
  }
}
