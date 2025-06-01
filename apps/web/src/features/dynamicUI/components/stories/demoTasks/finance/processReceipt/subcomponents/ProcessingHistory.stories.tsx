import type { Meta, StoryObj } from '@storybook/react';
import { DynamicDisplay } from '../../../../../DynamicDisplay';
import { UIComponentSchema } from '../../../../../../types/schemas';

const meta: Meta<typeof DynamicDisplay> = {
  title: 'Demo Tasks/Finance/Process Receipt/Subcomponents/Processing History',
  component: DynamicDisplay,
  parameters: {
    docs: {
      description: {
        component: `
# Processing History Component

Displays the audit trail and processing history for receipt workflows.

**Features:**
- Chronological activity log
- User actions and timestamps
- Status changes tracking
- Comments and notes
- Approval workflow stages

**Use Cases:**
- Audit compliance
- Workflow transparency
- Process debugging
- Performance tracking
- Approval tracking
        `
      }
    },
    layout: 'padded'
  },
  argTypes: {
    onAction: { action: 'action triggered' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DynamicDisplay>;

const processingHistorySchema: UIComponentSchema = {
  componentId: 'processing-history',
  name: 'Processing History',
  componentType: 'Display',
  title: 'Processing History',
  customProps: {
    displayType: 'table',
    dataKey: 'historyItems',
    columns: [
      { key: 'timestamp', label: 'Date/Time' },
      { key: 'action', label: 'Action' },
      { key: 'user', label: 'User' },
      { key: 'status', label: 'Status' },
      { key: 'notes', label: 'Notes' }
    ]
  },
  actions: []
};

export const BasicWorkflow: Story = {
  name: 'Basic Processing Workflow',
  args: {
    schema: processingHistorySchema,
    data: {
      historyItems: [
        { 
          timestamp: '2024-01-16 09:15', 
          action: 'Receipt Submitted', 
          user: 'John Smith', 
          status: 'Submitted',
          notes: 'Receipt uploaded via mobile app'
        },
        { 
          timestamp: '2024-01-16 10:30', 
          action: 'Auto-Processing Started', 
          user: 'System', 
          status: 'Processing',
          notes: 'OCR extraction and categorization initiated'
        },
        { 
          timestamp: '2024-01-16 10:33', 
          action: 'Data Extracted', 
          user: 'System', 
          status: 'Processing',
          notes: 'Vendor, amount, and line items extracted successfully'
        },
        { 
          timestamp: '2024-01-16 14:20', 
          action: 'Review Started', 
          user: 'Sarah Johnson', 
          status: 'Under Review',
          notes: 'Receipt assigned for manual review'
        }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic processing workflow showing submission through initial review.'
      }
    }
  }
};

export const ApprovedWorkflow: Story = {
  name: 'Approved Receipt Workflow',
  args: {
    schema: processingHistorySchema,
    data: {
      historyItems: [
        { 
          timestamp: '2024-01-20 08:45', 
          action: 'Receipt Submitted', 
          user: 'Mike Davis', 
          status: 'Submitted',
          notes: 'Travel expense - client meeting'
        },
        { 
          timestamp: '2024-01-20 08:47', 
          action: 'Auto-Processing Completed', 
          user: 'System', 
          status: 'Processing',
          notes: 'All data extracted, confidence score: 96%'
        },
        { 
          timestamp: '2024-01-20 11:15', 
          action: 'Review Completed', 
          user: 'Emma Wilson', 
          status: 'Reviewed',
          notes: 'Expense policy compliant, valid business purpose'
        },
        { 
          timestamp: '2024-01-20 15:30', 
          action: 'Approved', 
          user: 'David Brown', 
          status: 'Approved',
          notes: 'Approved for reimbursement - £387.50'
        },
        { 
          timestamp: '2024-01-21 09:00', 
          action: 'Payment Initiated', 
          user: 'System', 
          status: 'Paid',
          notes: 'Bank transfer initiated to employee account'
        }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete approved workflow from submission to payment.'
      }
    }
  }
};

export const RejectedWorkflow: Story = {
  name: 'Rejected Receipt Workflow',
  args: {
    schema: processingHistorySchema,
    data: {
      historyItems: [
        { 
          timestamp: '2024-01-18 16:20', 
          action: 'Receipt Submitted', 
          user: 'Alex Wilson', 
          status: 'Submitted',
          notes: 'Personal expense claim'
        },
        { 
          timestamp: '2024-01-18 16:22', 
          action: 'Auto-Processing Completed', 
          user: 'System', 
          status: 'Processing',
          notes: 'Data extracted, flagged for review - personal vendor'
        },
        { 
          timestamp: '2024-01-19 09:30', 
          action: 'Review Started', 
          user: 'Sarah Johnson', 
          status: 'Under Review',
          notes: 'Investigating expense category and business purpose'
        },
        { 
          timestamp: '2024-01-19 11:45', 
          action: 'Rejected', 
          user: 'Sarah Johnson', 
          status: 'Rejected',
          notes: 'Personal expense not eligible for reimbursement. Policy violation.'
        },
        { 
          timestamp: '2024-01-19 14:20', 
          action: 'Employee Notified', 
          user: 'System', 
          status: 'Rejected',
          notes: 'Rejection notification sent to employee with reason'
        }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Rejected receipt workflow showing policy violation and notification.'
      }
    }
  }
};

export const HighValueWorkflow: Story = {
  name: 'High Value Receipt - Extended Approval',
  args: {
    schema: processingHistorySchema,
    data: {
      historyItems: [
        { 
          timestamp: '2024-01-20 10:15', 
          action: 'Receipt Submitted', 
          user: 'Sarah Johnson', 
          status: 'Submitted',
          notes: 'Software licenses - annual renewal'
        },
        { 
          timestamp: '2024-01-20 10:17', 
          action: 'Auto-Processing Completed', 
          user: 'System', 
          status: 'Processing',
          notes: 'High-value expense detected (£2,850.00) - routing to senior approval'
        },
        { 
          timestamp: '2024-01-20 14:30', 
          action: 'Finance Review', 
          user: 'Emma Wilson', 
          status: 'Under Review',
          notes: 'Budget allocation verified, vendor validated'
        },
        { 
          timestamp: '2024-01-20 16:45', 
          action: 'Manager Approval', 
          user: 'David Brown', 
          status: 'Manager Approved',
          notes: 'Business justification confirmed, essential software tools'
        },
        { 
          timestamp: '2024-01-21 09:30', 
          action: 'Senior Approval Required', 
          user: 'System', 
          status: 'Pending Senior Approval',
          notes: 'Amount exceeds manager threshold, routed to CFO'
        },
        { 
          timestamp: '2024-01-22 11:00', 
          action: 'Final Approval', 
          user: 'Rachel Green (CFO)', 
          status: 'Approved',
          notes: 'Strategic software investment approved'
        }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'High-value expense requiring multi-level approval process.'
      }
    }
  }
};

export const EmptyHistory: Story = {
  name: 'No Processing History',
  args: {
    schema: processingHistorySchema,
    data: {
      historyItems: []
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no processing history is available.'
      }
    }
  }
}; 