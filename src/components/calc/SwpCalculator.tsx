"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import {
  CalcShell,
  CURRENCIES,
  NumberField,
  OptionGroup,
  PrimaryResult,
  ResultStat,
  formatCurrency,
  type CurrencyId,
} from "@/components/calc/ui";
import { simulateWithdrawals } from "@/lib/calc/finance";

export default function SwpCalculator() {
  const [currency, setCurrency] = useState<CurrencyId>("INR");
  const [corpus, setCorpus] = useState("10000000");
  const [withdrawal, setWithdrawal] = useState("50000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("25");
  const [stepUp, setStepUp] = useState("0");

  const corpusValue = Number.parseFloat(corpus) || 0;
  const monthly = Number.parseFloat(withdrawal) || 0;
  const annualRate = Number.parseFloat(rate) || 0;
  const months = Math.round((Number.parseFloat(years) || 0) * 12);
  const increase = Number.parseFloat(stepUp) || 0;

  const result = useMemo(
    () =>
      simulateWithdrawals({
        corpus: corpusValue,
        monthlyWithdrawal: monthly,
        annualRatePercent: annualRate,
        months,
        annualIncreasePercent: increase,
      }),
    [corpusValue, monthly, annualRate, months, increase],
  );

  // The line between living off returns and eating capital.
  const monthlyGrowth = (corpusValue * annualRate) / 100 / 12;
  const isSustainable = result.exhaustedAfterMonths === null;

  const money = (value: number) => formatCurrency(value, currency);
  const symbol = CURRENCIES.find((entry) => entry.id === currency)?.symbol;

  const lastedYears = result.exhaustedAfterMonths
    ? Math.floor(result.exhaustedAfterMonths / 12)
    : 0;
  const lastedMonths = result.exhaustedAfterMonths
    ? result.exhaustedAfterMonths % 12
    : 0;

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

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Corpus"
          value={corpus}
          onChange={setCorpus}
          prefix={symbol}
          min={0}
          step={100000}
        />
        <NumberField
          label="Monthly withdrawal"
          value={withdrawal}
          onChange={setWithdrawal}
          prefix={symbol}
          min={0}
          step={1000}
        />
        <NumberField
          label="Expected annual return"
          value={rate}
          onChange={setRate}
          suffix="%"
          min={0}
          max={20}
          step={0.5}
          showSlider
        />
        <NumberField
          label="Period to check"
          value={years}
          onChange={setYears}
          suffix="years"
          min={1}
          max={50}
          step={1}
          showSlider
        />
      </div>

      <NumberField
        label="Annual increase in withdrawal (optional)"
        value={stepUp}
        onChange={setStepUp}
        suffix="%"
        min={0}
        max={15}
        step={0.5}
        hint="Keeps the withdrawal in step with rising costs. A flat withdrawal loses purchasing power every year."
      />

      {corpusValue > 0 && monthly > 0 && (
        <>
          <PrimaryResult
            label={isSustainable ? "Your corpus survives" : "Your corpus runs out after"}
            value={
              isSustainable
                ? `${years} years and beyond`
                : `${lastedYears}y ${lastedMonths}m`
            }
            sublabel={
              isSustainable
                ? `${money(result.finalBalance)} remaining at the end`
                : `after ${result.exhaustedAfterMonths} withdrawals`
            }
          />

          {/* The sustainability comparison is the insight people come for. */}
          <div
            className={`flex items-start gap-2.5 rounded-custom-md border p-4 text-sm ${
              isSustainable
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {isSustainable ? (
              <CheckCircle2 size={16} className="mt-px shrink-0" aria-hidden="true" />
            ) : (
              <AlertTriangle size={16} className="mt-px shrink-0" aria-hidden="true" />
            )}
            <span>
              Your corpus earns about <strong>{money(monthlyGrowth)}</strong> a month at{" "}
              {annualRate}%. You are withdrawing <strong>{money(monthly)}</strong>
              {monthly <= monthlyGrowth
                ? " — less than it earns, so the balance keeps growing."
                : ` — ${money(monthly - monthlyGrowth)} more than it earns, so the shortfall comes out of capital.`}
              {increase > 0 &&
                " The annual increase raises the withdrawal over time, which is why a plan that starts sustainable may not stay that way."}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ResultStat label="Total withdrawn" value={money(result.totalWithdrawn)} />
            <ResultStat
              label="Final balance"
              value={money(result.finalBalance)}
              tone={result.finalBalance > corpusValue ? "positive" : undefined}
            />
            <ResultStat
              label="Monthly growth"
              value={money(monthlyGrowth)}
              hint="The sustainability line"
            />
          </dl>

          <div className="border-t border-border-custom pt-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
              Withdrawal schedule
            </h2>
            <div className="max-h-80 overflow-auto rounded-custom-sm border border-border-custom">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-surface">
                  <tr>
                    {["Month", "Opening", "Growth", "Withdrawn", "Closing"].map((heading) => (
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
                  {/* Yearly sampling keeps a 50-year table readable. */}
                  {result.rows
                    .filter((row, index) => index % 12 === 0 || index === result.rows.length - 1)
                    .map((row) => (
                      <tr key={row.month} className="border-b border-border-custom last:border-0">
                        <td className="px-3 py-2 font-medium text-text-custom">{row.month}</td>
                        <td className="px-3 py-2 tabular-nums text-text-2">
                          {money(row.openingBalance)}
                        </td>
                        <td className="px-3 py-2 tabular-nums text-text-2">
                          {money(row.returns)}
                        </td>
                        <td className="px-3 py-2 tabular-nums text-text-2">
                          {money(row.withdrawal)}
                        </td>
                        <td className="px-3 py-2 tabular-nums text-text-2">
                          {money(row.closingBalance)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </CalcShell>
  );
}
