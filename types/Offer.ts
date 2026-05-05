export type OfferDiscountType = "PERCENT" | "FLAT";
export type OfferBookingType = "movie" | "event" | "sport" | "gaming";
export type UserCouponStatus = "ACTIVE" | "USED" | "EXPIRED";

export interface OfferCoupon {
  _id: string;
  categoryId: string;
  categoryTitle: string;
  title: string;
  description: string;
  discountType: OfferDiscountType;
  value: number;
  maxDiscount: number | null;
  minAmount: number;
  validTill: string;
  applicableBookingTypes: OfferBookingType[];
  codePrefix: string;
  discountLabel: string;
  conditions: string[];
}

export interface OfferCategory {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  accentFrom: string;
  accentTo: string;
  couponCount: number;
  featuredCoupons: OfferCoupon[];
  coupons?: OfferCoupon[];
}

export interface UserCoupon extends OfferCoupon {
  _id: string;
  code: string;
  status: UserCouponStatus;
  collectedAt: string;
  usedAt: string | null;
  usedBookingId: string | null;
  estimatedDiscount: number;
  isEligible: boolean;
  ineligibilityReason: string | null;
}

export interface AppliedCoupon {
  _id: string;
  code: string;
  title: string;
  categoryId: string;
  discountType: OfferDiscountType;
  value: number;
  maxDiscount: number | null;
  minAmount: number;
  validTill: string;
  applicableBookingTypes: OfferBookingType[];
  discountLabel: string;
  off: number;
}

export interface OffersResponse {
  categories: OfferCategory[];
}

export interface MyCouponsResponse {
  coupons: UserCoupon[];
  grouped: {
    ACTIVE: UserCoupon[];
    USED: UserCoupon[];
    EXPIRED: UserCoupon[];
  };
  counts: {
    total: number;
    active: number;
    used: number;
    expired: number;
  };
}
