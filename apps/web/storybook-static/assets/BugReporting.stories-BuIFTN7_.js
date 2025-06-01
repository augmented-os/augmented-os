import{D as f}from"./DynamicUIRenderer-UL-Os6h0.js";import"./jsx-runtime-CmtfZKef.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./DynamicForm-CQvi70jR.js";import"./FormSection-BXhPtV5Y.js";import"./TextInput-B-b59Q_e.js";import"./input-CbSxzvDx.js";import"./utils-CytzSlOG.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";import"./index-C9U_LHPE.js";import"./NumberInput-BM-Ag6sN.js";import"./SelectInput-Cji-AcSY.js";import"./check-M_MmD5Zy.js";import"./TextareaInput-d_sTEtii.js";import"./BooleanInput-DAkAH8Ho.js";import"./checkbox-BGOkVoFJ.js";import"./DateInput-DrtaTLZA.js";import"./FileInput-CkTp4YSM.js";import"./button-BIv8UjPY.js";import"./MultiSelectInput-GIzsWy5u.js";import"./EmailInput-BDtJ9KKU.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-DwxbG8kR.js";import"./QueryClientProvider-mz6q_e7V.js";import"./iframe-BVJQxLgr.js";import"./DynamicDisplay-CN3Fs3X6.js";import"./TableDisplay-BZ_5kpJV.js";import"./CardDisplay-DissT9ux.js";import"./ActionButtons-B9l-49-W.js";import"./DynamicUIErrorBoundary-B-AhmovT.js";import"./DynamicUIStateContext-BU6sB-Jv.js";const Z={title:"Demo Tasks/Coding/Bug Reporting",component:f,parameters:{docs:{description:{component:`
# Bug Reporting System

Bug report submission forms showing different severity levels and validation states.
Demonstrates form handling, file uploads, and validation workflows.

**Scenarios Include:**
- New Bug Report - Clean form ready for input
- Critical Bug - High priority issue reporting
- Bug with Attachments - Including screenshots and logs
- Validation Errors - Form with validation issues
        `}}},argTypes:{onSubmit:{action:"submitted"},onCancel:{action:"cancelled"},onAction:{action:"action triggered"}}},e={componentId:"bug-report-form",name:"Bug Report",componentType:"Form",title:"Report a Bug",description:"Help us improve by reporting issues you encounter",fields:[{fieldKey:"title",label:"Bug Title",type:"text",required:!0,placeholder:"Brief description of the issue"},{fieldKey:"severity",label:"Severity",type:"select",required:!0,options:[{value:"critical",label:"Critical - System Down"},{value:"high",label:"High - Major Feature Broken"},{value:"medium",label:"Medium - Minor Feature Issue"},{value:"low",label:"Low - Cosmetic/Enhancement"}]},{fieldKey:"environment",label:"Environment",type:"select",required:!0,options:[{value:"production",label:"Production"},{value:"staging",label:"Staging"},{value:"development",label:"Development"},{value:"local",label:"Local Development"}]},{fieldKey:"stepsToReproduce",label:"Steps to Reproduce",type:"textarea",required:!0,placeholder:`1. Navigate to...
2. Click on...
3. Observe that...`},{fieldKey:"expectedBehavior",label:"Expected Behavior",type:"textarea",required:!0,placeholder:"What should have happened?"},{fieldKey:"actualBehavior",label:"Actual Behavior",type:"textarea",required:!0,placeholder:"What actually happened?"},{fieldKey:"browserInfo",label:"Browser/Device Info",type:"text",placeholder:"Chrome 119, Safari 17, iPhone 14, etc."},{fieldKey:"screenshots",label:"Screenshots/Logs",type:"file",customProps:{accept:"image/*,.txt,.log",multiple:!0},helpText:"Upload screenshots, error logs, or console output"}],actions:[{actionKey:"submit",label:"Submit Bug Report",style:"primary"},{actionKey:"save_draft",label:"Save Draft",style:"secondary"},{actionKey:"cancel",label:"Cancel",style:"secondary"}]},r={name:"New Bug Report",args:{schema:e,initialData:{}},parameters:{docs:{description:{story:"A clean bug report form ready for user input."}}}},t={name:"Critical Bug - System Down",args:{schema:e,initialData:{title:"Payment processing completely broken",severity:"critical",environment:"production",stepsToReproduce:`1. Go to checkout page
2. Enter payment details
3. Click "Complete Purchase"
4. System shows 500 error`,expectedBehavior:"Payment should process successfully and redirect to confirmation page",actualBehavior:"Server returns 500 Internal Server Error and no payment is processed",browserInfo:"Chrome 119.0.6045.199, Windows 11"}},parameters:{docs:{description:{story:"A critical bug report for a system-down scenario affecting payments."}}}},o={name:"Bug Report with Attachments",args:{schema:e,initialData:{title:"UI layout broken on mobile devices",severity:"medium",environment:"production",stepsToReproduce:`1. Open app on mobile device
2. Navigate to dashboard
3. Observe layout issues`,expectedBehavior:"Dashboard should display properly on mobile with responsive layout",actualBehavior:"Elements overlap and text is cut off on smaller screens",browserInfo:"Safari iOS 17.1, iPhone 14 Pro"}},parameters:{docs:{description:{story:"A bug report with screenshots and supporting documentation attached."}}}},a={name:"Form with Validation Errors",args:{schema:{...e,fields:e.fields.map(i=>({...i,validationErrors:i.required?["This field is required"]:void 0,hasError:i.required}))},initialData:{title:"",severity:"",environment:""}},parameters:{docs:{description:{story:"Bug report form showing validation errors for required fields."}}}};var n,s,l;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  name: 'New Bug Report',
  args: {
    schema: bugReportSchema,
    initialData: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'A clean bug report form ready for user input.'
      }
    }
  }
}`,...(l=(s=r.parameters)==null?void 0:s.docs)==null?void 0:l.source}}};var p,c,m;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  name: 'Critical Bug - System Down',
  args: {
    schema: bugReportSchema,
    initialData: {
      title: 'Payment processing completely broken',
      severity: 'critical',
      environment: 'production',
      stepsToReproduce: '1. Go to checkout page\\n2. Enter payment details\\n3. Click "Complete Purchase"\\n4. System shows 500 error',
      expectedBehavior: 'Payment should process successfully and redirect to confirmation page',
      actualBehavior: 'Server returns 500 Internal Server Error and no payment is processed',
      browserInfo: 'Chrome 119.0.6045.199, Windows 11'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'A critical bug report for a system-down scenario affecting payments.'
      }
    }
  }
}`,...(m=(c=t.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var d,u,h;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`{
  name: 'Bug Report with Attachments',
  args: {
    schema: bugReportSchema,
    initialData: {
      title: 'UI layout broken on mobile devices',
      severity: 'medium',
      environment: 'production',
      stepsToReproduce: '1. Open app on mobile device\\n2. Navigate to dashboard\\n3. Observe layout issues',
      expectedBehavior: 'Dashboard should display properly on mobile with responsive layout',
      actualBehavior: 'Elements overlap and text is cut off on smaller screens',
      browserInfo: 'Safari iOS 17.1, iPhone 14 Pro'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'A bug report with screenshots and supporting documentation attached.'
      }
    }
  }
}`,...(h=(u=o.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var g,y,v;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: 'Form with Validation Errors',
  args: {
    schema: {
      ...bugReportSchema,
      fields: bugReportSchema.fields.map(field => ({
        ...field,
        validationErrors: field.required ? ['This field is required'] : undefined,
        hasError: field.required
      }))
    },
    initialData: {
      title: '',
      severity: '',
      environment: ''
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Bug report form showing validation errors for required fields.'
      }
    }
  }
}`,...(v=(y=a.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};const $=["NewBugReport","CriticalBug","BugWithAttachments","ValidationErrors"];export{o as BugWithAttachments,t as CriticalBug,r as NewBugReport,a as ValidationErrors,$ as __namedExportsOrder,Z as default};
