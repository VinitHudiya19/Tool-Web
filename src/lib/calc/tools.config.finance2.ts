import type { CalculatorConfig } from "./types";

/** Remaining finance calculators. Split purely to keep files readable. */
export const FINANCE_CALCULATORS_2: Record<string, CalculatorConfig> = {
  "sip-calculator": {
    slug: "sip-calculator",
    group: "finance",
    name: "SIP Calculator",
    title: "SIP Calculator — Mutual Fund Returns",
    description:
      "Project systematic investment plan returns with the annuity-due convention Indian SIPs actually use. Includes step-up SIP and inflation-adjusted value.",
    h1: "SIP Calculator",
    primaryQuestion: "How is SIP return calculated?",
    quickAnswer:
      "SIP maturity is calculated as M = P × ((1+i)^n − 1) ÷ i × (1+i), where P is the monthly instalment, i the monthly return and n the number of instalments. ₹5,000 a month for 10 years at 12% grows to ₹11,61,695 against ₹6,00,000 invested.",
    term: "SIP",
    termDefinition:
      "A systematic investment plan is a method of investing a fixed amount in a mutual fund at regular intervals, buying more units when prices are low and fewer when they are high.",
    formula: "M = P × ((1 + i)^n − 1) / i × (1 + i)",
    variables: [
      { symbol: "M", meaning: "Maturity amount" },
      { symbol: "P", meaning: "Monthly instalment" },
      { symbol: "i", meaning: "Monthly rate — annual return ÷ 12 ÷ 100" },
      { symbol: "n", meaning: "Number of instalments" },
    ],
    workedExample: {
      scenario: "₹5,000 a month for 10 years at an assumed 12% a year",
      inputs: [
        { label: "Instalment (P)", value: "₹5,000" },
        { label: "Annual return", value: "12%" },
        { label: "Monthly rate (i)", value: "0.12 ÷ 12 = 0.01" },
        { label: "Instalments (n)", value: "120" },
      ],
      working: [
        "(1 + 0.01)^120 = 3.30039",
        "(3.30039 − 1) ÷ 0.01 = 230.039",
        "230.039 × 5,000 = ₹11,50,193",
        "× (1 + 0.01) for start-of-month investing = ₹11,61,695",
      ],
      result: "₹11,61,695 against ₹6,00,000 invested — a gain of ₹5,61,695.",
    },
    intro:
      "A SIP calculator projects what a monthly mutual fund instalment grows to over time. The detail that separates a correct calculator from an approximate one is the timing convention: a SIP debits at the start of the month, so each instalment earns that month's growth. Treating it as an end-of-month payment understates the result by about 1%, which over long horizons is a substantial sum.",
    iconName: "PiggyBank",
    applicationCategory: "FinanceApplication",
    features: [
      "Annuity-due convention matching how SIPs actually debit",
      "Step-up SIP with an annual increase",
      "Inflation-adjusted real value",
      "Invested versus gain breakdown",
      "Year-by-year growth table",
    ],
    steps: [
      {
        name: "Enter your monthly instalment",
        text: "Put in the amount debited each month. Most funds accept from ₹500, and the projection scales linearly with this figure.",
      },
      {
        name: "Set an expected return",
        text: "Enter the annual return you want to assume. Equity funds are commonly modelled at 10–12%, but this is an assumption, not a promise.",
      },
      {
        name: "Choose the period",
        text: "Set how many years you will invest. SIP outcomes are dominated by time — the last few years contribute far more than the first.",
      },
      {
        name: "Compare against inflation",
        text: "Check the inflation-adjusted figure to see what the maturity amount is worth in today's money before treating it as a goal.",
      },
    ],
    examples: [
      {
        title: "Ten-year SIP",
        input: "₹5,000/month at 12% for 10 years",
        output: "₹11,61,695 · invested ₹6,00,000",
        explanation:
          "Growth of ₹5,61,695 — almost as much as was invested. The final two years alone add more than the first five.",
      },
      {
        title: "Twenty-year SIP",
        input: "₹5,000/month at 12% for 20 years",
        output: "₹49,95,740 · invested ₹12,00,000",
        explanation:
          "Doubling the period more than quadruples the outcome. This is the compounding effect that makes starting early matter more than investing more.",
      },
      {
        title: "Step-up SIP",
        input: "₹5,000/month, +10% a year, 12% for 10 years",
        output: "₹17,68,000 approximately",
        explanation:
          "Raising the instalment 10% each year as income grows lifts the result by more than half, without a painful jump at any single point.",
      },
    ],
    benefits: [
      {
        title: "The right timing convention",
        description:
          "Uses annuity-due, matching a start-of-month debit. Ordinary-annuity calculators understate a ten-year SIP by roughly ₹11,500 on a ₹5,000 instalment.",
      },
      {
        title: "Step-up modelling",
        description:
          "Shows what raising the instalment annually achieves, which is usually more effective than trying to time the market.",
      },
      {
        title: "Real purchasing power",
        description:
          "The inflation-adjusted figure prevents a large nominal number from creating a false sense of sufficiency.",
      },
      {
        title: "Nothing leaves the browser",
        description: "Your investment amounts are never transmitted or logged.",
      },
    ],
    limitations: [
      "Assumes a constant return every month. Real markets are volatile, and the order of good and bad years changes the outcome even at the same average.",
      "Ignores exit load, expense ratio and taxes, all of which reduce the realised amount.",
      "Past performance does not indicate future returns; the rate entered is an assumption, not a forecast.",
      "Assumes every instalment is paid on time. A missed debit changes both the amount invested and the units bought.",
    ],
    keyTakeaways: [
      "M = P × ((1+i)^n − 1) / i × (1+i) for a start-of-month SIP.",
      "₹5,000 a month at 12% for 10 years reaches ₹11,61,695.",
      "Doubling the period roughly quadruples the outcome.",
      "A 10% annual step-up lifts a ten-year result by more than half.",
      "Returns are assumptions; markets do not deliver a constant rate.",
    ],
    faqs: [
      {
        id: "formula",
        question: "What is the SIP maturity formula?",
        answer:
          "M = P × ((1 + i)^n − 1) / i × (1 + i), where P is the monthly instalment, i the monthly rate and n the instalment count. The final (1 + i) reflects that a SIP debits at the start of the month.",
      },
      {
        id: "due",
        question: "Why does my bank's SIP figure differ slightly?",
        answer:
          "Usually the timing convention. Treating instalments as end-of-month payments understates the result by one month of growth — about ₹11,500 on a ten-year ₹5,000 SIP at 12%. Fund houses use the start-of-month convention.",
      },
      {
        id: "return",
        question: "What return should I assume?",
        answer:
          "There is no correct figure. Indian equity funds are commonly modelled at 10–12% over long periods and debt funds at 6–7%, but these are historical averages over decades and any individual period can differ sharply.",
      },
      {
        id: "step-up",
        question: "What is a step-up SIP?",
        answer:
          "An arrangement where the instalment rises by a set percentage each year, usually tracking income growth. Raising ₹5,000 by 10% annually over ten years produces roughly half as much again as a flat instalment.",
      },
      {
        id: "lumpsum",
        question: "Is a SIP better than investing a lump sum?",
        answer:
          "They answer different questions. A lump sum invested at the start of a rising period wins arithmetically; a SIP spreads entry price and removes the need to time the market. A SIP suits money that arrives monthly.",
      },
      {
        id: "duration",
        question: "How long should I run a SIP?",
        answer:
          "Long enough for compounding to dominate contributions, which typically takes seven to ten years in equity. Short horizons expose the investment to market cycles without time to recover from a poor stretch.",
      },
      {
        id: "tax",
        question: "How are SIP gains taxed in India?",
        answer:
          "Each instalment is treated as a separate purchase with its own holding period. Equity gains held over a year fall under long-term capital gains rules; shorter holdings are taxed at the short-term rate. Confirm current rates with a tax adviser.",
      },
      {
        id: "stop",
        question: "What happens if I stop a SIP midway?",
        answer:
          "The units already bought stay invested and continue to grow, but no further instalments are added. Stopping during a downturn locks in the lower average and forfeits the units the remaining instalments would have bought cheaply.",
      },
      {
        id: "privacy",
        question: "Is my investment amount recorded?",
        answer:
          "No. The projection runs in your browser as arithmetic. Nothing about your instalment, horizon or assumed return is transmitted or stored anywhere.",
      },
    ],
    disclaimer:
      "This is a projection tool, not investment advice. Mutual fund investments are subject to market risk; returns are not guaranteed and can be negative.",
    relatedSlugs: ["swp-calculator", "compound-interest-calculator", "retirement-calculator"],
  },

  "swp-calculator": {
    slug: "swp-calculator",
    group: "finance",
    name: "SWP Calculator",
    title: "SWP Calculator — How Long Will My Corpus Last",
    description:
      "Work out how long a corpus lasts under regular withdrawals, or what you can safely withdraw. Simulated month by month, with an annual step-up option.",
    h1: "SWP Calculator",
    primaryQuestion: "How long will my money last if I withdraw monthly?",
    quickAnswer:
      "A corpus lasts indefinitely while withdrawals stay below the growth it earns. ₹1 crore at 8% earning ₹66,667 a month supports a ₹50,000 withdrawal forever, but a ₹1,00,000 withdrawal exhausts it in about 14 years.",
    term: "SWP",
    termDefinition:
      "A systematic withdrawal plan is an arrangement to redeem a fixed amount from an investment at regular intervals, typically to generate income from a lump sum.",
    formula:
      "Balance(next) = (Balance + Balance × i) − Withdrawal, applied month by month",
    variables: [
      { symbol: "i", meaning: "Monthly return — annual rate ÷ 12 ÷ 100" },
      { symbol: "Withdrawal", meaning: "Amount redeemed each month" },
    ],
    workedExample: {
      scenario: "₹1,00,00,000 at 8% a year, withdrawing ₹1,00,000 a month",
      inputs: [
        { label: "Corpus", value: "₹1,00,00,000" },
        { label: "Annual return", value: "8%" },
        { label: "Monthly return (i)", value: "0.6667%" },
        { label: "Monthly withdrawal", value: "₹1,00,000" },
      ],
      working: [
        "Month 1 growth: 1,00,00,000 × 0.006667 = ₹66,667",
        "Month 1 close: 1,00,00,000 + 66,667 − 1,00,000 = ₹99,66,667",
        "The shortfall of ₹33,333 compounds as the balance shrinks",
        "Simulated forward month by month until the balance hits zero",
      ],
      result: "The corpus is exhausted after about 166 months — roughly 13 years 10 months.",
    },
    intro:
      "An SWP calculator answers how long an invested lump sum survives a regular withdrawal, or how much can be taken without depleting it. There is no closed-form answer to the question people actually ask — whether the money runs out and when — so this simulates every month, crediting growth before the redemption, which is how a fund house processes it.",
    iconName: "Banknote",
    applicationCategory: "FinanceApplication",
    features: [
      "Month-by-month simulation rather than a formula approximation",
      "Tells you the month the corpus runs out",
      "Annual step-up to keep pace with inflation",
      "Sustainable-withdrawal mode",
      "Full withdrawal schedule",
    ],
    steps: [
      {
        name: "Enter your corpus",
        text: "Put in the invested amount you will draw from. This is the balance at the moment withdrawals begin.",
      },
      {
        name: "Set the withdrawal",
        text: "Enter the monthly amount you need. Compare it against the monthly growth shown — withdrawing less than that keeps the corpus intact indefinitely.",
      },
      {
        name: "Add an annual increase",
        text: "Set a step-up percentage so the withdrawal keeps pace with rising costs. A flat withdrawal loses purchasing power every year.",
      },
      {
        name: "Read the depletion month",
        text: "The result states either that the corpus survives the period or the exact month it runs out, along with the balance remaining.",
      },
    ],
    examples: [
      {
        title: "Sustainable withdrawal",
        input: "₹1 crore at 8%, ₹50,000/month",
        output: "Never exhausted · balance grows",
        explanation:
          "Monthly growth is ₹66,667 against a ₹50,000 withdrawal, so the surplus is reinvested and the corpus keeps rising.",
      },
      {
        title: "Depleting withdrawal",
        input: "₹1 crore at 8%, ₹1,00,000/month",
        output: "Exhausted after 166 months",
        explanation:
          "Withdrawing more than the corpus earns eats principal, and the shortfall accelerates as the balance — and so the growth — falls.",
      },
      {
        title: "With an inflation step-up",
        input: "₹1 crore at 8%, ₹50,000/month, +6% a year",
        output: "Exhausted after about 22 years",
        explanation:
          "A withdrawal that was comfortably sustainable becomes unsustainable once it rises annually, which is why flat-withdrawal projections mislead.",
      },
    ],
    benefits: [
      {
        title: "Answers the real question",
        description:
          "Simulating month by month reveals exactly when the money runs out — something a closed-form formula cannot express.",
      },
      {
        title: "The sustainability threshold",
        description:
          "Shows the monthly growth alongside the withdrawal, making it immediately clear whether you are living off returns or eating principal.",
      },
      {
        title: "Inflation-aware",
        description:
          "The step-up option models a withdrawal that rises over time, which is the realistic case and usually changes the conclusion.",
      },
      {
        title: "Private",
        description: "Your corpus and income needs never leave your browser.",
      },
    ],
    limitations: [
      "Assumes a constant monthly return. Real returns fluctuate, and a poor sequence early in retirement depletes a corpus far faster than the average suggests.",
      "Capital gains tax on each redemption is not deducted, so the net amount received will be lower.",
      "Exit loads within the first year of investment are not modelled.",
      "Sequence-of-returns risk is the main danger in withdrawal planning and cannot be captured by a fixed-rate simulation.",
    ],
    keyTakeaways: [
      "A corpus survives indefinitely while withdrawals stay under the growth earned.",
      "₹1 crore at 8% earns ₹66,667 a month — that is the sustainability line.",
      "Withdrawing ₹1,00,000 a month from ₹1 crore exhausts it in about 14 years.",
      "Adding an inflation step-up can turn a sustainable plan into a depleting one.",
      "Sequence of returns matters more than the average return.",
    ],
    faqs: [
      {
        id: "how-long",
        question: "How long will my corpus last?",
        answer:
          "It depends on whether the withdrawal exceeds the growth. ₹1 crore at 8% earns about ₹66,667 a month; withdrawing less preserves it indefinitely, while ₹1,00,000 a month exhausts it in roughly 166 months.",
      },
      {
        id: "safe-rate",
        question: "What is a safe withdrawal rate?",
        answer:
          "The often-quoted figure is 4% a year, derived from US market history over 30-year retirements. It is a rule of thumb, not a guarantee, and assumes a particular asset mix and country's return history.",
      },
      {
        id: "sequence",
        question: "Why do advisers warn about sequence of returns?",
        answer:
          "Two portfolios with identical average returns can end very differently depending on when the bad years fall. Poor returns early, while withdrawals are being taken, permanently reduce the capital available to recover.",
      },
      {
        id: "step-up",
        question: "Should my withdrawal rise each year?",
        answer:
          "If it funds living costs, yes — a flat withdrawal loses purchasing power every year. At 6% inflation, ₹50,000 today buys what ₹27,919 buys in fifteen years, so a flat plan quietly becomes inadequate.",
      },
      {
        id: "vs-fd",
        question: "How does an SWP compare with fixed deposit interest?",
        answer:
          "An SWP redeems units, so part of each withdrawal is your own capital and only the gain is taxed. Fixed deposit interest is taxed in full as income. The treatment differs materially at higher withdrawal levels.",
      },
      {
        id: "timing",
        question: "When is growth credited relative to the withdrawal?",
        answer:
          "This calculator credits the month's growth first and then takes the redemption, which matches how fund houses process it. Reversing the order slightly shortens the projected lifespan.",
      },
      {
        id: "market-fall",
        question: "What happens if the market falls?",
        answer:
          "Withdrawals redeem more units at lower prices, permanently reducing the unit count. This is why withdrawing during a downturn is damaging and why a cash buffer for lean years is commonly recommended.",
      },
      {
        id: "restart",
        question: "Can I pause an SWP?",
        answer:
          "Yes, most fund houses allow it. Pausing during a market fall preserves units, though it requires an alternative income source for that period. The remaining balance continues to grow while paused.",
      },
      {
        id: "privacy",
        question: "Is my corpus figure stored anywhere?",
        answer:
          "No. The whole simulation runs in your browser. Nothing about your savings or income needs is transmitted, and closing the tab discards everything.",
      },
    ],
    disclaimer:
      "This is a projection tool, not financial advice. Withdrawal planning depends on tax, asset mix and market conditions; consult a qualified adviser before relying on any figure.",
    relatedSlugs: ["sip-calculator", "retirement-calculator", "compound-interest-calculator"],
  },

  "roi-calculator": {
    slug: "roi-calculator",
    group: "finance",
    name: "ROI Calculator",
    title: "ROI Calculator — Return on Investment & CAGR",
    description:
      "Calculate return on investment as a percentage and the annualised CAGR. Simple ROI ignores time — both figures are shown side by side.",
    h1: "ROI Calculator",
    primaryQuestion: "How do you calculate return on investment?",
    quickAnswer:
      "ROI = (gain ÷ cost) × 100. An investment of £10,000 returning £15,000 gives a 50% ROI. Over three years that is a 14.47% compound annual growth rate — the figure to use when comparing investments held for different periods.",
    term: "ROI",
    termDefinition:
      "Return on investment is the gain or loss on an investment expressed as a percentage of the amount invested, without reference to how long the investment was held.",
    formula: "ROI = ((Final − Initial) / Initial) × 100   ·   CAGR = ((Final/Initial)^(1/years) − 1) × 100",
    variables: [
      { symbol: "Initial", meaning: "Amount invested" },
      { symbol: "Final", meaning: "Value returned" },
      { symbol: "years", meaning: "Holding period, for the annualised figure" },
    ],
    workedExample: {
      scenario: "£10,000 invested, worth £15,000 after 3 years",
      inputs: [
        { label: "Initial", value: "£10,000" },
        { label: "Final", value: "£15,000" },
        { label: "Period", value: "3 years" },
      ],
      working: [
        "Gain = 15,000 − 10,000 = £5,000",
        "ROI = (5,000 ÷ 10,000) × 100 = 50%",
        "CAGR = ((15,000 ÷ 10,000)^(1/3) − 1) × 100",
        "= (1.5^0.3333 − 1) × 100 = (1.14471 − 1) × 100",
      ],
      result: "ROI 50%, CAGR 14.47% a year.",
    },
    intro:
      "An ROI calculator expresses a gain as a percentage of what was invested. Its weakness is that it ignores time entirely — a 50% return looks identical whether it took one year or ten. The annualised figure, CAGR, is what makes two investments comparable, so both are shown together here rather than leaving the more useful one out.",
    iconName: "TrendingUp",
    applicationCategory: "FinanceApplication",
    features: [
      "Simple ROI as a percentage",
      "Annualised CAGR for period-adjusted comparison",
      "Absolute gain or loss in currency",
      "Handles losses without breaking",
      "Works for any currency",
    ],
    steps: [
      {
        name: "Enter what you invested",
        text: "Put in the total cost, including fees and commissions where they apply — leaving them out overstates the return.",
      },
      {
        name: "Enter what it returned",
        text: "Put in the final value or sale proceeds, after selling costs. For an ongoing investment, use the current value.",
      },
      {
        name: "Add the holding period",
        text: "Enter how long you held it. This unlocks the annualised figure, which is the only fair basis for comparing investments of different lengths.",
      },
      {
        name: "Compare the two numbers",
        text: "Use ROI to describe the total outcome and CAGR to compare against other opportunities or a benchmark rate.",
      },
    ],
    examples: [
      {
        title: "A three-year holding",
        input: "£10,000 → £15,000 over 3 years",
        output: "ROI 50% · CAGR 14.47%",
        explanation:
          "The headline 50% sounds better than it is. The annualised 14.47% is the number that compares against a savings rate or an index.",
      },
      {
        title: "Same ROI, different period",
        input: "£10,000 → £15,000 over 10 years",
        output: "ROI 50% · CAGR 4.14%",
        explanation:
          "Identical ROI, very different investment. Over ten years, 4.14% a year barely beats inflation — which simple ROI completely hides.",
      },
      {
        title: "A loss",
        input: "£10,000 → £7,500 over 2 years",
        output: "ROI −25% · CAGR −13.40%",
        explanation:
          "Losses annualise too. A 25% fall over two years is a 13.4% annual decline, not 12.5%, because the losses compound.",
      },
    ],
    benefits: [
      {
        title: "Time-adjusted comparison",
        description:
          "CAGR sits alongside ROI, so a return spread over ten years is never mistaken for the same return earned in one.",
      },
      {
        title: "Honest about losses",
        description:
          "Negative returns are annualised correctly rather than divided evenly, which understates the rate of decline.",
      },
      {
        title: "Simple inputs",
        description:
          "Three numbers give both figures. No account, no sign-up and no assumptions hidden behind the result.",
      },
      {
        title: "Nothing transmitted",
        description: "Portfolio figures stay in your browser.",
      },
    ],
    limitations: [
      "Ignores cash flows during the holding period. If you added or withdrew money, use an internal rate of return instead.",
      "Does not adjust for risk. A 15% return from a volatile asset is not equivalent to 15% from a stable one.",
      "Excludes tax, which can materially reduce the realised return depending on the asset and jurisdiction.",
      "CAGR describes a smooth average path that no real investment follows; it says nothing about volatility along the way.",
    ],
    keyTakeaways: [
      "ROI = ((Final − Initial) / Initial) × 100.",
      "CAGR = ((Final/Initial)^(1/years) − 1) × 100.",
      "A 50% ROI is 14.47% a year over three years but only 4.14% over ten.",
      "Always compare investments using the annualised figure.",
      "Neither figure adjusts for risk or interim cash flows.",
    ],
    faqs: [
      {
        id: "formula",
        question: "What is the ROI formula?",
        answer:
          "ROI = ((Final value − Initial cost) / Initial cost) × 100. An investment of £10,000 returning £15,000 gives ((15,000 − 10,000) / 10,000) × 100, which is 50%.",
      },
      {
        id: "cagr",
        question: "What is the difference between ROI and CAGR?",
        answer:
          "ROI is the total return regardless of time; CAGR converts it to a yearly rate. A 50% ROI is 14.47% a year over three years and 4.14% over ten — the same ROI describing two very different investments.",
      },
      {
        id: "good-roi",
        question: "What counts as a good ROI?",
        answer:
          "Only in comparison. Judge it against a risk-free rate, inflation and a relevant index over the same period. A 6% annual return is strong when inflation is 2% and weak when it is 8%.",
      },
      {
        id: "fees",
        question: "Should I include fees?",
        answer:
          "Yes, on both sides. Add purchase costs to the initial amount and subtract selling costs from the final value. Excluding them can overstate returns by several percentage points on smaller investments.",
      },
      {
        id: "negative",
        question: "How is a negative return annualised?",
        answer:
          "By the same compounding formula. A fall from £10,000 to £7,500 over two years is −13.40% a year, not −12.5%, because each year's decline applies to the reduced balance.",
      },
      {
        id: "cash-flows",
        question: "What if I invested more money along the way?",
        answer:
          "ROI and CAGR both assume a single investment and a single exit. With deposits or withdrawals in between you need money-weighted return — the internal rate of return — which accounts for the timing of each flow.",
      },
      {
        id: "annualise-short",
        question: "Can I annualise a return from a few months?",
        answer:
          "Arithmetically yes, but it is usually misleading. Projecting a strong three-month result to a yearly figure assumes the conditions persist, which is rarely a safe assumption.",
      },
      {
        id: "property",
        question: "Does this work for property or business returns?",
        answer:
          "The formula applies to any investment. For property, include stamp duty, legal fees and maintenance in the cost, and rental income in the return, or the figure will flatter substantially.",
      },
      {
        id: "privacy",
        question: "Are my investment figures uploaded?",
        answer:
          "No. Both calculations are arithmetic performed in the page. Nothing about what you invested or what it returned is sent to a server or retained.",
      },
    ],
    disclaimer:
      "This calculator performs arithmetic and is not investment advice. Past returns do not indicate future performance.",
    relatedSlugs: ["profit-margin-calculator", "compound-interest-calculator", "break-even-calculator"],
  },

  "profit-margin-calculator": {
    slug: "profit-margin-calculator",
    group: "finance",
    name: "Profit Margin Calculator",
    title: "Profit Margin Calculator — Margin vs Markup",
    description:
      "Calculate profit margin and markup from cost and price. The two are routinely confused — a 60% margin is a 150% markup, and both are shown.",
    h1: "Profit Margin Calculator",
    primaryQuestion: "What is the difference between margin and markup?",
    quickAnswer:
      "Margin is profit as a percentage of the selling price; markup is profit as a percentage of cost. An item costing £40 and sold for £100 carries a 60% margin but a 150% markup. Quoting markup as margin overstates profitability substantially.",
    term: "Profit margin",
    termDefinition:
      "Profit margin is the proportion of revenue remaining after costs, expressed as a percentage of the selling price rather than of the cost.",
    formula: "Margin % = (Profit / Revenue) × 100   ·   Markup % = (Profit / Cost) × 100",
    variables: [
      { symbol: "Profit", meaning: "Revenue minus cost" },
      { symbol: "Revenue", meaning: "Selling price" },
      { symbol: "Cost", meaning: "What the item cost you" },
    ],
    workedExample: {
      scenario: "An item costing £40, sold for £100",
      inputs: [
        { label: "Cost", value: "£40" },
        { label: "Selling price", value: "£100" },
      ],
      working: [
        "Profit = 100 − 40 = £60",
        "Margin = (60 ÷ 100) × 100 = 60%",
        "Markup = (60 ÷ 40) × 100 = 150%",
      ],
      result: "60% margin, 150% markup — the same £60 profit described two ways.",
    },
    intro:
      "A profit margin calculator converts cost and price into the percentages a business runs on. The reason it matters that both are shown is that margin and markup are constantly mistaken for one another: a supplier quoting a 50% markup is offering a 33% margin, and pricing a product as though those are the same erodes profit on every unit sold.",
    iconName: "Percent",
    applicationCategory: "BusinessApplication",
    features: [
      "Margin and markup side by side",
      "Reverse calculation — price from a target margin",
      "Absolute profit per unit",
      "Works with any currency",
      "Handles a loss without breaking",
    ],
    steps: [
      {
        name: "Enter your cost",
        text: "Put in what the item costs you, including anything variable that scales per unit — materials, packaging, payment fees.",
      },
      {
        name: "Enter the selling price",
        text: "Put in what the customer pays, excluding sales tax. Including tax overstates both margin and markup.",
      },
      {
        name: "Read both percentages",
        text: "Margin is the share of the price you keep; markup is how much you added to cost. Markup is always the larger number.",
      },
      {
        name: "Work backwards if needed",
        text: "Enter a target margin instead to find the price you must charge to achieve it.",
      },
    ],
    examples: [
      {
        title: "Retail pricing",
        input: "Cost £40, price £100",
        output: "Margin 60% · markup 150%",
        explanation:
          "The same £60 profit. Describing it as a 150% markup sounds far better than 60% margin, which is why the two are confused so often.",
      },
      {
        title: "The 50% trap",
        input: "Cost £50, markup 50%",
        output: "Price £75 · margin 33.3%",
        explanation:
          "Applying a 50% markup does not give a 50% margin. Businesses that conflate them consistently price too low.",
      },
      {
        title: "Target margin",
        input: "Cost £40, target margin 50%",
        output: "Price £80",
        explanation:
          "To achieve a 50% margin the price must be double the cost, which corresponds to a 100% markup.",
      },
    ],
    referenceTable: {
      caption: "Markup needed for a given margin",
      columns: ["Target margin", "Required markup", "Price on £100 cost"],
      rows: [
        ["10%", "11.1%", "£111"],
        ["20%", "25.0%", "£125"],
        ["30%", "42.9%", "£143"],
        ["40%", "66.7%", "£167"],
        ["50%", "100.0%", "£200"],
        ["60%", "150.0%", "£250"],
      ],
    },
    benefits: [
      {
        title: "Both numbers, always",
        description:
          "Showing margin and markup together removes the single most common pricing error in small business.",
      },
      {
        title: "Reverse pricing",
        description:
          "Enter the margin you need and get the price, rather than guessing a markup and discovering the margin afterwards.",
      },
      {
        title: "A conversion table",
        description:
          "The reference table maps target margins to the markup required, which is the lookup most pricing decisions actually need.",
      },
      {
        title: "Private",
        description: "Cost and pricing data never leaves your browser.",
      },
    ],
    limitations: [
      "This is gross margin only. Overheads, salaries and rent are not deducted, so net margin will be lower.",
      "Assumes a single unit. Volume discounts, returns and shrinkage all change the realised margin.",
      "Sales tax must be excluded from the price, or both percentages will be overstated.",
      "Does not account for the cost of holding stock, which matters for slow-moving inventory.",
    ],
    keyTakeaways: [
      "Margin = profit ÷ price. Markup = profit ÷ cost.",
      "A 60% margin is a 150% markup — the same profit, two descriptions.",
      "A 50% markup gives only a 33.3% margin.",
      "To hit a 50% margin, price at double the cost.",
      "Markup is always the larger of the two percentages.",
    ],
    faqs: [
      {
        id: "difference",
        question: "What is the difference between margin and markup?",
        answer:
          "Margin measures profit against the selling price; markup measures it against cost. On an item costing £40 sold at £100, the margin is 60% and the markup 150%. Markup is always larger for a profitable sale.",
      },
      {
        id: "which",
        question: "Which should I use for pricing?",
        answer:
          "Use markup to set the price from a known cost, and margin to judge profitability and compare with competitors or industry benchmarks. Financial statements report margin, not markup.",
      },
      {
        id: "convert",
        question: "How do I convert markup to margin?",
        answer:
          "Margin = markup ÷ (1 + markup), with both as decimals. A 50% markup gives 0.5 ÷ 1.5 = 0.333, so a 33.3% margin. To go the other way, markup = margin ÷ (1 − margin).",
      },
      {
        id: "good-margin",
        question: "What is a good profit margin?",
        answer:
          "It varies enormously by sector. Grocery retail runs on 1–3% net, software often exceeds 70% gross, and restaurants typically sit at 3–9% net. Compare only against your own industry.",
      },
      {
        id: "gross-net",
        question: "Is this gross or net margin?",
        answer:
          "Gross. It covers direct costs only. Net margin additionally deducts overheads, salaries, rent, marketing and tax, and is always lower — often substantially.",
      },
      {
        id: "hundred",
        question: "Can margin exceed 100%?",
        answer:
          "No. Margin is profit as a share of price, so it approaches but never reaches 100%, which would mean zero cost. Markup has no such ceiling and can be many hundred per cent.",
      },
      {
        id: "loss",
        question: "What if I sell below cost?",
        answer:
          "Both figures turn negative. Selling a £40 item for £30 gives a −33.3% margin and a −25% markup. This is a loss leader, sometimes deliberate, but it must be intentional rather than accidental.",
      },
      {
        id: "tax",
        question: "Should VAT or sales tax be included in the price?",
        answer:
          "No. Tax is collected on behalf of the government and is not revenue, so including it inflates both percentages. Use the price excluding tax on both sides.",
      },
      {
        id: "privacy",
        question: "Is my cost data sent anywhere?",
        answer:
          "No. The arithmetic runs in your browser. Supplier costs and pricing strategy are commercially sensitive, and neither is transmitted, stored or logged.",
      },
    ],
    relatedSlugs: ["break-even-calculator", "roi-calculator", "net-worth-calculator"],
  },
};
