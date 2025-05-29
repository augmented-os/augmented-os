import { TaskDetail } from '../types';

/**
 * Sample task details for testing and development
 */
export const sampleTaskDetails: TaskDetail = {
  company: "ABC Ventures",
  valuation: "$12M pre-money",
  investment: "$2M",
  equity: "16.7%",
  documents: ["Term Sheet - May 12, 2025.pdf"],
  extractedTerms: [
    { term: "Liquidation Preference", value: "2x", standard: "1x", flag: true },
    { term: "Board Seats", value: "3 Investor, 2 Founders", standard: "1 Investor, 2 Founders", flag: true },
    { term: "Vesting Schedule", value: "4 years, no cliff", standard: "4 years, 1 year cliff", flag: true },
    { term: "Option Pool", value: "10%", standard: "10%", flag: false },
    { term: "Pro-rata Rights", value: "Yes", standard: "Yes", flag: false },
    { term: "Dividends", value: "8% non-cumulative", standard: "Non-cumulative", flag: true }
  ]
}; 