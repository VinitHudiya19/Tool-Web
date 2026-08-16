"use client";

import { useMemo, useState } from "react";

import {
  CalcShell,
  NumberField,
  OptionGroup,
  PrimaryResult,
  ResultStat,
  formatNumber,
} from "@/components/calc/ui";
import {
  ACTIVITY_LEVELS,
  ASIAN_BMI_CATEGORIES,
  WHO_BMI_CATEGORIES,
  basalMetabolicRate,
  bodyMassIndex,
  energyPlan,
  feetInchesToCm,
  macroSplit,
  poundsToKg,
  type BmiStandard,
  type BmrFormula,
  type Sex,
} from "@/lib/calc/health";

type Units = "metric" | "imperial";

const TONE_CLASS: Record<string, string> = {
  low: "text-amber-600",
  healthy: "text-emerald-600",
  raised: "text-amber-600",
  high: "text-red-600",
};

// ---------------------------------------------------------------------------

export function BmiCalculator() {
  const [units, setUnits] = useState<Units>("metric");
  const [standard, setStandard] = useState<BmiStandard>("who");

  const [kg, setKg] = useState("70");
  const [cm, setCm] = useState("175");
  const [pounds, setPounds] = useState("154");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");

  const weightKg =
    units === "metric"
      ? Number.parseFloat(kg) || 0
      : poundsToKg(Number.parseFloat(pounds) || 0);

  const heightCm =
    units === "metric"
      ? Number.parseFloat(cm) || 0
      : feetInchesToCm(Number.parseFloat(feet) || 0, Number.parseFloat(inches) || 0);

  const result = useMemo(
    () => bodyMassIndex(weightKg, heightCm, standard),
    [weightKg, heightCm, standard],
  );

  const categories = standard === "asian" ? ASIAN_BMI_CATEGORIES : WHO_BMI_CATEGORIES;

  return (
    <CalcShell>
      <div className="grid gap-4 sm:grid-cols-2">
        <OptionGroup
          label="Units"
          value={units}
          onChange={setUnits}
          options={[
            { id: "metric", label: "Metric" },
            { id: "imperial", label: "Imperial" },
          ]}
        />
        <OptionGroup
          label="Threshold set"
          value={standard}
          onChange={setStandard}
          options={[
            { id: "who", label: "WHO", hint: "International cut-offs: healthy 18.5–24.9" },
            { id: "asian", label: "Asian", hint: "Used in India, China and Japan: healthy 18.5–22.9" },
          ]}
        />
      </div>

      {units === "metric" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Weight" value={kg} onChange={setKg} suffix="kg" min={20} max={300} step={0.5} showSlider />
          <NumberField label="Height" value={cm} onChange={setCm} suffix="cm" min={100} max={250} step={1} showSlider />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField label="Weight" value={pounds} onChange={setPounds} suffix="lb" min={40} max={660} step={1} />
          <NumberField label="Height (feet)" value={feet} onChange={setFeet} suffix="ft" min={3} max={8} step={1} />
          <NumberField label="Height (inches)" value={inches} onChange={setInches} suffix="in" min={0} max={11} step={1} />
        </div>
      )}

      {result && (
        <>
          <PrimaryResult
            label="Body mass index"
            value={result.bmi.toFixed(1)}
            sublabel={result.category.label}
          />

          {/* The band scale makes the thresholds visible rather than implied. */}
          <div>
            <ul className="flex gap-1">
              {categories.map((band) => {
                const isActive = band.label === result.category.label;
                return (
                  <li
                    key={band.label}
                    className={`flex-1 rounded-custom-sm border p-2 text-center transition-colors ${
                      isActive ? "border-transparent" : "border-border-custom"
                    }`}
                    style={isActive ? { background: "var(--cat-surface)" } : undefined}
                  >
                    <span
                      className={`block text-[11px] font-semibold ${
                        isActive ? TONE_CLASS[band.tone] : "text-text-2"
                      }`}
                    >
                      {band.label}
                    </span>
                    <span className="block text-[10px] tabular-nums text-text-2">
                      {band.max === Infinity
                        ? `${band.min}+`
                        : `${band.min}–${(band.max - 0.1).toFixed(1)}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <dl className="grid grid-cols-2 gap-3">
            <ResultStat
              label="Healthy weight for your height"
              value={`${result.healthyRangeKg.min.toFixed(1)}–${result.healthyRangeKg.max.toFixed(1)} kg`}
              hint={standard === "asian" ? "Under Asian thresholds" : "Under WHO thresholds"}
            />
            <ResultStat
              label="Your category"
              value={result.category.label}
              tone={
                result.category.tone === "healthy"
                  ? "positive"
                  : result.category.tone === "high"
                    ? "negative"
                    : "warning"
              }
            />
          </dl>

          {standard === "who" && result.bmi >= 23 && result.bmi < 25 && (
            <p className="rounded-custom-sm border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
              At BMI {result.bmi.toFixed(1)} you are inside the WHO healthy band but above
              the Asian threshold of 23. If you are of South or East Asian descent, your
              own national guidelines would place you in the increased-risk category.
            </p>
          )}
        </>
      )}
    </CalcShell>
  );
}

// ---------------------------------------------------------------------------

export function CalorieCalculator() {
  const [sex, setSex] = useState<Sex>("male");
  const [formula, setFormula] = useState<BmrFormula>("mifflin");
  const [age, setAge] = useState("30");
  const [kg, setKg] = useState("80");
  const [cm, setCm] = useState("180");
  const [bodyFat, setBodyFat] = useState("15");
  const [activity, setActivity] = useState<string>("moderate");
  const [weeklyChange, setWeeklyChange] = useState("-0.5");

  const [protein, setProtein] = useState("30");
  const [carbs, setCarbs] = useState("40");
  const [fat, setFat] = useState("30");

  const bmr = useMemo(
    () =>
      basalMetabolicRate({
        formula,
        sex,
        weightKg: Number.parseFloat(kg) || 0,
        heightCm: Number.parseFloat(cm) || 0,
        age: Number.parseFloat(age) || 0,
        bodyFatPercent: Number.parseFloat(bodyFat) || undefined,
      }),
    [formula, sex, kg, cm, age, bodyFat],
  );

  const level = ACTIVITY_LEVELS.find((entry) => entry.id === activity) ?? ACTIVITY_LEVELS[0];
  const change = Number.parseFloat(weeklyChange) || 0;

  const plan = useMemo(
    () =>
      bmr !== null
        ? energyPlan({ bmr, activityMultiplier: level.multiplier, weeklyChangeKg: change })
        : null,
    [bmr, level, change],
  );

  const macroTotal =
    (Number.parseFloat(protein) || 0) +
    (Number.parseFloat(carbs) || 0) +
    (Number.parseFloat(fat) || 0);

  const macros =
    plan && macroTotal === 100
      ? macroSplit(
          plan.target,
          Number.parseFloat(protein) || 0,
          Number.parseFloat(carbs) || 0,
          Number.parseFloat(fat) || 0,
        )
      : null;

  const isVeryLow = plan !== null && plan.target < 1200;

  return (
    <CalcShell>
      <div className="grid gap-4 sm:grid-cols-2">
        <OptionGroup
          label="Sex"
          value={sex}
          onChange={setSex}
          options={[
            { id: "male", label: "Male" },
            { id: "female", label: "Female" },
          ]}
        />
        <OptionGroup
          label="Formula"
          value={formula}
          onChange={setFormula}
          options={[
            { id: "mifflin", label: "Mifflin-St Jeor", hint: "Best evidenced for the general population" },
            { id: "harris", label: "Harris-Benedict", hint: "The revised 1984 equation" },
            { id: "katch", label: "Katch-McArdle", hint: "Uses lean mass — better if you know your body fat" },
          ]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField label="Age" value={age} onChange={setAge} suffix="years" min={15} max={100} step={1} />
        <NumberField label="Weight" value={kg} onChange={setKg} suffix="kg" min={30} max={250} step={0.5} />
        <NumberField label="Height" value={cm} onChange={setCm} suffix="cm" min={120} max={230} step={1} />
      </div>

      {formula === "katch" && (
        <NumberField
          label="Body fat percentage"
          value={bodyFat}
          onChange={setBodyFat}
          suffix="%"
          min={3}
          max={60}
          step={0.5}
          showSlider
          hint="Required for Katch-McArdle, which works from lean mass"
        />
      )}

      <OptionGroup
        label="Activity level"
        value={activity}
        onChange={setActivity}
        options={ACTIVITY_LEVELS.map((entry) => ({
          id: entry.id,
          label: entry.label,
          hint: `${entry.hint} — multiplier ${entry.multiplier}`,
        }))}
      />

      <NumberField
        label="Weekly weight change goal"
        value={weeklyChange}
        onChange={setWeeklyChange}
        suffix="kg/week"
        min={-1}
        max={1}
        step={0.25}
        showSlider
        hint="Negative to lose, positive to gain. 0.5 kg a week is a common sustainable rate."
      />

      {plan !== null ? (
        <>
          <PrimaryResult
            label="Daily calorie target"
            value={`${formatNumber(Math.round(plan.target))} kcal`}
            sublabel={
              change === 0
                ? "to maintain your weight"
                : `to ${change < 0 ? "lose" : "gain"} ${Math.abs(change)} kg a week`
            }
          />

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ResultStat label="BMR" value={`${formatNumber(Math.round(plan.bmr))} kcal`} hint="At complete rest" />
            <ResultStat label="TDEE" value={`${formatNumber(Math.round(plan.tdee))} kcal`} hint="Maintenance" />
            <ResultStat
              label="Daily adjustment"
              value={`${change < 0 ? "−" : "+"}${formatNumber(Math.abs(Math.round(plan.tdee - plan.target)))} kcal`}
              tone={change === 0 ? undefined : "warning"}
            />
          </dl>

          {isVeryLow && (
            <p className="rounded-custom-sm border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-700">
              This target is below 1,200 kcal a day. Intakes at that level are difficult to
              meet nutritional needs on and are generally recommended only under medical
              supervision. Consider a smaller weekly change.
            </p>
          )}

          <div className="border-t border-border-custom pt-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
              Macronutrient split
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField label="Protein" value={protein} onChange={setProtein} suffix="%" min={0} max={100} step={5} />
              <NumberField label="Carbohydrate" value={carbs} onChange={setCarbs} suffix="%" min={0} max={100} step={5} />
              <NumberField label="Fat" value={fat} onChange={setFat} suffix="%" min={0} max={100} step={5} />
            </div>

            {macroTotal !== 100 ? (
              <p className="mt-2 text-xs text-amber-600">
                The three percentages add up to {macroTotal}%. Adjust them to total 100%.
              </p>
            ) : (
              macros && (
                <dl className="mt-3 grid grid-cols-3 gap-3">
                  <ResultStat label="Protein" value={`${Math.round(macros.proteinGrams)} g`} hint="4 kcal per gram" />
                  <ResultStat label="Carbs" value={`${Math.round(macros.carbGrams)} g`} hint="4 kcal per gram" />
                  <ResultStat label="Fat" value={`${Math.round(macros.fatGrams)} g`} hint="9 kcal per gram" />
                </dl>
              )
            )}
          </div>
        </>
      ) : (
        formula === "katch" && (
          <p className="text-sm text-text-2">
            Enter a body fat percentage to use the Katch-McArdle equation.
          </p>
        )
      )}
    </CalcShell>
  );
}
