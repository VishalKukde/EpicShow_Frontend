"use client";

import { useMemo, useState } from "react";
import BillingCycleSelector from "./components/BillingCycleSelector";
import FreePlanCard from "./components/FreePlanCard";
import ProPlanCard from "./components/ProPlanCard";
import SubscriptionHero from "./components/SubscriptionHero";
import { freeFeatures, proFeatures, proPrices } from "./data";
import type { BillingCycle } from "./types";

export default function SubscriptionPage() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const selected = proPrices[cycle];

  const savings = useMemo(() => {
    const monthlyCost = proPrices.monthly.amount;
    const quarterlyMonthlyAvg = Math.round(proPrices.quarterly.amount / 3);
    const yearlyMonthlyAvg = Math.round(proPrices.yearly.amount / 12);

    return {
      quarterly: monthlyCost - quarterlyMonthlyAvg,
      yearly: monthlyCost - yearlyMonthlyAvg,
    };
  }, []);

  return (
    <div className="space-y-6 px-3 py-3 pb-6 select-none sm:px-4 lg:px-0">
      <SubscriptionHero />

      <BillingCycleSelector
        cycle={cycle}
        onChange={setCycle}
        quarterlySavings={savings.quarterly}
        yearlySavings={savings.yearly}
      />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <FreePlanCard features={freeFeatures} />
        <ProPlanCard
          amount={selected.amount}
          label={selected.label}
          features={proFeatures}
        />
      </section>
    </div>
  );
}
