"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

import {
  CalcShell,
  CURRENCIES,
  NumberField,
  OptionGroup,
  PrimaryResult,
  ResultStat,
  SplitBar,
  formatCurrency,
  formatNumber,
  type CurrencyId,
} from "@/components/calc/ui";
import { breakEven, profitMargin, returnOnInvestment } from "@/lib/calc/finance";

function useCurrency(initial: CurrencyId = "GBP") {
  const [currency, setCurrency] = useState<CurrencyId>(initial);
  const symbol = CURRENCIES.find((entry) => entry.id === currency)?.symbol;
  const money = (value: number) => formatCurrency(value, currency);

  const picker = (
    <OptionGroup
      label="Currency"
      value={currency}
      onChange={setCurrency}
      options={CURRENCIES.map((entry) => ({
        id: entry.id,
        label: `${entry.symbol} ${entry.id}`,
      }))}
    />
  );

  return { currency, symbol, money, picker };
}

// ---------------------------------------------------------------------------

export function RoiCalculator() {
  const { symbol, money, picker } = useCurrency();
  const [invested, setInvested] = useState("10000");
  const [returned, setReturned] = useState("15000");
  const [years, setYears] = useState("3");

  const initial = Number.parseFloat(invested) || 0;
  const final = Number.parseFloat(returned) || 0;
  const period = Number.parseFloat(years) || 0;

  const result = useMemo(
    () => returnOnInvestment(initial, final, period > 0 ? period : undefined),
    [initial, final, period],
  );

  return (
    <CalcShell>
      {picker}

      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField label="Amount invested" value={invested} onChange={setInvested} prefix={symbol} min={0} step={100} />
        <NumberField label="Value returned" value={returned} onChange={setReturned} prefix={symbol} min={0} step={100} />
        <NumberField label="Holding period" value={years} onChange={setYears} suffix="years" min={0} step={0.5} hint="Unlocks the annualised figure" />
      </div>

      {initial > 0 && (
        <>
          <PrimaryResult
            label="Return on investment"
            value={`${result.roiPercent >= 0 ? "+" : ""}${result.roiPercent.toFixed(2)}%`}
            sublabel={`${result.gain >= 0 ? "Gain" : "Loss"} of ${money(Math.abs(result.gain))}`}
          />

          <dl className="grid grid-cols-2 gap-3">
            <ResultStat
              label="Annualised (CAGR)"
              value={result.cagrPercent !== null ? `${result.cagrPercent.toFixed(2)}%` : "—"}
              hint={result.cagrPercent !== null ? "The comparable figure" : "Enter a holding period"}
              tone={result.cagrPercent !== null && result.cagrPercent < 0 ? "negative" : "positive"}
            />
            <ResultStat
              label="Absolute gain"
              value={money(result.gain)}
              tone={result.gain >= 0 ? "positive" : "negative"}
            />
          </dl>

          {result.cagrPercent !== null && period > 1 && (
            <p className="rounded-custom-sm border border-border-custom bg-surface p-3 text-xs leading-relaxed text-text-2">
              A {result.roiPercent.toFixed(1)}% total return over {period} years is{" "}
              <strong className="text-text-custom">{result.cagrPercent.toFixed(2)}% a year</strong>.
              Always compare investments on the annualised figure — simple ROI hides how
              long the money was tied up.
            </p>
          )}
        </>
      )}
    </CalcShell>
  );
}

// ---------------------------------------------------------------------------

export function ProfitMarginCalculator() {
  const { symbol, money, picker } = useCurrency();
  const [cost, setCost] = useState("40");
  const [price, setPrice] = useState("100");
  const [targetMargin, setTargetMargin] = useState("50");

  const costValue = Number.parseFloat(cost) || 0;
  const priceValue = Number.parseFloat(price) || 0;
  const target = Number.parseFloat(targetMargin) || 0;

  const result = useMemo(
    () => profitMargin(priceValue, costValue),
    [priceValue, costValue],
  );

  // Price needed for a target margin: price = cost / (1 − margin).
  const requiredPrice =
    target > 0 && target < 100 ? costValue / (1 - target / 100) : null;

  return (
    <CalcShell>
      {picker}

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Cost per unit" value={cost} onChange={setCost} prefix={symbol} min={0} step={1} />
        <NumberField label="Selling price" value={price} onChange={setPrice} prefix={symbol} min={0} step={1} hint="Excluding sales tax" />
      </div>

      {priceValue > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <PrimaryResult
              label="Profit margin"
              value={`${result.marginPercent.toFixed(1)}%`}
              sublabel="Share of the selling price you keep"
            />
            <PrimaryResult
              label="Markup"
              value={`${result.markupPercent.toFixed(1)}%`}
              sublabel="How much you added to cost"
            />
          </div>

          <dl className="grid grid-cols-2 gap-3">
            <ResultStat
              label="Profit per unit"
              value={money(result.profit)}
              tone={result.profit >= 0 ? "positive" : "negative"}
            />
            <ResultStat label="Cost as a share of price" value={`${priceValue > 0 ? ((costValue / priceValue) * 100).toFixed(1) : "0"}%`} />
          </dl>

          <SplitBar
            segments={[
              { label: "Cost", value: costValue, colour: "#94A3B8" },
              { label: "Profit", value: Math.max(0, result.profit), colour: "var(--cat-accent)" },
            ]}
          />

          <p className="rounded-custom-sm border border-border-custom bg-surface p-3 text-xs leading-relaxed text-text-2">
            The same {money(result.profit)} profit is a{" "}
            <strong className="text-text-custom">{result.marginPercent.toFixed(1)}% margin</strong>{" "}
            but a <strong className="text-text-custom">{result.markupPercent.toFixed(1)}% markup</strong>.
            Quoting markup as margin is the most common pricing error in small business.
          </p>
        </>
      )}

      <div className="border-t border-border-custom pt-4">
        <NumberField
          label="Work backwards — target margin"
          value={targetMargin}
          onChange={setTargetMargin}
          suffix="%"
          min={0}
          max={99}
          step={1}
          showSlider
        />
        {requiredPrice !== null && costValue > 0 && (
          <p className="mt-2 text-sm text-text-2">
            To achieve a {target}% margin on a {money(costValue)} cost, price at{" "}
            <strong className="text-text-custom">{money(requiredPrice)}</strong> — a markup of{" "}
            {(((requiredPrice - costValue) / costValue) * 100).toFixed(1)}%.
          </p>
        )}
      </div>
    </CalcShell>
  );
}

