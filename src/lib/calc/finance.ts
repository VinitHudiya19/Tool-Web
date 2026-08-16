/**
 * Financial mathematics.
 *
 * Every function here is pure and independently testable, because a wrong
 * number in a loan or retirement calculator is not a cosmetic bug — someone
 * makes a decision on it. Two rules are enforced throughout:
 *
 * 1. A zero interest rate never divides by zero. The standard annuity formula
 *    is 0/0 at r = 0, so every function has an explicit linear branch.
 * 2. Rounding happens at the edge, never in the middle. An amortisation
 *    schedule built from a rounded instalment drifts by hundreds of rupees
 *    over 360 payments and never closes at zero.
 */

/** Rounds to 2 decimals without the floating-point surprises of toFixed. */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

// ---------------------------------------------------------------------------
// Loans
// ---------------------------------------------------------------------------

export interface LoanSummary {
  /** Equated instalment per period, unrounded. */
  payment: number;
  totalPaid: number;
  totalInterest: number;
}

/**
 * Equated instalment for an amortising loan.
 *
 * EMI = P · r · (1 + r)^n / ((1 + r)^n − 1), where r is the rate per period.
 */
export function loanPayment(
  principal: number,
  annualRatePercent: number,
  months: number,
): LoanSummary {
  if (!isPositive(principal) || !isPositive(months)) {
    return { payment: 0, totalPaid: 0, totalInterest: 0 };
  }

  const r = annualRatePercent / 12 / 100;

  // An interest-free loan is repaid in equal slices of principal.
  if (r === 0) {
    const payment = principal / months;
    return { payment, totalPaid: principal, totalInterest: 0 };
  }

  const growth = Math.pow(1 + r, months);
  const payment = (principal * r * growth) / (growth - 1);
  const totalPaid = payment * months;

  return {
    payment,
    totalPaid,
    totalInterest: totalPaid - principal,
  };
}

export interface AmortisationRow {
  period: number;
  openingBalance: number;
  payment: number;
  interest: number;
  principal: number;
  closingBalance: number;
}

/**
 * Month-by-month amortisation that closes at exactly zero.
 *
 * The instalment is kept unrounded while the schedule is built, and the final
 * payment absorbs the remainder — which is what a lender actually does. Using
 * a rounded instalment throughout leaves a visible balance on the last row.
 */
export function amortisationSchedule(
  principal: number,
  annualRatePercent: number,
  months: number,
): AmortisationRow[] {
  if (!isPositive(principal) || !isPositive(months)) return [];

  const r = annualRatePercent / 12 / 100;
  const { payment } = loanPayment(principal, annualRatePercent, months);

  const rows: AmortisationRow[] = [];
  let balance = principal;

  for (let period = 1; period <= months; period += 1) {
    const interest = balance * r;
    const isLast = period === months;

    // The last instalment settles whatever remains, so the balance ends at 0.
    const principalPart = isLast ? balance : payment - interest;
    const actualPayment = isLast ? balance + interest : payment;

    const opening = balance;
    balance = Math.max(0, balance - principalPart);

    rows.push({
      period,
      openingBalance: round2(opening),
      payment: round2(actualPayment),
      interest: round2(interest),
      principal: round2(principalPart),
      closingBalance: round2(balance),
    });
  }

  return rows;
}

/** Collapses a monthly schedule into yearly totals for display. */
export function summariseByYear(rows: AmortisationRow[]) {
  const years: {
    year: number;
    principal: number;
    interest: number;
    payment: number;
    closingBalance: number;
  }[] = [];

  for (let index = 0; index < rows.length; index += 12) {
    const slice = rows.slice(index, index + 12);
    years.push({
      year: Math.floor(index / 12) + 1,
      principal: round2(slice.reduce((sum, row) => sum + row.principal, 0)),
      interest: round2(slice.reduce((sum, row) => sum + row.interest, 0)),
      payment: round2(slice.reduce((sum, row) => sum + row.payment, 0)),
      closingBalance: slice[slice.length - 1].closingBalance,
    });
  }

  return years;
}

// ---------------------------------------------------------------------------
// Compounding and investment
// ---------------------------------------------------------------------------

