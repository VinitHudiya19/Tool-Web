import type { CalculatorConfig } from "./types";

/**
 * Finance calculator content.
 *
 * Split from the other groups because it is the largest and would otherwise
 * make one unreadable file.
 */
export const FINANCE_CALCULATORS: Record<string, CalculatorConfig> = {
  "emi-calculator": {
    slug: "emi-calculator",
    group: "finance",
    name: "EMI Calculator",
    title: "EMI Calculator — Monthly Loan Instalment",
    description:
      "Work out the monthly instalment on any loan, with a full amortisation schedule that closes at zero and shows exactly what goes to interest.",
    h1: "EMI Calculator",
    primaryQuestion: "How is EMI calculated?",
    quickAnswer:
      "EMI is calculated as P × r × (1+r)^n ÷ ((1+r)^n − 1), where P is the loan amount, r is the monthly interest rate, and n is the number of months. A ₹50 lakh loan at 8.5% over 30 years gives an EMI of ₹38,446.",
    term: "EMI",
    termDefinition:
      "An equated monthly instalment is the fixed amount paid each month to repay a loan, covering both interest and principal, calculated so the balance reaches exactly zero at the end of the term.",
    formula: "EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)",
    variables: [
      { symbol: "P", meaning: "Principal — the amount borrowed" },
      { symbol: "r", meaning: "Monthly interest rate — the annual rate divided by 12, then by 100" },
      { symbol: "n", meaning: "Total number of monthly instalments" },
    ],
    workedExample: {
      scenario: "A ₹50,00,000 home loan at 8.5% a year over 30 years",
      inputs: [
        { label: "Principal (P)", value: "₹50,00,000" },
        { label: "Annual rate", value: "8.5%" },
        { label: "Monthly rate (r)", value: "0.085 ÷ 12 = 0.0070833" },
        { label: "Months (n)", value: "30 × 12 = 360" },
      ],
      working: [
        "(1 + r)^n = 1.0070833^360 = 12.6875",
        "Numerator: 50,00,000 × 0.0070833 × 12.6875 = 4,49,318",
        "Denominator: 12.6875 − 1 = 11.6875",
        "EMI = 4,49,318 ÷ 11.6875",
      ],
      result: "EMI = ₹38,446 a month. Total paid ₹1,38,40,442, of which ₹88,40,442 is interest.",
    },
    intro:
      "An EMI calculator works out the fixed monthly payment on a loan and splits it into interest and principal. The instalment itself is easy to find anywhere; what usually is not shown is the amortisation schedule that proves it — and most schedules are built from a rounded instalment, so the balance never quite reaches zero. This one keeps the instalment exact and lets the final payment absorb the remainder, exactly as a lender does.",
    iconName: "Landmark",
    applicationCategory: "FinanceApplication",
    features: [
      "Monthly instalment for any loan amount, rate and term",
      "Full amortisation schedule that closes at exactly zero",
      "Year-by-year and month-by-month views",
      "Interest versus principal breakdown",
      "Handles a 0% interest rate without breaking",
    ],
    steps: [
      {
        name: "Enter the loan amount",
        text: "Put in the principal — the amount actually borrowed, after any down payment. The instalment is proportional to this, so halving the loan halves the EMI.",
      },
      {
        name: "Add the interest rate",
        text: "Enter the annual rate your lender quoted. It is divided by 12 to give the monthly rate the formula needs; you do not need to convert it yourself.",
      },
      {
        name: "Set the term",
        text: "Choose the tenure in years or months. A longer term lowers the instalment but raises total interest, and the summary shows both so the trade-off is visible.",
      },
      {
        name: "Read the schedule",
        text: "The amortisation table shows what each payment does. Early instalments are mostly interest; the crossover point is usually much later than people expect.",
      },
    ],
    examples: [
      {
        title: "Home loan",
        input: "₹50,00,000 at 8.5% for 30 years",
        output: "EMI ₹38,446 · interest ₹88,40,442",
        explanation:
          "Over 30 years the interest exceeds the loan itself. Cutting the term to 20 years raises the EMI to ₹43,391 but saves ₹34 lakh in interest.",
      },
      {
        title: "Car loan",
        input: "₹8,00,000 at 9.5% for 5 years",
        output: "EMI ₹16,798 · interest ₹2,07,879",
        explanation:
          "Shorter terms keep total interest modest. The first instalment is ₹6,333 interest and ₹10,465 principal.",
      },
      {
        title: "Interest-free instalments",
        input: "₹60,000 at 0% for 12 months",
        output: "EMI ₹5,000 · interest ₹0",
        explanation:
          "The standard formula divides by zero at a 0% rate. This calculator falls back to equal principal slices instead of returning an error.",
      },
    ],
    referenceTable: {
      caption: "EMI per ₹1,00,000 borrowed, by rate and term",
      columns: ["Rate", "10 years", "15 years", "20 years", "30 years"],
      rows: [
        ["7.0%", "₹1,161", "₹899", "₹775", "₹665"],
        ["8.0%", "₹1,213", "₹956", "₹836", "₹734"],
        ["8.5%", "₹1,240", "₹985", "₹868", "₹769"],
        ["9.0%", "₹1,267", "₹1,014", "₹900", "₹805"],
        ["10.0%", "₹1,322", "₹1,075", "₹965", "₹878"],
      ],
    },
    benefits: [
      {
        title: "A schedule that actually closes",
        description:
          "The instalment is kept unrounded while the table is built and the last payment settles the remainder, so the final balance is zero rather than a few hundred rupees adrift.",
      },
      {
        title: "The real cost, not just the instalment",
        description:
          "Total interest is shown next to the monthly figure, which is the number that decides whether a longer tenure is worth it.",
      },
      {
        title: "The interest-to-principal crossover",
        description:
          "The schedule shows the month where a payment starts going mostly to principal — usually far later in the term than borrowers assume.",
      },
      {
        title: "Nothing is uploaded",
        description:
          "Loan amounts and rates are calculated in the page. Your borrowing plans are not sent to a server or logged.",
      },
    ],
    limitations: [
      "Assumes a fixed rate for the whole term. A floating-rate loan changes the instalment or the tenure whenever the benchmark moves.",
      "Processing fees, insurance and documentation charges are excluded — these are usually 0.5–2% of the loan and are not part of the EMI formula.",
      "Prepayments are not modelled. Paying extra reduces both the balance and the interest, so real totals will be lower than shown.",
      "Assumes payment on the same day each month. A lender computing daily-reducing interest will differ slightly.",
    ],
    keyTakeaways: [
      "EMI = P × r × (1+r)^n / ((1+r)^n − 1), with r as the monthly rate.",
      "A ₹50 lakh loan at 8.5% over 30 years costs ₹38,446 a month.",
      "Over a long tenure the interest can exceed the amount borrowed.",
      "Extending the term lowers the instalment but sharply raises total interest.",
      "The amortisation schedule here closes at exactly zero rather than drifting.",
    ],
    faqs: [
      {
        id: "formula",
        question: "What is the formula for EMI?",
        answer:
          "EMI = P × r × (1 + r)^n / ((1 + r)^n − 1). P is the principal, r is the monthly interest rate — the annual rate divided by 12 and then by 100 — and n is the number of monthly instalments. The same formula covers home, car and personal loans.",
      },
      {
        id: "interest-first",
        question: "Why is most of my early EMI going to interest?",
        answer:
          "Interest is charged on the outstanding balance, which is highest at the start. On a 30-year loan at 8.5%, the first instalment is about 92% interest. The crossover where principal exceeds interest arrives around year 18.",
      },
      {
        id: "tenure",
        question: "Should I choose a longer tenure for a lower EMI?",
        answer:
          "It lowers the monthly outgo but raises the total sharply. Extending a ₹50 lakh loan at 8.5% from 20 to 30 years cuts the EMI by ₹4,945 a month but adds about ₹34 lakh in interest over the life of the loan.",
      },
      {
        id: "prepayment",
        question: "How does prepaying affect the EMI?",
        answer:
          "A lump-sum prepayment reduces the outstanding principal, so you either keep the EMI and finish earlier or keep the tenure and pay less each month. Prepaying early saves far more, because that is when the balance — and so the interest — is largest.",
      },
      {
        id: "zero-rate",
        question: "Does it work for a 0% interest offer?",
        answer:
          "Yes. The standard formula is 0 ÷ 0 at a zero rate, which is why many calculators return an error or NaN. This one detects the case and divides the principal evenly across the instalments instead.",
      },
      {
        id: "floating",
        question: "What happens if my rate is floating?",
        answer:
          "Lenders usually hold the instalment steady and change the tenure instead, so a rate rise quietly extends your loan. Re-run the calculation at the new rate to see the effect, and ask your lender which of the two they adjust.",
      },
      {
        id: "vs-flat",
        question: "How does this differ from a flat-rate calculation?",
        answer:
          "A flat rate charges interest on the original amount for the whole term, so a quoted 8% flat is roughly 14–15% in reducing-balance terms. This calculator uses reducing balance, which is how home and car loans actually work.",
      },
      {
        id: "eligibility",
        question: "How much EMI can I afford?",
        answer:
          "Lenders generally cap total instalments at 40–50% of net monthly income, including any existing loans. That is an underwriting limit rather than a recommendation — the comfortable figure depends on your own commitments.",
      },
      {
        id: "privacy",
        question: "Is my loan information sent anywhere?",
        answer:
          "No. Every figure is computed by JavaScript in your browser. Nothing about the amount you are borrowing, your rate or your tenure is transmitted, stored or logged.",
      },
    ],
    sources: [
      { label: "Reducing-balance annuity formula, standard actuarial notation" },
    ],
    disclaimer:
      "This calculator is a computation tool, not financial advice. Confirm figures with your lender before committing — their fees, rounding and interest-accrual method may differ.",
    relatedSlugs: ["loan-calculator", "compound-interest-calculator", "sip-calculator"],
  },

  "loan-calculator": {
    slug: "loan-calculator",
    group: "finance",
    name: "Loan Calculator",
    title: "Loan Calculator — Repayments & Total Interest",
    description:
      "Compare loan repayments across amounts, rates and terms. See total interest, the amortisation schedule, and what an extra payment saves.",
    h1: "Loan Calculator",
    primaryQuestion: "How much will my loan cost in total?",
    quickAnswer:
      "Total loan cost is the monthly repayment multiplied by the number of payments. A £20,000 loan at 7% over 5 years costs £396 a month and £23,761 in total — £3,761 of interest on top of the amount borrowed.",
    term: "Loan repayment",
    termDefinition:
      "A loan repayment is the periodic amount paid to a lender that covers the interest accrued since the last payment plus a portion of the outstanding principal.",
    formula: "Payment = P × r × (1 + r)^n / ((1 + r)^n − 1)",
    variables: [
      { symbol: "P", meaning: "Principal — the amount borrowed" },
      { symbol: "r", meaning: "Interest rate per period" },
      { symbol: "n", meaning: "Total number of payments" },
    ],
    workedExample: {
      scenario: "A £20,000 personal loan at 7% a year over 5 years",
      inputs: [
        { label: "Principal (P)", value: "£20,000" },
        { label: "Annual rate", value: "7%" },
        { label: "Monthly rate (r)", value: "0.07 ÷ 12 = 0.0058333" },
        { label: "Payments (n)", value: "5 × 12 = 60" },
      ],
      working: [
        "(1 + r)^n = 1.0058333^60 = 1.41763",
        "Numerator: 20,000 × 0.0058333 × 1.41763 = 165.39",
        "Denominator: 1.41763 − 1 = 0.41763",
        "Payment = 165.39 ÷ 0.41763",
      ],
      result: "Payment = £396.02 a month. Total repaid £23,761, of which £3,761 is interest.",
    },
    intro:
      "A loan calculator shows the periodic repayment on a fixed-rate loan and what it costs in total. The repayment is the number people ask for; the total interest is the number that decides whether the loan is a good idea. Both are shown together here, along with a schedule that reveals how slowly the balance falls in the early years.",
    iconName: "Wallet",
    applicationCategory: "FinanceApplication",
    features: [
      "Repayment for any amount, rate and term",
      "Total interest shown alongside the monthly figure",
      "Amortisation schedule closing at exactly zero",
      "Extra-payment modelling",
      "Weekly, fortnightly and monthly frequencies",
    ],
    steps: [
      {
        name: "Enter what you are borrowing",
        text: "Put in the loan amount. If you are trading in or paying a deposit, enter only the balance you actually need to finance.",
      },
      {
        name: "Enter the rate and term",
        text: "Use the annual rate the lender quoted. Try two or three terms — the effect on total interest is usually larger than people expect.",
      },
      {
        name: "Compare the totals",
        text: "Look at the total repaid rather than only the monthly figure. Two loans with similar repayments can differ by thousands over the full term.",
      },
      {
        name: "Test an overpayment",
        text: "Add a regular extra amount to see how many months it removes. Overpaying early has a disproportionate effect because the balance is largest then.",
      },
    ],
    examples: [
      {
        title: "Personal loan",
        input: "£20,000 at 7% for 5 years",
        output: "£396/month · £3,761 interest",
        explanation:
          "A five-year term keeps total interest under 20% of the amount borrowed. Stretching to seven years drops the payment to £302 but raises interest to £5,364.",
      },
      {
        title: "The cost of a longer term",
        input: "£20,000 at 7% for 10 years",
        output: "£232/month · £7,878 interest",
        explanation:
          "Halving the monthly payment more than doubles the interest. The repayment is what you can afford; the total is what it costs.",
      },
      {
        title: "Overpaying by £50 a month",
        input: "£20,000 at 7% for 5 years, +£50",
        output: "Finishes 7 months early · saves £791",
        explanation:
          "A small regular overpayment shortens the term because every extra pound goes straight to principal, removing all the future interest it would have carried.",
      },
    ],
    benefits: [
      {
        title: "Total cost, front and centre",
        description:
          "The total repaid and total interest sit beside the monthly figure, so a cheap-looking payment on a long term does not mislead.",
      },
      {
        title: "Overpayment modelling",
        description:
          "See exactly how many months and how much interest a regular extra payment removes, which is the most reliable way to cut the cost of a loan.",
      },
      {
        title: "An accurate schedule",
        description:
          "The amortisation table is built from the unrounded payment and closes at zero, so the figures reconcile rather than drifting.",
      },
      {
        title: "Private by construction",
        description:
          "Nothing about the amount you want to borrow leaves your browser.",
      },
    ],
    limitations: [
      "Assumes a fixed rate. Variable-rate loans change the payment or the term whenever the benchmark moves.",
      "Arrangement fees, early-repayment charges and insurance are excluded; these can add materially to the real cost.",
      "Assumes payments are made on time. A missed payment adds interest and usually a fee.",
      "APR quoted by lenders includes compulsory fees, so a lender's APR may exceed the nominal rate entered here.",
    ],
    keyTakeaways: [
      "The repayment formula is the same annuity formula used for EMI.",
      "Total interest, not the monthly payment, is the true cost of a loan.",
      "Doubling the term more than doubles the interest paid.",
      "Regular overpayments shorten the term disproportionately.",
      "All figures are computed in your browser and never uploaded.",
    ],
    faqs: [
      {
        id: "total-cost",
        question: "How do I work out the total cost of a loan?",
        answer:
          "Multiply the periodic payment by the number of payments, then subtract the amount borrowed to isolate the interest. A £20,000 loan at 7% over 5 years repays £23,761 in total, so the interest is £3,761.",
      },
      {
        id: "shorter-term",
        question: "Is a shorter term always cheaper?",
        answer:
          "In total interest, yes — less time means less accrued interest. But the payment is higher, and a term you cannot comfortably afford risks missed payments and fees, which cost more than the interest saved.",
      },
      {
        id: "apr",
        question: "Why is the lender's APR higher than the rate I entered?",
        answer:
          "APR bundles compulsory fees into a single annualised figure, while the nominal rate does not. If a loan carries an arrangement fee, its APR will exceed the interest rate, and the APR is the fairer basis for comparison.",
      },
      {
        id: "overpay",
        question: "Does overpaying actually save money?",
        answer:
          "Yes, and more than most people expect. An extra payment reduces the principal immediately, so all the future interest that principal would have attracted disappears. Overpayments made early save the most.",
      },
      {
        id: "frequency",
        question: "Does paying fortnightly instead of monthly help?",
        answer:
          "It usually does, for an arithmetic reason: 26 fortnightly payments equal 13 monthly payments a year rather than 12. The extra payment goes entirely to principal, shortening the term.",
      },
      {
        id: "secured",
        question: "What is the difference between a secured and unsecured loan?",
        answer:
          "A secured loan is backed by an asset the lender can claim if you default, so rates are lower. An unsecured loan is not, so rates are higher. The repayment maths is identical; only the rate differs.",
      },
      {
        id: "affordability",
        question: "How much can I borrow?",
        answer:
          "Lenders assess income, existing commitments and credit history, and commonly cap total debt payments near 40% of net income. That is their risk threshold, not a target — borrowing to the maximum leaves no margin.",
      },
      {
        id: "compare",
        question: "How should I compare two loan offers?",
        answer:
          "Compare total repaid over the same term, including fees. A lower monthly payment on a longer term almost always costs more overall, so aligning the terms before comparing is essential.",
      },
      {
        id: "privacy",
        question: "Are my borrowing figures stored?",
        answer:
          "No. The calculation runs entirely in your browser and nothing is transmitted. There is no account, no logging and no record of what you entered once the tab is closed.",
      },
    ],
    disclaimer:
      "This calculator is a computation tool, not financial advice. Lender fees and rounding rules vary; confirm any figure with the lender before committing.",
    relatedSlugs: ["emi-calculator", "compound-interest-calculator", "roi-calculator"],
  },

  "compound-interest-calculator": {
    slug: "compound-interest-calculator",
    group: "finance",
    name: "Compound Interest Calculator",
    title: "Compound Interest Calculator — Growth Over Time",
    description:
      "Project savings growth with any compounding frequency and regular contributions. Both parts use the same frequency, so the result is consistent.",
    h1: "Compound Interest Calculator",
    primaryQuestion: "How is compound interest calculated?",
    quickAnswer:
      "Compound interest is calculated as A = P(1 + r/n)^(nt), where P is the starting amount, r is the annual rate as a decimal, n is how many times a year interest is added, and t is the number of years. £10,000 at 6% compounded monthly for 10 years becomes £18,194.",
    term: "Compound interest",
    termDefinition:
      "Compound interest is interest calculated on the original principal plus all interest already added, so the balance grows at an accelerating rate rather than a constant one.",
    formula: "A = P(1 + r/n)^(nt)",
    variables: [
      { symbol: "A", meaning: "Final amount" },
      { symbol: "P", meaning: "Principal — the starting amount" },
      { symbol: "r", meaning: "Annual interest rate as a decimal (6% = 0.06)" },
      { symbol: "n", meaning: "Compounding periods per year" },
      { symbol: "t", meaning: "Time in years" },
    ],
    workedExample: {
      scenario: "£10,000 at 6% a year, compounded monthly, for 10 years",
      inputs: [
        { label: "Principal (P)", value: "£10,000" },
        { label: "Annual rate (r)", value: "0.06" },
        { label: "Compounds per year (n)", value: "12" },
        { label: "Years (t)", value: "10" },
      ],
      working: [
        "r/n = 0.06 ÷ 12 = 0.005",
        "nt = 12 × 10 = 120",
        "(1 + 0.005)^120 = 1.81940",
        "A = 10,000 × 1.81940",
      ],
      result: "A = £18,194. Interest earned is £8,194 — compared with £6,000 under simple interest.",
    },
    intro:
      "A compound interest calculator projects how a balance grows when interest is added back and starts earning interest itself. The trap in most such calculators is mixing conventions: they compound the lump sum yearly but the monthly contributions monthly, producing a figure that matches no real product. Here both use the same frequency, so the projection is internally consistent.",
    iconName: "TrendingUp",
    applicationCategory: "FinanceApplication",
    features: [
      "Yearly, half-yearly, quarterly, monthly or daily compounding",
      "Regular contributions at the same frequency as compounding",
      "Contribution at the start or end of each period",
      "Inflation-adjusted real value",
      "Year-by-year growth breakdown",
    ],
    steps: [
      {
        name: "Enter your starting amount",
        text: "Put in what you have to begin with. This can be zero if you are starting from nothing and only contributing regularly.",
      },
      {
        name: "Set the rate and compounding frequency",
        text: "Enter the annual rate and how often interest is added. More frequent compounding produces slightly more growth for the same headline rate.",
      },
      {
        name: "Add regular contributions",
        text: "Enter any recurring deposit. Choose whether it lands at the start or end of each period — at the start earns one extra period of growth.",
      },
      {
        name: "Check the real value",
        text: "The inflation-adjusted figure shows what the final amount is worth in today's money, which is usually the number that matters.",
      },
    ],
    examples: [
      {
        title: "Lump sum only",
        input: "£10,000 at 6%, monthly, 10 years",
        output: "£18,194",
        explanation:
          "Interest of £8,194 against £6,000 under simple interest. The £2,194 difference is interest earned on interest.",
      },
      {
        title: "Compounding frequency matters",
        input: "£10,000 at 6% for 10 years",
        output: "Yearly £17,908 · monthly £18,194 · daily £18,221",
        explanation:
          "The same nominal rate produces different results depending on how often interest is added. The gap narrows as frequency rises, approaching a limit.",
      },
      {
        title: "Regular saving",
        input: "£0 start, £200/month at 6% for 20 years",
        output: "£92,408",
        explanation:
          "Contributions total £48,000; growth adds £44,408. Over long periods the growth approaches the amount contributed.",
      },
    ],
    referenceTable: {
      caption: "£10,000 growth at different rates and compounding frequencies (10 years)",
      columns: ["Rate", "Yearly", "Quarterly", "Monthly", "Daily"],
      rows: [
        ["3%", "£13,439", "£13,483", "£13,494", "£13,499"],
        ["5%", "£16,289", "£16,436", "£16,470", "£16,487"],
        ["6%", "£17,908", "£18,140", "£18,194", "£18,221"],
        ["8%", "£21,589", "£22,080", "£22,196", "£22,253"],
        ["10%", "£25,937", "£26,851", "£27,070", "£27,179"],
      ],
    },
    benefits: [
      {
        title: "One consistent convention",
        description:
          "The lump sum and the contributions compound at the same frequency, so the total corresponds to a product that could actually exist.",
      },
      {
        title: "Frequency made visible",
        description:
          "Switching between yearly and daily compounding shows how much the convention is worth — often more than a small difference in the headline rate.",
      },
      {
        title: "Real value after inflation",
        description:
          "A projection in nominal terms flatters. The inflation-adjusted figure shows the purchasing power you would actually have.",
      },
      {
        title: "Timing of contributions",
        description:
          "Paying at the start of the period rather than the end earns an extra period of growth each time, which compounds into a visible difference.",
      },
    ],
    limitations: [
      "Assumes a constant rate. Real returns vary year to year, and a sequence of poor early years produces a materially lower result than the average implies.",
      "Tax on interest or gains is not deducted; in a taxable account the effective rate is lower.",
      "Fees are excluded. A 1% annual charge on a 6% return removes roughly a sixth of the growth over long periods.",
      "Projections are arithmetic, not forecasts. They show what a given rate produces, not what any investment will return.",
    ],
    keyTakeaways: [
      "A = P(1 + r/n)^(nt) is the compound interest formula.",
      "£10,000 at 6% compounded monthly becomes £18,194 over 10 years.",
      "More frequent compounding raises the result for the same nominal rate.",
      "Contributions at the start of each period earn one extra period of growth.",
      "The inflation-adjusted figure is the one that reflects real purchasing power.",
    ],
    faqs: [
      {
        id: "formula",
        question: "What is the compound interest formula?",
        answer:
          "A = P(1 + r/n)^(nt). P is the starting amount, r the annual rate as a decimal, n the number of compounding periods per year and t the years. Subtract P from A to get the interest alone.",
      },
      {
        id: "vs-simple",
        question: "How much better is compound than simple interest?",
        answer:
          "The gap widens with time. Over 10 years at 6%, £10,000 earns £6,000 simple but £8,194 compounded monthly. Over 30 years the same principal earns £18,000 simple and £50,226 compounded.",
      },
      {
        id: "frequency",
        question: "Does compounding frequency really matter?",
        answer:
          "Yes, though less than people assume. £10,000 at 6% for 10 years gives £17,908 compounded yearly and £18,221 daily — a 1.7% difference. The gain shrinks as frequency rises and converges on a ceiling.",
      },
      {
        id: "consistency",
        question: "Why do other calculators give a different total?",
        answer:
          "Many compound the opening balance at the frequency you chose but the monthly contributions monthly regardless, so the two halves grow under different assumptions. Using one frequency for both gives a figure that matches a real product.",
      },
      {
        id: "start-end",
        question: "Should contributions be at the start or end of the period?",
        answer:
          "It depends on the product. A salary-date standing order lands at the start and earns that period's growth; interest credited at period end does not. The difference is one period of interest, about 1% a year at 12%.",
      },
      {
        id: "rule-72",
        question: "What is the rule of 72?",
        answer:
          "Divide 72 by the annual rate to estimate the years for money to double. At 6%, 72 ÷ 6 = 12 years. It is a mental shortcut accurate to within a few months for rates between about 4% and 12%.",
      },
      {
        id: "inflation",
        question: "Should I adjust for inflation?",
        answer:
          "For any projection beyond a few years, yes. £100,000 in 20 years at 3% inflation buys what £55,368 buys today. A nominal figure without that context systematically overstates the outcome.",
      },
      {
        id: "tax",
        question: "Is tax included?",
        answer:
          "No. Interest and gains may be taxable depending on the account and where you live. In a taxable account, reduce the rate to an after-tax figure before projecting to keep the result realistic.",
      },
      {
        id: "privacy",
        question: "Are my savings figures uploaded?",
        answer:
          "No. The projection is arithmetic performed in your browser. Nothing about how much you have or contribute is sent anywhere, stored or logged.",
      },
    ],
    sources: [{ label: "Standard compound interest formula" }],
    disclaimer:
      "Projections are arithmetic, not forecasts, and are not financial advice. Actual returns vary and may be negative.",
    relatedSlugs: ["sip-calculator", "retirement-calculator", "emi-calculator"],
  },
};
