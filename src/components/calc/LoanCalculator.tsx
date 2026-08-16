"use client";

import { useMemo, useState } from "react";

import {
  CalcShell,
  CURRENCIES,
  NumberField,
  OptionGroup,
  PrimaryResult,
  ResultStat,
  SplitBar,
  formatCurrency,
  type CurrencyId,
} from "@/components/calc/ui";
import {
  amortisationSchedule,
  loanPayment,
  summariseByYear,
} from "@/lib/calc/finance";

/**
 * Shared by the EMI and loan calculators, which are the same computation
 * presented for different audiences. The label set is the only difference.
 */
export default function LoanCalculator({
  defaultAmount = "5000000",
  defaultRate = "8.5",
  defaultYears = "20",
  defaultCurrency = "INR",
  paymentLabel = "Monthly EMI",
}: {
  defaultAmount?: string;
  defaultRate?: string;
  defaultYears?: string;
  defaultCurrency?: CurrencyId;
  paymentLabel?: string;
}) {
  const [currency, setCurrency] = useState<CurrencyId>(defaultCurrency);
  const [amount, setAmount] = useState(defaultAmount);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);
  const [extra, setExtra] = useState("0");
  const [view, setView] = useState<"yearly" | "monthly">("yearly");

  const principal = Number.parseFloat(amount) || 0;
  const annualRate = Number.parseFloat(rate) || 0;
  const months = Math.round((Number.parseFloat(years) || 0) * 12);
  const extraPayment = Number.parseFloat(extra) || 0;

  const summary = useMemo(
    () => loanPayment(principal, annualRate, months),
    [principal, annualRate, months],
  );

  const schedule = useMemo(
    () => amortisationSchedule(principal, annualRate, months),
    [principal, annualRate, months],
  );

  const yearly = useMemo(() => summariseByYear(schedule), [schedule]);

  /**
   * Effect of a regular overpayment, simulated directly.
   *
   * There is no closed form for "how many months does an extra £50 remove",
   * so the schedule is replayed with the larger payment.
   */
  const withExtra = useMemo(() => {
    if (extraPayment <= 0 || summary.payment <= 0) return null;

    const monthlyRate = annualRate / 12 / 100;
    const payment = summary.payment + extraPayment;

    let balance = principal;
    let paid = 0;
    let elapsed = 0;

    // Capped so a payment that never clears the interest cannot loop forever.
    while (balance > 0.005 && elapsed < months) {
      const interest = balance * monthlyRate;
      const principalPart = Math.min(payment - interest, balance);

      if (principalPart <= 0) return null;

      balance -= principalPart;
      paid += principalPart + interest;
      elapsed += 1;
    }

    return {
      months: elapsed,
      monthsSaved: months - elapsed,
      totalPaid: paid,
      interestSaved: summary.totalInterest - (paid - principal),
    };
  }, [extraPayment, summary, principal, annualRate, months]);

  const money = (value: number) => formatCurrency(value, currency);

  return (
    <CalcShell>
      <OptionGroup
        label="Currency"
        value={currency}
        onChange={setCurrency}
        options={CURRENCIES.map((entry) => ({
          id: entry.id,
          label: `${entry.symbol} ${entry.id}`,
        }))}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField
          label="Loan amount"
          value={amount}
          onChange={setAmount}
          prefix={CURRENCIES.find((c) => c.id === currency)?.symbol}
          min={0}
          step={10000}
        />
        <NumberField
          label="Interest rate"
          value={rate}
          onChange={setRate}
          suffix="%"
          min={0}
          max={30}
          step={0.1}
          showSlider
          hint="Annual rate, as quoted by the lender"
        />
        <NumberField
          label="Tenure"
          value={years}
          onChange={setYears}
          suffix="years"
          min={1}
          max={40}
          step={1}
          showSlider
        />
      </div>

      {months > 0 && principal > 0 && (
        <>
          <PrimaryResult
            label={paymentLabel}
            value={money(summary.payment)}
            sublabel={`${months} payments over ${(months / 12).toFixed(months % 12 === 0 ? 0 : 1)} years`}
          />

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ResultStat label="Principal" value={money(principal)} />
            <ResultStat
              label="Total interest"
              value={money(summary.totalInterest)}
              tone={summary.totalInterest > principal ? "warning" : undefined}
              hint={
                summary.totalInterest > principal
                  ? "More than the amount borrowed"
                  : undefined
              }
            />
            <ResultStat label="Total repaid" value={money(summary.totalPaid)} />
          </dl>

          <SplitBar
            segments={[
              { label: "Principal", value: principal, colour: "var(--cat-accent)" },
              { label: "Interest", value: summary.totalInterest, colour: "#F59E0B" },
            ]}
          />

          {/* Overpayment */}
          <div className="border-t border-border-custom pt-4">
            <NumberField
              label="Regular overpayment (optional)"
              value={extra}
              onChange={setExtra}
              prefix={CURRENCIES.find((c) => c.id === currency)?.symbol}
              min={0}
              step={500}
              hint="An extra amount added to every payment"
            />

            {withExtra && withExtra.monthsSaved > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <ResultStat
                  label="Finishes earlier by"
                  value={`${withExtra.monthsSaved} months`}
                  tone="positive"
                />
                <ResultStat
                  label="Interest saved"
                  value={money(withExtra.interestSaved)}
                  tone="positive"
                />
              </div>
            )}
          </div>

          {/* Amortisation */}
          <div className="border-t border-border-custom pt-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-text-2">
                Repayment schedule
              </h2>
              <OptionGroup
                label=""
                value={view}
                onChange={setView}
                options={[
                  { id: "yearly", label: "Yearly" },
                  { id: "monthly", label: "Monthly" },
                ]}
              />
            </div>

            <div className="max-h-96 overflow-auto rounded-custom-sm border border-border-custom">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-surface">
                  <tr>
                    {["Period", "Principal", "Interest", "Balance"].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="border-b border-border-custom px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-text-2"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {view === "yearly"
                    ? yearly.map((row) => (
                        <tr key={row.year} className="border-b border-border-custom last:border-0">
                          <td className="px-3 py-2 font-medium text-text-custom">
                            Year {row.year}
                          </td>
                          <td className="px-3 py-2 tabular-nums text-text-2">
                            {money(row.principal)}
                          </td>
                          <td className="px-3 py-2 tabular-nums text-text-2">
                            {money(row.interest)}
                          </td>
                          <td className="px-3 py-2 tabular-nums text-text-2">
                            {money(row.closingBalance)}
                          </td>
                        </tr>
                      ))
                    : schedule.map((row) => (
                        <tr key={row.period} className="border-b border-border-custom last:border-0">
                          <td className="px-3 py-2 font-medium text-text-custom">
                            {row.period}
                          </td>
                          <td className="px-3 py-2 tabular-nums text-text-2">
                            {money(row.principal)}
                          </td>
                          <td className="px-3 py-2 tabular-nums text-text-2">
                            {money(row.interest)}
                          </td>
                          <td className="px-3 py-2 tabular-nums text-text-2">
                            {money(row.closingBalance)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            <p className="mt-2 text-xs text-text-2">
              The final payment settles the remaining balance exactly, so the schedule
              closes at zero rather than drifting.
            </p>
          </div>
        </>
      )}
    </CalcShell>
  );
}