/** How often interest is added to the balance, per year. */
export const COMPOUND_FREQUENCIES = [
  { id: 1, label: "Yearly" },
  { id: 2, label: "Half-yearly" },
  { id: 4, label: "Quarterly" },
  { id: 12, label: "Monthly" },
  { id: 365, label: "Daily" },
] as const;

export interface GrowthSummary {
  futureValue: number;
  totalInvested: number;
  totalGain: number;
}

/**
 * Future value of a lump sum.
 *
 * A = P(1 + r/n)^(nt)
 */
export function compoundLumpSum(
  principal: number,
  annualRatePercent: number,
  years: number,
  timesPerYear = 1,
): number {
  if (!isPositive(principal) || years <= 0) return Math.max(0, principal);

  const r = annualRatePercent / 100;
  if (r === 0) return principal;

  return principal * Math.pow(1 + r / timesPerYear, timesPerYear * years);
}

/**
 * Future value of a regular contribution.
 *
 * The contribution interval and the compounding interval are deliberately the
 * same. Compounding a lump sum yearly while compounding contributions monthly
 * — as many calculators do — produces a figure that corresponds to no real
 * product, because the two halves grow under different assumptions.
 *
 * `atPeriodStart` matters more than it looks. A SIP debits on the 1st, so the
 * instalment earns that month's growth and the published figures for any given
 * SIP are annuity-due. Treating it as an ordinary annuity understates the
 * result by roughly one period of interest — about 1% over ten years at 12%.
 */
export function compoundContributions(
  contributionPerPeriod: number,
  annualRatePercent: number,
  years: number,
  periodsPerYear = 12,
  atPeriodStart = false,
): number {
  if (!isPositive(contributionPerPeriod) || years <= 0) return 0;

  const periods = Math.round(years * periodsPerYear);
  const r = annualRatePercent / 100 / periodsPerYear;

  // Without growth the total is simply everything paid in.
  if (r === 0) return contributionPerPeriod * periods;

  const ordinary =
    contributionPerPeriod * ((Math.pow(1 + r, periods) - 1) / r);

  // Paying at the start of each period earns one extra period of growth.
  return atPeriodStart ? ordinary * (1 + r) : ordinary;
}

/**
 * Combined growth of an opening balance plus regular contributions.
 *
 * Both parts use the same compounding interval, so the result is internally
 * consistent.
 */
export function projectGrowth(options: {
  principal: number;
  contribution: number;
  annualRatePercent: number;
  years: number;
  periodsPerYear?: number;
  contributeAtStart?: boolean;
}): GrowthSummary {
  const {
    principal,
    contribution,
    annualRatePercent,
    years,
    periodsPerYear = 12,
    contributeAtStart = false,
  } = options;

  const lump = compoundLumpSum(
    principal,
    annualRatePercent,
    years,
    periodsPerYear,
  );

  const stream = compoundContributions(
    contribution,
    annualRatePercent,
    years,
    periodsPerYear,
    contributeAtStart,
  );

  const invested = principal + contribution * Math.round(years * periodsPerYear);

  return {
    futureValue: lump + stream,
    totalInvested: invested,
    totalGain: lump + stream - invested,
  };
}

/**
 * Systematic withdrawal, simulated month by month.
 *
 * Returns are credited before the withdrawal is taken, matching how a fund
 * house processes a redemption. A closed-form formula cannot express the case
 * where the balance runs out mid-way, which is the answer people actually
 * want.
 */
export interface WithdrawalRow {
  month: number;
  openingBalance: number;
  returns: number;
  withdrawal: number;
  closingBalance: number;
}

export interface WithdrawalSummary {
  rows: WithdrawalRow[];
  /** Months the corpus lasted, or null when it survives the whole period. */
  exhaustedAfterMonths: number | null;
  totalWithdrawn: number;
  finalBalance: number;
}

