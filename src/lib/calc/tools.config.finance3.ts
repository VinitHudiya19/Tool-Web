import type { CalculatorConfig } from "./types";

/** Final group of finance calculators. */
export const FINANCE_CALCULATORS_3: Record<string, CalculatorConfig> = {
  "break-even-calculator": {
    slug: "break-even-calculator",
    group: "finance",
    name: "Break-Even Calculator",
    title: "Break-Even Calculator — Units & Revenue Needed",
    description:
      "Find how many units you must sell to cover fixed costs. Shows contribution per unit and flags when a price can never break even.",
    h1: "Break-Even Calculator",
    primaryQuestion: "How do you calculate the break-even point?",
    quickAnswer:
      "Break-even units = fixed costs ÷ (price per unit − variable cost per unit). With £100,000 of fixed costs, a £500 price and £300 variable cost, the contribution is £200 and you must sell 500 units to break even.",
    term: "Break-even point",
    termDefinition:
      "The break-even point is the sales volume at which total revenue exactly equals total costs, so the business makes neither a profit nor a loss.",
    formula: "Break-even units = Fixed costs / (Price per unit − Variable cost per unit)",
    variables: [
      { symbol: "Fixed costs", meaning: "Costs that do not change with volume — rent, salaries, insurance" },
      { symbol: "Price per unit", meaning: "What you charge for one unit" },
      { symbol: "Variable cost per unit", meaning: "Cost incurred for each unit produced" },
    ],
    workedExample: {
      scenario: "£100,000 fixed costs, £500 price, £300 variable cost per unit",
      inputs: [
        { label: "Fixed costs", value: "£100,000" },
        { label: "Price per unit", value: "£500" },
        { label: "Variable cost per unit", value: "£300" },
      ],
      working: [
        "Contribution per unit = 500 − 300 = £200",
        "Contribution margin = 200 ÷ 500 = 40%",
        "Break-even units = 100,000 ÷ 200",
      ],
      result: "500 units, or £250,000 in revenue, to cover all costs.",
    },
    intro:
      "A break-even calculator works out the sales volume at which a business stops losing money. The number that drives it is contribution — what each unit adds after its own variable cost. When the price does not exceed the variable cost there is no break-even point at any volume, and this calculator says so rather than returning an infinity that looks like a number.",
    iconName: "Scale",
    applicationCategory: "BusinessApplication",
    features: [
      "Break-even in units and in revenue",
      "Contribution per unit and contribution margin",
      "Flags prices that can never break even",
      "Target-profit volume",
      "Margin of safety against current sales",
    ],
    steps: [
      {
        name: "Add your fixed costs",
        text: "Total everything that does not change with volume over the period — rent, salaries, software, insurance. Use a consistent period, usually a month or a year.",
      },
      {
        name: "Enter the selling price",
        text: "Put in the price per unit excluding sales tax. If you sell several products, use a weighted average or run each separately.",
      },
      {
        name: "Enter the variable cost",
        text: "Include everything incurred per unit — materials, packaging, shipping, payment processing, commission. Understating this is the most common error.",
      },
      {
        name: "Read the contribution",
        text: "Contribution per unit is what each sale adds toward fixed costs. Fixed costs divided by contribution gives the units needed.",
      },
    ],
    examples: [
      {
        title: "A product business",
        input: "£100,000 fixed, £500 price, £300 variable",
        output: "500 units · £250,000 revenue",
        explanation:
          "Each unit contributes £200. Fixed costs are covered at 500 units; every unit after that adds £200 of profit.",
      },
      {
        title: "Raising the price",
        input: "£100,000 fixed, £600 price, £300 variable",
        output: "334 units · £200,400 revenue",
        explanation:
          "A 20% price rise cuts the break-even volume by a third, because contribution rises from £200 to £300 per unit.",
      },
      {
        title: "A price that cannot work",
        input: "£50,000 fixed, £100 price, £120 variable",
        output: "No break-even point",
        explanation:
          "Each sale loses £20, so volume makes the loss worse. The calculator reports this rather than returning a meaningless figure.",
      },
    ],
    benefits: [
      {
        title: "Contribution made explicit",
        description:
          "The per-unit contribution is the number that actually drives the answer, so it is shown rather than hidden inside the division.",
      },
      {
        title: "Impossible prices flagged",
        description:
          "When variable cost meets or exceeds price, the result is stated as having no break-even point instead of a misleading infinity.",
      },
      {
        title: "Target profit, not just zero",
        description:
          "Add a profit target to see the volume needed to reach it, which is usually the more useful planning number.",
      },
      {
        title: "Commercially private",
        description: "Cost structure and pricing never leave your browser.",
      },
    ],
    limitations: [
      "Assumes variable cost per unit is constant. Bulk discounts on materials lower it at volume, so real break-even is often slightly earlier.",
      "Assumes one price. Discounts, promotions and mixed channels all change the effective average.",
      "Fixed costs are rarely fixed forever — growth eventually requires more space, staff or equipment, which steps them up.",
      "Ignores timing. Break-even says nothing about whether cash arrives before the bills fall due.",
    ],
    keyTakeaways: [
      "Break-even units = fixed costs ÷ (price − variable cost).",
      "Contribution per unit is what each sale adds toward fixed costs.",
      "£100,000 fixed with £200 contribution needs 500 units.",
      "If variable cost meets or exceeds price, no volume breaks even.",
      "Raising price cuts break-even volume faster than cutting fixed costs.",
    ],
    faqs: [
      {
        id: "formula",
        question: "What is the break-even formula?",
        answer:
          "Break-even units = fixed costs ÷ (price per unit − variable cost per unit). The denominator is the contribution per unit. Multiply the result by the price to get break-even revenue.",
      },
      {
        id: "contribution",
        question: "What is contribution margin?",
        answer:
          "Contribution per unit is price minus variable cost — what each sale adds toward fixed costs. As a percentage of price it is the contribution margin: £200 on a £500 price is 40%.",
      },
      {
        id: "fixed-variable",
        question: "How do I tell fixed from variable costs?",
        answer:
          "Ask whether the cost changes if you sell one more unit. Rent and salaries do not, so they are fixed. Materials, shipping and payment fees do, so they are variable. Some costs are partly both.",
      },
      {
        id: "no-breakeven",
        question: "Why does it say there is no break-even point?",
        answer:
          "Because the variable cost meets or exceeds the price, so each sale loses money and selling more increases the loss. Volume cannot fix negative contribution — only a higher price or lower cost can.",
      },
      {
        id: "target-profit",
        question: "How do I find the volume for a target profit?",
        answer:
          "Add the target to fixed costs before dividing. To make £50,000 on top of £100,000 of fixed costs with £200 contribution, you need (100,000 + 50,000) ÷ 200 = 750 units.",
      },
      {
        id: "multiple-products",
        question: "What if I sell several different products?",
        answer:
          "Use a weighted average contribution based on your sales mix, or calculate each product separately. A blended figure is only valid while the mix holds; a shift in mix moves the break-even point.",
      },
      {
        id: "margin-safety",
        question: "What is the margin of safety?",
        answer:
          "The gap between current sales and break-even, as a percentage. Selling 800 units against a 500-unit break-even gives a 37.5% margin of safety — how far sales can fall before losses start.",
      },
      {
        id: "services",
        question: "Does this work for a service business?",
        answer:
          "Yes, with billable hours or projects as the unit. Variable cost is contractor time or delivery cost; fixed cost is everything else. The arithmetic is identical.",
      },
      {
        id: "privacy",
        question: "Is my cost structure stored?",
        answer:
          "No. Everything is computed in your browser. Cost structure and pricing are commercially sensitive, and neither is transmitted or retained.",
      },
    ],
    relatedSlugs: ["profit-margin-calculator", "roi-calculator", "net-worth-calculator"],
  },

  "net-worth-calculator": {
    slug: "net-worth-calculator",
    group: "finance",
    name: "Net Worth Calculator",
    title: "Net Worth Calculator — Assets Minus Liabilities",
    description:
      "Add up assets and debts to find your net worth. Groups holdings by liquidity so you can see what is actually available if needed.",
    h1: "Net Worth Calculator",
    primaryQuestion: "How do you calculate net worth?",
    quickAnswer:
      "Net worth = total assets − total liabilities. Someone with a £350,000 house, £40,000 in savings and investments, and a £220,000 mortgage plus £8,000 of other debt has a net worth of £162,000.",
    term: "Net worth",
    termDefinition:
      "Net worth is the value of everything owned minus everything owed, giving a single figure for financial position at a point in time.",
    formula: "Net worth = Total assets − Total liabilities",
    variables: [
      { symbol: "Assets", meaning: "Everything owned that has value — property, savings, investments, vehicles" },
      { symbol: "Liabilities", meaning: "Everything owed — mortgage, loans, credit card balances" },
    ],
    workedExample: {
      scenario: "A typical household balance sheet",
      inputs: [
        { label: "Property", value: "£350,000" },
        { label: "Savings and investments", value: "£40,000" },
        { label: "Mortgage", value: "£220,000" },
        { label: "Other debt", value: "£8,000" },
      ],
      working: [
        "Total assets = 350,000 + 40,000 = £390,000",
        "Total liabilities = 220,000 + 8,000 = £228,000",
        "Net worth = 390,000 − 228,000",
      ],
      result: "£162,000, of which only £40,000 is liquid.",
    },
    intro:
      "A net worth calculator subtracts what you owe from what you own. The single figure is less useful than the composition behind it: a net worth of £162,000 that is almost entirely house equity behaves very differently from the same figure held in savings. Assets are grouped by how quickly they can be turned into cash, so the picture is honest.",
    iconName: "Scale",
    applicationCategory: "FinanceApplication",
    features: [
      "Assets grouped by liquidity",
      "Liabilities separated into secured and unsecured",
      "Liquid net worth alongside the headline figure",
      "Debt-to-asset ratio",
      "Works with any currency",
    ],
    steps: [
      {
        name: "List your assets",
        text: "Enter cash, savings, investments, property and vehicles at current market value rather than what you paid.",
      },
      {
        name: "List your liabilities",
        text: "Enter outstanding balances, not original amounts — mortgage, loans, credit cards, anything owed.",
      },
      {
        name: "Read the split",
        text: "Liquid net worth excludes property and other assets you cannot quickly sell, which is the figure that matters in an emergency.",
      },
      {
        name: "Track it over time",
        text: "The trend matters more than the level. Recalculating quarterly shows whether the direction is right.",
      },
    ],
    examples: [
      {
        title: "Homeowner",
        input: "£390,000 assets, £228,000 debts",
        output: "Net worth £162,000 · liquid £40,000",
        explanation:
          "Most of the net worth is house equity, which cannot be spent without selling or borrowing against the property.",
      },
      {
        title: "Renter with investments",
        input: "£120,000 assets, £5,000 debts",
        output: "Net worth £115,000 · liquid £115,000",
        explanation:
          "A lower headline figure but entirely accessible. Comparing only the net worth figure would misjudge which position is more flexible.",
      },
      {
        title: "Negative net worth",
        input: "£25,000 assets, £45,000 student debt",
        output: "Net worth −£20,000",
        explanation:
          "Common early in a career and not alarming on its own. The trend over the following years is what matters.",
      },
    ],
    benefits: [
      {
        title: "Liquidity made visible",
        description:
          "Liquid net worth is shown separately, so a figure dominated by property equity is not mistaken for available money.",
      },
      {
        title: "Debt in context",
        description:
          "The debt-to-asset ratio shows how leveraged the position is, which the headline figure alone conceals.",
      },
      {
        title: "A single point of reference",
        description:
          "One number to track over time, which is far more informative than any individual account balance.",
      },
      {
        title: "Completely private",
        description:
          "A full picture of your finances is exactly what should never be uploaded, and here it never is.",
      },
    ],
    limitations: [
      "Asset values are estimates. Property and vehicles are worth what someone will pay, which is only known at sale.",
      "Selling costs are excluded — estate agent fees, legal costs and capital gains tax all reduce what an asset actually realises.",
      "Ignores income and expenses entirely. A high net worth with no income is a different situation from the same figure with strong earnings.",
      "Pensions may be hard to value accurately, particularly defined-benefit schemes where the transfer value is not the same as the promised income.",
    ],
    keyTakeaways: [
      "Net worth = total assets − total liabilities.",
      "Liquid net worth excludes assets you cannot quickly sell.",
      "A negative net worth is common early in a career.",
      "The trend over time matters more than the level.",
      "Composition matters as much as the headline figure.",
    ],
    faqs: [
      {
        id: "formula",
        question: "How is net worth calculated?",
        answer:
          "Add everything you own at current value, add everything you owe, and subtract the second from the first. £390,000 of assets against £228,000 of debts gives a net worth of £162,000.",
      },
      {
        id: "include",
        question: "What should I include as an asset?",
        answer:
          "Anything with resale value: cash, savings, investments, pensions, property, vehicles and valuables. Use realistic current market values, not purchase prices or sentimental estimates.",
      },
      {
        id: "liquid",
        question: "What is liquid net worth?",
        answer:
          "Net worth counting only assets convertible to cash quickly — savings and listed investments, but not property or a car you need. It is the more useful figure when assessing resilience to a shock.",
      },
      {
        id: "negative",
        question: "Is a negative net worth bad?",
        answer:
          "Not necessarily. Student debt and a recent mortgage both produce negative figures for people whose finances are otherwise healthy. What matters is whether it is improving year on year.",
      },
      {
        id: "home",
        question: "Should I include my home?",
        answer:
          "Include it as an asset and the mortgage as a liability, so the net effect is your equity. But track liquid net worth separately, since you cannot spend house equity without selling or borrowing.",
      },
      {
        id: "pension",
        question: "How do I value a pension?",
        answer:
          "For a defined-contribution scheme, use the current fund value. Defined-benefit schemes are harder — the transfer value is a rough proxy but understates a guaranteed inflation-linked income.",
      },
      {
        id: "frequency",
        question: "How often should I calculate it?",
        answer:
          "Quarterly or twice a year is enough. Monthly checks mostly capture market noise, and the value of the exercise is in the multi-year trend rather than short-term movement.",
      },
      {
        id: "average",
        question: "How does my net worth compare with others?",
        answer:
          "Comparisons are of limited use because age, country, housing market and career stage dominate. Someone of 25 and someone of 55 with the same figure are in very different positions.",
      },
      {
        id: "privacy",
        question: "Is my financial information stored?",
        answer:
          "No. Everything is calculated in your browser and nothing is transmitted. There is no account and no record — closing the tab discards all of it.",
      },
    ],
    disclaimer:
      "This calculator performs arithmetic on figures you provide and is not financial advice.",
    relatedSlugs: ["retirement-calculator", "profit-margin-calculator", "compound-interest-calculator"],
  },

  "retirement-calculator": {
    slug: "retirement-calculator",
    group: "finance",
    name: "Retirement Calculator",
    title: "Retirement Calculator — Corpus & Monthly Saving",
    description:
      "Work out the corpus needed to retire and what to save monthly. Adjusts for inflation on both sides, which most calculators only do on one.",
    h1: "Retirement Calculator",
    primaryQuestion: "How much do I need to retire?",
    quickAnswer:
      "The corpus needed is your annual expense at retirement divided by a sustainable withdrawal rate. Spending £30,000 a year today, retiring in 25 years with 3% inflation, means £62,800 a year then — needing roughly £1.57 million at a 4% withdrawal rate.",
    term: "Retirement corpus",
    termDefinition:
      "A retirement corpus is the accumulated sum required at retirement to fund living expenses for the remainder of life, allowing for inflation and investment growth.",
    formula:
      "Future expense = Current expense × (1 + inflation)^years   ·   Corpus = Future annual expense / withdrawal rate",
    variables: [
      { symbol: "Current expense", meaning: "What you spend each year today" },
      { symbol: "inflation", meaning: "Expected annual inflation as a decimal" },
      { symbol: "years", meaning: "Years until retirement" },
      { symbol: "withdrawal rate", meaning: "Sustainable annual withdrawal, often taken as 4%" },
    ],
    workedExample: {
      scenario: "Spending £30,000 a year today, retiring in 25 years, 3% inflation",
      inputs: [
        { label: "Current annual expense", value: "£30,000" },
        { label: "Years to retirement", value: "25" },
        { label: "Inflation", value: "3%" },
        { label: "Withdrawal rate", value: "4%" },
      ],
      working: [
        "Future expense = 30,000 × 1.03^25 = 30,000 × 2.0938 = £62,813",
        "Corpus = 62,813 ÷ 0.04",
      ],
      result:
        "About £1,570,000 at retirement. In today's money that is worth roughly £750,000.",
    },
    intro:
      "A retirement calculator estimates the sum needed to stop working and what must be saved to reach it. Two adjustments decide whether the answer is meaningful: inflating today's expenses to what they will cost at retirement, and then discounting the resulting corpus back to today's money so the number means something. Calculators that do only the first produce figures that sound alarming but are not comparable to anything.",
    iconName: "Umbrella",
    applicationCategory: "FinanceApplication",
    features: [
      "Corpus required, inflated to retirement",
      "Monthly saving needed to reach it",
      "Real value in today's money",
      "Adjustable withdrawal rate",
      "Accounts for existing savings",
    ],
    steps: [
      {
        name: "Enter your current spending",
        text: "Use annual living costs today, not income. Retirement spending is often 70–80% of working spending once commuting and saving stop.",
      },
      {
        name: "Set your timeline",
        text: "Enter your age and intended retirement age. The gap drives everything, because it determines how long compounding has to work.",
      },
      {
        name: "Choose inflation and withdrawal assumptions",
        text: "3% inflation and a 4% withdrawal rate are common starting points. Both are assumptions, and the result is sensitive to each.",
      },
      {
        name: "Read the monthly saving",
        text: "The calculator shows what you need to save each month given what you already have. Check the today's-money figure to sense-check the target.",
      },
    ],
    examples: [
      {
        title: "Mid-career",
        input: "£30,000/year spend, 25 years, 3% inflation",
        output: "Corpus £1.57m · about £750k in today's money",
        explanation:
          "The nominal figure looks daunting but is inflated across 25 years. The real figure is the meaningful comparison.",
      },
      {
        title: "Starting ten years later",
        input: "Same target, 15 years instead of 25",
        output: "Monthly saving roughly triples",
        explanation:
          "Ten fewer years removes the compounding that does most of the work, which is why starting early matters more than saving more.",
      },
      {
        title: "A more cautious withdrawal rate",
        input: "Same inputs at 3% withdrawal",
        output: "Corpus £2.09m",
        explanation:
          "Dropping the withdrawal rate from 4% to 3% raises the corpus needed by a third. The assumption matters as much as the saving.",
      },
    ],
    benefits: [
      {
        title: "Inflation applied on both sides",
        description:
          "Expenses are inflated to retirement and the corpus is discounted back, so the target can be judged against what money is worth today.",
      },
      {
        title: "The withdrawal rate is visible",
        description:
          "Exposed as an input rather than hidden, because moving it from 4% to 3% changes the answer by a third.",
      },
      {
        title: "Existing savings counted",
        description:
          "What you already have compounds toward the target, reducing the monthly figure accordingly.",
      },
      {
        title: "Entirely private",
        description: "Retirement plans and balances never leave your browser.",
      },
    ],
    limitations: [
      "Assumes a constant return and constant inflation. Neither holds, and a poor sequence of returns early in retirement is the largest single risk.",
      "The 4% rule derives from US market history over 30-year retirements and may not hold for other markets or longer retirements.",
      "State pensions, employer schemes and other income sources are not included and would reduce the corpus required.",
      "Healthcare costs typically rise faster than general inflation, which a single inflation rate does not capture.",
    ],
    keyTakeaways: [
      "Corpus = future annual expense ÷ withdrawal rate.",
      "Inflate today's spending to retirement before dividing.",
      "£30,000 a year today becomes £62,813 after 25 years at 3%.",
      "Moving the withdrawal rate from 4% to 3% raises the target by a third.",
      "Starting ten years earlier matters more than saving more each month.",
    ],
    faqs: [
      {
        id: "how-much",
        question: "How much do I need to retire?",
        answer:
          "Divide your expected annual spending at retirement by a sustainable withdrawal rate. Spending £62,813 a year at a 4% rate requires about £1.57 million. The figure is only as good as those two assumptions.",
      },
      {
        id: "four-percent",
        question: "What is the 4% rule?",
        answer:
          "A guideline that withdrawing 4% of a portfolio in the first year, rising with inflation, historically lasted 30 years in US markets. It is a starting point, not a guarantee, and assumes a particular asset mix.",
      },
      {
        id: "inflation",
        question: "Why does inflation matter so much?",
        answer:
          "Because it compounds over decades. At 3%, costs double roughly every 24 years, so £30,000 of spending today becomes £62,813 in 25 years. Ignoring it understates the target by more than half.",
      },
      {
        id: "when-start",
        question: "When should I start saving?",
        answer:
          "As early as possible, because compounding does most of the work in the final years and those years only exist if the money is invested early. Delaying ten years can roughly triple the monthly saving required.",
      },
      {
        id: "spending",
        question: "Will I spend the same in retirement?",
        answer:
          "Usually less — commuting, saving and often a mortgage all stop. A common estimate is 70–80% of working expenditure, though healthcare costs tend to rise in later retirement and can reverse the pattern.",
      },
      {
        id: "state-pension",
        question: "Should I include a state pension?",
        answer:
          "Yes, if you expect one. Subtract the annual amount from your spending before calculating the corpus, since that portion does not need to come from savings. This can reduce the target substantially.",
      },
      {
        id: "shortfall",
        question: "What if I cannot save the amount shown?",
        answer:
          "The main levers are retiring later, spending less in retirement, or saving more. Retiring two years later helps twice over: the corpus grows longer and needs to last a shorter period.",
      },
      {
        id: "returns",
        question: "What growth rate should I use for the accumulation years?",
        answer:
          "Conservative is safer. A real return of 4–5% above inflation is a common long-run equity assumption, but assuming a high rate produces a comfortable projection and an uncomfortable retirement.",
      },
      {
        id: "privacy",
        question: "Is my retirement data uploaded?",
        answer:
          "No. Every figure is computed in your browser. Income, savings and retirement plans are among the most sensitive data there is, and none of it is transmitted or stored.",
      },
    ],
    disclaimer:
      "This is a projection tool, not financial advice. Retirement planning depends on personal circumstances, tax and market conditions — consult a qualified adviser before acting on any figure.",
    relatedSlugs: ["swp-calculator", "compound-interest-calculator", "net-worth-calculator"],
  },
};
