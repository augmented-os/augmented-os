import{j as F}from"./jsx-runtime-BT65X5dW.js";import{D as M}from"./DynamicForm-OHA8l7o_.js";import{D as q}from"./DynamicDisplay-CW0ZWIbw.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./FormSection-BXqWezJv.js";import"./TextInput-D1rd6FA3.js";import"./input-dGyvt1gO.js";import"./utils-CytzSlOG.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./index-B5vUWwF_.js";import"./NumberInput-DNalEYdP.js";import"./SelectInput-bHGg1ngK.js";import"./check-BvmRBcsD.js";import"./TextareaInput-DTn6fcBx.js";import"./BooleanInput-BbQ8GhQ8.js";import"./checkbox-DAvk8bKM.js";import"./DateInput-Cgcb2E7S.js";import"./FileInput-ltJkPhXW.js";import"./button-DTZ1A7rA.js";import"./MultiSelectInput-BlXkhP6C.js";import"./EmailInput-BZWgOOXu.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-CiQj-xe7.js";import"./QueryClientProvider-9W50J78D.js";import"./iframe-CSMkAxJl.js";import"./TableDisplay-CACaD82O.js";import"./CardDisplay-3IRVwmAz.js";import"./ActionButtons-4328mjEA.js";const ye={title:"Dynamic UI/Examples/Task Management",component:M,parameters:{docs:{description:{component:"Task management examples showcasing dynamic forms and displays for task creation, editing, and tracking."}}},tags:["autodocs"]},U={componentId:"task-creation-form",name:"Task Creation",componentType:"Form",title:"Create New Task",fields:[{fieldKey:"title",label:"Task Title",type:"text",required:!0,placeholder:"Enter task title"},{fieldKey:"description",label:"Description",type:"textarea",placeholder:"Describe the task..."},{fieldKey:"priority",label:"Priority",type:"select",required:!0,options:[{value:"low",label:"Low"},{value:"medium",label:"Medium"},{value:"high",label:"High"},{value:"urgent",label:"Urgent"}],default:"medium"}],actions:[{actionKey:"submit",label:"Create Task",style:"primary"},{actionKey:"saveDraft",label:"Save as Draft",style:"secondary"}]},_={componentId:"task-edit-form",name:"Task Edit",componentType:"Form",title:"Edit Task",fields:[{fieldKey:"title",label:"Task Title",type:"text",required:!0},{fieldKey:"status",label:"Status",type:"select",required:!0,options:[{value:"todo",label:"To Do"},{value:"in_progress",label:"In Progress"},{value:"review",label:"In Review"},{value:"done",label:"Done"}]}],actions:[{actionKey:"submit",label:"Update Task",style:"primary"},{actionKey:"delete",label:"Delete Task",style:"danger",confirmation:"Are you sure you want to delete this task?"}]},N={componentId:"task-display",name:"Task Display",componentType:"Display",title:"Task Details",displayTemplate:`
    <div class="task-details">
      <h2>{{title}}</h2>
      <div class="task-meta">
        <span class="priority priority-{{priority}}">{{priority}}</span>
        <span class="status status-{{status}}">{{status}}</span>
      </div>
      <p>{{description}}</p>
      <!-- TODO: Add assignee, due date, progress, comments -->
    </div>
  `,actions:[{actionKey:"edit",label:"Edit Task",style:"primary"},{actionKey:"complete",label:"Mark Complete",style:"secondary"}]},t={args:{schema:U,onSubmit:e=>{console.log("Task created:",e)}},parameters:{docs:{description:{story:"TODO: Task creation form with priority selection, assignee management, and due date planning."}}}},a={args:{schema:_,initialData:{title:"Sample Task",status:"in_progress",priority:"high"},onSubmit:e=>{console.log("Task updated:",e)}},parameters:{docs:{description:{story:"TODO: Task editing form with status updates, progress tracking, and time logging."}}}},n={render:e=>F.jsx(q,{schema:N,data:{title:"Implement Dynamic UI System",description:"Create a comprehensive dynamic UI system for form generation",priority:"high",status:"in_progress"},onAction:x=>{console.log("Task action:",x)}}),parameters:{docs:{description:{story:"TODO: Task display view with formatted information, status indicators, and action buttons."}}}},s={args:{schema:{componentId:"subtask-management",name:"Subtask Management",componentType:"Form",title:"Manage Subtasks",fields:[{fieldKey:"subtaskTitle",label:"Subtask Title",type:"text",required:!0,placeholder:"Enter subtask title"}],actions:[{actionKey:"addSubtask",label:"Add Subtask",style:"primary"}]},onSubmit:e=>{console.log("Subtask added:",e)}},parameters:{docs:{description:{story:"TODO: Subtask management with parent relationships, hierarchies, and progress tracking."}}}},r={args:{schema:{componentId:"task-template",name:"Task Template",componentType:"Form",title:"Create Task Template",fields:[{fieldKey:"templateName",label:"Template Name",type:"text",required:!0,placeholder:"Enter template name"}],actions:[{actionKey:"submit",label:"Save Template",style:"primary"}]},onSubmit:e=>{console.log("Task template created:",e)}},parameters:{docs:{description:{story:"TODO: Task template creation for reusable task patterns and standardized workflows."}}}};var i,o,m,l,p;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    schema: taskCreationSchema,
    onSubmit: data => {
      console.log('Task created:', data);
      // TODO: Implement task creation logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Task creation form with priority selection, assignee management, and due date planning.'
      }
    }
  }
}`,...(m=(o=t.parameters)==null?void 0:o.docs)==null?void 0:m.source},description:{story:`Task Creation Form

