"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

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
import { compoundLumpSum, realValue } from "@/lib/calc/finance";
import {
  calculateAge,
  formatPlainDate,
  parsePlainDate,
  todayPlain,
  weekdayOf,
} from "@/lib/calc/dates";

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Math.random());

// ---------------------------------------------------------------------------

export function AgeCalculator() {
  const [birth, setBirth] = useState("1990-06-15");

  // Initialised lazily rather than in an effect, which would cascade a render.
  // The page is statically generated, so the server value is the build date and
  // the client corrects it on hydration — hence suppressHydrationWarning below.
  const [reference, setReference] = useState(() => formatPlainDate(todayPlain()));

  const result = useMemo(() => {
    const birthDate = parsePlainDate(birth);
    const referenceDate = parsePlainDate(reference);
    if (!birthDate || !referenceDate) return null;
    return calculateAge(birthDate, referenceDate);
  }, [birth, reference]);

  const isFuture = parsePlainDate(birth) && parsePlainDate(reference) && !result;

  return (
    <CalcShell>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dob" className="mb-1.5 block text-sm font-medium text-text-2">
            Date of birth
          </label>
          <input
            id="dob"
            type="date"
            value={birth}
            onChange={(event) => setBirth(event.target.value)}
            className="h-12 w-full rounded-custom-sm border border-border-custom bg-bg px-3.5 text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
          />
        </div>
        <div>
          <label htmlFor="ref" className="mb-1.5 block text-sm font-medium text-text-2">
            Age at date
          </label>
          <input
            id="ref"
            type="date"
            value={reference}
            suppressHydrationWarning
            onChange={(event) => setReference(event.target.value)}
            className="h-12 w-full rounded-custom-sm border border-border-custom bg-bg px-3.5 text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
          />
          <p className="mt-1 text-xs text-text-2">
            Defaults to today. Change it to check age at any past or future date.
          </p>
        </div>
      </div>

      {isFuture && (
        <p className="rounded-custom-sm border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          The date of birth is after the reference date. Swap them to get a result.
        </p>
      )}

      {result && (
        <>
          <PrimaryResult
            label="Age"
            value={`${result.years}y ${result.months}m ${result.days}d`}
            sublabel={`Born on a ${result.bornOn}`}
          />

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ResultStat label="Total days" value={formatNumber(result.totalDays)} />
            <ResultStat label="Total weeks" value={formatNumber(result.totalWeeks)} />
            <ResultStat label="Total months" value={formatNumber(result.totalMonths)} />
            <ResultStat label="Total hours" value={formatNumber(result.totalHours)} />
          </dl>

          <div className="rounded-custom-md border border-border-custom p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-2">
              Next birthday
            </h2>
            <p className="mt-1 text-sm text-text-custom">
              {result.daysToNextBirthday === 0 ? (
                <strong>Today. Happy birthday.</strong>
              ) : (
                <>
                  <strong className="tabular-nums">{result.daysToNextBirthday}</strong> days
                  away, on {formatPlainDate(result.nextBirthday)} — a{" "}
                  {weekdayOf(result.nextBirthday)}.
                </>
              )}
            </p>
          </div>
        </>
      )}
    </CalcShell>
  );
}

// ---------------------------------------------------------------------------

interface LineItem {
  id: string;
  label: string;
  amount: number;
}

