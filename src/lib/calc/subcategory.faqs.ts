import type { Faq } from "@/components/tool-page/sections";

/**
 * Distinct FAQs for each calculator subcategory index.
 *
 * The three index pages previously spread the same parent config, so all three
 * emitted an identical FAQPage block on different URLs. Duplicate structured
 * data across pages competes with itself and gives a search engine no reason to
 * prefer one over another, so each section answers questions specific to it.
 */

export const FINANCE_INDEX_FAQS: Faq[] = [
  {
    id: "which-loan-tool",
    question: "Should I use the EMI calculator or the loan calculator?",
    answer:
      "They run the same annuity formula and differ only in presentation. The EMI calculator is set up for Indian home and car loans in rupees; the loan calculator defaults to a shorter personal loan and adds overpayment modelling. Either gives the same figure for the same inputs.",
  },
  {
    id: "sip-vs-compound",
    question: "What is the difference between the SIP and compound interest calculators?",
    answer:
      "The SIP calculator assumes a start-of-month contribution, which is how a mutual fund instalment actually debits and is worth roughly one extra period of growth. The compound interest calculator lets you choose the compounding frequency and the timing, so it suits savings accounts and fixed deposits.",
  },
  {
    id: "currency",
    question: "Can I use these calculators in a currency other than rupees?",
    answer:
      "Yes. Every finance calculator has a currency selector covering rupees, dollars, pounds and euros. Only the formatting changes — the underlying arithmetic is identical, since none of these formulas depend on the currency.",
  },
  {
    id: "inflation",
    question: "Do these calculators account for inflation?",
    answer:
      "The compound interest, SIP and retirement calculators all show an inflation-adjusted figure alongside the nominal one. A projection quoted only in future money systematically overstates what it will actually buy, which is why the real value is shown by default.",
  },
  {
    id: "advice",
    question: "Is any of this financial advice?",
    answer:
      "No. These are computation tools that apply published formulas to figures you enter. They cannot account for your tax position, risk tolerance or circumstances, and the return rates are assumptions rather than forecasts. Speak to a qualified adviser before acting on any projection.",
  },
];

export const HEALTH_INDEX_FAQS: Faq[] = [
  {
    id: "bmi-vs-calorie",
    question: "Should I start with the BMI or the calorie calculator?",
    answer:
      "BMI gives a quick screening figure from height and weight alone. The calorie calculator estimates the energy your body actually uses, which is what you need to plan a change. BMI tells you where you are; the calorie calculator tells you what to do about it.",
  },
  {
    id: "asian-thresholds",
    question: "Why does the BMI calculator offer two sets of thresholds?",
    answer:
      "Because risk does not begin at the same BMI everywhere. A WHO expert consultation found cardiometabolic risk rises at a lower BMI in South and East Asian populations, so India, China and Japan classify from 23 rather than 25. Using only the international bands misclassifies a large share of the world.",
  },
  {
    id: "which-bmr",
    question: "Which BMR equation should I choose?",
    answer:
      "Mifflin-St Jeor for most people — validation reviews place it within 10% of measured resting metabolic rate more consistently than Harris-Benedict. Choose Katch-McArdle instead if you know your body fat percentage and are lean, since it works from lean mass.",
  },
  {
    id: "accuracy",
    question: "How accurate are these health estimates?",
    answer:
      "They are population-level estimates. Individual metabolic rate can differ from any predicted figure by 10% or more, and BMI cannot distinguish muscle from fat at all. Use them as a starting point and adjust based on what actually happens over several weeks.",
  },
  {
    id: "medical",
    question: "Can these replace advice from a doctor?",
    answer:
      "No. They apply published formulas to the numbers you enter and know nothing about your medical history, medication or conditions. They are screening and planning aids only — speak to a doctor or registered dietitian about your own health.",
  },
];

export const EDUCATION_INDEX_FAQS: Faq[] = [
  {
    id: "gpa-vs-cgpa",
    question: "What is the difference between the GPA and CGPA calculators?",
    answer:
      "The GPA calculator works from individual courses and their credit hours within one term. The CGPA calculator combines whole semesters, weighted by the credits each carried, and adds percentage conversion. Use the first for a semester, the second for your programme to date.",
  },
  {
    id: "scales",
    question: "Which grading scale should I select?",
    answer:
      "The 4.0 letter scale for US and most Western institutions, and the 10-point scale for Indian universities and CBSE. They are separate systems rather than conversions of each other, so pick the one your institution actually uses.",
  },
  {
    id: "conversion",
    question: "Why is there no single CGPA to percentage formula?",
    answer:
      "Because each board and university sets its own. CBSE publishes multiply by 9.5, derived from its own grading distribution, while many universities use (CGPA − 0.5) × 10 or a bespoke table. The calculator exposes the multiplier so you can use the rule that applies to you.",
  },
  {
    id: "weighting",
    question: "Do credit hours really change the result?",
    answer:
      "Substantially. Averaging grade points without weighting treats a one-credit elective the same as a five-credit core course. Where the weaker grades sit in the heavier courses, an unweighted average can overstate the true figure by several tenths of a point.",
  },
  {
    id: "official",
    question: "Can I quote these figures on an application?",
    answer:
      "Use them to plan, but always quote the official figure from your transcript. Institutions apply their own rounding, retake rules and exclusions, so a self-calculated number can differ slightly from what appears on record.",
  },
];