// ---------------------------------------------------------------------------

export function BreakEvenCalculator() {
  const { symbol, money, picker } = useCurrency();
  const [fixed, setFixed] = useState("100000");
  const [price, setPrice] = useState("500");
  const [variable, setVariable] = useState("300");
  const [targetProfit, setTargetProfit] = useState("0");
  const [currentSales, setCurrentSales] = useState("0");

  const fixedCosts = Number.parseFloat(fixed) || 0;
  const priceValue = Number.parseFloat(price) || 0;
  const variableCost = Number.parseFloat(variable) || 0;
  const profit = Number.parseFloat(targetProfit) || 0;
  const sales = Number.parseFloat(currentSales) || 0;

  const result = useMemo(
    () => breakEven(fixedCosts, priceValue, variableCost),
    [fixedCosts, priceValue, variableCost],
  );

  const unitsForProfit =
    result.contributionPerUnit > 0
      ? (fixedCosts + profit) / result.contributionPerUnit
      : null;

  const marginOfSafety =
    result.units !== null && sales > result.units
      ? ((sales - result.units) / sales) * 100
      : null;

  return (
    <CalcShell>
      {picker}

      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField label="Fixed costs" value={fixed} onChange={setFixed} prefix={symbol} min={0} step={1000} hint="Rent, salaries, insurance" />
        <NumberField label="Price per unit" value={price} onChange={setPrice} prefix={symbol} min={0} step={10} />
        <NumberField label="Variable cost per unit" value={variable} onChange={setVariable} prefix={symbol} min={0} step={10} hint="Materials, shipping, fees" />
      </div>

      {result.units === null ? (
        <div className="flex items-start gap-2.5 rounded-custom-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle size={16} className="mt-px shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">There is no break-even point.</strong> Each
            unit loses {money(Math.abs(result.contributionPerUnit))} because the variable
            cost meets or exceeds the price, so selling more increases the loss. Volume
            cannot fix negative contribution — only a higher price or a lower cost can.
          </span>
        </div>
      ) : (
        <>
          <PrimaryResult
            label="Break-even volume"
            value={`${formatNumber(Math.ceil(result.units))} units`}
            sublabel={`${money(result.revenueAtBreakEven ?? 0)} in revenue`}
          />

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ResultStat
              label="Contribution per unit"
              value={money(result.contributionPerUnit)}
              hint="What each sale adds to fixed costs"
            />
            <ResultStat
              label="Contribution margin"
              value={`${result.contributionMarginPercent.toFixed(1)}%`}
            />
            <ResultStat
              label="Units for target profit"
              value={unitsForProfit !== null ? formatNumber(Math.ceil(unitsForProfit)) : "—"}
            />
          </dl>

          <div className="grid gap-4 border-t border-border-custom pt-4 sm:grid-cols-2">
            <NumberField label="Target profit (optional)" value={targetProfit} onChange={setTargetProfit} prefix={symbol} min={0} step={1000} />
            <NumberField label="Current unit sales (optional)" value={currentSales} onChange={setCurrentSales} min={0} step={10} hint="To see your margin of safety" />
          </div>

          {marginOfSafety !== null && (
            <p className="rounded-custom-sm border border-border-custom bg-surface p-3 text-xs leading-relaxed text-text-2">
              Selling {formatNumber(sales)} units against a break-even of{" "}
              {formatNumber(Math.ceil(result.units))} gives a margin of safety of{" "}
              <strong className="text-text-custom">{marginOfSafety.toFixed(1)}%</strong> —
              how far sales can fall before you start making a loss.
            </p>
          )}
        </>
      )}
    </CalcShell>
  );
}
