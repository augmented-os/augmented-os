import{j as r}from"./jsx-runtime-DF2Pcvd1.js";import{I as V}from"./input-LIyW3PKO.js";import{L as _}from"./label-BpIRGnnY.js";import{c as p}from"./utils-fDSEsyX8.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-CFX93qP1.js";const k=({id:e,label:U,value:P,onChange:R,type:J="text",placeholder:$,required:u,error:a,helpText:c})=>r.jsxs("div",{className:"space-y-2",children:[r.jsx(_,{htmlFor:e,className:p("text-sm font-medium text-foreground",u&&"after:content-['*'] after:ml-1 after:text-destructive"),children:U}),r.jsx(V,{id:e,type:J,value:P,onChange:H=>R(H.target.value),placeholder:$,required:u,className:p("w-full",a&&"border-destructive focus:ring-destructive"),"aria-describedby":a?`${e}-error`:c?`${e}-help`:void 0}),a&&r.jsx("div",{id:`${e}-error`,className:"text-sm text-destructive",role:"alert",children:a}),c&&!a&&r.jsx("div",{id:`${e}-help`,className:"text-sm text-muted-foreground",children:c})]}),Q={title:"DynamicUI/Fields/TextInput",component:k,parameters:{layout:"centered",docs:{description:{component:"A flexible text input component for forms with support for validation, error states, and help text."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the input field"},label:{control:"text",description:"Label text displayed above the input"},value:{control:"text",description:"Current value of the input"},onChange:{action:"changed",description:"Callback function called when input value changes"},type:{control:{type:"select"},options:["text","email"],description:"Input type - text or email"},placeholder:{control:"text",description:"Placeholder text shown when input is empty"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[e=>r.jsx("div",{className:"max-w-md",children:r.jsx(e,{})})]},t={args:{id:"name",label:"Full Name",value:"",placeholder:"Enter your full name"}},n={args:{id:"name-filled",label:"Full Name",value:"John Doe",placeholder:"Enter your full name"}},o={args:{id:"name-error",label:"Full Name",value:"",placeholder:"Enter your full name",required:!0,error:"Full name is required"}},l={args:{id:"name-disabled",label:"Full Name",value:"John Doe",placeholder:"Enter your full name"},parameters:{docs:{description:{story:"Disabled state would require adding a disabled prop to the TextInput component."}}}},s={args:{id:"name-required",label:"Full Name",value:"",placeholder:"Enter your full name",required:!0,helpText:"This field is required for account creation"}},i={args:{id:"username",label:"Username",value:"",placeholder:"Choose a unique username",helpText:"Username must be 3-20 characters long and contain only letters, numbers, and underscores"}},d={args:{id:"description",label:"Detailed Project Description and Requirements",value:"",placeholder:"Provide a comprehensive description",helpText:"Include all relevant details about the project scope, requirements, and deliverables"}};var m,h,x;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    id: 'name',
    label: 'Full Name',
    value: '',
    placeholder: 'Enter your full name'
  }
}`,...(x=(h=t.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var b,f,g;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    id: 'name-filled',
    label: 'Full Name',
    value: 'John Doe',
    placeholder: 'Enter your full name'
  }
}`,...(g=(f=n.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var v,y,q;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    id: 'name-error',
    label: 'Full Name',
    value: '',
    placeholder: 'Enter your full name',
    required: true,
    error: 'Full name is required'
  }
}`,...(q=(y=o.parameters)==null?void 0:y.docs)==null?void 0:q.source}}};var N,D,E;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
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
}`,...(E=(D=l.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};var F,T,j;s.parameters={...s.parameters,docs:{...(F=s.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    id: 'name-required',
    label: 'Full Name',
    value: '',
    placeholder: 'Enter your full name',
    required: true,
    helpText: 'This field is required for account creation'
  }
}`,...(j=(T=s.parameters)==null?void 0:T.docs)==null?void 0:j.source}}};var I,w,L;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    id: 'username',
    label: 'Username',
    value: '',
    placeholder: 'Choose a unique username',
    helpText: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores'
  }
}`,...(L=(w=i.parameters)==null?void 0:w.docs)==null?void 0:L.source}}};var S,W,C;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    id: 'description',
    label: 'Detailed Project Description and Requirements',
    value: '',
    placeholder: 'Provide a comprehensive description',
    helpText: 'Include all relevant details about the project scope, requirements, and deliverables'
  }
}`,...(C=(W=d.parameters)==null?void 0:W.docs)==null?void 0:C.source}}};const X=["Default","WithValue","WithError","Disabled","Required","WithHelpText","LongLabel"];export{t as Default,l as Disabled,d as LongLabel,s as Required,o as WithError,i as WithHelpText,n as WithValue,X as __namedExportsOrder,Q as default};