export function NetWorthCalculator() {
  const [currency, setCurrency] = useState<CurrencyId>("GBP");

  const [liquid, setLiquid] = useState<LineItem[]>([
    { id: newId(), label: "Cash and savings", amount: 15000 },
    { id: newId(), label: "Investments", amount: 25000 },
  ]);
  const [illiquid, setIlliquid] = useState<LineItem[]>([
    { id: newId(), label: "Property", amount: 350000 },
  ]);
  const [debts, setDebts] = useState<LineItem[]>([
    { id: newId(), label: "Mortgage", amount: 220000 },
    { id: newId(), label: "Other debt", amount: 8000 },
  ]);

  const total = (items: LineItem[]) =>
    items.reduce((sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0), 0);

  const liquidTotal = total(liquid);
  const illiquidTotal = total(illiquid);
  const assetTotal = liquidTotal + illiquidTotal;
  const debtTotal = total(debts);
  const netWorth = assetTotal - debtTotal;
  const liquidNetWorth = liquidTotal - debtTotal;

  const money = (value: number) => formatCurrency(value, currency);
  const symbol = CURRENCIES.find((entry) => entry.id === currency)?.symbol;

  const section = (
    title: string,
    items: LineItem[],
    setItems: (items: LineItem[]) => void,
    hint?: string,
  ) => (
    <div>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-2">
        {title}
      </h2>
      {hint && <p className="mb-2 text-xs text-text-2">{hint}</p>}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr_130px_40px] gap-2">
            <input
              type="text"
              value={item.label}
              onChange={(event) =>
                setItems(
                  items.map((entry) =>
                    entry.id === item.id ? { ...entry, label: event.target.value } : entry,
                  ),
                )
              }
              aria-label="Item name"
              className="h-11 rounded-custom-sm border border-border-custom bg-bg px-3 text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
            />
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-2">
                {symbol}
              </span>
              <input
                type="number"
                value={item.amount}
                min={0}
                step={1000}
                onChange={(event) =>
                  setItems(
                    items.map((entry) =>
                      entry.id === item.id
                        ? { ...entry, amount: Number.parseFloat(event.target.value) || 0 }
                        : entry,
                    ),
                  )
                }
                aria-label="Amount"
                className="h-11 w-full rounded-custom-sm border border-border-custom bg-bg pl-8 pr-3 text-sm tabular-nums text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
              />
            </div>
            <button
              type="button"
              onClick={() => setItems(items.filter((entry) => entry.id !== item.id))}
              aria-label={`Remove ${item.label}`}
              className="flex h-11 w-11 items-center justify-center rounded-custom-sm text-text-2 transition-colors hover:bg-surface hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setItems([...items, { id: newId(), label: "", amount: 0 }])}
          className="inline-flex h-9 items-center gap-1.5 rounded-custom-sm border border-border-custom bg-bg px-3 text-xs font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Plus size={13} aria-hidden="true" />
          Add
        </button>
      </div>
    </div>
  );

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

      <div className="grid gap-6 lg:grid-cols-3">
        {section("Liquid assets", liquid, setLiquid, "Convertible to cash quickly")}
        {section("Other assets", illiquid, setIlliquid, "Property, vehicles, valuables")}
        {section("Liabilities", debts, setDebts, "Outstanding balances, not originals")}
      </div>

      <PrimaryResult
        label="Net worth"
        value={money(netWorth)}
        sublabel={`${money(assetTotal)} in assets less ${money(debtTotal)} in debts`}
      />

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ResultStat label="Total assets" value={money(assetTotal)} />
        <ResultStat label="Total liabilities" value={money(debtTotal)} />
        <ResultStat
          label="Liquid net worth"
          value={money(liquidNetWorth)}
          hint="Excluding property and other slow assets"
          tone={liquidNetWorth < 0 ? "negative" : undefined}
        />
        <ResultStat
          label="Debt to assets"
          value={assetTotal > 0 ? `${((debtTotal / assetTotal) * 100).toFixed(0)}%` : "—"}
          tone={assetTotal > 0 && debtTotal / assetTotal > 0.6 ? "warning" : undefined}
        />
      </dl>

      {assetTotal > 0 && (
        <SplitBar
          segments={[
            { label: "Liquid assets", value: liquidTotal, colour: "var(--cat-accent)" },
            { label: "Other assets", value: illiquidTotal, colour: "#8B5CF6" },
            { label: "Debts", value: debtTotal, colour: "#F59E0B" },
          ]}
        />
      )}
    </CalcShell>
  );
}

// ---------------------------------------------------------------------------

