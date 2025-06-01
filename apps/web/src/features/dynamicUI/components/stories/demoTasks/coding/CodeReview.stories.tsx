import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/Coding/Code Review',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Code Review Workflow

Pull request review process showing different states of the code review lifecycle.
Demonstrates how Dynamic UI handles developer workflows and collaboration tools.

**States Include:**
- Pending Review - PR awaiting initial review
- Approved - PR approved and ready to merge
- Changes Requested - PR needs modifications
- Merged - Successfully merged PR
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

// Base schema for code review
const codeReviewSchema: UIComponentSchema = {
  componentId: 'code-review-demo',
  name: 'Code Review Workflow',
  componentType: 'Display',
  title: 'Pull Request #{{prNumber}}: {{title}}',
  customProps: {
    displayType: 'card',
    fields: [
      { key: 'title', label: 'PR Title' },
      { key: 'author', label: 'Author' },
      { key: 'branch', label: 'Branch' },
      { key: 'description', label: 'Description' },
      { key: 'filesChanged', label: 'Files Changed' },
      { key: 'additions', label: 'Lines Added' },
      { key: 'deletions', label: 'Lines Deleted' },
      { key: 'reviewers', label: 'Reviewers' },
      { key: 'status', label: 'Status' }
    ],
    layout: 'grid'
  },
  actions: [
    { actionKey: 'approve', label: 'Approve', style: 'primary' },
    { actionKey: 'request_changes', label: 'Request Changes', style: 'danger' },
    { actionKey: 'comment', label: 'Add Comment', style: 'secondary' },
    { actionKey: 'merge', label: 'Merge', style: 'primary', visibleIf: 'status == "approved"' }
  ]
};

export const PendingReview: Story = {
  name: 'Pending Review',
  args: {
    schema: codeReviewSchema,
    data: {
      prNumber: '1247',
      title: 'Add authentication middleware for API routes',
      author: 'sarah.dev',
      branch: 'feature/auth-middleware',
      description: 'Implements JWT-based authentication middleware for all API endpoints. Includes rate limiting and request validation.',
      filesChanged: '12',
      additions: '+247',
      deletions: '-15',
      reviewers: 'john.smith, alice.chen',
      status: 'pending_review'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'A pull request awaiting initial review from team members.'
      }
    }
  }
};

export const Approved: Story = {
  name: 'Approved - Ready to Merge',
  args: {
    schema: codeReviewSchema,
    data: {
      prNumber: '1247',
      title: 'Add authentication middleware for API routes',
      author: 'sarah.dev',
      branch: 'feature/auth-middleware',
      description: 'Implements JWT-based authentication middleware for all API endpoints. Includes rate limiting and request validation.',
      filesChanged: '12',
      additions: '+247',
      deletions: '-15',
      reviewers: 'john.smith ✅, alice.chen ✅',
      status: 'approved'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'A pull request that has been approved by all required reviewers and is ready to merge.'
      }
    }
  }
};

export const ChangesRequested: Story = {
  name: 'Changes Requested',
  args: {
    schema: codeReviewSchema,
    data: {
      prNumber: '1247',
      title: 'Add authentication middleware for API routes',
      author: 'sarah.dev',
      branch: 'feature/auth-middleware',
      description: 'Implements JWT-based authentication middleware for all API endpoints. Includes rate limiting and request validation.',
      filesChanged: '12',
      additions: '+247',
      deletions: '-15',
      reviewers: 'john.smith ❌, alice.chen ⏳',
      status: 'changes_requested'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'A pull request where reviewers have requested changes before approval.'
      }
    }
  }
};

export const Merged: Story = {
  name: 'Successfully Merged',
  args: {
    schema: {
      ...codeReviewSchema,
      actions: [] // No actions available for merged PRs
    },
    data: {
      prNumber: '1247',
      title: 'Add authentication middleware for API routes',
      author: 'sarah.dev',
      branch: 'feature/auth-middleware',
      description: 'Implements JWT-based authentication middleware for all API endpoints. Includes rate limiting and request validation.',
      filesChanged: '12',
      additions: '+247',
      deletions: '-15',
      reviewers: 'john.smith ✅, alice.chen ✅',
      status: 'merged'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'A successfully merged pull request showing the final state.'
      }
    }
  }
}; 