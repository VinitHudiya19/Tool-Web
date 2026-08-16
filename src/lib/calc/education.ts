/**
 * Grade point calculations.
 *
 * Grading scales are not universal, which is the main reason these
 * calculators give wrong answers: a 4.0-scale GPA and a 10-point CGPA are
 * different systems, and the percentage conversion differs by university. Each
 * scale is declared explicitly rather than assumed.
 */

export interface GradePoint {
  grade: string;
  points: number;
  /** Typical percentage band, for reference. */
  percentBand?: string;
}

export interface GradeScale {
  id: string;
  label: string;
  max: number;
  description: string;
  points: GradePoint[];
}

/** US 4.0 scale with plus and minus grades. */
export const US_4_SCALE: GradeScale = {
  id: "us-4",
  label: "4.0 scale (US letter grades)",
  max: 4,
  description:
    "The standard American scale. Plus and minus grades shift the value by 0.3.",
  points: [
    { grade: "A+", points: 4.0, percentBand: "97–100" },
    { grade: "A", points: 4.0, percentBand: "93–96" },
    { grade: "A−", points: 3.7, percentBand: "90–92" },
    { grade: "B+", points: 3.3, percentBand: "87–89" },
    { grade: "B", points: 3.0, percentBand: "83–86" },
    { grade: "B−", points: 2.7, percentBand: "80–82" },
    { grade: "C+", points: 2.3, percentBand: "77–79" },
    { grade: "C", points: 2.0, percentBand: "73–76" },
    { grade: "C−", points: 1.7, percentBand: "70–72" },
    { grade: "D+", points: 1.3, percentBand: "67–69" },
    { grade: "D", points: 1.0, percentBand: "63–66" },
    { grade: "D−", points: 0.7, percentBand: "60–62" },
    { grade: "F", points: 0.0, percentBand: "below 60" },
  ],
};

/** 10-point scale used by most Indian universities and CBSE. */
export const INDIA_10_SCALE: GradeScale = {
  id: "india-10",
  label: "10-point scale (Indian universities)",
  max: 10,
  description:
    "Used by CBSE, AICTE and most Indian universities. Letter grades map to points out of 10.",
  points: [
    { grade: "O (Outstanding)", points: 10, percentBand: "90–100" },
    { grade: "A+", points: 9, percentBand: "80–89" },
    { grade: "A", points: 8, percentBand: "70–79" },
    { grade: "B+", points: 7, percentBand: "60–69" },
    { grade: "B", points: 6, percentBand: "50–59" },
    { grade: "C", points: 5, percentBand: "45–49" },
    { grade: "P (Pass)", points: 4, percentBand: "40–44" },
    { grade: "F (Fail)", points: 0, percentBand: "below 40" },
  ],
};

export const GRADE_SCALES: GradeScale[] = [US_4_SCALE, INDIA_10_SCALE];

export interface CourseEntry {
  id: string;
  name: string;
  /** Credit hours, or 1 when a course is unweighted. */
  credits: number;
  /** Grade points earned for this course. */
  points: number;
}

export interface GpaResult {
  gpa: number;
  totalCredits: number;
  totalPoints: number;
  /** Number of entries that actually counted. */
  countedCourses: number;
}

/**
 * Credit-weighted grade point average.
 *
 * GPA = Σ(grade points × credits) / Σ(credits)
 *
 * Averaging the grade points directly — ignoring credits — is the usual error
 * and inflates the result whenever the low grades are in the heavier courses.
 */
export function gradePointAverage(courses: CourseEntry[]): GpaResult | null {
  const valid = courses.filter(
    (course) =>
      Number.isFinite(course.credits) &&
      course.credits > 0 &&
      Number.isFinite(course.points) &&
      course.points >= 0,
  );

  if (valid.length === 0) return null;

  const totalCredits = valid.reduce((sum, course) => sum + course.credits, 0);
  const totalPoints = valid.reduce(
    (sum, course) => sum + course.points * course.credits,
    0,
  );

  return {
    gpa: totalPoints / totalCredits,
    totalCredits,
    totalPoints,
    countedCourses: valid.length,
  };
}

export interface SemesterEntry {
  id: string;
  name: string;
  /** Semester grade point average. */
  sgpa: number;
  credits: number;
}

/**
 * Cumulative grade point average across semesters.
 *
 * Weighted by the credits carried in each semester, so a light semester does
 * not count the same as a full one.
 */
export function cumulativeGpa(semesters: SemesterEntry[]): GpaResult | null {
  return gradePointAverage(
    semesters.map((semester) => ({
      id: semester.id,
      name: semester.name,
      credits: semester.credits,
      points: semester.sgpa,
    })),
  );
}

/**
 * Percentage equivalent of a CGPA.
 *
 * There is no universal conversion. CBSE publishes CGPA × 9.5; many
 * universities use (CGPA − 0.5) × 10 or their own table. The multiplier is a
 * parameter rather than a constant so the page can state which rule it used,
 * and warn that the institution's own rule is the one that counts.
 */
export function cgpaToPercentage(cgpa: number, multiplier = 9.5): number {
  return cgpa * multiplier;
}

/** The CBSE rule, published for classes 10 and 12. */
export const CBSE_MULTIPLIER = 9.5;

/**
 * Grade points still needed to reach a target average.
 *
 * Returns null when the target cannot be reached even with a perfect score in
 * the remaining credits, which is more useful than an impossible number.
 */
export function requiredPointsForTarget(options: {
  currentGpa: number;
  completedCredits: number;
  remainingCredits: number;
  targetGpa: number;
  scaleMax: number;
}): { requiredAverage: number; achievable: boolean } | null {
  const {
    currentGpa,
    completedCredits,
    remainingCredits,
    targetGpa,
    scaleMax,
  } = options;

  if (!(remainingCredits > 0)) return null;

  const totalCredits = completedCredits + remainingCredits;
  const pointsNeeded = targetGpa * totalCredits - currentGpa * completedCredits;
  const requiredAverage = pointsNeeded / remainingCredits;

  return {
    requiredAverage,
    achievable: requiredAverage <= scaleMax && requiredAverage >= 0,
  };
}
