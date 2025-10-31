/**
 * Voucher Type Definitions
 * DTOs for voucher API responses and requests
 */

// ============================================================================
// Request DTOs
// ============================================================================

export interface ValidateVoucherRequestDTO {
  code: string;
  purchaseAmount: number;
}

// ============================================================================
// Response DTOs
// ============================================================================

export interface VoucherDTO {
  id: string;
  code: string;
  title: string;
  description: string | null;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: string;
  maxDiscountAmount: string | null;
  minPurchaseAmount: string | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ValidateVoucherResponseDTO {
  valid: boolean;
  discount?: number;
  message: string;
}

export interface VoucherListResponseDTO {
  data: VoucherDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============================================================================
// Legacy type aliases (for backwards compatibility)
// ============================================================================

export type ValidateVoucherQuery = ValidateVoucherRequestDTO;
