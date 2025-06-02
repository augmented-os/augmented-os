// Export subcomponent stories for Process Receipt workflow
// These components can be used independently or as part of the main workflow

// Receipt Details Form stories
export { 
  EditReceiptFields as ReceiptDetailsEdit,
  MatchSupplier as ReceiptDetailsMatch, 
  AssignLineItems as ReceiptDetailsAssign 
} from './ReceiptDetails.stories';

// Line Items Form stories
export { 
  EditReceiptFields as LineItemsEdit,
  MatchSupplier as LineItemsMatch,
  AssignLineItems as LineItemsAssign,
  EmptyLineItems as LineItemsEmpty
} from './LineItemsTable.stories';

// Processing History Display stories
export * from './ProcessingHistory.stories';

/*
 * Subcomponent Overview:
 * 
 * ReceiptDetails.stories.tsx - Form-based receipt details editing
 * ├── ReceiptDetailsEdit - Fully editable form for data entry
 * ├── ReceiptDetailsMatch - Form with supplier highlighting
 * └── ReceiptDetailsAssign - Read-only form during categorization
 * 
 * LineItemsTable.stories.tsx - Form-based line items editing
 * ├── LineItemsEdit - Line items editing without categories
 * ├── LineItemsMatch - Same as edit mode, no categories
 * ├── LineItemsAssign - Category assignment mode (selective editing)
 * └── LineItemsEmpty - Empty form state for new items
 * 
 * ProcessingHistory.stories.tsx - Audit trail display
 * ├── BasicWorkflow - Standard processing steps
 * ├── ApprovedWorkflow - Complete approval workflow
 * ├── RejectedWorkflow - Rejection process
 * ├── HighValueWorkflow - Multi-level approval process
 * └── EmptyHistory - No processing history available
 */ 