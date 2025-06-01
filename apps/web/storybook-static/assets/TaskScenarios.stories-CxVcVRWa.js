import{D as C}from"./DynamicUIRenderer-UL-Os6h0.js";import"./jsx-runtime-CmtfZKef.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./DynamicForm-CQvi70jR.js";import"./FormSection-BXhPtV5Y.js";import"./TextInput-B-b59Q_e.js";import"./input-CbSxzvDx.js";import"./utils-CytzSlOG.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";import"./index-C9U_LHPE.js";import"./NumberInput-BM-Ag6sN.js";import"./SelectInput-Cji-AcSY.js";import"./check-M_MmD5Zy.js";import"./TextareaInput-d_sTEtii.js";import"./BooleanInput-DAkAH8Ho.js";import"./checkbox-BGOkVoFJ.js";import"./DateInput-DrtaTLZA.js";import"./FileInput-CkTp4YSM.js";import"./button-BIv8UjPY.js";import"./MultiSelectInput-GIzsWy5u.js";import"./EmailInput-BDtJ9KKU.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-DwxbG8kR.js";import"./QueryClientProvider-mz6q_e7V.js";import"./iframe-BVJQxLgr.js";import"./DynamicDisplay-CN3Fs3X6.js";import"./TableDisplay-BZ_5kpJV.js";import"./CardDisplay-DissT9ux.js";import"./ActionButtons-B9l-49-W.js";import"./DynamicUIErrorBoundary-B-AhmovT.js";import"./DynamicUIStateContext-BU6sB-Jv.js";const le={title:"Dynamic UI/System Integration/Task Scenarios",component:C,parameters:{docs:{description:{component:`
# Task Scenarios

Real-world task examples that demonstrate complete user workflows using the Dynamic UI system.
These stories represent actual business scenarios that users encounter in production.

**Purpose**: Validate end-to-end user experiences and ensure the system handles complex task flows correctly.
        `}}},argTypes:{onSubmit:{action:"submitted"},onCancel:{action:"cancelled"},onAction:{action:"action triggered"}}},T={componentId:"user-onboarding-form",name:"User Onboarding",componentType:"Form",title:"Welcome! Let's set up your account",description:"Please provide your information to get started with the platform.",fields:[{fieldKey:"firstName",label:"First Name",type:"text",placeholder:"Enter your first name",required:!0,validationRules:[{type:"required",message:"First name is required"}]},{fieldKey:"lastName",label:"Last Name",type:"text",placeholder:"Enter your last name",required:!0,validationRules:[{type:"required",message:"Last name is required"}]},{fieldKey:"email",label:"Email Address",type:"email",placeholder:"you@company.com",required:!0,validationRules:[{type:"required",message:"Email is required"},{type:"email",message:"Please enter a valid email address"}]},{fieldKey:"department",label:"Department",type:"select",placeholder:"Choose your department",required:!0,options:[{value:"engineering",label:"Engineering"},{value:"marketing",label:"Marketing"},{value:"sales",label:"Sales"},{value:"hr",label:"Human Resources"},{value:"finance",label:"Finance"}]},{fieldKey:"role",label:"Job Role",type:"text",placeholder:"e.g., Software Engineer, Marketing Manager",required:!0},{fieldKey:"notifications",label:"Email Notifications",type:"boolean",helpText:"Receive important updates and task notifications via email"}],actions:[{actionKey:"submit",label:"Complete Setup",style:"primary"},{actionKey:"cancel",label:"Skip for Now",style:"secondary"}]},A={componentId:"task-approval-display",name:"Task Approval Review",componentType:"Display",title:"Review Task: {{taskTitle}}",customProps:{displayType:"card",fields:[{key:"taskTitle",label:"Task"},{key:"taskDescription",label:"Description"},{key:"assignee",label:"Assigned To"},{key:"department",label:"Department"},{key:"priority",label:"Priority"},{key:"dueDate",label:"Due Date"},{key:"status",label:"Status"},{key:"createdBy",label:"Created By"},{key:"createdDate",label:"Created Date"}],layout:"list"},actions:[{actionKey:"approve",label:"Approve Task",style:"primary",confirmation:"Are you sure you want to approve this task?"},{actionKey:"reject",label:"Request Changes",style:"danger",confirmation:"Are you sure you want to request changes?"},{actionKey:"assign",label:"Reassign",style:"secondary"}]},x={componentId:"expense-report-form",name:"Expense Report",componentType:"Form",title:"Submit Expense Report",description:"Please provide details for your business expenses.",layout:{sections:[{title:"Trip Information",fields:["tripPurpose","startDate","endDate","destination"],collapsible:!1},{title:"Expense Details",fields:["category","amount","description","receipt"],collapsible:!1},{title:"Additional Information",fields:["clientBillable","notes"],collapsible:!0,defaultExpanded:!1}],spacing:"normal"},fields:[{fieldKey:"tripPurpose",label:"Purpose of Trip",type:"select",required:!0,options:[{value:"client_meeting",label:"Client Meeting"},{value:"conference",label:"Conference/Training"},{value:"business_travel",label:"Business Travel"},{value:"other",label:"Other"}]},{fieldKey:"startDate",label:"Start Date",type:"date",required:!0},{fieldKey:"endDate",label:"End Date",type:"date",required:!0},{fieldKey:"destination",label:"Destination",type:"text",placeholder:"City, State/Country",required:!0},{fieldKey:"category",label:"Expense Category",type:"select",required:!0,options:[{value:"accommodation",label:"Accommodation"},{value:"transportation",label:"Transportation"},{value:"meals",label:"Meals & Entertainment"},{value:"supplies",label:"Office Supplies"},{value:"other",label:"Other"}]},{fieldKey:"amount",label:"Amount ($)",type:"number",required:!0,validationRules:[{type:"required",message:"Amount is required"},{type:"min",value:.01,message:"Amount must be greater than $0"}]},{fieldKey:"description",label:"Description",type:"textarea",placeholder:"Provide details about this expense...",required:!0},{fieldKey:"receipt",label:"Receipt",type:"file",helpText:"Upload receipt image or PDF",customProps:{accept:"image/*,.pdf",multiple:!1}},{fieldKey:"clientBillable",label:"Client Billable",type:"boolean",helpText:"Can this expense be billed to a client?"},{fieldKey:"notes",label:"Additional Notes",type:"textarea",placeholder:"Any additional information..."}],actions:[{actionKey:"submit",label:"Submit Report",style:"primary"},{actionKey:"save_draft",label:"Save as Draft",style:"secondary"},{actionKey:"cancel",label:"Cancel",style:"secondary"}]},R={taskTitle:"Review Q4 Marketing Campaign",taskDescription:"Review and approve the Q4 marketing campaign materials and budget allocation.",assignee:"John Smith",department:"Marketing",priority:"High",dueDate:"2024-02-15",status:"pending_review",createdBy:"Sarah Johnson",createdDate:"2024-01-28"},e={args:{schema:T,initialData:{email:"new.user@company.com"}},parameters:{docs:{description:{story:`
**Scenario**: New employee account setup

A new employee receives an invitation email and needs to complete their profile setup. 
This form demonstrates:
- Progressive disclosure with logical field grouping
- Email validation and required field handling
- Department-based role suggestions
- Notification preferences

**Use Case**: HR onboarding workflow, new hire setup
        `}}}},a={args:{schema:A,data:R,initialUIState:{workflowState:"pending_review",showApprovalActions:!0}},parameters:{docs:{description:{story:`
**Scenario**: Manager reviewing a submitted task

A manager needs to review a task submission and make an approval decision.
This display demonstrates:
- Multi-area layout with task details and actions
- Conditional action visibility based on user role
- Confirmation dialogs for critical actions
- Rich data display with status indicators

**Use Case**: Task management workflow, approval processes
        `}}}},t={args:{schema:x,initialData:{}},parameters:{docs:{description:{story:`
**Scenario**: Employee submitting business expenses

An employee needs to submit an expense report for business travel.
This form demonstrates:
- Complex sectioned layout with collapsible areas
- Date range validation and business logic
- File upload for receipt attachments
- Conditional fields based on expense type
- Multiple submission actions (submit, save draft)

**Use Case**: Finance workflow, expense management
        `}}}},n={args:{schema:x,initialData:{tripPurpose:"client_meeting",startDate:"2024-02-01",endDate:"2024-02-03",destination:"San Francisco, CA",category:"accommodation",amount:450,description:"Hotel stay for client meetings - 2 nights at Marriott Downtown",clientBillable:!0}},parameters:{docs:{description:{story:`
**Scenario**: Partially completed expense report

Shows how the form behaves when some data is already filled in, 
either from a saved draft or pre-populated from another source.
        `}}}},s={args:{schema:{componentId:"empty-task-queue",name:"Empty Task Queue",componentType:"Display",title:"No Tasks Assigned",customProps:{displayType:"card",fields:[{key:"emptyMessage",label:"Status"}],layout:"list"}},data:{emptyMessage:"You have no tasks assigned at this time. Check back later or contact your manager if you need work assigned."}},parameters:{docs:{description:{story:`
**Scenario**: User has no assigned tasks

Demonstrates empty state handling when there are no tasks to display.
This is important for maintaining good UX when data is unavailable.
        `}}}},i={args:{schema:T,initialData:{firstName:"John",email:"invalid-email"}},parameters:{docs:{description:{story:`
**Scenario**: Form with validation errors

Shows how the system handles and displays validation errors,
helping users understand what needs to be corrected.
        `}}}};var r,o,l;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  args: {
    schema: userOnboardingSchema,
    initialData: {
      email: 'new.user@company.com' // Pre-filled from invitation
    }
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Scenario**: New employee account setup

A new employee receives an invitation email and needs to complete their profile setup. 
This form demonstrates:
- Progressive disclosure with logical field grouping
- Email validation and required field handling
- Department-based role suggestions
- Notification preferences

**Use Case**: HR onboarding workflow, new hire setup
        \`
      }
    }
  }
}`,...(l=(o=e.parameters)==null?void 0:o.docs)==null?void 0:l.source}}};var p,d,c;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    schema: taskApprovalDisplaySchema,
    data: sampleTaskData,
    initialUIState: {
      workflowState: 'pending_review',
      showApprovalActions: true
    }
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Scenario**: Manager reviewing a submitted task

