import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/YC/YC Application',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Y Combinator Application Process

Startup accelerator application workflow from initial submission through acceptance.
Demonstrates venture funding processes, startup evaluation, and accelerator workflows.

**Application Stages:**
- Application Submitted - Initial YC application
- Under Review - Application being evaluated
- Interview Invited - Selected for interview round
- Accepted - Accepted into YC batch
- Rejected - Application declined
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

// YC application schema
const ycApplicationSchema: UIComponentSchema = {
  componentId: 'yc-application-demo',
  name: 'YC Application',
  componentType: 'Display',
  title: '{{companyName}} - YC {{batch}} Application',
  customProps: {
    displayType: 'card',
    fields: [
      { key: 'founders', label: 'Founders' },
      { key: 'industry', label: 'Industry' },
      { key: 'stage', label: 'Company Stage' },
      { key: 'mrr', label: 'Monthly Revenue' },
      { key: 'users', label: 'Active Users' },
      { key: 'submissionDate', label: 'Submitted' },
      { key: 'lastActivity', label: 'Last Activity' },
      { key: 'status', label: 'Application Status' },
      { key: 'nextSteps', label: 'Next Steps' }
    ],
    layout: 'grid'
  },
  actions: [
    { actionKey: 'review_application', label: 'Review Application', style: 'secondary' },
    { actionKey: 'request_demo', label: 'Request Demo', style: 'secondary' },
    { actionKey: 'schedule_interview', label: 'Schedule Interview', style: 'primary', visibleIf: 'status == "under_review"' },
    { actionKey: 'accept', label: 'Accept', style: 'primary', visibleIf: 'status == "interviewed"' },
    { actionKey: 'reject', label: 'Decline', style: 'danger', visibleIf: 'status == "under_review" || status == "interviewed"' }
  ]
};

export const ApplicationSubmitted: Story = {
  name: 'Application Submitted',
  args: {
    schema: ycApplicationSchema,
    data: {
      companyName: 'FlowAI',
      batch: 'W25',
      founders: 'Sarah Chen (CEO), Mark Thompson (CTO)',
      industry: 'B2B SaaS / AI',
      stage: 'Pre-seed with MVP',
      mrr: '$8,400',
      users: '1,247 active users',
      submissionDate: 'Oct 15, 2024',
      lastActivity: 'Application submitted',
      status: 'submitted',
      nextSteps: 'Awaiting initial review'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Startup application submitted for Y Combinator batch evaluation.'
      }
    }
  }
};

export const UnderReview: Story = {
  name: 'Under Review',
  args: {
    schema: ycApplicationSchema,
    data: {
      companyName: 'FlowAI',
      batch: 'W25',
      founders: 'Sarah Chen (CEO), Mark Thompson (CTO)',
      industry: 'B2B SaaS / AI',
      stage: 'Pre-seed with MVP',
      mrr: '$8,400 (+15% MoM)',
      users: '1,247 active users',
      submissionDate: 'Oct 15, 2024',
      lastActivity: 'Partner review in progress',
      status: 'under_review',
      nextSteps: 'Partners evaluating application'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Application under review by YC partners for potential interview invitation.'
      }
    }
  }
};

export const InterviewInvited: Story = {
  name: 'Interview Invited',
  args: {
    schema: {
      ...ycApplicationSchema,
      actions: [
        { actionKey: 'view_interview_details', label: 'Interview Details', style: 'primary' },
        { actionKey: 'reschedule', label: 'Reschedule', style: 'secondary' },
        { actionKey: 'preparation_materials', label: 'Prep Materials', style: 'secondary' }
      ]
    },
    data: {
      companyName: 'FlowAI',
      batch: 'W25',
      founders: 'Sarah Chen (CEO), Mark Thompson (CTO)',
      industry: 'B2B SaaS / AI',
      stage: 'Pre-seed with MVP',
      mrr: '$8,400 (+15% MoM)',
      users: '1,247 active users',
      submissionDate: 'Oct 15, 2024',
      lastActivity: 'Interview scheduled for Nov 5',
      status: 'interview_invited',
      nextSteps: 'Prepare for 10-minute partner interview'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Startup invited for YC partner interview - a crucial step in the selection process.'
      }
    }
  }
};

export const Accepted: Story = {
  name: 'Accepted into YC',
  args: {
    schema: {
      ...ycApplicationSchema,
      actions: [
        { actionKey: 'view_acceptance_letter', label: 'Acceptance Letter', style: 'primary' },
        { actionKey: 'accept_offer', label: 'Accept Offer', style: 'primary' },
        { actionKey: 'batch_onboarding', label: 'Batch Onboarding', style: 'secondary' },
        { actionKey: 'connect_founders', label: 'Connect with Batch', style: 'secondary' }
      ]
    },
    data: {
      companyName: 'FlowAI',
      batch: 'W25',
      founders: 'Sarah Chen (CEO), Mark Thompson (CTO)',
      industry: 'B2B SaaS / AI',
      stage: 'Pre-seed with MVP',
      mrr: '$8,400 (+15% MoM)',
      users: '1,247 active users',
      submissionDate: 'Oct 15, 2024',
      lastActivity: 'Accepted into YC W25!',
      status: 'accepted',
      nextSteps: 'Complete onboarding by Dec 1, 2024'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Startup successfully accepted into Y Combinator batch with onboarding next steps.'
      }
    }
  }
}; 