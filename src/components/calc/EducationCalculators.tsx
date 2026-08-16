"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  CalcShell,
  NumberField,
  OptionGroup,
  PrimaryResult,
  ResultStat,
} from "@/components/calc/ui";
import {
  CBSE_MULTIPLIER,
  GRADE_SCALES,
  cgpaToPercentage,
  cumulativeGpa,
  gradePointAverage,
  requiredPointsForTarget,
  type CourseEntry,
  type SemesterEntry,
} from "@/lib/calc/education";

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Math.random());

// ---------------------------------------------------------------------------

export function GpaCalculator() {
  const [scaleId, setScaleId] = useState(GRADE_SCALES[0].id);
  const scale = GRADE_SCALES.find((entry) => entry.id === scaleId) ?? GRADE_SCALES[0];

  const [courses, setCourses] = useState<CourseEntry[]>([
    { id: newId(), name: "Course 1", credits: 3, points: scale.points[0].points },
    { id: newId(), name: "Course 2", credits: 4, points: scale.points[1].points },
    { id: newId(), name: "Course 3", credits: 3, points: scale.points[2].points },
  ]);

  const [targetGpa, setTargetGpa] = useState("3.5");
  const [remainingCredits, setRemainingCredits] = useState("30");

  const result = useMemo(() => gradePointAverage(courses), [courses]);

  const target = useMemo(() => {
    if (!result) return null;
    return requiredPointsForTarget({
      currentGpa: result.gpa,
      completedCredits: result.totalCredits,
      remainingCredits: Number.parseFloat(remainingCredits) || 0,
      targetGpa: Number.parseFloat(targetGpa) || 0,
      scaleMax: scale.max,
    });
  }, [result, remainingCredits, targetGpa, scale]);

  const update = (id: string, patch: Partial<CourseEntry>) =>
    setCourses((current) =>
      current.map((course) => (course.id === id ? { ...course, ...patch } : course)),
    );

  return (
    <CalcShell>
      <OptionGroup
        label="Grading scale"
        value={scaleId}
        onChange={(value) => {
          setScaleId(value);
          // Grade points differ between scales, so reset to the top grade.
          const next = GRADE_SCALES.find((entry) => entry.id === value)!;
          setCourses((current) =>
            current.map((course) => ({ ...course, points: next.points[0].points })),
          );
        }}
        options={GRADE_SCALES.map((entry) => ({
          id: entry.id,
          label: entry.label,
          hint: entry.description,
        }))}
      />

      <div className="space-y-2">
        <div className="hidden gap-3 px-1 sm:grid sm:grid-cols-[1fr_100px_140px_40px]">
          {["Course", "Credits", "Grade", ""].map((heading) => (
            <span
              key={heading}
              className="text-[11px] font-semibold uppercase tracking-wider text-text-2"
            >
              {heading}
            </span>
          ))}
        </div>

        {courses.map((course) => (
          <div
            key={course.id}
            className="grid gap-3 rounded-custom-sm border border-border-custom p-3 sm:grid-cols-[1fr_100px_140px_40px] sm:items-center sm:border-0 sm:p-1"
          >
            <input
              type="text"
              value={course.name}
              onChange={(event) => update(course.id, { name: event.target.value })}
              aria-label="Course name"
              className="h-11 rounded-custom-sm border border-border-custom bg-bg px-3 text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
            />
            <input
              type="number"
              value={course.credits}
              min={0}
              step={0.5}
              onChange={(event) =>
                update(course.id, { credits: Number.parseFloat(event.target.value) || 0 })
              }
              aria-label="Credits"
              className="h-11 rounded-custom-sm border border-border-custom bg-bg px-3 text-sm tabular-nums text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
            />
            <select
              value={course.points}
              onChange={(event) =>
                update(course.id, { points: Number.parseFloat(event.target.value) })
              }
              aria-label="Grade"
              className="h-11 rounded-custom-sm border border-border-custom bg-bg px-3 text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
            >
              {scale.points.map((grade) => (
                <option key={grade.grade} value={grade.points}>
                  {grade.grade} ({grade.points})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                setCourses((current) => current.filter((entry) => entry.id !== course.id))
              }
              aria-label={`Remove ${course.name}`}
              disabled={courses.length <= 1}
              className="flex h-11 w-11 items-center justify-center rounded-custom-sm text-text-2 transition-colors hover:bg-surface hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-30"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setCourses((current) => [
              ...current,
              {
                id: newId(),
                name: `Course ${current.length + 1}`,
                credits: 3,
                points: scale.points[0].points,
              },
            ])
          }
          className="inline-flex h-10 items-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-4 text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Plus size={15} aria-hidden="true" />
          Add course
        </button>
      </div>

      {result && (
        <>
          <PrimaryResult
            label="Grade point average"
            value={result.gpa.toFixed(2)}
            sublabel={`out of ${scale.max} · ${result.totalCredits} credits across ${result.countedCourses} courses`}
          />

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ResultStat label="Total credits" value={String(result.totalCredits)} />
            <ResultStat label="Weighted points" value={result.totalPoints.toFixed(1)} />
            <ResultStat
              label="Unweighted average"
              value={(
                courses.reduce((sum, course) => sum + course.points, 0) / courses.length
              ).toFixed(2)}
              hint="Ignores credits — shown for comparison"
            />
          </dl>

          <div className="border-t border-border-custom pt-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
              Reach a target GPA
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Target GPA"
                value={targetGpa}
                onChange={setTargetGpa}
                min={0}
                max={scale.max}
                step={0.1}
              />
              <NumberField
                label="Credits remaining"
                value={remainingCredits}
                onChange={setRemainingCredits}
                min={0}
                step={1}
              />
            </div>

            {target && (
              <p
                className={`mt-3 rounded-custom-sm border p-3 text-sm ${
                  target.achievable
                    ? "border-border-custom bg-surface text-text-2"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {target.achievable ? (
                  <>
                    You need an average of{" "}
                    <strong className="text-text-custom">
                      {target.requiredAverage.toFixed(2)}
                    </strong>{" "}
                    across the remaining {remainingCredits} credits.
                  </>
                ) : (
                  <>
                    <strong className="font-semibold">This target is not reachable.</strong>{" "}
                    It would need an average of {target.requiredAverage.toFixed(2)}, which
                    exceeds the scale maximum of {scale.max}.
                  </>
                )}
              </p>
            )}
          </div>
        </>
      )}
    </CalcShell>
  );
}

// ---------------------------------------------------------------------------

export function CgpaCalculator() {
  const [semesters, setSemesters] = useState<SemesterEntry[]>([
    { id: newId(), name: "Semester 1", sgpa: 8, credits: 20 },
    { id: newId(), name: "Semester 2", sgpa: 9, credits: 24 },
  ]);
  const [multiplier, setMultiplier] = useState(String(CBSE_MULTIPLIER));
  const [rule, setRule] = useState<"cbse" | "minus" | "custom">("cbse");

  const result = useMemo(() => cumulativeGpa(semesters), [semesters]);

  const percentage = useMemo(() => {
    if (!result) return null;
    if (rule === "minus") return (result.gpa - 0.5) * 10;
    return cgpaToPercentage(result.gpa, Number.parseFloat(multiplier) || CBSE_MULTIPLIER);
  }, [result, rule, multiplier]);

  const update = (id: string, patch: Partial<SemesterEntry>) =>
    setSemesters((current) =>
      current.map((semester) => (semester.id === id ? { ...semester, ...patch } : semester)),
    );

  return (
    <CalcShell>
      <div className="space-y-2">
        <div className="hidden gap-3 px-1 sm:grid sm:grid-cols-[1fr_110px_110px_40px]">
          {["Semester", "SGPA", "Credits", ""].map((heading) => (
            <span
              key={heading}
              className="text-[11px] font-semibold uppercase tracking-wider text-text-2"
            >
              {heading}
            </span>
          ))}
        </div>

        {semesters.map((semester) => (
          <div
            key={semester.id}
            className="grid gap-3 rounded-custom-sm border border-border-custom p-3 sm:grid-cols-[1fr_110px_110px_40px] sm:items-center sm:border-0 sm:p-1"
          >
            <input
              type="text"
              value={semester.name}
              onChange={(event) => update(semester.id, { name: event.target.value })}
              aria-label="Semester name"
              className="h-11 rounded-custom-sm border border-border-custom bg-bg px-3 text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
            />
            <input
              type="number"
              value={semester.sgpa}
              min={0}
              max={10}
              step={0.01}
              onChange={(event) =>
                update(semester.id, { sgpa: Number.parseFloat(event.target.value) || 0 })
              }
              aria-label="SGPA"
              className="h-11 rounded-custom-sm border border-border-custom bg-bg px-3 text-sm tabular-nums text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
            />
            <input
              type="number"
              value={semester.credits}
              min={0}
              step={1}
              onChange={(event) =>
                update(semester.id, { credits: Number.parseFloat(event.target.value) || 0 })
              }
              aria-label="Credits"
              className="h-11 rounded-custom-sm border border-border-custom bg-bg px-3 text-sm tabular-nums text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() =>
                setSemesters((current) => current.filter((entry) => entry.id !== semester.id))
              }
              aria-label={`Remove ${semester.name}`}
              disabled={semesters.length <= 1}
              className="flex h-11 w-11 items-center justify-center rounded-custom-sm text-text-2 transition-colors hover:bg-surface hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-30"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setSemesters((current) => [
              ...current,
              {
                id: newId(),
                name: `Semester ${current.length + 1}`,
                sgpa: 8,
                credits: 20,
              },
            ])
          }
          className="inline-flex h-10 items-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-4 text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Plus size={15} aria-hidden="true" />
          Add semester
        </button>
      </div>

      {result && (
        <>
          <PrimaryResult
            label="Cumulative GPA"
            value={result.gpa.toFixed(2)}
            sublabel={`${result.totalCredits} credits across ${result.countedCourses} semesters`}
          />

          <div className="border-t border-border-custom pt-4">
            <OptionGroup
              label="Percentage conversion rule"
              value={rule}
              onChange={setRule}
              options={[
                { id: "cbse", label: "CBSE (× 9.5)", hint: "The rule CBSE publishes for classes 10 and 12" },
                { id: "minus", label: "(CGPA − 0.5) × 10", hint: "Used by many universities" },
                { id: "custom", label: "Custom multiplier", hint: "Use your institution's published factor" },
              ]}
            />

            {rule === "custom" && (
              <div className="mt-3">
                <NumberField
                  label="Multiplier"
                  value={multiplier}
                  onChange={setMultiplier}
                  min={1}
                  max={15}
                  step={0.1}
                />
              </div>
            )}

            {percentage !== null && (
              <dl className="mt-3 grid grid-cols-2 gap-3">
                <ResultStat label="Percentage" value={`${percentage.toFixed(2)}%`} />
                <ResultStat
                  label="Conversion used"
                  value={
                    rule === "minus"
                      ? "(CGPA − 0.5) × 10"
                      : `× ${rule === "cbse" ? CBSE_MULTIPLIER : multiplier}`
                  }
                />
              </dl>
            )}

            <p className="mt-3 rounded-custom-sm border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
              There is no universal CGPA to percentage conversion. Always use the rule your
              own institution publishes, and quote the official transcript figure on any
              application rather than a self-calculated one.
            </p>
          </div>
        </>
      )}
    </CalcShell>
  );
}
