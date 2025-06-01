import{D as x}from"./DynamicForm-OHA8l7o_.js";import"./jsx-runtime-BT65X5dW.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./FormSection-BXqWezJv.js";import"./TextInput-D1rd6FA3.js";import"./input-dGyvt1gO.js";import"./utils-CytzSlOG.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./index-B5vUWwF_.js";import"./NumberInput-DNalEYdP.js";import"./SelectInput-bHGg1ngK.js";import"./check-BvmRBcsD.js";import"./TextareaInput-DTn6fcBx.js";import"./BooleanInput-BbQ8GhQ8.js";import"./checkbox-DAvk8bKM.js";import"./DateInput-Cgcb2E7S.js";import"./FileInput-ltJkPhXW.js";import"./button-DTZ1A7rA.js";import"./MultiSelectInput-BlXkhP6C.js";import"./EmailInput-BZWgOOXu.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-CiQj-xe7.js";import"./QueryClientProvider-9W50J78D.js";import"./iframe-CSMkAxJl.js";const oe={title:"Dynamic UI/Examples/Business Workflows",component:x,parameters:{docs:{description:{component:"Real-world business workflow examples demonstrating complex form patterns and user interactions."}}},tags:["autodocs"]},v={componentId:"employee-onboarding-workflow",name:"Employee Onboarding",componentType:"Form",title:"New Employee Onboarding",fields:[{fieldKey:"firstName",label:"First Name",type:"text",required:!0,placeholder:"Enter first name"}],actions:[{actionKey:"submit",label:"Complete Onboarding",style:"primary"},{actionKey:"saveDraft",label:"Save Draft",style:"secondary"}]},E={componentId:"project-approval-workflow",name:"Project Approval",componentType:"Form",title:"Project Approval Request",fields:[{fieldKey:"projectName",label:"Project Name",type:"text",required:!0,placeholder:"Enter project name"}],actions:[{actionKey:"submit",label:"Submit for Approval",style:"primary"},{actionKey:"cancel",label:"Cancel",style:"secondary"}]},j={componentId:"expense-report-workflow",name:"Expense Report",componentType:"Form",title:"Submit Expense Report",fields:[{fieldKey:"reportTitle",label:"Report Title",type:"text",required:!0,placeholder:"Enter report title"}],actions:[{actionKey:"submit",label:"Submit Report",style:"primary"},{actionKey:"addExpense",label:"Add Expense",style:"secondary"}]},o={args:{schema:v,onSubmit:e=>{console.log("Employee onboarding submitted:",e)}},parameters:{docs:{description:{story:"TODO: Complete employee onboarding workflow with multi-step form, document uploads, and department-specific fields."}}}},t={args:{schema:E,onSubmit:e=>{console.log("Project approval submitted:",e)}},parameters:{docs:{description:{story:"TODO: Project approval workflow with conditional fields, budget validation, and stakeholder management."}}}},r={args:{schema:j,onSubmit:e=>{console.log("Expense report submitted:",e)}},parameters:{docs:{description:{story:"TODO: Expense report workflow with dynamic item management, receipt uploads, and policy validation."}}}},n={args:{schema:{componentId:"support-ticket-workflow",name:"Support Ticket",componentType:"Form",title:"Create Support Ticket",fields:[{fieldKey:"subject",label:"Subject",type:"text",required:!0,placeholder:"Brief description of the issue"}],actions:[{actionKey:"submit",label:"Create Ticket",style:"primary"}]},onSubmit:e=>{console.log("Support ticket created:",e)}},parameters:{docs:{description:{story:"TODO: Customer support ticket workflow with issue categorization, priority assignment, and SLA routing."}}}};var a,i,s,p,c;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    schema: employeeOnboardingSchema,
    onSubmit: data => {
      console.log('Employee onboarding submitted:', data);
      // TODO: Implement onboarding submission logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Complete employee onboarding workflow with multi-step form, document uploads, and department-specific fields.'
      }
    }
  }
}`,...(s=(i=o.parameters)==null?void 0:i.docs)==null?void 0:s.source},description:{story:`Employee Onboarding Workflow

TODO: Demonstrates a multi-step onboarding process with:
- Personal information collection
- Document upload requirements
- Department-specific configurations
- Progress tracking and validation`,...(c=(p=o.parameters)==null?void 0:p.docs)==null?void 0:c.description}}};var m,l,d,u,y;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    schema: projectApprovalSchema,
    onSubmit: data => {
      console.log('Project approval submitted:', data);
      // TODO: Implement approval workflow logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Project approval workflow with conditional fields, budget validation, and stakeholder management.'
      }
    }
  }
}`,...(d=(l=t.parameters)==null?void 0:l.docs)==null?void 0:d.source},description:{story:`Project Approval Workflow

TODO: Demonstrates project approval process with:
- Project details and requirements
- Budget and timeline planning
- Stakeholder assignment
- Approval routing logic`,...(y=(u=t.parameters)==null?void 0:u.docs)==null?void 0:y.description}}};var g,b,f,w,O;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    schema: expenseReportSchema,
    onSubmit: data => {
      console.log('Expense report submitted:', data);
      // TODO: Implement expense report submission logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Expense report workflow with dynamic item management, receipt uploads, and policy validation.'
      }
    }
  }
}`,...(f=(b=r.parameters)==null?void 0:b.docs)==null?void 0:f.source},description:{story:`Expense Report Workflow

TODO: Demonstrates expense reporting with:
- Dynamic expense item management
- Receipt upload and validation
- Category-based approval routing
- Policy compliance checking`,...(O=(w=r.parameters)==null?void 0:w.docs)==null?void 0:O.description}}};var k,h,S,T,D;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'support-ticket-workflow',
      name: 'Support Ticket',
      componentType: 'Form',
      title: 'Create Support Ticket',
      // TODO: Add support ticket specific fields
      fields: [{
        fieldKey: 'subject',
        label: 'Subject',
        type: 'text',
        required: true,
        placeholder: 'Brief description of the issue'
      }
      // TODO: Add priority, category, customer lookup fields
      ],
      actions: [{
        actionKey: 'submit',
        label: 'Create Ticket',
        style: 'primary'
      }]
    },
    onSubmit: data => {
      console.log('Support ticket created:', data);
      // TODO: Implement ticket creation logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Customer support ticket workflow with issue categorization, priority assignment, and SLA routing.'
      }
    }
  }
}`,...(S=(h=n.parameters)==null?void 0:h.docs)==null?void 0:S.source},description:{story:`Customer Support Ticket

TODO: Demonstrates support ticket creation with:
- Issue categorization and priority
- Customer information lookup
- Attachment handling
- SLA-based routing`,...(D=(T=n.parameters)==null?void 0:T.docs)==null?void 0:D.description}}};const te=["EmployeeOnboarding","ProjectApproval","ExpenseReport","CustomerSupportTicket"];export{n as CustomerSupportTicket,o as EmployeeOnboarding,r as ExpenseReport,t as ProjectApproval,te as __namedExportsOrder,oe as default};
