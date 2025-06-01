import{D as v}from"./DynamicUIRenderer-DW83NvMH.js";import"./jsx-runtime-BT65X5dW.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./DynamicForm-OHA8l7o_.js";import"./FormSection-BXqWezJv.js";import"./TextInput-D1rd6FA3.js";import"./input-dGyvt1gO.js";import"./utils-CytzSlOG.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./index-B5vUWwF_.js";import"./NumberInput-DNalEYdP.js";import"./SelectInput-bHGg1ngK.js";import"./check-BvmRBcsD.js";import"./TextareaInput-DTn6fcBx.js";import"./BooleanInput-BbQ8GhQ8.js";import"./checkbox-DAvk8bKM.js";import"./DateInput-Cgcb2E7S.js";import"./FileInput-ltJkPhXW.js";import"./button-DTZ1A7rA.js";import"./MultiSelectInput-BlXkhP6C.js";import"./EmailInput-BZWgOOXu.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-CiQj-xe7.js";import"./QueryClientProvider-9W50J78D.js";import"./iframe-CSMkAxJl.js";import"./DynamicDisplay-CW0ZWIbw.js";import"./TableDisplay-CACaD82O.js";import"./CardDisplay-3IRVwmAz.js";import"./ActionButtons-4328mjEA.js";import"./DynamicUIErrorBoundary-Ca1kF0AK.js";import"./DynamicUIStateContext-BrzZPoL3.js";const X={title:"Demo Tasks/Finance/Loan Application",component:v,parameters:{docs:{description:{component:`
# Loan Application Process

Complete loan application workflow from initial submission through approval and funding.
Demonstrates financial workflows, credit assessment, and approval processes.

**Application Stages:**
- Application Submitted - Initial loan request
- Under Review - Credit check and documentation review
- Approved - Loan approved with terms
- Funded - Loan amount disbursed
- Rejected - Application declined
        `}}},argTypes:{onSubmit:{action:"submitted"},onCancel:{action:"cancelled"},onAction:{action:"action triggered"}}},o={componentId:"loan-application-demo",name:"Loan Application",componentType:"Display",title:"Loan Application #{{applicationId}}",customProps:{displayType:"card",fields:[{key:"applicantName",label:"Applicant"},{key:"loanAmount",label:"Loan Amount"},{key:"loanPurpose",label:"Purpose"},{key:"submissionDate",label:"Submitted"},{key:"creditScore",label:"Credit Score"},{key:"annualIncome",label:"Annual Income"},{key:"employmentStatus",label:"Employment"},{key:"status",label:"Application Status"},{key:"interestRate",label:"Offered Rate"}],layout:"grid"},actions:[{actionKey:"review_docs",label:"Review Documents",style:"secondary"},{actionKey:"request_info",label:"Request More Info",style:"secondary"},{actionKey:"approve",label:"Approve",style:"primary",visibleIf:'status == "under_review"'},{actionKey:"reject",label:"Reject",style:"danger",visibleIf:'status == "under_review"'},{actionKey:"disburse",label:"Disburse Funds",style:"primary",visibleIf:'status == "approved"'}]},e={name:"Application Submitted",args:{schema:o,data:{applicationId:"LA-2024-009847",applicantName:"Michael Rodriguez",loanAmount:"$25,000",loanPurpose:"Home Improvement",submissionDate:"Oct 24, 2024 9:15 AM",creditScore:"Pending verification",annualIncome:"$68,500",employmentStatus:"Full-time (3 years)",status:"submitted",interestRate:"Pending approval"}},parameters:{docs:{description:{story:"New loan application submitted and awaiting initial processing."}}}},n={name:"Under Review",args:{schema:o,data:{applicationId:"LA-2024-009847",applicantName:"Michael Rodriguez",loanAmount:"$25,000",loanPurpose:"Home Improvement",submissionDate:"Oct 24, 2024 9:15 AM",creditScore:"742 (Good)",annualIncome:"$68,500",employmentStatus:"Full-time (3 years)",status:"under_review",interestRate:"Calculating..."}},parameters:{docs:{description:{story:"Application under review with credit check completed and awaiting underwriting decision."}}}},a={name:"Loan Approved",args:{schema:o,data:{applicationId:"LA-2024-009847",applicantName:"Michael Rodriguez",loanAmount:"$25,000",loanPurpose:"Home Improvement",submissionDate:"Oct 24, 2024 9:15 AM",creditScore:"742 (Good)",annualIncome:"$68,500",employmentStatus:"Full-time (3 years)",status:"approved",interestRate:"7.25% APR (60 months)"}},parameters:{docs:{description:{story:"Loan application approved with terms and ready for fund disbursement."}}}},t={name:"Funds Disbursed",args:{schema:{...o,actions:[{actionKey:"view_schedule",label:"Payment Schedule",style:"secondary"},{actionKey:"setup_autopay",label:"Setup Auto-pay",style:"secondary"},{actionKey:"contact_borrower",label:"Contact Borrower",style:"secondary"}]},data:{applicationId:"LA-2024-009847",applicantName:"Michael Rodriguez",loanAmount:"$25,000 (Disbursed)",loanPurpose:"Home Improvement",submissionDate:"Oct 24, 2024 9:15 AM",creditScore:"742 (Good)",annualIncome:"$68,500",employmentStatus:"Full-time (3 years)",status:"funded",interestRate:"7.25% APR (60 months)"}},parameters:{docs:{description:{story:"Loan successfully funded with payment schedule active."}}}};var i,r,s;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  name: 'Application Submitted',
  args: {
    schema: loanApplicationSchema,
    data: {
      applicationId: 'LA-2024-009847',
      applicantName: 'Michael Rodriguez',
      loanAmount: '$25,000',
      loanPurpose: 'Home Improvement',
      submissionDate: 'Oct 24, 2024 9:15 AM',
      creditScore: 'Pending verification',
      annualIncome: '$68,500',
      employmentStatus: 'Full-time (3 years)',
      status: 'submitted',
      interestRate: 'Pending approval'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'New loan application submitted and awaiting initial processing.'
      }
    }
  }
}`,...(s=(r=e.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};var p,c,m;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  name: 'Under Review',
  args: {
    schema: loanApplicationSchema,
    data: {
      applicationId: 'LA-2024-009847',
      applicantName: 'Michael Rodriguez',
      loanAmount: '$25,000',
      loanPurpose: 'Home Improvement',
      submissionDate: 'Oct 24, 2024 9:15 AM',
      creditScore: '742 (Good)',
      annualIncome: '$68,500',
      employmentStatus: 'Full-time (3 years)',
      status: 'under_review',
      interestRate: 'Calculating...'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Application under review with credit check completed and awaiting underwriting decision.'
      }
    }
  }
}`,...(m=(c=n.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var l,d,u;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  name: 'Loan Approved',
  args: {
    schema: loanApplicationSchema,
    data: {
      applicationId: 'LA-2024-009847',
      applicantName: 'Michael Rodriguez',
      loanAmount: '$25,000',
      loanPurpose: 'Home Improvement',
      submissionDate: 'Oct 24, 2024 9:15 AM',
      creditScore: '742 (Good)',
      annualIncome: '$68,500',
      employmentStatus: 'Full-time (3 years)',
      status: 'approved',
      interestRate: '7.25% APR (60 months)'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Loan application approved with terms and ready for fund disbursement.'
      }
    }
  }
}`,...(u=(d=a.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var y,A,b;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'Funds Disbursed',
  args: {
    schema: {
      ...loanApplicationSchema,
      actions: [{
        actionKey: 'view_schedule',
        label: 'Payment Schedule',
        style: 'secondary'
      }, {
        actionKey: 'setup_autopay',
        label: 'Setup Auto-pay',
        style: 'secondary'
      }, {
        actionKey: 'contact_borrower',
        label: 'Contact Borrower',
        style: 'secondary'
      }]
    },
    data: {
      applicationId: 'LA-2024-009847',
      applicantName: 'Michael Rodriguez',
      loanAmount: '$25,000 (Disbursed)',
      loanPurpose: 'Home Improvement',
      submissionDate: 'Oct 24, 2024 9:15 AM',
      creditScore: '742 (Good)',
      annualIncome: '$68,500',
      employmentStatus: 'Full-time (3 years)',
      status: 'funded',
      interestRate: '7.25% APR (60 months)'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Loan successfully funded with payment schedule active.'
      }
    }
  }
}`,...(b=(A=t.parameters)==null?void 0:A.docs)==null?void 0:b.source}}};const Y=["ApplicationSubmitted","UnderReview","Approved","Funded"];export{e as ApplicationSubmitted,a as Approved,t as Funded,n as UnderReview,Y as __namedExportsOrder,X as default};
