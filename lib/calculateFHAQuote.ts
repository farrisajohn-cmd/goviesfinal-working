export function calculateFHAQuote({
  purchasePrice,
  interestRate,
  creditScore,
  propertyType
}: {
  purchasePrice: number
  interestRate: number
  creditScore: number
  propertyType: string
}) {
  // Reject invalid scenarios
  if (creditScore < 640) return 'fha requires a minimum 640 fico.'
  if (!['single-family', 'townhome'].includes(propertyType.toLowerCase()))
    return 'only single-family homes and townhomes are eligible for fha.'
  if (purchasePrice < 75000) return 'minimum fha loan amount is $75,000.'

  const downPayment = purchasePrice * 0.035
  const baseLoan = purchasePrice - downPayment
  const ufmip = baseLoan * 0.0175
  const finalLoan = baseLoan + ufmip
  const dailyInterest = (finalLoan * (interestRate / 100)) / 365
  const interimInterest = dailyInterest * 15
  const monthlyMIP = (finalLoan * 0.0055) / 12
  const lenderTitle = finalLoan * 0.0055

  // Flat fees for now
  const creditReport = 75
  const floodCert = 20
  const survey = 375
  const transferTax = 0
  const insurancePrepaid = 1200
  const taxEscrows = 900

  const closingCosts = {
    boxA: 0,
    boxB: 0,
    boxC: 0,
    boxD: transferTax,
    boxE: lenderTitle,
    boxF: creditReport + floodCert + survey,
    boxG: insurancePrepaid + taxEscrows + interimInterest
  }

  const totalClosingCosts =
    closingCosts.boxA +
    closingCosts.boxB +
    closingCosts.boxC +
    closingCosts.boxD +
    closingCosts.boxE +
    closingCosts.boxF +
    closingCosts.boxG

  const cashToClose = downPayment + totalClosingCosts

  return `
purchase price: $${purchasePrice.toLocaleString()}
loan amount: $${baseLoan.toLocaleString()}
interest rate: ${interestRate}%
final loan amount (with ufmip): $${Math.round(finalLoan).toLocaleString()}
total monthly payment (est.): includes P&I, taxes, insurance, mip

estimated cash to close: $${Math.round(cashToClose).toLocaleString()}

closing cost breakdown:
  box a – origination charges: $0
  box b – points: $0
  box c – services you can shop for: $0
  box d – transfer taxes: $${transferTax}
  box e – title insurance (lender’s): $${Math.round(lenderTitle)}
  box f – credit, flood, survey: $${creditReport + floodCert + survey}
  box g – prepaids + escrows: $${Math.round(closingCosts.boxG)}

disclaimer: actual costs may vary. this is an estimate only.
  `.trim()
}
