import{D as v}from"./DynamicUIRenderer-UL-Os6h0.js";import"./jsx-runtime-CmtfZKef.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./DynamicForm-CQvi70jR.js";import"./FormSection-BXhPtV5Y.js";import"./TextInput-B-b59Q_e.js";import"./input-CbSxzvDx.js";import"./utils-CytzSlOG.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";import"./index-C9U_LHPE.js";import"./NumberInput-BM-Ag6sN.js";import"./SelectInput-Cji-AcSY.js";import"./check-M_MmD5Zy.js";import"./TextareaInput-d_sTEtii.js";import"./BooleanInput-DAkAH8Ho.js";import"./checkbox-BGOkVoFJ.js";import"./DateInput-DrtaTLZA.js";import"./FileInput-CkTp4YSM.js";import"./button-BIv8UjPY.js";import"./MultiSelectInput-GIzsWy5u.js";import"./EmailInput-BDtJ9KKU.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-DwxbG8kR.js";import"./QueryClientProvider-mz6q_e7V.js";import"./iframe-BVJQxLgr.js";import"./DynamicDisplay-CN3Fs3X6.js";import"./TableDisplay-BZ_5kpJV.js";import"./CardDisplay-DissT9ux.js";import"./ActionButtons-B9l-49-W.js";import"./DynamicUIErrorBoundary-B-AhmovT.js";import"./DynamicUIStateContext-BU6sB-Jv.js";const Y={title:"Demo Tasks/Coding/Sprint Planning",component:v,parameters:{docs:{description:{component:`
# Sprint Planning Workflow

Agile sprint planning showing backlog management, story estimation, and sprint configuration.
Demonstrates project management workflows and collaborative planning tools.

**Planning Stages:**
- Backlog Review - Reviewing and prioritizing user stories
- Story Estimation - Team estimates story points
- Sprint Configuration - Setting sprint goals and capacity
- Sprint Started - Active sprint dashboard
        `}}},argTypes:{onSubmit:{action:"submitted"},onCancel:{action:"cancelled"},onAction:{action:"action triggered"}}},i={componentId:"sprint-planning-demo",name:"Sprint Planning",componentType:"Display",title:"Sprint {{sprintNumber}} Planning",customProps:{displayType:"card",fields:[{key:"sprintGoal",label:"Sprint Goal"},{key:"duration",label:"Duration"},{key:"teamCapacity",label:"Team Capacity"},{key:"storiesSelected",label:"Stories Selected"},{key:"totalStoryPoints",label:"Total Story Points"},{key:"velocityTrend",label:"Previous Velocity"},{key:"status",label:"Planning Status"}],layout:"grid"},actions:[{actionKey:"add_story",label:"Add Story",style:"secondary"},{actionKey:"estimate",label:"Estimate Stories",style:"secondary"},{actionKey:"start_sprint",label:"Start Sprint",style:"primary"},{actionKey:"save_draft",label:"Save Planning",style:"secondary"}]},t={name:"Backlog Review",args:{schema:i,data:{sprintNumber:"15",sprintGoal:"Improve user authentication and security features",duration:"2 weeks (Oct 23 - Nov 6)",teamCapacity:"5 developers × 80 hours = 400 hours",storiesSelected:"12 user stories",totalStoryPoints:"34 points",velocityTrend:"Last 3 sprints: 32, 29, 35 points",status:"reviewing_backlog"}},parameters:{docs:{description:{story:"Product owner and team reviewing user stories and prioritizing work for the upcoming sprint."}}}},e={name:"Story Estimation Session",args:{schema:i,data:{sprintNumber:"15",sprintGoal:"Improve user authentication and security features",duration:"2 weeks (Oct 23 - Nov 6)",teamCapacity:"5 developers × 80 hours = 400 hours",storiesSelected:"8 user stories (4 pending estimation)",totalStoryPoints:"21 points (estimating...)",velocityTrend:"Last 3 sprints: 32, 29, 35 points",status:"estimating_stories"}},parameters:{docs:{description:{story:"Team collaboratively estimating story points using planning poker or similar techniques."}}}},n={name:"Sprint Configuration",args:{schema:i,data:{sprintNumber:"15",sprintGoal:"Improve user authentication and security features",duration:"2 weeks (Oct 23 - Nov 6)",teamCapacity:"5 developers × 80 hours = 400 hours",storiesSelected:"10 user stories",totalStoryPoints:"32 points",velocityTrend:"Last 3 sprints: 32, 29, 35 points",status:"configuring_sprint"}},parameters:{docs:{description:{story:"Final sprint configuration with goals set, stories committed, and ready to start."}}}},r={name:"Sprint Active",args:{schema:{...i,actions:[{actionKey:"view_board",label:"View Sprint Board",style:"primary"},{actionKey:"daily_standup",label:"Daily Standup",style:"secondary"},{actionKey:"add_impediment",label:"Log Impediment",style:"danger"}]},data:{sprintNumber:"15",sprintGoal:"Improve user authentication and security features",duration:"2 weeks (Oct 23 - Nov 6) - Day 3",teamCapacity:"5 developers × 80 hours = 400 hours",storiesSelected:"10 user stories",totalStoryPoints:"32 points (8 completed, 24 remaining)",velocityTrend:"Burndown: On track",status:"sprint_active"}},parameters:{docs:{description:{story:"Active sprint showing progress tracking and daily management activities."}}}};var s,a,o;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
}`,...(o=(a=t.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};var p,c,m;e.parameters={...e.parameters,docs:{...(p=e.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(m=(c=e.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var l,d,u;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(u=(d=n.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var y,g,S;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'Sprint Active',
  args: {
    schema: {
      ...sprintPlanningSchema,
      actions: [{
        actionKey: 'view_board',
        label: 'View Sprint Board',
        style: 'primary'
      }, {
        actionKey: 'daily_standup',
        label: 'Daily Standup',
        style: 'secondary'
      }, {
        actionKey: 'add_impediment',
        label: 'Log Impediment',
        style: 'danger'
      }]
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
}`,...(S=(g=r.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};const Z=["BacklogReview","StoryEstimation","SprintConfiguration","SprintStarted"];export{t as BacklogReview,n as SprintConfiguration,r as SprintStarted,e as StoryEstimation,Z as __namedExportsOrder,Y as default};