A manager needs to review a task submission and make an approval decision.
This display demonstrates:
- Multi-area layout with task details and actions
- Conditional action visibility based on user role
- Confirmation dialogs for critical actions
- Rich data display with status indicators

**Use Case**: Task management workflow, approval processes
        \`
      }
    }
  }
}`,...(c=(d=a.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var m,u,y;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    schema: expenseReportSchema,
    initialData: {}
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Scenario**: Employee submitting business expenses

An employee needs to submit an expense report for business travel.
This form demonstrates:
- Complex sectioned layout with collapsible areas
- Date range validation and business logic
- File upload for receipt attachments
- Conditional fields based on expense type
- Multiple submission actions (submit, save draft)

**Use Case**: Finance workflow, expense management
        \`
      }
    }
  }
}`,...(y=(u=t.parameters)==null?void 0:u.docs)==null?void 0:y.source}}};var g,h,b;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    schema: expenseReportSchema,
    initialData: {
      tripPurpose: 'client_meeting',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      destination: 'San Francisco, CA',
      category: 'accommodation',
      amount: 450.00,
      description: 'Hotel stay for client meetings - 2 nights at Marriott Downtown',
      clientBillable: true
    }
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Scenario**: Partially completed expense report

Shows how the form behaves when some data is already filled in, 
either from a saved draft or pre-populated from another source.
        \`
      }
    }
  }
}`,...(b=(h=n.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var f,v,k;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'empty-task-queue',
      name: 'Empty Task Queue',
      componentType: 'Display',
      title: 'No Tasks Assigned',
      customProps: {
        displayType: 'card',
        fields: [{
          key: 'emptyMessage',
          label: 'Status'
        }],
        layout: 'list'
      }
    },
    data: {
      emptyMessage: 'You have no tasks assigned at this time. Check back later or contact your manager if you need work assigned.'
    }
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Scenario**: User has no assigned tasks

Demonstrates empty state handling when there are no tasks to display.
This is important for maintaining good UX when data is unavailable.
        \`
      }
    }
  }
}`,...(k=(v=s.parameters)==null?void 0:v.docs)==null?void 0:k.source}}};var w,S,D;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    schema: userOnboardingSchema,
    initialData: {
      firstName: 'John',
      email: 'invalid-email' // This will trigger validation errors
    }
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Scenario**: Form with validation errors

Shows how the system handles and displays validation errors,
helping users understand what needs to be corrected.
        \`
      }
    }
  }
}`,...(D=(S=i.parameters)==null?void 0:S.docs)==null?void 0:D.source}}};const pe=["UserOnboarding","TaskApprovalWorkflow","ExpenseReportSubmission","ExpenseReportWithData","EmptyTaskQueue","ErrorRecovery"];export{s as EmptyTaskQueue,i as ErrorRecovery,t as ExpenseReportSubmission,n as ExpenseReportWithData,a as TaskApprovalWorkflow,e as UserOnboarding,pe as __namedExportsOrder,le as default};
