import{D as h}from"./DynamicUIRenderer-UL-Os6h0.js";import"./jsx-runtime-CmtfZKef.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./DynamicForm-CQvi70jR.js";import"./FormSection-BXhPtV5Y.js";import"./TextInput-B-b59Q_e.js";import"./input-CbSxzvDx.js";import"./utils-CytzSlOG.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";import"./index-C9U_LHPE.js";import"./NumberInput-BM-Ag6sN.js";import"./SelectInput-Cji-AcSY.js";import"./check-M_MmD5Zy.js";import"./TextareaInput-d_sTEtii.js";import"./BooleanInput-DAkAH8Ho.js";import"./checkbox-BGOkVoFJ.js";import"./DateInput-DrtaTLZA.js";import"./FileInput-CkTp4YSM.js";import"./button-BIv8UjPY.js";import"./MultiSelectInput-GIzsWy5u.js";import"./EmailInput-BDtJ9KKU.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-DwxbG8kR.js";import"./QueryClientProvider-mz6q_e7V.js";import"./iframe-BVJQxLgr.js";import"./DynamicDisplay-CN3Fs3X6.js";import"./TableDisplay-BZ_5kpJV.js";import"./CardDisplay-DissT9ux.js";import"./ActionButtons-B9l-49-W.js";import"./DynamicUIErrorBoundary-B-AhmovT.js";import"./DynamicUIStateContext-BU6sB-Jv.js";const Q={title:"Demo Tasks/YC/YC Application",component:h,parameters:{docs:{description:{component:`
# Y Combinator Application Process

Startup accelerator application workflow from initial submission through acceptance.
Demonstrates venture funding processes, startup evaluation, and accelerator workflows.

**Application Stages:**
- Application Submitted - Initial YC application
- Under Review - Application being evaluated
- Interview Invited - Selected for interview round
- Accepted - Accepted into YC batch
- Rejected - Application declined
        `}}},argTypes:{onSubmit:{action:"submitted"},onCancel:{action:"cancelled"},onAction:{action:"action triggered"}}},i={componentId:"yc-application-demo",name:"YC Application",componentType:"Display",title:"{{companyName}} - YC {{batch}} Application",customProps:{displayType:"card",fields:[{key:"founders",label:"Founders"},{key:"industry",label:"Industry"},{key:"stage",label:"Company Stage"},{key:"mrr",label:"Monthly Revenue"},{key:"users",label:"Active Users"},{key:"submissionDate",label:"Submitted"},{key:"lastActivity",label:"Last Activity"},{key:"status",label:"Application Status"},{key:"nextSteps",label:"Next Steps"}],layout:"grid"},actions:[{actionKey:"review_application",label:"Review Application",style:"secondary"},{actionKey:"request_demo",label:"Request Demo",style:"secondary"},{actionKey:"schedule_interview",label:"Schedule Interview",style:"primary",visibleIf:'status == "under_review"'},{actionKey:"accept",label:"Accept",style:"primary",visibleIf:'status == "interviewed"'},{actionKey:"reject",label:"Decline",style:"danger",visibleIf:'status == "under_review" || status == "interviewed"'}]},e={name:"Application Submitted",args:{schema:i,data:{companyName:"FlowAI",batch:"W25",founders:"Sarah Chen (CEO), Mark Thompson (CTO)",industry:"B2B SaaS / AI",stage:"Pre-seed with MVP",mrr:"$8,400",users:"1,247 active users",submissionDate:"Oct 15, 2024",lastActivity:"Application submitted",status:"submitted",nextSteps:"Awaiting initial review"}},parameters:{docs:{description:{story:"Startup application submitted for Y Combinator batch evaluation."}}}},t={name:"Under Review",args:{schema:i,data:{companyName:"FlowAI",batch:"W25",founders:"Sarah Chen (CEO), Mark Thompson (CTO)",industry:"B2B SaaS / AI",stage:"Pre-seed with MVP",mrr:"$8,400 (+15% MoM)",users:"1,247 active users",submissionDate:"Oct 15, 2024",lastActivity:"Partner review in progress",status:"under_review",nextSteps:"Partners evaluating application"}},parameters:{docs:{description:{story:"Application under review by YC partners for potential interview invitation."}}}},a={name:"Interview Invited",args:{schema:{...i,actions:[{actionKey:"view_interview_details",label:"Interview Details",style:"primary"},{actionKey:"reschedule",label:"Reschedule",style:"secondary"},{actionKey:"preparation_materials",label:"Prep Materials",style:"secondary"}]},data:{companyName:"FlowAI",batch:"W25",founders:"Sarah Chen (CEO), Mark Thompson (CTO)",industry:"B2B SaaS / AI",stage:"Pre-seed with MVP",mrr:"$8,400 (+15% MoM)",users:"1,247 active users",submissionDate:"Oct 15, 2024",lastActivity:"Interview scheduled for Nov 5",status:"interview_invited",nextSteps:"Prepare for 10-minute partner interview"}},parameters:{docs:{description:{story:"Startup invited for YC partner interview - a crucial step in the selection process."}}}},n={name:"Accepted into YC",args:{schema:{...i,actions:[{actionKey:"view_acceptance_letter",label:"Acceptance Letter",style:"primary"},{actionKey:"accept_offer",label:"Accept Offer",style:"primary"},{actionKey:"batch_onboarding",label:"Batch Onboarding",style:"secondary"},{actionKey:"connect_founders",label:"Connect with Batch",style:"secondary"}]},data:{companyName:"FlowAI",batch:"W25",founders:"Sarah Chen (CEO), Mark Thompson (CTO)",industry:"B2B SaaS / AI",stage:"Pre-seed with MVP",mrr:"$8,400 (+15% MoM)",users:"1,247 active users",submissionDate:"Oct 15, 2024",lastActivity:"Accepted into YC W25!",status:"accepted",nextSteps:"Complete onboarding by Dec 1, 2024"}},parameters:{docs:{description:{story:"Startup successfully accepted into Y Combinator batch with onboarding next steps."}}}};var r,s,o;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
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
}`,...(o=(s=e.parameters)==null?void 0:s.docs)==null?void 0:o.source}}};var c,p,l;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(l=(p=t.parameters)==null?void 0:p.docs)==null?void 0:l.source}}};var m,d,u;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  name: 'Interview Invited',
  args: {
    schema: {
      ...ycApplicationSchema,
      actions: [{
        actionKey: 'view_interview_details',
        label: 'Interview Details',
        style: 'primary'
      }, {
        actionKey: 'reschedule',
        label: 'Reschedule',
        style: 'secondary'
      }, {
        actionKey: 'preparation_materials',
        label: 'Prep Materials',
        style: 'secondary'
      }]
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
}`,...(u=(d=a.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var y,b,v;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'Accepted into YC',
  args: {
    schema: {
      ...ycApplicationSchema,
      actions: [{
        actionKey: 'view_acceptance_letter',
        label: 'Acceptance Letter',
        style: 'primary'
      }, {
        actionKey: 'accept_offer',
        label: 'Accept Offer',
        style: 'primary'
      }, {
        actionKey: 'batch_onboarding',
        label: 'Batch Onboarding',
        style: 'secondary'
      }, {
        actionKey: 'connect_founders',
        label: 'Connect with Batch',
        style: 'secondary'
      }]
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
}`,...(v=(b=n.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};const X=["ApplicationSubmitted","UnderReview","InterviewInvited","Accepted"];export{n as Accepted,e as ApplicationSubmitted,a as InterviewInvited,t as UnderReview,X as __namedExportsOrder,Q as default};
