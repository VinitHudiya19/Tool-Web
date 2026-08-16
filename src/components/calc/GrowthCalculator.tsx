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
  COMPOUND_FREQUENCIES,
  compoundContributions,
  compoundLumpSum,
  projectGrowth,
  realValue,
} from "@/lib/calc/finance";

/**
 * Shared by the compound interest and SIP calculators.
 *
 * `sipMode` switches the defaults to a start-of-period contribution and a
 * monthly-only frequency, which is how a SIP actually behaves — the timing
 * convention is worth about 1% over ten years.
 */
export default function GrowthCalculator({
  sipMode = false,
  defaultPrincipal = "100000",
  defaultContribution = "5000",
  defaultRate = "12",
  defaultYears = "10",
  defaultCurrency = "INR",
}: {
  sipMode?: boolean;
  defaultPrincipal?: string;
  defaultContribution?: string;
  defaultRate?: string;
  defaultYears?: string;
  defaultCurrency?: CurrencyId;
}) {
  const [currency, setCurrency] = useState<CurrencyId>(defaultCurrency);
  const [principal, setPrincipal] = useState(sipMode ? "0" : defaultPrincipal);
  const [contribution, setContribution] = useState(defaultContribution);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);
  const [frequency, setFrequency] = useState(12);
  const [atStart, setAtStart] = useState(sipMode);
  const [stepUp, setStepUp] = useState("0");
  const [inflation, setInflation] = useState("6");

  const p = Number.parseFloat(principal) || 0;
  const c = Number.parseFloat(contribution) || 0;
  const r = Number.parseFloat(rate) || 0;
  const y = Number.parseFloat(years) || 0;
  const step = Number.parseFloat(stepUp) || 0;
  const inf = Number.parseFloat(inflation) || 0;

  /**
   * With a step-up the contribution changes each year, so the closed form no
   * longer applies and each year is grown separately.
   */
  const result = useMemo(() => {
    if (step <= 0) {
      return projectGrowth({
        principal: p,
        contribution: c,
        annualRatePercent: r,
        years: y,
        periodsPerYear: frequency,
        contributeAtStart: atStart,
      });
    }

    let futureValue = compoundLumpSum(p, r, y, frequency);
    let invested = p;
    let yearlyContribution = c;

    for (let year = 0; year < Math.floor(y); year += 1) {
      const grownForOneYear = compoundContributions(
        yearlyContribution,
        r,
        1,
        frequency,
        atStart,
      );
      // Each year's contributions then compound for the remaining years.
      futureValue += compoundLumpSum(grownForOneYear, r, y - year - 1, frequency);
      invested += yearlyContribution * frequency;
      yearlyContribution *= 1 + step / 100;
    }

    return {
      futureValue,
      totalInvested: invested,
      totalGain: futureValue - invested,
    };
  }, [p, c, r, y, frequency, atStart, step]);

  const money = (value: number) => formatCurrency(value, currency);
  const symbol = CURRENCIES.find((entry) => entry.id === currency)?.symbol;

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
        {!sipMode && (
          <NumberField
            label="Starting amount"
            value={principal}
            onChange={setPrincipal}
            prefix={symbol}
            min={0}
            step={1000}
          />
        )}
        <NumberField
          label={sipMode ? "Monthly investment" : "Regular contribution"}
          value={contribution}
          onChange={setContribution}
          prefix={symbol}
          min={0}
          step={500}
        />
        <NumberField
          label={sipMode ? "Expected annual return" : "Annual interest rate"}
          value={rate}
          onChange={setRate}
          suffix="%"
          min={0}
          max={30}
          step={0.5}
          showSlider
        />
        <NumberField
          label="Period"
          value={years}
          onChange={setYears}
          suffix="years"
          min={1}
          max={40}
          step={1}
          showSlider
        />
      </div>

      {!sipMode && (
        <OptionGroup
          label="Compounding frequency"
          value={String(frequency)}
          onChange={(value) => setFrequency(Number(value))}
          options={COMPOUND_FREQUENCIES.map((entry) => ({
            id: String(entry.id),
            label: entry.label,
          }))}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Annual step-up (optional)"
          value={stepUp}
          onChange={setStepUp}
          suffix="%"
          min={0}
          max={25}
          step={1}
          hint="Raise the contribution each year as income grows"
        />
        <NumberField
          label="Inflation, for the real value"
          value={inflation}
          onChange={setInflation}
          suffix="%"
          min={0}
          max={20}
          step={0.5}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 text-sm text-text-custom">
        <input
          type="checkbox"
          checked={atStart}
          onChange={(event) => setAtStart(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--cat-accent)]"
        />
        <span>
          Contribute at the start of each period
          <span className="mt-0.5 block text-xs text-text-2">
            A SIP debits on the 1st, so the instalment earns that period&apos;s growth.
            Turning this off understates a ten-year SIP by about 1%.
          </span>
        </span>
      </label>

      {y > 0 && (result.totalInvested > 0 || p > 0) && (
        <>
          <PrimaryResult
            label={sipMode ? "Maturity value" : "Final amount"}
            value={money(result.futureValue)}
            sublabel={`after ${y} year${y === 1 ? "" : "s"}`}
          />

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ResultStat label="Total invested" value={money(result.totalInvested)} />
            <ResultStat
              label="Growth"
              value={money(result.totalGain)}
              tone={result.totalGain > 0 ? "positive" : undefined}
            />
            <ResultStat
              label="Worth in today's money"
              value={money(realValue(result.futureValue, inf, y))}
              hint={`after ${inf}% inflation`}
            />
          </dl>

          <SplitBar
            segments={[
              { label: "Invested", value: result.totalInvested, colour: "var(--cat-accent)" },
              { label: "Growth", value: Math.max(0, result.totalGain), colour: "#10B981" },
            ]}
          />
        </>
      )}
    </CalcShell>
  );
}
