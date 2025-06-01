import{j as e}from"./jsx-runtime-BT65X5dW.js";import{E as a}from"./EmailInput-BZWgOOXu.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./input-dGyvt1gO.js";import"./utils-CytzSlOG.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./index-B5vUWwF_.js";const K={title:"Dynamic UI/Atomic Components/Form Fields/Email Input",component:a,parameters:{layout:"centered",docs:{description:{component:"An email input component with built-in validation, visual feedback, and email icon. Provides real-time validation feedback for email format."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the input field"},label:{control:"text",description:"Label text displayed above the input"},value:{control:"text",description:"Current email value of the input"},onChange:{action:"changed",description:"Callback function called when input value changes"},placeholder:{control:"text",description:"Placeholder text shown when input is empty"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[R=>e.jsx("div",{className:"max-w-md",children:e.jsx(R,{})})]},r={args:{id:"email",label:"Email Address",value:"",placeholder:"Enter email address"}},i={args:{id:"email-filled",label:"Email Address",value:"john.doe@example.com"}},l={args:{id:"email-valid",label:"Work Email",value:"sarah.smith@company.org",helpText:"Please use your work email address"}},s={args:{id:"email-invalid",label:"Email Address",value:"invalid-email",helpText:"Enter a valid email address"},parameters:{docs:{description:{story:"Shows built-in validation feedback when an invalid email format is entered."}}}},o={args:{id:"email-error",label:"Email Address",value:"",required:!0,error:"Email address is required for account creation"}},n={args:{id:"email-required",label:"Email Address",value:"",required:!0,helpText:"We will use this email to send you important updates"}},t={args:{id:"support-email",label:"Support Email",value:"",placeholder:"support@yourcompany.com",helpText:"Email address for customer support inquiries"}},d={args:{id:"long-email",label:"Email Address",value:"very.long.email.address@subdomain.example-company.co.uk",helpText:"Long email addresses are supported"}},m={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(a,{id:"email-empty",label:"Empty (Valid)",value:"",onChange:()=>{},helpText:"Empty is considered valid"}),e.jsx(a,{id:"email-valid-simple",label:"Valid Simple",value:"user@example.com",onChange:()=>{}}),e.jsx(a,{id:"email-valid-complex",label:"Valid Complex",value:"user.name+tag@sub.domain.com",onChange:()=>{}}),e.jsx(a,{id:"email-invalid-format",label:"Invalid Format",value:"user@",onChange:()=>{}}),e.jsx(a,{id:"email-invalid-domain",label:"Invalid Domain",value:"user@domain",onChange:()=>{}})]}),parameters:{docs:{description:{story:"Demonstrates various email validation states in a single view."}}}};var p,c,u;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    id: 'email',
    label: 'Email Address',
    value: '',
    placeholder: 'Enter email address'
  }
}`,...(u=(c=r.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var v,h,g;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    id: 'email-filled',
    label: 'Email Address',
    value: 'john.doe@example.com'
  }
}`,...(g=(h=i.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var E,x,b;l.parameters={...l.parameters,docs:{...(E=l.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    id: 'email-valid',
    label: 'Work Email',
    value: 'sarah.smith@company.org',
    helpText: 'Please use your work email address'
  }
}`,...(b=(x=l.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var y,f,C;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(C=(f=s.parameters)==null?void 0:f.docs)==null?void 0:C.source}}};var S,A,q;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    id: 'email-error',
    label: 'Email Address',
    value: '',
    required: true,
    error: 'Email address is required for account creation'
  }
}`,...(q=(A=o.parameters)==null?void 0:A.docs)==null?void 0:q.source}}};var w,I,T;n.parameters={...n.parameters,docs:{...(w=n.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    id: 'email-required',
    label: 'Email Address',
    value: '',
    required: true,
    helpText: 'We will use this email to send you important updates'
  }
}`,...(T=(I=n.parameters)==null?void 0:I.docs)==null?void 0:T.source}}};var j,V,k;t.parameters={...t.parameters,docs:{...(j=t.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    id: 'support-email',
    label: 'Support Email',
    value: '',
    placeholder: 'support@yourcompany.com',
    helpText: 'Email address for customer support inquiries'
  }
}`,...(k=(V=t.parameters)==null?void 0:V.docs)==null?void 0:k.source}}};var W,D,P;d.parameters={...d.parameters,docs:{...(W=d.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    id: 'long-email',
    label: 'Email Address',
    value: 'very.long.email.address@subdomain.example-company.co.uk',
    helpText: 'Long email addresses are supported'
  }
}`,...(P=(D=d.parameters)==null?void 0:D.docs)==null?void 0:P.source}}};var L,F,N;m.parameters={...m.parameters,docs:{...(L=m.parameters)==null?void 0:L.docs,source:{originalSource:`{
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
}`,...(N=(F=m.parameters)==null?void 0:F.docs)==null?void 0:N.source}}};const Q=["Default","WithValue","ValidEmail","InvalidEmail","WithError","Required","WithCustomPlaceholder","LongEmailAddress","MultipleValidationStates"];export{r as Default,s as InvalidEmail,d as LongEmailAddress,m as MultipleValidationStates,n as Required,l as ValidEmail,t as WithCustomPlaceholder,o as WithError,i as WithValue,Q as __namedExportsOrder,K as default};
