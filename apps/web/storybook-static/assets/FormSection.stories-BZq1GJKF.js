import{j as s}from"./jsx-runtime-CmtfZKef.js";import{F as P}from"./FormSection-BXhPtV5Y.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./TextInput-B-b59Q_e.js";import"./input-CbSxzvDx.js";import"./utils-CytzSlOG.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";import"./index-C9U_LHPE.js";import"./NumberInput-BM-Ag6sN.js";import"./SelectInput-Cji-AcSY.js";import"./check-M_MmD5Zy.js";import"./TextareaInput-d_sTEtii.js";import"./BooleanInput-DAkAH8Ho.js";import"./checkbox-BGOkVoFJ.js";import"./DateInput-DrtaTLZA.js";import"./FileInput-CkTp4YSM.js";import"./button-BIv8UjPY.js";import"./MultiSelectInput-GIzsWy5u.js";import"./EmailInput-BDtJ9KKU.js";import"./conditions-CsAx6Gnl.js";const ae={title:"Dynamic UI/Composite Components/Form Section",component:P,parameters:{layout:"padded",docs:{description:{component:"A form section component that groups related fields with optional collapsible functionality. Supports various field types and layouts."}}},tags:["autodocs"],argTypes:{section:{control:"object",description:"Section configuration including title, fields, and collapse settings"},fields:{control:"object",description:"Array of field definitions to render in the section"},formData:{control:"object",description:"Current form data object"},errors:{control:"object",description:"Object mapping field keys to error messages"},onFieldChange:{action:"field-changed",description:"Callback function called when a field value changes"}},decorators:[C=>s.jsx("div",{className:"max-w-2xl",children:s.jsx(C,{})})]},M=[{fieldKey:"firstName",label:"First Name",type:"text",placeholder:"Enter your first name",required:!0},{fieldKey:"lastName",label:"Last Name",type:"text",placeholder:"Enter your last name",required:!0},{fieldKey:"email",label:"Email",type:"email",placeholder:"Enter your email address",required:!0}],o=[{fieldKey:"department",label:"Department",type:"select",required:!0,options:[{value:"engineering",label:"Engineering"},{value:"marketing",label:"Marketing"},{value:"sales",label:"Sales"},{value:"hr",label:"Human Resources"}]},{fieldKey:"isManager",label:"Are you a manager?",type:"boolean"},{fieldKey:"teamSize",label:"Team Size",type:"number",placeholder:"Number of direct reports",visibleIf:"isManager == true"},{fieldKey:"skills",label:"Skills",type:"multi-select",options:[{value:"javascript",label:"JavaScript"},{value:"typescript",label:"TypeScript"},{value:"react",label:"React"},{value:"nodejs",label:"Node.js"},{value:"python",label:"Python"}]},{fieldKey:"bio",label:"Bio",type:"textarea",placeholder:"Tell us about yourself...",helpText:"Brief description of your background and experience"}],e={args:{section:{title:"Personal Information",fields:["firstName","lastName","email"],collapsible:!1,defaultExpanded:!0},fields:M,formData:{firstName:"John",lastName:"Doe",email:"john.doe@example.com"},errors:{}}},a={args:{section:{title:"Personal Information",fields:["firstName","lastName","email"],collapsible:!1,defaultExpanded:!0},fields:M,formData:{firstName:"",lastName:"Doe",email:"invalid-email"},errors:{firstName:"First name is required",email:"Please enter a valid email address"}}},t={args:{section:{title:"Professional Details",fields:["department","isManager","teamSize","skills","bio"],collapsible:!0,defaultExpanded:!0},fields:o,formData:{department:"engineering",isManager:!0,teamSize:5,skills:["javascript","typescript","react"],bio:"Experienced software engineer with a passion for building great products."},errors:{}}},r={args:{section:{title:"Optional Information",fields:["department","isManager","teamSize","skills","bio"],collapsible:!0,defaultExpanded:!1},fields:o,formData:{},errors:{}}},i={args:{section:{title:"Management Information",fields:["department","isManager","teamSize","skills","bio"],collapsible:!1,defaultExpanded:!0},fields:o,formData:{department:"engineering",isManager:!0,teamSize:8,skills:["javascript","typescript"],bio:"Engineering manager with 10+ years of experience."},errors:{}}},n={args:{section:{title:"Application Details",fields:["position","experience","remote","startDate","resume","coverLetter"],collapsible:!1,defaultExpanded:!0},fields:[{fieldKey:"position",label:"Position",type:"select",required:!0,options:[{value:"frontend",label:"Frontend Developer"},{value:"backend",label:"Backend Developer"},{value:"fullstack",label:"Full Stack Developer"}]},{fieldKey:"experience",label:"Years of Experience",type:"number",required:!0,placeholder:"e.g., 5"},{fieldKey:"remote",label:"Open to remote work",type:"boolean"},{fieldKey:"startDate",label:"Available Start Date",type:"date",required:!0},{fieldKey:"resume",label:"Resume",type:"file",required:!0,customProps:{accept:".pdf,.doc,.docx"}},{fieldKey:"coverLetter",label:"Cover Letter",type:"textarea",placeholder:"Tell us why you're interested in this position...",helpText:"Optional but recommended"}],formData:{position:"fullstack",experience:5,remote:!0,startDate:"2024-01-15",coverLetter:"I am very excited about this opportunity..."},errors:{resume:"Please upload your resume"}}},l={args:{section:{title:"Empty Section",fields:[],collapsible:!1,defaultExpanded:!0},fields:[],formData:{},errors:{}}};var d,p,c;e.parameters={...e.parameters,docs:{...(d=e.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    section: {
      title: 'Personal Information',
      fields: ['firstName', 'lastName', 'email'],
      collapsible: false,
      defaultExpanded: true
    } as FormSectionType,
    fields: basicFields,
    formData: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    },
    errors: {}
  }
}`,...(c=(p=e.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};var m,u,f;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    section: {
      title: 'Personal Information',
      fields: ['firstName', 'lastName', 'email'],
      collapsible: false,
      defaultExpanded: true
    } as FormSectionType,
    fields: basicFields,
    formData: {
      firstName: '',
      lastName: 'Doe',
      email: 'invalid-email'
    },
    errors: {
      firstName: 'First name is required',
      email: 'Please enter a valid email address'
    }
  }
}`,...(f=(u=a.parameters)==null?void 0:u.docs)==null?void 0:f.source}}};var b,y,g;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    section: {
      title: 'Professional Details',
      fields: ['department', 'isManager', 'teamSize', 'skills', 'bio'],
      collapsible: true,
      defaultExpanded: true
    } as FormSectionType,
    fields: complexFields,
    formData: {
      department: 'engineering',
      isManager: true,
      teamSize: 5,
      skills: ['javascript', 'typescript', 'react'],
      bio: 'Experienced software engineer with a passion for building great products.'
    },
    errors: {}
  }
}`,...(g=(y=t.parameters)==null?void 0:y.docs)==null?void 0:g.source}}};var x,v,S;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    section: {
      title: 'Optional Information',
      fields: ['department', 'isManager', 'teamSize', 'skills', 'bio'],
      collapsible: true,
      defaultExpanded: false
    } as FormSectionType,
    fields: complexFields,
    formData: {},
    errors: {}
  }
}`,...(S=(v=r.parameters)==null?void 0:v.docs)==null?void 0:S.source}}};var h,D,E;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    section: {
      title: 'Management Information',
      fields: ['department', 'isManager', 'teamSize', 'skills', 'bio'],
      collapsible: false,
      defaultExpanded: true
    } as FormSectionType,
    fields: complexFields,
    formData: {
      department: 'engineering',
      isManager: true,
      teamSize: 8,
      skills: ['javascript', 'typescript'],
      bio: 'Engineering manager with 10+ years of experience.'
    },
    errors: {}
  }
}`,...(E=(D=i.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};var k,F,N;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    section: {
      title: 'Application Details',
      fields: ['position', 'experience', 'remote', 'startDate', 'resume', 'coverLetter'],
      collapsible: false,
      defaultExpanded: true
    } as FormSectionType,
    fields: [{
      fieldKey: 'position',
      label: 'Position',
      type: 'select',
      required: true,
      options: [{
        value: 'frontend',
        label: 'Frontend Developer'
      }, {
        value: 'backend',
        label: 'Backend Developer'
      }, {
        value: 'fullstack',
        label: 'Full Stack Developer'
      }]
    }, {
      fieldKey: 'experience',
      label: 'Years of Experience',
      type: 'number',
      required: true,
      placeholder: 'e.g., 5'
    }, {
      fieldKey: 'remote',
      label: 'Open to remote work',
      type: 'boolean'
    }, {
      fieldKey: 'startDate',
      label: 'Available Start Date',
      type: 'date',
      required: true
    }, {
      fieldKey: 'resume',
      label: 'Resume',
      type: 'file',
      required: true,
      customProps: {
        accept: '.pdf,.doc,.docx'
      }
    }, {
      fieldKey: 'coverLetter',
      label: 'Cover Letter',
      type: 'textarea',
      placeholder: 'Tell us why you\\'re interested in this position...',
      helpText: 'Optional but recommended'
    }],
    formData: {
      position: 'fullstack',
      experience: 5,
      remote: true,
      startDate: '2024-01-15',
      coverLetter: 'I am very excited about this opportunity...'
    },
    errors: {
      resume: 'Please upload your resume'
    }
  }
}`,...(N=(F=n.parameters)==null?void 0:F.docs)==null?void 0:N.source}}};var K,j,T;l.parameters={...l.parameters,docs:{...(K=l.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    section: {
      title: 'Empty Section',
      fields: [],
      collapsible: false,
      defaultExpanded: true
    } as FormSectionType,
    fields: [],
    formData: {},
    errors: {}
  }
}`,...(T=(j=l.parameters)==null?void 0:j.docs)==null?void 0:T.source}}};const te=["BasicSection","WithValidationErrors","CollapsibleExpanded","CollapsibleCollapsed","WithConditionalFields","MixedFieldTypes","EmptySection"];export{e as BasicSection,r as CollapsibleCollapsed,t as CollapsibleExpanded,l as EmptySection,n as MixedFieldTypes,i as WithConditionalFields,a as WithValidationErrors,te as __namedExportsOrder,ae as default};