export function simulateWithdrawals(options: {
  corpus: number;
  monthlyWithdrawal: number;
  annualRatePercent: number;
  months: number;
  /** Annual step-up in the withdrawal, as a percentage. */
  annualIncreasePercent?: number;
}): WithdrawalSummary {
  const {
    corpus,
    monthlyWithdrawal,
    annualRatePercent,
    months,
    annualIncreasePercent = 0,
  } = options;

  const r = annualRatePercent / 100 / 12;
  const rows: WithdrawalRow[] = [];

  let balance = corpus;
  let withdrawal = monthlyWithdrawal;
  let totalWithdrawn = 0;
  let exhaustedAfterMonths: number | null = null;

  for (let month = 1; month <= months; month += 1) {
    // Inflation-style step-up applies on each anniversary.
    if (month > 1 && (month - 1) % 12 === 0 && annualIncreasePercent !== 0) {
      withdrawal *= 1 + annualIncreasePercent / 100;
    }

    const opening = balance;
    const returns = balance * r;
    const available = balance + returns;
    const taken = Math.min(withdrawal, Math.max(0, available));

    balance = available - taken;
    totalWithdrawn += taken;

    rows.push({
      month,
      openingBalance: round2(opening),
      returns: round2(returns),
      withdrawal: round2(taken),
      closingBalance: round2(Math.max(0, balance)),
    });

    if (balance <= 0.005) {
      exhaustedAfterMonths = month;
      break;
    }
  }

  return {
    rows,
    exhaustedAfterMonths,
    totalWithdrawn: round2(totalWithdrawn),
    finalBalance: round2(Math.max(0, balance)),
  };
}

// ---------------------------------------------------------------------------
// Returns and business ratios
// ---------------------------------------------------------------------------

/**
 * Return on investment, with the annualised figure where a period is given.
 *
 * Simple ROI ignores time, so a 50% gain looks identical over one year and
 * ten. CAGR is the comparable number.
 */
export function returnOnInvestment(
  invested: number,
  returned: number,
  years?: number,
): { roiPercent: number; gain: number; cagrPercent: number | null } {
  if (!isPositive(invested)) {
    return { roiPercent: 0, gain: 0, cagrPercent: null };
  }

  const gain = returned - invested;
  const roiPercent = (gain / invested) * 100;

  // CAGR is undefined for a non-positive final value or a zero period.
  const cagrPercent =
    years && years > 0 && returned > 0
      ? (Math.pow(returned / invested, 1 / years) - 1) * 100
      : null;

  return { roiPercent, gain, cagrPercent };
}

export interface MarginSummary {
  revenue: number;
  cost: number;
  profit: number;
  /** Profit as a share of revenue. */
  marginPercent: number;
  /** Profit as a share of cost — always the larger number. */
  markupPercent: number;
}

/**
 * Margin and markup, which are routinely confused.
 *
 * A £40 item sold for £100 carries a 60% margin but a 150% markup. Quoting
 * markup as margin overstates profitability, so both are always returned.
 */
export function profitMargin(revenue: number, cost: number): MarginSummary {
  const profit = revenue - cost;

  return {
    revenue,
    cost,
    profit,
    marginPercent: isPositive(revenue) ? (profit / revenue) * 100 : 0,
    markupPercent: isPositive(cost) ? (profit / cost) * 100 : 0,
  };
}

export interface BreakEvenSummary {
  /** Units that must be sold to cover fixed costs. */
  units: number | null;
  revenueAtBreakEven: number | null;
  contributionPerUnit: number;
  contributionMarginPercent: number;
}

/**
 * Break-even point.
 *
 * Units = fixed costs / (price − variable cost). When the price does not
 * exceed the variable cost there is no break-even point at any volume, which
 * is returned as null rather than a misleading Infinity.
 */
export function breakEven(
  fixedCosts: number,
  pricePerUnit: number,
  variableCostPerUnit: number,
): BreakEvenSummary {
  const contribution = pricePerUnit - variableCostPerUnit;

  if (contribution <= 0) {
    return {
      units: null,
      revenueAtBreakEven: null,
      contributionPerUnit: contribution,
      contributionMarginPercent: isPositive(pricePerUnit)
        ? (contribution / pricePerUnit) * 100
        : 0,
    };
  }

  const units = fixedCosts / contribution;

  return {
    units,
    revenueAtBreakEven: units * pricePerUnit,
    contributionPerUnit: contribution,
    contributionMarginPercent: (contribution / pricePerUnit) * 100,
  };
}

/**
 * Real value after inflation.
 *
 * Used to show what a projected corpus is worth in today's money, which is
 * the difference between a retirement figure that means something and one
 * that flatters.
 */
export function realValue(
  nominal: number,
  inflationPercent: number,
  years: number,
): number {
  if (inflationPercent === 0 || years <= 0) return nominal;
  return nominal / Math.pow(1 + inflationPercent / 100, years);
}
