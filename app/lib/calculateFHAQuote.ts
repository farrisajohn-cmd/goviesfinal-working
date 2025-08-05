interface FHAQuoteInput {
  purchasePrice: number;
  downPaymentPercent: number;
  creditScore: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyHOA?: number;
}

interface FHAQuoteOutput {
  baseLoanAmount: number;
  ufmip: number;
  finalLoanAmount: number;
  interestRate: number;
  apr: number;
  monthlyPI: number;
  monthlyMIP: number;
  totalMonthlyPayment: number;
  interimInterest: number;
  closingCosts: number;
  cashToClose: number;
}

export function calculateFHAQuote(input: FHAQuoteInput): FHAQuoteOutput {
  const {
    purchasePrice,
    downPaymentPercent,
    creditScore,
    monthlyTaxes,
    monthlyInsurance,
    monthlyHOA = 0,
  } = input;

  // --- VALIDATIONS ---
  if (creditScore < 640) throw new Error('Minimum FICO for FHA is 640.');
  if (purchasePrice * (1 - downPaymentPercent / 100) < 75000) throw new Error('Minimum base loan is $75,000.');

  // --- PRICING TABLE (customize this as needed) ---
  let interestRate = 6.125;
  let apr = 6.528;

  if (creditScore >= 720) {
    interestRate = 6.0;
    apr = 6.4;
  } else if (creditScore < 660) {
    interestRate = 6.375;
    apr = 6.78;
  }

  // --- FHA LOGIC ---
  const baseLoanAmount = purchasePrice * (1 - downPaymentPercent / 100);
  const ufmip = baseLoanAmount * 0.0175;
  const finalLoanAmount = baseLoanAmount + ufmip;

  const monthlyPI = (finalLoanAmount * (interestRate / 100)) / 12;
  const monthlyMIP = (finalLoanAmount * 0.0055) / 12;

  const totalMonthlyPayment = monthlyPI + monthlyMIP + monthlyTaxes + monthlyInsurance + monthlyHOA;

  const interimInterest = (finalLoanAmount * (interestRate / 100) / 365) * 15;

  // --- CLOSING COSTS ---
  const boxB = 650 + 100 + 30; // appraisal, credit, flood
  const lenderTitle = finalLoanAmount * 0.0055;
  const boxC = 500 + 300 + lenderTitle; // title, survey, lender title
  const transferTax = finalLoanAmount * 0.0055;
  const boxE = 299 + transferTax;
  const boxF = monthlyInsurance * 12 + interimInterest;
  const boxG = (monthlyTaxes * 3) + (monthlyInsurance * 3);

  const totalClosingCosts =
    0 + // box a
    boxB +
    boxC +
    0 + // box d
    boxE +
    boxF +
    boxG;

  const cashToClose = (purchasePrice * (downPaymentPercent / 100)) + totalClosingCosts;

  return {
    baseLoanAmount,
    ufmip,
    finalLoanAmount,
    interestRate,
    apr,
    monthlyPI: round(monthlyPI),
    monthlyMIP: round(monthlyMIP),
    totalMonthlyPayment: round(totalMonthlyPayment),
    interimInterest: round(interimInterest),
    closingCosts: round(totalClosingCosts),
    cashToClose: round(cashToClose),
  };
}

function round(num: number) {
  return Math.round(num * 100) / 100;
}
