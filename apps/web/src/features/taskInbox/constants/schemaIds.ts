/**
 * Component ID constants for Task Inbox dynamic UI schemas
 * 
 * These IDs correspond to database-stored UI component schemas
 * that define the structure and behavior of dynamic components.
 */

/**
 * Schema ID for the task review form component
 * Used when reviewing term sheets and making decisions
 */
export const TASK_REVIEW_FORM_ID = 'task-review-form' as const;

/**
 * Schema ID for the review request form component
 * Used when requesting revisions from companies
 */
export const REVIEW_REQUEST_FORM_ID = 'review-request-form' as const;

/**
 * Schema ID for the term sheet summary display component
 * Replaces the hardcoded TaskSummaryCard component
 */
export const TERM_SHEET_SUMMARY_ID = 'term-sheet-summary' as const;

/**
 * Schema ID for the extracted terms table display component
 * Replaces the hardcoded ExtractedTermsTable component
 */
export const EXTRACTED_TERMS_TABLE_ID = 'extracted-terms-table' as const;

/**
 * Schema ID for the task action buttons display component
 * Replaces the hardcoded action buttons in TaskDetailHeader
 */
export const TASK_ACTION_BUTTONS_ID = 'task-action-buttons' as const;

/**
 * All task inbox component IDs grouped by category
 */
export const TASK_INBOX_SCHEMA_IDS = {
  forms: {
    taskReview: TASK_REVIEW_FORM_ID,
    reviewRequest: REVIEW_REQUEST_FORM_ID,
  },
  displays: {
    termSheetSummary: TERM_SHEET_SUMMARY_ID,
    extractedTermsTable: EXTRACTED_TERMS_TABLE_ID,
    taskActionButtons: TASK_ACTION_BUTTONS_ID,
  },
} as const;

/**
 * Type definitions for component IDs
 */
export type TaskInboxFormId = typeof TASK_INBOX_SCHEMA_IDS.forms[keyof typeof TASK_INBOX_SCHEMA_IDS.forms];
export type TaskInboxDisplayId = typeof TASK_INBOX_SCHEMA_IDS.displays[keyof typeof TASK_INBOX_SCHEMA_IDS.displays];
export type TaskInboxSchemaId = TaskInboxFormId | TaskInboxDisplayId; 