export function RetirementCalculator() {
  const [currency, setCurrency] = useState<CurrencyId>("GBP");
  const [currentAge, setCurrentAge] = useState("35");
  const [retireAge, setRetireAge] = useState("60");
  const [annualSpend, setAnnualSpend] = useState("30000");
  const [existingSavings, setExistingSavings] = useState("50000");
  const [inflation, setInflation] = useState("3");
  const [growthRate, setGrowthRate] = useState("8");
  const [withdrawalRate, setWithdrawalRate] = useState("4");

  const years = (Number.parseFloat(retireAge) || 0) - (Number.parseFloat(currentAge) || 0);
  const spend = Number.parseFloat(annualSpend) || 0;
  const savings = Number.parseFloat(existingSavings) || 0;
  const inf = Number.parseFloat(inflation) || 0;
  const growth = Number.parseFloat(growthRate) || 0;
  const withdrawal = Number.parseFloat(withdrawalRate) || 0;

  const projection = useMemo(() => {
    if (years <= 0 || spend <= 0 || withdrawal <= 0) return null;

    // Today's spending, inflated to the retirement date.
    const futureSpend = spend * Math.pow(1 + inf / 100, years);
    const corpusNeeded = futureSpend / (withdrawal / 100);

    // What existing savings grow to on their own.
    const savingsAtRetirement = compoundLumpSum(savings, growth, years, 12);
    const shortfall = Math.max(0, corpusNeeded - savingsAtRetirement);

    // Monthly saving needed to close the gap, inverting the annuity formula.
    const monthlyRate = growth / 100 / 12;
    const months = Math.round(years * 12);
    const monthlyNeeded =
      shortfall <= 0
        ? 0
        : monthlyRate === 0
          ? shortfall / months
          : shortfall / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

    return {
      futureSpend,
      corpusNeeded,
      savingsAtRetirement,
      shortfall,
      monthlyNeeded,
      corpusInTodaysMoney: realValue(corpusNeeded, inf, years),
    };
  }, [years, spend, savings, inf, growth, withdrawal]);

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
        <NumberField label="Current age" value={currentAge} onChange={setCurrentAge} suffix="years" min={18} max={80} step={1} />
        <NumberField label="Retirement age" value={retireAge} onChange={setRetireAge} suffix="years" min={40} max={90} step={1} />
        <NumberField label="Annual spending today" value={annualSpend} onChange={setAnnualSpend} prefix={symbol} min={0} step={1000} hint="Living costs, not income" />
        <NumberField label="Savings so far" value={existingSavings} onChange={setExistingSavings} prefix={symbol} min={0} step={1000} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField label="Inflation" value={inflation} onChange={setInflation} suffix="%" min={0} max={15} step={0.5} showSlider />
        <NumberField label="Growth until retirement" value={growthRate} onChange={setGrowthRate} suffix="%" min={0} max={20} step={0.5} showSlider />
        <NumberField label="Withdrawal rate" value={withdrawalRate} onChange={setWithdrawalRate} suffix="%" min={1} max={10} step={0.25} showSlider hint="4% is the common rule of thumb" />
      </div>

      {projection && (
        <>
          <PrimaryResult
            label="Corpus needed at retirement"
            value={money(projection.corpusNeeded)}
            sublabel={`worth about ${money(projection.corpusInTodaysMoney)} in today's money`}
          />

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ResultStat
              label="Spending at retirement"
              value={money(projection.futureSpend)}
              hint={`${money(spend)} today after ${years} years of ${inf}% inflation`}
            />
            <ResultStat label="Savings will grow to" value={money(projection.savingsAtRetirement)} />
            <ResultStat
              label="Shortfall"
              value={money(projection.shortfall)}
              tone={projection.shortfall > 0 ? "warning" : "positive"}
            />
            <ResultStat
              label="Save each month"
              value={money(projection.monthlyNeeded)}
              tone={projection.monthlyNeeded > 0 ? undefined : "positive"}
              hint={projection.monthlyNeeded === 0 ? "You are on track" : `for ${years} years`}
            />
          </dl>

          <p className="rounded-custom-sm border border-border-custom bg-surface p-3 text-xs leading-relaxed text-text-2">
            The headline figure is in future money, which is why it looks large. In today&apos;s
            terms the target is{" "}
            <strong className="text-text-custom">{money(projection.corpusInTodaysMoney)}</strong>.
            Dropping the withdrawal rate from 4% to 3% would raise the corpus needed by
            about a third — the assumption matters as much as the saving.
          </p>
        </>
      )}
    </CalcShell>
  );
}
