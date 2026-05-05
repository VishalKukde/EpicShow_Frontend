import type { AppliedCoupon, OfferBookingType, UserCoupon } from "@/types/Offer";

const offerDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatOfferDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return offerDateFormatter.format(date);
}

export function getBookingTypeLabel(type: OfferBookingType) {
  switch (type) {
    case "movie":
      return "Movies";
    case "event":
      return "Events";
    case "sport":
      return "Sports";
    case "gaming":
      return "Gaming";
    default:
      return type;
  }
}

export function toAppliedCoupon(coupon: UserCoupon): AppliedCoupon {
  return {
    _id: coupon._id,
    code: coupon.code,
    title: coupon.title,
    categoryId: coupon.categoryId,
    discountType: coupon.discountType,
    value: coupon.value,
    maxDiscount: coupon.maxDiscount,
    minAmount: coupon.minAmount,
    validTill: coupon.validTill,
    applicableBookingTypes: coupon.applicableBookingTypes,
    discountLabel: coupon.discountLabel,
    off: Number(coupon.estimatedDiscount || 0),
  };
}
