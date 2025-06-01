import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{I as Q}from"./input-LIyW3PKO.js";import{L as X}from"./label-BpIRGnnY.js";import{c as g}from"./utils-fDSEsyX8.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-CFX93qP1.js";const r=({id:a,label:O,value:v,onChange:G,placeholder:J="Enter email address",required:x,error:K,helpText:h})=>{const E=v&&!(s=>s?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s):!0)(v),i=K||(E?"Please enter a valid email address":void 0);return e.jsxs("div",{className:"space-y-2",children:[e.jsx(X,{htmlFor:a,className:g("text-sm font-medium text-foreground",x&&"after:content-['*'] after:ml-1 after:text-destructive"),children:O}),e.jsxs("div",{className:"relative",children:[e.jsx(Q,{id:a,type:"email",value:v,onChange:s=>G(s.target.value),placeholder:J,required:x,className:g("w-full pr-10",i&&"border-destructive focus:ring-destructive"),"aria-describedby":i?`${a}-error`:h?`${a}-help`:void 0}),e.jsx("div",{className:"absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none",children:e.jsx("svg",{className:g("h-4 w-4",E?"text-destructive":"text-muted-foreground"),fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"})})})]}),i&&e.jsx("div",{id:`${a}-error`,className:"text-sm text-destructive",role:"alert",children:i}),h&&!i&&e.jsx("div",{id:`${a}-help`,className:"text-sm text-muted-foreground",children:h})]})},te={title:"DynamicUI/Fields/EmailInput",component:r,parameters:{layout:"centered",docs:{description:{component:"An email input component with built-in validation, visual feedback, and email icon. Provides real-time validation feedback for email format."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the input field"},label:{control:"text",description:"Label text displayed above the input"},value:{control:"text",description:"Current email value of the input"},onChange:{action:"changed",description:"Callback function called when input value changes"},placeholder:{control:"text",description:"Placeholder text shown when input is empty"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[a=>e.jsx("div",{className:"max-w-md",children:e.jsx(a,{})})]},l={args:{id:"email",label:"Email Address",value:"",placeholder:"Enter email address"}},o={args:{id:"email-filled",label:"Email Address",value:"john.doe@example.com"}},t={args:{id:"email-valid",label:"Work Email",value:"sarah.smith@company.org",helpText:"Please use your work email address"}},n={args:{id:"email-invalid",label:"Email Address",value:"invalid-email",helpText:"Enter a valid email address"},parameters:{docs:{description:{story:"Shows built-in validation feedback when an invalid email format is entered."}}}},d={args:{id:"email-error",label:"Email Address",value:"",required:!0,error:"Email address is required for account creation"}},m={args:{id:"email-required",label:"Email Address",value:"",required:!0,helpText:"We will use this email to send you important updates"}},c={args:{id:"support-email",label:"Support Email",value:"",placeholder:"support@yourcompany.com",helpText:"Email address for customer support inquiries"}},u={args:{id:"long-email",label:"Email Address",value:"very.long.email.address@subdomain.example-company.co.uk",helpText:"Long email addresses are supported"}},p={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(r,{id:"email-empty",label:"Empty (Valid)",value:"",onChange:()=>{},helpText:"Empty is considered valid"}),e.jsx(r,{id:"email-valid-simple",label:"Valid Simple",value:"user@example.com",onChange:()=>{}}),e.jsx(r,{id:"email-valid-complex",label:"Valid Complex",value:"user.name+tag@sub.domain.com",onChange:()=>{}}),e.jsx(r,{id:"email-invalid-format",label:"Invalid Format",value:"user@",onChange:()=>{}}),e.jsx(r,{id:"email-invalid-domain",label:"Invalid Domain",value:"user@domain",onChange:()=>{}})]}),parameters:{docs:{description:{story:"Demonstrates various email validation states in a single view."}}}};var b,f,y;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    id: 'email',
    label: 'Email Address',
    value: '',
    placeholder: 'Enter email address'
  }
}`,...(y=(f=l.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var j,C,w;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    id: 'email-filled',
    label: 'Email Address',
    value: 'john.doe@example.com'
  }
}`,...(w=(C=o.parameters)==null?void 0:C.docs)==null?void 0:w.source}}};var S,I,V;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    id: 'email-valid',
    label: 'Work Email',
    value: 'sarah.smith@company.org',
    helpText: 'Please use your work email address'
  }
}`,...(V=(I=t.parameters)==null?void 0:I.docs)==null?void 0:V.source}}};var k,A,q;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    id: 'email-invalid',
    label: 'Email Address',
    value: 'invalid-email',
    helpText: 'Enter a valid email address'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows built-in validation feedback when an invalid email format is entered.'
      }
    }
  }
}`,...(q=(A=n.parameters)==null?void 0:A.docs)==null?void 0:q.source}}};var T,W,N;d.parameters={...d.parameters,docs:{...(T=d.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    id: 'email-error',
    label: 'Email Address',
    value: '',
    required: true,
    error: 'Email address is required for account creation'
  }
}`,...(N=(W=d.parameters)==null?void 0:W.docs)==null?void 0:N.source}}};var L,D,P;m.parameters={...m.parameters,docs:{...(L=m.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    id: 'email-required',
    label: 'Email Address',
    value: '',
    required: true,
    helpText: 'We will use this email to send you important updates'
  }
}`,...(P=(D=m.parameters)==null?void 0:D.docs)==null?void 0:P.source}}};var R,$,F;c.parameters={...c.parameters,docs:{...(R=c.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    id: 'support-email',
    label: 'Support Email',
    value: '',
    placeholder: 'support@yourcompany.com',
    helpText: 'Email address for customer support inquiries'
  }
}`,...(F=($=c.parameters)==null?void 0:$.docs)==null?void 0:F.source}}};var M,U,_;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    id: 'long-email',
    label: 'Email Address',
    value: 'very.long.email.address@subdomain.example-company.co.uk',
    helpText: 'Long email addresses are supported'
  }
}`,...(_=(U=u.parameters)==null?void 0:U.docs)==null?void 0:_.source}}};var z,B,H;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <EmailInput id="email-empty" label="Empty (Valid)" value="" onChange={() => {}} helpText="Empty is considered valid" />
      <EmailInput id="email-valid-simple" label="Valid Simple" value="user@example.com" onChange={() => {}} />
      <EmailInput id="email-valid-complex" label="Valid Complex" value="user.name+tag@sub.domain.com" onChange={() => {}} />
      <EmailInput id="email-invalid-format" label="Invalid Format" value="user@" onChange={() => {}} />
      <EmailInput id="email-invalid-domain" label="Invalid Domain" value="user@domain" onChange={() => {}} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates various email validation states in a single view.'
      }
    }
  }
}`,...(H=(B=p.parameters)==null?void 0:B.docs)==null?void 0:H.source}}};const ne=["Default","WithValue","ValidEmail","InvalidEmail","WithError","Required","WithCustomPlaceholder","LongEmailAddress","MultipleValidationStates"];export{l as Default,n as InvalidEmail,u as LongEmailAddress,p as MultipleValidationStates,m as Required,t as ValidEmail,c as WithCustomPlaceholder,d as WithError,o as WithValue,ne as __namedExportsOrder,te as default};
