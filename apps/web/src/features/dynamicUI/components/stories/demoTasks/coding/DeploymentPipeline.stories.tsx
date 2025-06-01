import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/Coding/Deployment Pipeline',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# CI/CD Deployment Pipeline

Continuous integration and deployment pipeline showing different stages of the software delivery process.
Demonstrates DevOps workflows, automated testing, and deployment management.

**Pipeline Stages:**
- Building - Code compilation and dependency resolution
- Testing - Automated test execution
- Ready to Deploy - All checks passed, awaiting deployment
- Deploying - Active deployment in progress
- Failed - Pipeline failure with error details
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

// Deployment pipeline schema
const deploymentPipelineSchema: UIComponentSchema = {
  componentId: 'deployment-pipeline-demo',
  name: 'Deployment Pipeline',
  componentType: 'Display',
  title: 'Pipeline #{{buildNumber}} - {{branch}}',
  customProps: {
    displayType: 'card',
    fields: [
      { key: 'commit', label: 'Commit' },
      { key: 'author', label: 'Author' },
      { key: 'triggeredBy', label: 'Triggered By' },
      { key: 'startTime', label: 'Started' },
      { key: 'duration', label: 'Duration' },
      { key: 'environment', label: 'Target Environment' },
      { key: 'status', label: 'Status' },
      { key: 'testResults', label: 'Test Results' },
      { key: 'coverage', label: 'Code Coverage' }
    ],
    layout: 'grid'
  },
  actions: [
    { actionKey: 'view_logs', label: 'View Logs', style: 'secondary' },
    { actionKey: 'deploy', label: 'Deploy', style: 'primary', visibleIf: 'status == "ready"' },
    { actionKey: 'retry', label: 'Retry', style: 'primary', visibleIf: 'status == "failed"' },
    { actionKey: 'rollback', label: 'Rollback', style: 'danger', visibleIf: 'status == "deployed"' }
  ]
};

export const Building: Story = {
  name: 'Building - In Progress',
  args: {
    schema: deploymentPipelineSchema,
    data: {
      buildNumber: '1,847',
      branch: 'main',
      commit: 'a7b8c9d - Fix authentication middleware bug',
      author: 'sarah.dev',
      triggeredBy: 'Push to main branch',
      startTime: '2 minutes ago',
      duration: '2m 14s (running)',
      environment: 'Production',
      status: 'building',
      testResults: 'Pending...',
      coverage: 'Calculating...'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Build pipeline in progress showing compilation and dependency resolution.'
      }
    }
  }
};

export const Testing: Story = {
  name: 'Testing - Running Tests',
  args: {
    schema: deploymentPipelineSchema,
    data: {
      buildNumber: '1,847',
      branch: 'main',
      commit: 'a7b8c9d - Fix authentication middleware bug',
      author: 'sarah.dev',
      triggeredBy: 'Push to main branch',
      startTime: '5 minutes ago',
      duration: '4m 32s (running)',
      environment: 'Production',
      status: 'testing',
      testResults: '847 passed, 12 running, 0 failed',
      coverage: '94.2% (+0.3%)'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Pipeline executing automated tests including unit, integration, and e2e tests.'
      }
    }
  }
};

export const ReadyToDeploy: Story = {
  name: 'Ready to Deploy',
  args: {
    schema: deploymentPipelineSchema,
    data: {
      buildNumber: '1,847',
      branch: 'main',
      commit: 'a7b8c9d - Fix authentication middleware bug',
      author: 'sarah.dev',
      triggeredBy: 'Push to main branch',
      startTime: '8 minutes ago',
      duration: '6m 18s',
      environment: 'Production',
      status: 'ready',
      testResults: '859 passed, 0 failed',
      coverage: '94.2% (+0.3%)'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Pipeline completed successfully and ready for deployment to production.'
      }
    }
  }
};

export const Deploying: Story = {
  name: 'Deploying to Production',
  args: {
    schema: deploymentPipelineSchema,
    data: {
      buildNumber: '1,847',
      branch: 'main',
      commit: 'a7b8c9d - Fix authentication middleware bug',
      author: 'sarah.dev',
      triggeredBy: 'Manual deployment by john.smith',
      startTime: '12 minutes ago',
      duration: '8m 45s (deploying)',
      environment: 'Production',
      status: 'deploying',
      testResults: '859 passed, 0 failed',
      coverage: '94.2% (+0.3%)'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Active deployment in progress with infrastructure updates and health checks.'
      }
    }
  }
};

export const Failed: Story = {
  name: 'Pipeline Failed',
  args: {
    schema: deploymentPipelineSchema,
    data: {
      buildNumber: '1,846',
      branch: 'feature/new-auth',
      commit: 'b8c9d0e - Add new authentication flow',
      author: 'alice.chen',
      triggeredBy: 'Pull request #1248',
      startTime: '25 minutes ago',
      duration: '3m 12s (failed)',
      environment: 'Staging',
      status: 'failed',
      testResults: '834 passed, 7 failed',
      coverage: '92.8% (-1.1%)'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Failed pipeline with test failures requiring developer attention.'
      }
    }
  }
}; 