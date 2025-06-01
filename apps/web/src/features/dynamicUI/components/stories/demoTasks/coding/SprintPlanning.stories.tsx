import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/Coding/Sprint Planning',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Sprint Planning Workflow

Agile sprint planning showing backlog management, story estimation, and sprint configuration.
Demonstrates project management workflows and collaborative planning tools.

**Planning Stages:**
- Backlog Review - Reviewing and prioritizing user stories
- Story Estimation - Team estimates story points
- Sprint Configuration - Setting sprint goals and capacity
- Sprint Started - Active sprint dashboard
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

// Sprint planning schema
const sprintPlanningSchema: UIComponentSchema = {
  componentId: 'sprint-planning-demo',
  name: 'Sprint Planning',
  componentType: 'Display',
  title: 'Sprint {{sprintNumber}} Planning',
  customProps: {
    displayType: 'card',
    fields: [
      { key: 'sprintGoal', label: 'Sprint Goal' },
      { key: 'duration', label: 'Duration' },
      { key: 'teamCapacity', label: 'Team Capacity' },
      { key: 'storiesSelected', label: 'Stories Selected' },
      { key: 'totalStoryPoints', label: 'Total Story Points' },
      { key: 'velocityTrend', label: 'Previous Velocity' },
      { key: 'status', label: 'Planning Status' }
    ],
    layout: 'grid'
  },
  actions: [
    { actionKey: 'add_story', label: 'Add Story', style: 'secondary' },
    { actionKey: 'estimate', label: 'Estimate Stories', style: 'secondary' },
    { actionKey: 'start_sprint', label: 'Start Sprint', style: 'primary' },
    { actionKey: 'save_draft', label: 'Save Planning', style: 'secondary' }
  ]
};

export const BacklogReview: Story = {
  name: 'Backlog Review',
  args: {
    schema: sprintPlanningSchema,
    data: {
      sprintNumber: '15',
      sprintGoal: 'Improve user authentication and security features',
      duration: '2 weeks (Oct 23 - Nov 6)',
      teamCapacity: '5 developers × 80 hours = 400 hours',
      storiesSelected: '12 user stories',
      totalStoryPoints: '34 points',
      velocityTrend: 'Last 3 sprints: 32, 29, 35 points',
      status: 'reviewing_backlog'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Product owner and team reviewing user stories and prioritizing work for the upcoming sprint.'
      }
    }
  }
};

export const StoryEstimation: Story = {
  name: 'Story Estimation Session',
  args: {
    schema: sprintPlanningSchema,
    data: {
      sprintNumber: '15',
      sprintGoal: 'Improve user authentication and security features',
      duration: '2 weeks (Oct 23 - Nov 6)',
      teamCapacity: '5 developers × 80 hours = 400 hours',
      storiesSelected: '8 user stories (4 pending estimation)',
      totalStoryPoints: '21 points (estimating...)',
      velocityTrend: 'Last 3 sprints: 32, 29, 35 points',
      status: 'estimating_stories'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Team collaboratively estimating story points using planning poker or similar techniques.'
      }
    }
  }
};

export const SprintConfiguration: Story = {
  name: 'Sprint Configuration',
  args: {
    schema: sprintPlanningSchema,
    data: {
      sprintNumber: '15',
      sprintGoal: 'Improve user authentication and security features',
      duration: '2 weeks (Oct 23 - Nov 6)',
      teamCapacity: '5 developers × 80 hours = 400 hours',
      storiesSelected: '10 user stories',
      totalStoryPoints: '32 points',
      velocityTrend: 'Last 3 sprints: 32, 29, 35 points',
      status: 'configuring_sprint'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Final sprint configuration with goals set, stories committed, and ready to start.'
      }
    }
  }
};

export const SprintStarted: Story = {
  name: 'Sprint Active',
  args: {
    schema: {
      ...sprintPlanningSchema,
      actions: [
        { actionKey: 'view_board', label: 'View Sprint Board', style: 'primary' },
        { actionKey: 'daily_standup', label: 'Daily Standup', style: 'secondary' },
        { actionKey: 'add_impediment', label: 'Log Impediment', style: 'danger' }
      ]
    },
    data: {
      sprintNumber: '15',
      sprintGoal: 'Improve user authentication and security features',
      duration: '2 weeks (Oct 23 - Nov 6) - Day 3',
      teamCapacity: '5 developers × 80 hours = 400 hours',
      storiesSelected: '10 user stories',
      totalStoryPoints: '32 points (8 completed, 24 remaining)',
      velocityTrend: 'Burndown: On track',
      status: 'sprint_active'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Active sprint showing progress tracking and daily management activities.'
      }
    }
  }
}; 