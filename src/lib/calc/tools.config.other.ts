import type { CalculatorConfig } from "./types";

/** Health, education and general calculators. */
export const OTHER_CALCULATORS: Record<string, CalculatorConfig> = {
  "bmi-calculator": {
    slug: "bmi-calculator",
    group: "health",
    name: "BMI Calculator",
    title: "BMI Calculator — WHO and Asian Thresholds",
    description:
      "Calculate body mass index in metric or imperial units, against WHO or Asian cut-offs. Asian guidelines classify risk from BMI 23, not 25.",
    h1: "BMI Calculator",
    primaryQuestion: "How is BMI calculated?",
    quickAnswer:
      "BMI is weight in kilograms divided by height in metres squared. Someone 70 kg and 1.75 m tall has a BMI of 22.9. WHO classifies 18.5–24.9 as healthy, but Indian and East Asian guidelines use 18.5–22.9 because risk rises at a lower BMI.",
    term: "BMI",
    termDefinition:
      "Body mass index is a screening measure calculated as weight in kilograms divided by the square of height in metres, used to categorise weight relative to height at population level.",
    formula: "BMI = weight (kg) / height (m)²",
    variables: [
      { symbol: "weight", meaning: "Body mass in kilograms" },
      { symbol: "height", meaning: "Height in metres — centimetres divided by 100" },
    ],
    workedExample: {
      scenario: "Someone weighing 70 kg and standing 175 cm tall",
      inputs: [
        { label: "Weight", value: "70 kg" },
        { label: "Height", value: "175 cm = 1.75 m" },
      ],
      working: ["height² = 1.75 × 1.75 = 3.0625", "BMI = 70 ÷ 3.0625"],
      result:
        "BMI 22.9 — healthy under both WHO and Asian thresholds. At 74 kg the same person is 24.2: still healthy by WHO, but 'increased risk' by Asian guidelines.",
    },
    intro:
      "A BMI calculator compares weight against height to give a single screening figure. Which thresholds it judges you against matters as much as the number: the WHO international cut-offs place the healthy band at 18.5–24.9, but the WHO expert consultation found cardiometabolic risk rises at a lower BMI in South and East Asian populations, and Indian, Chinese and Japanese guidelines use 23 and 27.5 accordingly. Both standards are offered here.",
    iconName: "Activity",
    applicationCategory: "HealthApplication",
    features: [
      "Metric and imperial input",
      "WHO international and Asian threshold sets",
      "Healthy weight range for your height",
      "Category with the exact cut-offs shown",
      "No data leaves the browser",
    ],
    steps: [
      {
        name: "Choose your units",
        text: "Enter height in centimetres and weight in kilograms, or switch to feet, inches and pounds. Conversion happens automatically.",
      },
      {
        name: "Select the threshold set",
        text: "Use WHO international cut-offs, or Asian cut-offs if you are of South or East Asian descent, where several national guidelines set lower boundaries.",
      },
      {
        name: "Read your category",
        text: "The result shows your BMI with the band it falls into and the exact boundaries, so you can see how close you are to the next one.",
      },
      {
        name: "Check the healthy range",
        text: "The weight range corresponding to a healthy BMI at your height is more actionable than the index itself.",
      },
    ],
    examples: [
      {
        title: "Healthy under both standards",
        input: "70 kg, 175 cm",
        output: "BMI 22.9 — healthy",
        explanation:
          "Comfortably inside both the WHO band (18.5–24.9) and the Asian band (18.5–22.9), though only just under the latter.",
      },
      {
        title: "Where the standards disagree",
        input: "73.5 kg, 175 cm",
        output: "WHO: healthy · Asian: increased risk",
        explanation:
          "At BMI 24.0 the two guidelines give different answers. For someone of South Asian descent the lower threshold is the clinically relevant one.",
      },
      {
        title: "Imperial input",
        input: "154 lb, 5 ft 9 in",
        output: "BMI 22.7",
        explanation:
          "Converted to 69.9 kg and 175.3 cm before the calculation. Entering imperial units does not change the formula.",
      },
    ],
    referenceTable: {
      caption: "BMI categories under each standard",
      columns: ["Category", "WHO international", "Asian guidelines"],
      rows: [
        ["Underweight", "below 18.5", "below 18.5"],
        ["Healthy weight", "18.5 – 24.9", "18.5 – 22.9"],
        ["Overweight / increased risk", "25.0 – 29.9", "23.0 – 27.4"],
        ["Obese / high risk", "30.0 and above", "27.5 and above"],
      ],
    },
    benefits: [
      {
        title: "The threshold set that applies to you",
        description:
          "Offering Asian cut-offs matters because a calculator using only WHO bands tells a large share of the world's population they are fine when their own health service would not.",
      },
      {
        title: "Boundaries shown, not just a label",
        description:
          "Seeing the exact cut-offs makes it clear how close you are to a different category, which a single word cannot convey.",
      },
      {
        title: "A healthy weight range",
        description:
          "The weight range for your height is a more useful target than an index number with no units.",
      },
      {
        title: "Private",
        description: "Height and weight are never transmitted or stored.",
      },
    ],
    limitations: [
      "BMI does not distinguish muscle from fat. Athletes are routinely classified as overweight despite low body fat.",
      "It says nothing about fat distribution. Waist circumference is a better predictor of metabolic risk than BMI alone.",
      "It is a population screening tool, not a diagnosis. Individual health depends on many factors BMI does not measure.",
      "Not valid for children, pregnant women or the very elderly, who require age-specific or alternative measures.",
    ],
    keyTakeaways: [
      "BMI = weight in kg ÷ height in metres squared.",
      "WHO places the healthy band at 18.5–24.9.",
      "Asian guidelines use 18.5–22.9, with high risk from 27.5.",
      "BMI cannot distinguish muscle from fat.",
      "Waist measurement adds information BMI does not capture.",
    ],
    faqs: [
      {
        id: "formula",
        question: "What is the BMI formula?",
        answer:
          "BMI = weight in kilograms divided by height in metres squared. For 70 kg at 1.75 m: 70 ÷ (1.75 × 1.75) = 22.9. In imperial units it is (pounds ÷ inches²) × 703.",
      },
      {
        id: "asian",
        question: "Why are Asian BMI thresholds lower?",
        answer:
          "A WHO expert consultation published in The Lancet in 2004 found that cardiometabolic risk rises at a lower BMI in Asian populations, partly due to differences in body composition. India, China, Japan and Singapore use 23 and 27.5 as a result.",
      },
      {
        id: "healthy",
        question: "What is a healthy BMI?",
        answer:
          "18.5 to 24.9 under WHO international cut-offs, or 18.5 to 22.9 under Asian guidelines. Both are population ranges — an individual outside them is not automatically unhealthy, nor healthy inside them.",
      },
      {
        id: "muscle",
        question: "Is BMI accurate for muscular people?",
        answer:
          "No. Muscle is denser than fat, so athletes frequently register as overweight or obese despite low body fat. For anyone carrying substantial muscle, body fat percentage or waist measurement is more informative.",
      },
      {
        id: "waist",
        question: "Is waist measurement better than BMI?",
        answer:
          "For metabolic risk, often yes. Fat around the abdomen carries more risk than the same weight elsewhere, and waist circumference captures that where BMI cannot. The two are commonly used together.",
      },
      {
        id: "children",
        question: "Does BMI work for children?",
        answer:
          "Not with adult thresholds. Children's BMI must be read against age and sex percentile charts because body composition changes throughout growth. Use a paediatric BMI-for-age chart instead.",
      },
      {
        id: "imperial",
        question: "How do I calculate BMI in pounds and inches?",
        answer:
          "BMI = (weight in pounds ÷ height in inches²) × 703. The 703 factor converts imperial units to the metric formula. This calculator does the conversion for you if you switch units.",
      },
      {
        id: "change",
        question: "How quickly can BMI change?",
        answer:
          "It tracks weight directly, so it moves as weight does. A safe rate of change is generally 0.25–0.5 kg a week, which for someone 175 cm tall shifts BMI by roughly 0.08–0.16 per week.",
      },
      {
        id: "privacy",
        question: "Is my height and weight recorded?",
        answer:
          "No. The calculation is a single division performed in your browser. Nothing is transmitted, and no health information is stored or logged anywhere.",
      },
    ],
    sources: [
      { label: "WHO, Body mass index", url: "https://www.who.int/data/gho/data/themes/topics/body-mass-index" },
      { label: "WHO expert consultation, The Lancet 2004 — Asian BMI cut-offs" },
    ],
    disclaimer:
      "BMI is a screening measure, not a diagnosis. It cannot assess individual health. Speak to a doctor or dietitian about your own circumstances.",
    relatedSlugs: ["calorie-calculator", "age-calculator"],
  },

  "calorie-calculator": {
    slug: "calorie-calculator",
    group: "health",
    name: "Calorie Calculator",
    title: "Calorie Calculator — BMR, TDEE & Macros",
    description:
      "Estimate daily calorie needs using Mifflin-St Jeor, Harris-Benedict or Katch-McArdle, with activity multiplier and macronutrient split.",
    h1: "Calorie Calculator",
    primaryQuestion: "How many calories do I need a day?",
    quickAnswer:
      "Daily needs are basal metabolic rate multiplied by an activity factor. A 30-year-old man weighing 80 kg at 180 cm has a BMR of 1,780 kcal; moderately active, that gives about 2,759 kcal a day to maintain weight.",
    term: "TDEE",
    termDefinition:
      "Total daily energy expenditure is the number of calories the body uses in a day, comprising basal metabolic rate multiplied by a factor reflecting physical activity.",
    formula:
      "BMR (Mifflin-St Jeor) = 10 × kg + 6.25 × cm − 5 × age + 5 (men) or − 161 (women)   ·   TDEE = BMR × activity factor",
    variables: [
      { symbol: "kg", meaning: "Body weight in kilograms" },
      { symbol: "cm", meaning: "Height in centimetres" },
      { symbol: "age", meaning: "Age in years" },
      { symbol: "activity factor", meaning: "1.2 sedentary to 1.9 extremely active" },
    ],
    workedExample: {
      scenario: "A 30-year-old man, 80 kg, 180 cm, moderately active",
      inputs: [
        { label: "Weight", value: "80 kg" },
        { label: "Height", value: "180 cm" },
        { label: "Age", value: "30" },
        { label: "Activity", value: "Moderate (1.55)" },
      ],
      working: [
        "BMR = 10 × 80 + 6.25 × 180 − 5 × 30 + 5",
        "= 800 + 1,125 − 150 + 5 = 1,780 kcal",
        "TDEE = 1,780 × 1.55",
      ],
      result:
        "2,759 kcal a day to maintain. For 0.5 kg a week of loss, subtract 550 kcal to give about 2,209.",
    },
    intro:
      "A calorie calculator estimates how much energy your body uses in a day. Mifflin-St Jeor is the default equation because the American Dietetic Association's evidence review found it lands within 10% of measured resting metabolic rate more often than the older Harris-Benedict. Katch-McArdle is offered as well, since it uses lean mass and is more accurate for lean, muscular people where the others under-predict.",
    iconName: "Flame",
    applicationCategory: "HealthApplication",
    features: [
      "Mifflin-St Jeor, Harris-Benedict and Katch-McArdle",
      "Five activity levels with plain descriptions",
      "Weekly rate of change rather than a vague deficit",
      "Macronutrient split in grams",
      "Warns when a target is unsafely low",
    ],
    steps: [
      {
        name: "Enter your details",
        text: "Age, sex, height and weight. These four inputs determine basal metabolic rate — the energy used at complete rest.",
      },
      {
        name: "Pick an activity level",
        text: "Choose honestly. Most people overestimate; a desk job with three gym sessions a week is 'moderately active', not 'very active'.",
      },
      {
        name: "Set a rate of change",
        text: "Enter the weekly weight change you want. This is converted to a daily calorie adjustment using roughly 7,700 kcal per kilogram.",
      },
      {
        name: "Read the macro split",
        text: "The daily target is divided into protein, carbohydrate and fat in grams, which is more usable than percentages when planning meals.",
      },
    ],
    examples: [
      {
        title: "Maintenance",
        input: "Man, 30, 80 kg, 180 cm, moderate",
        output: "BMR 1,780 · TDEE 2,759 kcal",
        explanation:
          "The maintenance figure. Eating at this level should hold weight steady over a period of weeks.",
      },
      {
        title: "Losing half a kilo a week",
        input: "Same person, −0.5 kg/week",
        output: "2,209 kcal a day",
        explanation:
          "A 550 kcal daily deficit, since a kilogram of body fat is roughly 7,700 kcal. Sustainable for most people.",
      },
      {
        title: "Formula comparison",
        input: "Same person, all three equations",
        output: "Mifflin 1,780 · Harris 1,854 · Katch 1,839 at 15% fat",
        explanation:
          "Roughly 4% between them. Mifflin is the general default; Katch is better when body fat is known and low.",
      },
    ],
    referenceTable: {
      caption: "Activity multipliers",
      columns: ["Level", "Multiplier", "Typical pattern"],
      rows: [
        ["Sedentary", "1.2", "Desk work, little deliberate exercise"],
        ["Lightly active", "1.375", "Light exercise 1–3 days a week"],
        ["Moderately active", "1.55", "Moderate exercise 3–5 days a week"],
        ["Very active", "1.725", "Hard exercise 6–7 days a week"],
        ["Extremely active", "1.9", "Physical job or twice-daily training"],
      ],
    },
    benefits: [
      {
        title: "The best-evidenced equation by default",
        description:
          "Mifflin-St Jeor outperforms Harris-Benedict in validation studies, and all three are available so results can be compared.",
      },
      {
        title: "Targets as a weekly rate",
        description:
          "Expressing the goal as kilograms per week rather than an abstract deficit makes an unrealistic target immediately obvious.",
      },
      {
        title: "Macros in grams",
        description:
          "Percentages are hard to act on. Grams of protein, carbohydrate and fat translate directly into meal planning.",
      },
      {
        title: "Nothing recorded",
        description: "Body measurements are never transmitted or stored.",
      },
    ],
    limitations: [
      "All BMR equations are estimates. Individual metabolic rate varies by 10% or more from the predicted figure even in healthy adults.",
      "Activity multipliers are coarse. Two people at the same nominal level can differ by several hundred calories a day.",
      "The 7,700 kcal per kilogram figure is an approximation, and the body adapts to sustained deficits by reducing expenditure.",
      "Not appropriate for children, during pregnancy or breastfeeding, or for anyone with a medical condition affecting metabolism.",
    ],
    keyTakeaways: [
      "BMR (Mifflin-St Jeor) = 10 × kg + 6.25 × cm − 5 × age, +5 for men and −161 for women.",
      "TDEE = BMR × an activity factor from 1.2 to 1.9.",
      "About 7,700 kcal equals one kilogram of body fat.",
      "A 550 kcal daily deficit gives roughly 0.5 kg a week.",
      "Estimates vary by 10% or more between individuals.",
    ],
    faqs: [
      {
        id: "how-many",
        question: "How many calories should I eat a day?",
        answer:
          "It depends on your basal rate and activity. A moderately active 30-year-old man of 80 kg and 180 cm needs about 2,759 kcal to maintain weight, and roughly 2,209 to lose half a kilogram a week.",
      },
      {
        id: "bmr-tdee",
        question: "What is the difference between BMR and TDEE?",
        answer:
          "BMR is what your body uses at complete rest to run its basic functions. TDEE adds everything else — moving, digesting, exercising — by multiplying BMR by an activity factor between 1.2 and 1.9.",
      },
      {
        id: "which-formula",
        question: "Which BMR formula is most accurate?",
        answer:
          "Mifflin-St Jeor for the general population; the American Dietetic Association's review found it within 10% of measured rates more consistently than Harris-Benedict. Katch-McArdle is better if you know your body fat percentage and are lean.",
      },
      {
        id: "deficit",
        question: "How big a calorie deficit is safe?",
        answer:
          "A deficit of 500–750 kcal a day, giving roughly 0.5–0.75 kg a week, is commonly recommended. Larger deficits increase muscle loss and are harder to sustain, and intakes below about 1,200 kcal warrant medical supervision.",
      },
      {
        id: "activity",
        question: "Which activity level should I choose?",
        answer:
          "Most people pick too high. A desk job with three or four gym sessions a week is 'moderately active' at 1.55. 'Very active' at 1.725 means hard training six or seven days a week, not occasional exercise.",
      },
      {
        id: "macros",
        question: "What macronutrient split should I use?",
        answer:
          "A common starting point is 30% protein, 40% carbohydrate and 30% fat, adjusted to preference and goal. Protein and carbohydrate provide 4 kcal per gram and fat 9, which is how grams are derived from the split.",
      },
      {
        id: "plateau",
        question: "Why has my weight loss stopped?",
        answer:
          "As weight falls, both BMR and the energy cost of movement fall with it, so the original target becomes maintenance. Recalculating at your current weight usually explains a plateau.",
      },
      {
        id: "accuracy",
        question: "How accurate are these numbers?",
        answer:
          "They are estimates with a genuine margin of error — individual metabolic rate can differ from prediction by 10% or more. Use the figure as a starting point and adjust based on what actually happens over three to four weeks.",
      },
      {
        id: "privacy",
        question: "Is my health data uploaded?",
        answer:
          "No. Age, weight and height are used for a calculation in your browser and never sent anywhere. Nothing is stored, logged or associated with you.",
      },
    ],
    sources: [
      { label: "Mifflin MD, St Jeor ST et al., American Journal of Clinical Nutrition, 1990" },
      { label: "Roza AM, Shizgal HM — revised Harris-Benedict, 1984" },
    ],
    disclaimer:
      "These are estimates for general information, not medical or dietary advice. Consult a doctor or registered dietitian before making significant changes to your diet.",
    relatedSlugs: ["bmi-calculator", "age-calculator"],
  },

  "gpa-calculator": {
    slug: "gpa-calculator",
    group: "education",
    name: "GPA Calculator",
    title: "GPA Calculator — Credit-Weighted Grade Average",
    description:
      "Calculate GPA on a 4.0 or 10-point scale, weighted by credit hours. Also works out the average needed to reach a target GPA.",
    h1: "GPA Calculator",
    primaryQuestion: "How is GPA calculated?",
    quickAnswer:
      "GPA is the sum of each grade's points multiplied by its credits, divided by total credits. Three courses worth 3, 4 and 3 credits graded A, B and C give (12 + 12 + 6) ÷ 10 = 3.0. Averaging grades without weighting by credits gives the wrong answer.",
    term: "GPA",
    termDefinition:
      "Grade point average is the credit-weighted mean of grade points earned across courses, expressing overall academic performance as a single figure on a fixed scale.",
    formula: "GPA = Σ(grade points × credits) / Σ(credits)",
    variables: [
      { symbol: "grade points", meaning: "Numeric value of the letter grade on the chosen scale" },
      { symbol: "credits", meaning: "Credit hours or weight carried by the course" },
    ],
    workedExample: {
      scenario: "Three courses on the 4.0 scale",
      inputs: [
        { label: "Course A", value: "3 credits, grade A (4.0)" },
        { label: "Course B", value: "4 credits, grade B (3.0)" },
        { label: "Course C", value: "3 credits, grade C (2.0)" },
      ],
      working: [
        "Weighted points: 4.0 × 3 = 12, 3.0 × 4 = 12, 2.0 × 3 = 6",
        "Total points = 30",
        "Total credits = 3 + 4 + 3 = 10",
        "GPA = 30 ÷ 10",
      ],
      result:
        "GPA 3.0. A plain average of 4.0, 3.0 and 2.0 also gives 3.0 here — but change the credits to 1, 4 and 5 and the weighted GPA falls to 2.6 while the plain average stays at 3.0.",
    },
    intro:
      "A GPA calculator converts letter grades into a single credit-weighted figure. The weighting is the part that is routinely got wrong: averaging the grade points directly ignores that a four-credit course counts more than a one-credit one, and inflates the result whenever the weaker grades are in the heavier courses. Both the 4.0 and 10-point scales are supported, since they are different systems rather than one converted into the other.",
    iconName: "GraduationCap",
    applicationCategory: "EducationalApplication",
    features: [
      "Credit-weighted, not a plain average",
      "4.0 letter scale and 10-point scale",
      "Add any number of courses",
      "Target GPA — what you need in remaining credits",
      "Flags impossible targets",
    ],
    steps: [
      {
        name: "Choose your scale",
        text: "Pick the 4.0 letter scale used across the US or the 10-point scale used by most Indian universities. The grade options change accordingly.",
      },
      {
        name: "Add your courses",
        text: "Enter each course with its credit hours and the grade received. Credits are usually on your transcript or in the course catalogue.",
      },
      {
        name: "Read the weighted GPA",
        text: "The result weights each grade by its credits. Courses with more credits move the figure more, which is how institutions calculate it.",
      },
      {
        name: "Set a target",
        text: "Enter a GPA you want and the credits remaining to see the average you need. If it exceeds the scale maximum, it is flagged as unreachable.",
      },
    ],
    examples: [
      {
        title: "Weighting matters",
        input: "A (3cr), B (4cr), C (3cr)",
        output: "GPA 3.0",
        explanation:
          "Weighted and unweighted agree here because the credits are balanced. Change to A (1cr), B (4cr), C (5cr) and the weighted GPA drops to 2.6.",
      },
      {
        title: "Reaching a target",
        input: "3.0 over 60 credits, target 3.5, 30 credits left",
        output: "Need a 4.5 average — impossible",
        explanation:
          "The required average exceeds the 4.0 maximum, so the target cannot be reached. Knowing this early is more useful than a number that looks achievable.",
      },
      {
        title: "10-point scale",
        input: "O (4cr), A+ (3cr), B+ (3cr)",
        output: "GPA 8.8",
        explanation:
          "On the Indian 10-point scale, O is 10, A+ is 9 and B+ is 7. Weighted: (40 + 27 + 21) ÷ 10 = 8.8.",
      },
    ],
    referenceTable: {
      caption: "Grade point values by scale",
      columns: ["Grade", "4.0 scale", "10-point scale", "Typical percentage"],
      rows: [
        ["A / O", "4.0", "10", "90–100"],
        ["A− / A+", "3.7", "9", "80–89"],
        ["B+ / A", "3.3", "8", "70–79"],
        ["B / B+", "3.0", "7", "60–69"],
        ["C / B", "2.0", "6", "50–59"],
        ["D / P", "1.0", "4", "40–49"],
        ["F", "0.0", "0", "below 40"],
      ],
    },
    benefits: [
      {
        title: "Correct weighting",
        description:
          "Credits are applied properly, so a heavy course counts more — matching how your institution computes the figure on your transcript.",
      },
      {
        title: "Two real scales",
        description:
          "The 4.0 and 10-point systems are offered as separate scales rather than converting one into the other, which loses accuracy.",
      },
      {
        title: "Honest target checking",
        description:
          "If a target cannot be reached even with perfect grades, that is stated plainly instead of returning an impossible required average.",
      },
      {
        title: "Nothing stored",
        description: "Grades and courses stay in your browser.",
      },
    ],
    limitations: [
      "Institutions vary. Some use plus and minus grades, some do not, and some cap or round differently — always check your own handbook.",
      "Pass or fail courses usually carry credits but no grade points and are excluded from GPA at most institutions.",
      "Repeated courses are handled differently everywhere: some replace the original grade, some average both, some count only the latest attempt.",
      "Weighted GPA for honours or advanced courses, common in US high schools, uses a different scale that goes above 4.0.",
    ],
    keyTakeaways: [
      "GPA = Σ(grade points × credits) ÷ Σ(credits).",
      "Averaging grades without credit weighting gives a wrong figure.",
      "The 4.0 and 10-point systems are separate scales, not conversions.",
      "A target requiring more than the scale maximum is unreachable.",
      "Institution rules on retakes and pass/fail vary widely.",
    ],
    faqs: [
      {
        id: "formula",
        question: "How do I calculate my GPA?",
        answer:
          "Multiply each course's grade points by its credit hours, add those products, then divide by total credits. Grades A, B and C in 3, 4 and 3 credit courses give (12 + 12 + 6) ÷ 10 = 3.0.",
      },
      {
        id: "weighting",
        question: "Why weight by credits?",
        answer:
          "Because courses are not equal. A four-credit course represents twice the work of a two-credit one and counts twice as much. Averaging grade points directly overstates your GPA whenever the weaker grades are in heavier courses.",
      },
      {
        id: "scales",
        question: "What is the difference between the 4.0 and 10-point scales?",
        answer:
          "They are separate systems. The 4.0 scale maps letter grades from A to F onto 0–4 with plus and minus steps of 0.3. The 10-point scale, used across Indian universities, maps grades onto 0–10. Neither converts cleanly to the other.",
      },
      {
        id: "target",
        question: "How do I work out the grades I need?",
        answer:
          "Multiply your target GPA by total credits including those remaining, subtract the points you already have, and divide by the remaining credits. If the answer exceeds the scale maximum, the target cannot be reached.",
      },
      {
        id: "pass-fail",
        question: "Do pass or fail courses count?",
        answer:
          "At most institutions they carry credit toward graduation but are excluded from GPA, because there is no grade point to weight. Check your handbook, since a minority do include them.",
      },
      {
        id: "retake",
        question: "How does retaking a course affect GPA?",
        answer:
          "It depends entirely on the institution. Some replace the original grade, some average the two attempts, and some count both separately. This changes the result substantially, so confirm the local rule.",
      },
      {
        id: "cumulative",
        question: "What is the difference between semester and cumulative GPA?",
        answer:
          "Semester GPA covers one term's courses; cumulative GPA covers everything to date, weighted by the credits in each term. A strong single semester moves the cumulative figure less than students expect.",
      },
      {
        id: "good-gpa",
        question: "What counts as a good GPA?",
        answer:
          "Context decides. On a 4.0 scale, 3.5 and above is generally considered strong and 3.0 solid, but competitive graduate programmes and employers vary widely in what they look for.",
      },
      {
        id: "privacy",
        question: "Are my grades saved?",
        answer:
          "No. Everything is calculated in your browser and nothing is transmitted. Closing the tab discards the courses you entered — there is no account and no record.",
      },
    ],
    relatedSlugs: ["cgpa-calculator", "age-calculator"],
  },

  "cgpa-calculator": {
    slug: "cgpa-calculator",
    group: "education",
    name: "CGPA Calculator",
    title: "CGPA Calculator — Cumulative GPA & Percentage",
    description:
      "Calculate cumulative GPA across semesters, weighted by credits, and convert to a percentage using the CBSE rule or your own multiplier.",
    h1: "CGPA Calculator",
    primaryQuestion: "How is CGPA calculated and converted to percentage?",
    quickAnswer:
      "CGPA is the credit-weighted average of semester GPAs: two semesters of 8.0 over 20 credits and 9.0 over 24 credits give 8.55. CBSE converts to percentage by multiplying by 9.5, so a CGPA of 9.2 is 87.4%.",
    term: "CGPA",
    termDefinition:
      "Cumulative grade point average is the credit-weighted average of grade points earned across all completed semesters of a programme.",
    formula:
      "CGPA = Σ(SGPA × semester credits) / Σ(semester credits)   ·   Percentage = CGPA × multiplier",
    variables: [
      { symbol: "SGPA", meaning: "Semester grade point average" },
      { symbol: "semester credits", meaning: "Credits carried in that semester" },
      { symbol: "multiplier", meaning: "Institution's conversion factor — 9.5 under the CBSE rule" },
    ],
    workedExample: {
      scenario: "Two semesters with different credit loads",
      inputs: [
        { label: "Semester 1", value: "SGPA 8.0, 20 credits" },
        { label: "Semester 2", value: "SGPA 9.0, 24 credits" },
      ],
      working: [
        "Weighted: 8.0 × 20 = 160, 9.0 × 24 = 216",
        "Total = 376 over 44 credits",
        "CGPA = 376 ÷ 44 = 8.545",
        "Percentage (CBSE rule) = 8.545 × 9.5",
      ],
      result: "CGPA 8.55, or about 81.2% under the CBSE multiplier.",
    },
    intro:
      "A CGPA calculator combines semester results into a cumulative figure and converts it to a percentage. Two details decide whether the answer is right: semesters must be weighted by the credits they carried, since a light semester should not count the same as a full one, and the percentage conversion has no universal rule — CBSE publishes multiply by 9.5, while many universities use a different factor or their own table entirely.",
    iconName: "GraduationCap",
    applicationCategory: "EducationalApplication",
    features: [
      "Credit-weighted across any number of semesters",
      "Percentage conversion with a selectable multiplier",
      "CBSE 9.5 rule built in",
      "Warns that conversion rules vary by institution",
      "Target CGPA planning",
    ],
    steps: [
      {
        name: "Add each semester",
        text: "Enter the SGPA and the credits carried in that semester. Both appear on your semester result sheet.",
      },
      {
        name: "Read the weighted CGPA",
        text: "Semesters are weighted by credits, so a term with a heavier load influences the cumulative figure more.",
      },
      {
        name: "Choose a conversion rule",
        text: "The CBSE rule multiplies by 9.5. If your university publishes a different factor, enter it — the result changes materially.",
      },
      {
        name: "Plan ahead",
        text: "Enter a target CGPA and remaining credits to see the SGPA needed in the semesters still to come.",
      },
    ],
    examples: [
      {
        title: "Two semesters",
        input: "8.0 over 20cr, 9.0 over 24cr",
        output: "CGPA 8.55",
        explanation:
          "A plain average would give 8.5. The credit weighting pulls it up because the stronger semester carried more credits.",
      },
      {
        title: "CBSE percentage",
        input: "CGPA 9.2",
        output: "87.4%",
        explanation:
          "9.2 × 9.5 = 87.4. This is the rule CBSE publishes for classes 10 and 12; other boards and universities differ.",
      },
      {
        title: "A different rule",
        input: "CGPA 9.2 under a (CGPA − 0.5) × 10 rule",
        output: "87.0%",
        explanation:
          "A common university alternative. The gap is small here but widens at lower CGPAs, so using the right rule matters.",
      },
    ],
    benefits: [
      {
        title: "Correct credit weighting",
        description:
          "Semesters are weighted by their credit load rather than averaged flat, matching how institutions compute the cumulative figure.",
      },
      {
        title: "Conversion is a choice, not an assumption",
        description:
          "The multiplier is exposed as an input with the CBSE rule as a default, because there is no universal conversion and pretending otherwise misleads.",
      },
      {
        title: "Forward planning",
        description:
          "Shows the SGPA needed in remaining semesters to reach a target, and says plainly when the target is out of reach.",
      },
      {
        title: "Private",
        description: "Academic records are never uploaded.",
      },
    ],
    limitations: [
      "Percentage conversion is institution-specific. The 9.5 multiplier is a CBSE rule and does not apply to most universities.",
      "Some universities exclude the first semester or drop the lowest result from the cumulative figure.",
      "Backlogs and re-examinations are treated differently everywhere and are not modelled here.",
      "A CGPA converted to a percentage is an approximation and should never be quoted where the official transcript figure is required.",
    ],
    keyTakeaways: [
      "CGPA = Σ(SGPA × credits) ÷ Σ(credits).",
      "Semesters must be weighted by credits, not averaged flat.",
      "CBSE converts to percentage by multiplying by 9.5.",
      "Many universities use a different rule, such as (CGPA − 0.5) × 10.",
      "Always use your own institution's published conversion.",
    ],
    faqs: [
      {
        id: "formula",
        question: "How is CGPA calculated?",
        answer:
          "Multiply each semester's SGPA by the credits carried that semester, sum the results and divide by total credits. Semesters of 8.0 over 20 credits and 9.0 over 24 credits give 376 ÷ 44 = 8.55.",
      },
      {
        id: "percentage",
        question: "How do I convert CGPA to a percentage?",
        answer:
          "CBSE publishes CGPA × 9.5, so 9.2 becomes 87.4%. Many universities instead use (CGPA − 0.5) × 10 or their own conversion table. Use the rule your institution publishes — there is no universal formula.",
      },
      {
        id: "why-95",
        question: "Why multiply by 9.5?",
        answer:
          "CBSE derived it from the average of the percentage bands corresponding to grades A1 to E2 across a large cohort. It is an empirical fit to their own grading distribution, not a general mathematical relationship.",
      },
      {
        id: "sgpa-cgpa",
        question: "What is the difference between SGPA and CGPA?",
        answer:
          "SGPA covers a single semester; CGPA covers every semester completed so far, weighted by the credits in each. A single strong semester moves CGPA less than students expect, particularly later in a programme.",
      },
      {
        id: "improve",
        question: "How can I improve my CGPA?",
        answer:
          "The effect of any one semester shrinks as total credits accumulate, so improvements early carry more weight. Enter a target and the remaining credits to see the SGPA required — sometimes it is not achievable.",
      },
      {
        id: "backlog",
        question: "How do backlogs affect CGPA?",
        answer:
          "It depends on the institution. Some replace the failed grade once cleared, others average both attempts, and some carry the original into the cumulative figure permanently. Check your regulations.",
      },
      {
        id: "ten-scale",
        question: "Is CGPA always out of 10?",
        answer:
          "Not always. Most Indian universities use 10, but some use 4 following the US convention and a few use other maxima. The calculation is the same; only the scale maximum changes.",
      },
      {
        id: "official",
        question: "Can I use this figure on an application?",
        answer:
          "Use it to plan, but quote the official figure from your transcript on any application. Institutions apply their own rounding and exclusions, so a self-calculated number can differ slightly.",
      },
      {
        id: "privacy",
        question: "Are my academic results stored?",
        answer:
          "No. All calculation happens in your browser and nothing is transmitted. There is no account, no logging and no record once you close the tab.",
      },
    ],
    sources: [{ label: "CBSE, official CGPA to percentage conversion rule" }],
    relatedSlugs: ["gpa-calculator", "age-calculator"],
  },

  "age-calculator": {
    slug: "age-calculator",
    group: null,
    name: "Age Calculator",
    title: "Age Calculator — Exact Years, Months and Days",
    description:
      "Calculate exact age in years, months and days between any two dates. Handles leap years and month lengths correctly, with no timezone drift.",
    h1: "Age Calculator",
    primaryQuestion: "How do you calculate age in years, months and days?",
    quickAnswer:
      "Subtract the birth date from the reference date field by field, borrowing from the previous month when the day is negative. Someone born on 15 June 1990 is 36 years, 1 month and 22 days old on 6 August 2026.",
    term: "Age calculation",
    termDefinition:
      "Age calculation is the determination of elapsed time between a birth date and a reference date, expressed in calendar units that account for varying month lengths and leap years.",
    formula:
      "years = Y₂ − Y₁, months = M₂ − M₁, days = D₂ − D₁, borrowing from the preceding month when days is negative",
    variables: [
      { symbol: "Y₁ M₁ D₁", meaning: "Year, month and day of birth" },
      { symbol: "Y₂ M₂ D₂", meaning: "Year, month and day of the reference date" },
    ],
    workedExample: {
      scenario: "Born 15 June 1990, calculated on 6 August 2026",
      inputs: [
        { label: "Birth date", value: "1990-06-15" },
        { label: "Reference date", value: "2026-08-06" },
      ],
      working: [
        "days = 6 − 15 = −9, so borrow from July which has 31 days",
        "days = −9 + 31 = 22, and months reduces by one",
        "months = 8 − 6 − 1 = 1",
        "years = 2026 − 1990 = 36",
      ],
      result: "36 years, 1 month and 22 days. Born on a Friday.",
    },
    intro:
      "An age calculator finds the exact time elapsed between two dates. The reason so many get it wrong by a day is that they subtract two timestamps and divide: across a daylight-saving boundary a day is 23 or 25 hours, which shifts the result. This one works with plain calendar dates and never involves a clock, so the answer is stable regardless of timezone or when in the day you run it.",
    iconName: "Calendar",
    applicationCategory: "UtilitiesApplication",
    features: [
      "Exact years, months and days",
      "Total days, weeks, months and hours",
      "Days until your next birthday",
      "The weekday you were born on",
      "Any two dates, not just today",
    ],
    steps: [
      {
        name: "Enter the date of birth",
        text: "Pick the birth date. Any date is accepted, including dates far in the past — the calendar arithmetic handles leap years correctly.",
      },
      {
        name: "Set the reference date",
        text: "Defaults to today, but you can set any date to find age at a past or future moment — useful for eligibility cut-offs.",
      },
      {
        name: "Read the breakdown",
        text: "Age appears as years, months and days, with totals in days, weeks and hours alongside.",
      },
      {
        name: "Check the next birthday",
        text: "The countdown shows days remaining and the weekday it falls on, with 29 February handled by clamping to the 28th in common years.",
      },
    ],
    examples: [
      {
        title: "Standard case",
        input: "Born 1990-06-15, on 2026-08-06",
        output: "36 years, 1 month, 22 days",
        explanation:
          "The day borrow takes 31 days from July, since July precedes the August reference date.",
      },
      {
        title: "Short-month borrowing",
        input: "Born 2000-01-31, on 2000-02-28",
        output: "0 years, 0 months, 28 days",
        explanation:
          "There is no 31 February, so the result is expressed in days. Calculators that assume 30-day months return 27 or 29 here.",
      },
      {
        title: "Leap day birthday",
        input: "Born 2000-02-29, next birthday from 2026-03-01",
        output: "28 February 2027",
        explanation:
          "2027 is not a leap year, so the birthday clamps to 28 February rather than rolling into March.",
      },
    ],
    benefits: [
      {
        title: "No timezone drift",
        description:
          "Calendar dates are handled as year, month and day rather than timestamps, so daylight saving cannot shift the answer by a day.",
      },
      {
        title: "Correct month borrowing",
        description:
          "Borrowing takes the real length of the preceding month, so 31 January to 28 February gives 28 days rather than an assumed 30-day approximation.",
      },
      {
        title: "Leap years handled properly",
        description:
          "Including the century rule — 1900 was not a leap year but 2000 was — and clamping 29 February birthdays in common years.",
      },
      {
        title: "Works for any two dates",
        description:
          "Not restricted to today, so you can check age at a deadline, a cut-off date or a future event.",
      },
    ],
    limitations: [
      "Uses the Gregorian calendar throughout. Dates before its adoption, which varied by country between 1582 and 1923, will not match historical records.",
      "Months are not a fixed length, so 'total months' is a count of complete months rather than a precise division of days.",
      "Does not account for the time of day. Someone born late in the evening is treated as a full day old on the following date.",
      "Time zones are deliberately ignored, so a birth in a different zone is taken as the calendar date entered.",
    ],
    keyTakeaways: [
      "Age is calculated field by field, borrowing from the preceding month.",
      "Borrowing must use the real length of that month, not an assumed 30 days.",
      "Timestamp subtraction is unreliable across daylight-saving changes.",
      "A leap-day birthday clamps to 28 February in common years.",
      "1900 was not a leap year; 2000 was — the century rule matters.",
    ],
    faqs: [
      {
        id: "how",
        question: "How is exact age calculated?",
        answer:
          "By subtracting year, month and day separately and borrowing when needed. If the day is negative, add the number of days in the preceding month and reduce the month count by one; if months then goes negative, add 12 and reduce years.",
      },
      {
        id: "timezone",
        question: "Why do some age calculators give a different answer?",
        answer:
          "Most subtract two timestamps and divide by 86,400,000. Across a daylight-saving change a day is 23 or 25 hours, so the division can land a day out. Working with calendar dates avoids the problem entirely.",
      },
      {
        id: "month-length",
        question: "How are different month lengths handled?",
        answer:
          "By borrowing the actual length of the month before the reference date. From 31 January to 28 February the borrow uses January's 31 days, giving 28 days — not the 27 or 29 that a fixed 30-day assumption produces.",
      },
      {
        id: "leap",
        question: "What happens with a 29 February birthday?",
        answer:
          "In common years the birthday clamps to 28 February, which is the convention most legal systems use. The calculator applies the full leap rule, so 1900 is correctly treated as a common year and 2000 as a leap year.",
      },
      {
        id: "leap-rule",
        question: "What is the leap year rule exactly?",
        answer:
          "A year is a leap year if divisible by 4, except centuries, which must also be divisible by 400. So 1996 and 2000 are leap years, but 1900 and 2100 are not. Calculators that only check divisibility by 4 are wrong for century years.",
      },
      {
        id: "future",
        question: "Can I calculate age at a future date?",
        answer:
          "Yes. Change the reference date to any date you like. This is useful for checking eligibility against a cut-off, such as a school admission or a scheme's qualifying date.",
      },
      {
        id: "total-days",
        question: "Why does total days not match years times 365?",
        answer:
          "Because leap years add a day roughly every four years. Over 36 years that is nine extra days, so a simple multiplication drifts by more than a week.",
      },
      {
        id: "weekday",
        question: "How is the day of the week worked out?",
        answer:
          "From the number of days since a known reference point, taken modulo seven. Because it is derived from the calendar rather than a timestamp, it is correct for any date without depending on your device's clock.",
      },
      {
        id: "privacy",
        question: "Is my date of birth stored?",
        answer:
          "No. The calculation is arithmetic performed in your browser. A date of birth is personal information and it is never transmitted, logged or retained anywhere.",
      },
    ],
    relatedSlugs: ["bmi-calculator", "gpa-calculator"],
  },
};
