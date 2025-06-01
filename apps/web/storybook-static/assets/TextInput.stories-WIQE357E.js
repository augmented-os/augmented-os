import{j as s}from"./jsx-runtime-BT65X5dW.js";import{T as S}from"./TextInput-D1rd6FA3.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./input-dGyvt1gO.js";import"./utils-CytzSlOG.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./index-B5vUWwF_.js";const V={title:"Dynamic UI/Atomic Components/Form Fields/Text Input",component:S,parameters:{layout:"centered",docs:{description:{component:"A flexible text input component for forms with support for validation, error states, and help text."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the input field"},label:{control:"text",description:"Label text displayed above the input"},value:{control:"text",description:"Current value of the input"},onChange:{action:"changed",description:"Callback function called when input value changes"},type:{control:{type:"select"},options:["text","email"],description:"Input type - text or email"},placeholder:{control:"text",description:"Placeholder text shown when input is empty"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[I=>s.jsx("div",{className:"max-w-md",children:s.jsx(I,{})})]},e={args:{id:"name",label:"Full Name",value:"",placeholder:"Enter your full name"}},r={args:{id:"name-filled",label:"Full Name",value:"John Doe",placeholder:"Enter your full name"}},a={args:{id:"name-error",label:"Full Name",value:"",placeholder:"Enter your full name",required:!0,error:"Full name is required"}},t={args:{id:"name-disabled",label:"Full Name",value:"John Doe",placeholder:"Enter your full name"},parameters:{docs:{description:{story:"Disabled state would require adding a disabled prop to the TextInput component."}}}},n={args:{id:"name-required",label:"Full Name",value:"",placeholder:"Enter your full name",required:!0,helpText:"This field is required for account creation"}},o={args:{id:"username",label:"Username",value:"",placeholder:"Choose a unique username",helpText:"Username must be 3-20 characters long and contain only letters, numbers, and underscores"}},l={args:{id:"description",label:"Detailed Project Description and Requirements",value:"",placeholder:"Provide a comprehensive description",helpText:"Include all relevant details about the project scope, requirements, and deliverables"}};var i,d,u;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    id: 'name',
    label: 'Full Name',
    value: '',
    placeholder: 'Enter your full name'
  }
}`,...(u=(d=e.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var c,p,m;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    id: 'name-filled',
    label: 'Full Name',
    value: 'John Doe',
    placeholder: 'Enter your full name'
  }
}`,...(m=(p=r.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var h,b,g;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    id: 'name-error',
    label: 'Full Name',
    value: '',
    placeholder: 'Enter your full name',
    required: true,
    error: 'Full name is required'
  }
}`,...(g=(b=a.parameters)==null?void 0:b.docs)==null?void 0:g.source}}};var x,f,v;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    id: 'name-disabled',
    label: 'Full Name',
    value: 'John Doe',
    placeholder: 'Enter your full name'
    // Note: Disabled state would need to be added to the component
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state would require adding a disabled prop to the TextInput component.'
      }
    }
  }
}`,...(v=(f=t.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};var q,y,T;n.parameters={...n.parameters,docs:{...(q=n.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    id: 'name-required',
    label: 'Full Name',
    value: '',
    placeholder: 'Enter your full name',
    required: true,
    helpText: 'This field is required for account creation'
  }
}`,...(T=(y=n.parameters)==null?void 0:y.docs)==null?void 0:T.source}}};var D,E,F;o.parameters={...o.parameters,docs:{...(D=o.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    id: 'username',
    label: 'Username',
    value: '',
    placeholder: 'Choose a unique username',
    helpText: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores'
  }
}`,...(F=(E=o.parameters)==null?void 0:E.docs)==null?void 0:F.source}}};var N,j,w;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    id: 'description',
    label: 'Detailed Project Description and Requirements',
    value: '',
    placeholder: 'Provide a comprehensive description',
    helpText: 'Include all relevant details about the project scope, requirements, and deliverables'
  }
}`,...(w=(j=l.parameters)==null?void 0:j.docs)==null?void 0:w.source}}};const _=["Default","WithValue","WithError","Disabled","Required","WithHelpText","LongLabel"];export{e as Default,t as Disabled,l as LongLabel,n as Required,a as WithError,o as WithHelpText,r as WithValue,_ as __namedExportsOrder,V as default};