TODO: Demonstrates task creation with:
- Basic task information
- Priority and category selection
- Assignee management
- Due date and time estimation`,...(p=(l=t.parameters)==null?void 0:l.docs)==null?void 0:p.description}}};var d,c,u,y,k;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    schema: taskEditSchema,
    initialData: {
      title: 'Sample Task',
      status: 'in_progress',
      priority: 'high'
      // TODO: Add more pre-populated data
    },
    onSubmit: data => {
      console.log('Task updated:', data);
      // TODO: Implement task update logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Task editing form with status updates, progress tracking, and time logging.'
      }
    }
  }
}`,...(u=(c=a.parameters)==null?void 0:c.docs)==null?void 0:u.source},description:{story:`Task Editing Form

TODO: Demonstrates task editing with:
- Status updates and progress tracking
- Time logging and effort estimation
- Comment and note management
- Dependency and blocker tracking`,...(k=(y=a.parameters)==null?void 0:y.docs)==null?void 0:k.description}}};var g,T,b,h,D;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: args => <DynamicDisplay schema={taskDisplaySchema} data={{
    title: 'Implement Dynamic UI System',
    description: 'Create a comprehensive dynamic UI system for form generation',
    priority: 'high',
    status: 'in_progress'
    // TODO: Add more display data
  }} onAction={actionKey => {
    console.log('Task action:', actionKey);
    // TODO: Implement action handlers
  }} />,
  parameters: {
    docs: {
      description: {
        story: 'TODO: Task display view with formatted information, status indicators, and action buttons.'
      }
    }
  }
}`,...(b=(T=n.parameters)==null?void 0:T.docs)==null?void 0:b.source},description:{story:`Task Display View

TODO: Demonstrates task display with:
- Formatted task information
- Status and priority indicators
- Action buttons for common operations
- Activity timeline and comments`,...(D=(h=n.parameters)==null?void 0:h.docs)==null?void 0:D.description}}};var O,f,S,w,v;s.parameters={...s.parameters,docs:{...(O=s.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'subtask-management',
      name: 'Subtask Management',
      componentType: 'Form',
      title: 'Manage Subtasks',
      // TODO: Add subtask management fields
      fields: [{
        fieldKey: 'subtaskTitle',
        label: 'Subtask Title',
        type: 'text',
        required: true,
        placeholder: 'Enter subtask title'
      }
      // TODO: Add parent task selection, dependency management
      ],
      actions: [{
        actionKey: 'addSubtask',
        label: 'Add Subtask',
        style: 'primary'
      }]
    },
    onSubmit: data => {
      console.log('Subtask added:', data);
      // TODO: Implement subtask creation logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Subtask management with parent relationships, hierarchies, and progress tracking.'
      }
    }
  }
}`,...(S=(f=s.parameters)==null?void 0:f.docs)==null?void 0:S.source},description:{story:`Subtask Management

TODO: Demonstrates subtask creation and management with:
- Parent task relationship
- Nested task hierarchies
- Progress rollup calculations
- Dependency management`,...(v=(w=s.parameters)==null?void 0:w.docs)==null?void 0:v.description}}};var I,K,E,A,C;r.parameters={...r.parameters,docs:{...(I=r.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'task-template',
      name: 'Task Template',
      componentType: 'Form',
      title: 'Create Task Template',
      // TODO: Add template creation fields
      fields: [{
        fieldKey: 'templateName',
        label: 'Template Name',
        type: 'text',
        required: true,
        placeholder: 'Enter template name'
      }
      // TODO: Add template fields, default values, categories
      ],
      actions: [{
        actionKey: 'submit',
        label: 'Save Template',
        style: 'primary'
      }]
    },
    onSubmit: data => {
      console.log('Task template created:', data);
      // TODO: Implement template creation logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Task template creation for reusable task patterns and standardized workflows.'
      }
    }
  }
}`,...(E=(K=r.parameters)==null?void 0:K.docs)==null?void 0:E.source},description:{story:`Task Template Creation

TODO: Demonstrates task template creation with:
- Reusable task patterns
- Template customization options
- Default field values
- Template categorization`,...(C=(A=r.parameters)==null?void 0:A.docs)==null?void 0:C.description}}};const ke=["TaskCreation","TaskEdit","TaskDisplay","SubtaskManagement","TaskTemplate"];export{s as SubtaskManagement,t as TaskCreation,n as TaskDisplay,a as TaskEdit,r as TaskTemplate,ke as __namedExportsOrder,ye as default};
