export interface PurchaseOrder {
  id: string
  smeName: string
  buyerName: string // e.g. Transnet, Eskom, Department of Health
  poValue: number // Value in Rand
  supplierQuote: number // Supplier quotation in Rand
  daysToRepayment: number // e.g. 30, 45, 60, 90 days
  status: 'Open' | 'Fully Funded' | 'Vetted' | 'Pending Approval'
  sector: 'Logistics' | 'Construction' | 'ICT' | 'Manufacturing' | 'Healthcare' | 'Agriculture'
  dateAdded: string
  verifiedByPOPIA: boolean
  bidsCount: number
}

export interface FunderBid {
  id: string
  poId: string
  funderName: string
  bidAmount: number
  rateOffer: number // percentage return
  timestamp: string
}

export interface SMEApplication {
  companyName: string
  registrationNumber: string
  industry: string
  buyerName: string
  poValue: number
  supplierQuote: number
  durationDays: number
}
