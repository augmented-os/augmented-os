import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/Coding/Bug Reporting',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Bug Reporting System

Bug report submission forms showing different severity levels and validation states.
Demonstrates form handling, file uploads, and validation workflows.

**Scenarios Include:**
- New Bug Report - Clean form ready for input
- Critical Bug - High priority issue reporting
- Bug with Attachments - Including screenshots and logs
- Validation Errors - Form with validation issues
        `
      }
    }
  },
  argTypes: {
    onSubmit: { action: 'submitted' },
    onCancel: { action: 'cancelled' },
    onAction: { action: 'action triggered' },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicUIRenderer>;

// Base bug report schema
const bugReportSchema: UIComponentSchema = {
  componentId: 'bug-report-form',
  name: 'Bug Report',
  componentType: 'Form',
  title: 'Report a Bug',
  description: 'Help us improve by reporting issues you encounter',
  fields: [
    {
      fieldKey: 'title',
      label: 'Bug Title',
      type: 'text',
      required: true,
      placeholder: 'Brief description of the issue'
    },
    {
      fieldKey: 'severity',
      label: 'Severity',
      type: 'select',
      required: true,
      options: [
        { value: 'critical', label: 'Critical - System Down' },
        { value: 'high', label: 'High - Major Feature Broken' },
        { value: 'medium', label: 'Medium - Minor Feature Issue' },
        { value: 'low', label: 'Low - Cosmetic/Enhancement' }
      ]
    },
    {
      fieldKey: 'environment',
      label: 'Environment',
      type: 'select',
      required: true,
      options: [
        { value: 'production', label: 'Production' },
        { value: 'staging', label: 'Staging' },
        { value: 'development', label: 'Development' },
        { value: 'local', label: 'Local Development' }
      ]
    },
    {
      fieldKey: 'stepsToReproduce',
      label: 'Steps to Reproduce',
      type: 'textarea',
      required: true,
      placeholder: '1. Navigate to...\n2. Click on...\n3. Observe that...'
    },
    {
      fieldKey: 'expectedBehavior',
      label: 'Expected Behavior',
      type: 'textarea',
      required: true,
      placeholder: 'What should have happened?'
    },
    {
      fieldKey: 'actualBehavior',
      label: 'Actual Behavior',
      type: 'textarea',
      required: true,
      placeholder: 'What actually happened?'
    },
    {
      fieldKey: 'browserInfo',
      label: 'Browser/Device Info',
      type: 'text',
      placeholder: 'Chrome 119, Safari 17, iPhone 14, etc.'
    },
    {
      fieldKey: 'screenshots',
      label: 'Screenshots/Logs',
      type: 'file',
      customProps: {
        accept: 'image/*,.txt,.log',
        multiple: true
      },
      helpText: 'Upload screenshots, error logs, or console output'
    }
  ],
  actions: [
    { actionKey: 'submit', label: 'Submit Bug Report', style: 'primary' },
    { actionKey: 'save_draft', label: 'Save Draft', style: 'secondary' },
    { actionKey: 'cancel', label: 'Cancel', style: 'secondary' }
  ]
};

export const NewBugReport: Story = {
  name: 'New Bug Report',
  args: {
    schema: bugReportSchema,
    initialData: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'A clean bug report form ready for user input.'
      }
    }
  }
};

export const CriticalBug: Story = {
  name: 'Critical Bug - System Down',
  args: {
    schema: bugReportSchema,
    initialData: {
      title: 'Payment processing completely broken',
      severity: 'critical',
      environment: 'production',
      stepsToReproduce: '1. Go to checkout page\n2. Enter payment details\n3. Click "Complete Purchase"\n4. System shows 500 error',
      expectedBehavior: 'Payment should process successfully and redirect to confirmation page',
      actualBehavior: 'Server returns 500 Internal Server Error and no payment is processed',
      browserInfo: 'Chrome 119.0.6045.199, Windows 11'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'A critical bug report for a system-down scenario affecting payments.'
      }
    }
  }
};

export const BugWithAttachments: Story = {
  name: 'Bug Report with Attachments',
  args: {
    schema: bugReportSchema,
    initialData: {
      title: 'UI layout broken on mobile devices',
      severity: 'medium',
      environment: 'production',
      stepsToReproduce: '1. Open app on mobile device\n2. Navigate to dashboard\n3. Observe layout issues',
      expectedBehavior: 'Dashboard should display properly on mobile with responsive layout',
      actualBehavior: 'Elements overlap and text is cut off on smaller screens',
      browserInfo: 'Safari iOS 17.1, iPhone 14 Pro'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'A bug report with screenshots and supporting documentation attached.'
      }
    }
  }
};

export const ValidationErrors: Story = {
  name: 'Form with Validation Errors',
  args: {
    schema: {
      ...bugReportSchema,
      fields: bugReportSchema.fields.map(field => ({
        ...field,
        validationErrors: field.required ? ['This field is required'] : undefined,
        hasError: field.required
      }))
    },
    initialData: {
      title: '',
      severity: '',
      environment: ''
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Bug report form showing validation errors for required fields.'
      }
    }
  }
}; 