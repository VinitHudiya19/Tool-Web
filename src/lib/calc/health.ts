/**
 * Health calculations.
 *
 * These are screening estimates, not diagnostics. Each function returns the
 * inputs it used alongside the result so a page can show its working, which
 * matters more here than anywhere else — a number like "your BMI is 27" means
 * nothing without the threshold it is being judged against.
 */

export type Sex = "male" | "female";

// ---------------------------------------------------------------------------
// Body mass index
// ---------------------------------------------------------------------------

export type BmiStandard = "who" | "asian";

export interface BmiCategory {
  label: string;
  /** Lower bound, inclusive. */
  min: number;
  /** Upper bound, exclusive. Infinity for the last band. */
  max: number;
  tone: "low" | "healthy" | "raised" | "high";
}

/**
 * WHO international cut-offs.
 *
 * https://www.who.int/data/gho/data/themes/topics/body-mass-index
 */
export const WHO_BMI_CATEGORIES: BmiCategory[] = [
  { label: "Underweight", min: 0, max: 18.5, tone: "low" },
  { label: "Healthy weight", min: 18.5, max: 25, tone: "healthy" },
  { label: "Overweight", min: 25, max: 30, tone: "raised" },
  { label: "Obese", min: 30, max: Infinity, tone: "high" },
];

/**
 * Lower cut-offs for South and East Asian populations.
 *
 * The WHO expert consultation (Lancet, 2004) found cardiometabolic risk rises
 * at a lower BMI in Asian populations, so several national guidelines — India,
 * China, Japan, Singapore — use 23 and 27.5 rather than 25 and 30. A
 * calculator that only offers the international bands tells a large share of
 * its users they are fine when their own health service would not.
 */
export const ASIAN_BMI_CATEGORIES: BmiCategory[] = [
  { label: "Underweight", min: 0, max: 18.5, tone: "low" },
  { label: "Healthy weight", min: 18.5, max: 23, tone: "healthy" },
  { label: "Increased risk", min: 23, max: 27.5, tone: "raised" },
  { label: "High risk", min: 27.5, max: Infinity, tone: "high" },
];

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  /** Weight range for a healthy BMI at this height, in kilograms. */
  healthyRangeKg: { min: number; max: number };
}

/**
 * Body mass index.
 *
 * BMI = kg / m². Height is taken in centimetres because that is how people
 * know it, and converted here rather than asking for metres.
 */
export function bodyMassIndex(
  weightKg: number,
  heightCm: number,
  standard: BmiStandard = "who",
): BmiResult | null {
  if (!(weightKg > 0) || !(heightCm > 0)) return null;

  const metres = heightCm / 100;
  const bmi = weightKg / (metres * metres);

  const categories =
    standard === "asian" ? ASIAN_BMI_CATEGORIES : WHO_BMI_CATEGORIES;

  const category =
    categories.find((band) => bmi >= band.min && bmi < band.max) ??
    categories[categories.length - 1];

  const healthy = categories.find((band) => band.tone === "healthy")!;

  return {
    bmi,
    category,
    healthyRangeKg: {
      min: healthy.min * metres * metres,
      max: healthy.max * metres * metres,
    },
  };
}

/** Converts feet and inches to centimetres. */
export function feetInchesToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54;
}

/** Converts pounds to kilograms. */
export function poundsToKg(pounds: number): number {
  return pounds * 0.45359237;
}

// ---------------------------------------------------------------------------
// Energy requirements
// ---------------------------------------------------------------------------

export type BmrFormula = "mifflin" | "harris" | "katch";

export const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", multiplier: 1.2, hint: "Desk work, little exercise" },
  { id: "light", label: "Lightly active", multiplier: 1.375, hint: "Light exercise 1–3 days a week" },
  { id: "moderate", label: "Moderately active", multiplier: 1.55, hint: "Moderate exercise 3–5 days a week" },
  { id: "very", label: "Very active", multiplier: 1.725, hint: "Hard exercise 6–7 days a week" },
  { id: "extra", label: "Extremely active", multiplier: 1.9, hint: "Physical job or twice-daily training" },
] as const;

/**
 * Basal metabolic rate.
 *
 * Mifflin-St Jeor is the default because it is the most accurate of the
 * prediction equations for the general population — the American Dietetic
 * Association's evidence review found it within 10% of measured RMR more often
 * than Harris-Benedict. Katch-McArdle is offered because it uses lean mass and
 * so is better for lean, muscular people, where the others under-predict.
 */
export function basalMetabolicRate(options: {
  formula: BmrFormula;
  sex: Sex;
  weightKg: number;
  heightCm: number;
  age: number;
  /** Required for Katch-McArdle only. */
  bodyFatPercent?: number;
}): number | null {
  const { formula, sex, weightKg, heightCm, age, bodyFatPercent } = options;

  if (!(weightKg > 0) || !(heightCm > 0) || !(age > 0)) return null;

  if (formula === "katch") {
    if (bodyFatPercent === undefined || bodyFatPercent < 0 || bodyFatPercent >= 100) {
      return null;
    }
    const leanMass = weightKg * (1 - bodyFatPercent / 100);
    return 370 + 21.6 * leanMass;
  }

  if (formula === "harris") {
    // Revised Harris-Benedict (Roza & Shizgal, 1984).
    return sex === "male"
      ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
      : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
  }

  // Mifflin-St Jeor (1990).
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export interface EnergyPlan {
  bmr: number;
  tdee: number;
  target: number;
  /** Expected weekly weight change in kilograms; negative means loss. */
  weeklyChangeKg: number;
}

/** One kilogram of body fat is about 7,700 kcal. */
const KCAL_PER_KG = 7700;

/**
 * Daily energy target for a chosen rate of change.
 *
 * The deficit is expressed as a weekly rate rather than a percentage, because
 * that is the number people are given ("half a kilo a week") and it makes an
 * unsafe target visible.
 */
export function energyPlan(options: {
  bmr: number;
  activityMultiplier: number;
  /** Desired change per week in kilograms. Negative to lose weight. */
  weeklyChangeKg: number;
}): EnergyPlan {
  const { bmr, activityMultiplier, weeklyChangeKg } = options;

  const tdee = bmr * activityMultiplier;
  const dailyAdjustment = (weeklyChangeKg * KCAL_PER_KG) / 7;

  return {
    bmr,
    tdee,
    target: tdee + dailyAdjustment,
    weeklyChangeKg,
  };
}

export interface MacroSplit {
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  proteinPercent: number;
  carbPercent: number;
  fatPercent: number;
}

/** Protein and carbohydrate supply 4 kcal per gram, fat 9. */
export function macroSplit(
  calories: number,
  proteinPercent: number,
  carbPercent: number,
  fatPercent: number,
): MacroSplit {
  return {
    proteinGrams: (calories * proteinPercent) / 100 / 4,
    carbGrams: (calories * carbPercent) / 100 / 4,
    fatGrams: (calories * fatPercent) / 100 / 9,
    proteinPercent,
    carbPercent,
    fatPercent,
  };
}
