import{j as r}from"./jsx-runtime-DF2Pcvd1.js";import{I as M}from"./input-LIyW3PKO.js";import{L as X}from"./label-BpIRGnnY.js";import{c as v}from"./utils-fDSEsyX8.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-CFX93qP1.js";const Y=({id:e,label:k,value:B,onChange:m,placeholder:G,required:h,error:a,helpText:p})=>{const J=K=>{const b=K.target.value;if(b==="")m("");else{const g=parseFloat(b);isNaN(g)||m(g)}};return r.jsxs("div",{className:"space-y-2",children:[r.jsx(X,{htmlFor:e,className:v("text-sm font-medium text-foreground",h&&"after:content-['*'] after:ml-1 after:text-destructive"),children:k}),r.jsx(M,{id:e,type:"number",value:B,onChange:J,placeholder:G,required:h,className:v("w-full",a&&"border-destructive focus:ring-destructive"),"aria-describedby":a?`${e}-error`:p?`${e}-help`:void 0}),a&&r.jsx("div",{id:`${e}-error`,className:"text-sm text-destructive",role:"alert",children:a}),p&&!a&&r.jsx("div",{id:`${e}-help`,className:"text-sm text-muted-foreground",children:p})]})},se={title:"DynamicUI/Fields/NumberInput",component:Y,parameters:{layout:"centered",docs:{description:{component:"A number input component for forms with support for validation, error states, and help text. Handles both integer and decimal values."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the input field"},label:{control:"text",description:"Label text displayed above the input"},value:{control:"number",description:"Current numeric value of the input"},onChange:{action:"changed",description:"Callback function called when input value changes"},placeholder:{control:"text",description:"Placeholder text shown when input is empty"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[e=>r.jsx("div",{className:"max-w-md",children:r.jsx(e,{})})]},t={args:{id:"age",label:"Age",value:"",placeholder:"Enter your age"}},n={args:{id:"salary",label:"Annual Salary",value:75e3,placeholder:"Enter amount",helpText:"Enter your annual salary in USD"}},o={args:{id:"price",label:"Product Price",value:299.99,placeholder:"0.00",helpText:"Enter price including cents"}},s={args:{id:"quantity-error",label:"Quantity",value:"",placeholder:"Enter quantity",required:!0,error:"Quantity is required and must be a positive number"}},l={args:{id:"quantity-required",label:"Quantity",value:"",placeholder:"Enter quantity",required:!0,helpText:"This field is required for order processing"}},i={args:{id:"population",label:"City Population",value:8398748,placeholder:"Enter population",helpText:"Enter the estimated city population"}},c={args:{id:"temperature",label:"Temperature (°C)",value:-15,placeholder:"Enter temperature",helpText:"Temperature can be negative for below freezing"}},u={args:{id:"optional-number",label:"Optional Number",value:"",placeholder:"Enter a number (optional)",helpText:"This field is optional and can be left empty"}},d={args:{id:"score",label:"Test Score",value:105,placeholder:"Enter score (0-100)",error:"Score must be between 0 and 100",helpText:"Enter a score between 0 and 100"},parameters:{docs:{description:{story:"Example of how validation errors would be displayed when value is outside acceptable range."}}}};var y,x,f;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    id: 'age',
    label: 'Age',
    value: '',
    placeholder: 'Enter your age'
  }
}`,...(f=(x=t.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var E,T,q;n.parameters={...n.parameters,docs:{...(E=n.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    id: 'salary',
    label: 'Annual Salary',
    value: 75000,
    placeholder: 'Enter amount',
    helpText: 'Enter your annual salary in USD'
  }
}`,...(q=(T=n.parameters)==null?void 0:T.docs)==null?void 0:q.source}}};var S,w,N;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    id: 'price',
    label: 'Product Price',
    value: 299.99,
    placeholder: '0.00',
    helpText: 'Enter price including cents'
  }
}`,...(N=(w=o.parameters)==null?void 0:w.docs)==null?void 0:N.source}}};var W,j,V;s.parameters={...s.parameters,docs:{...(W=s.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    id: 'quantity-error',
    label: 'Quantity',
    value: '',
    placeholder: 'Enter quantity',
    required: true,
    error: 'Quantity is required and must be a positive number'
  }
}`,...(V=(j=s.parameters)==null?void 0:j.docs)==null?void 0:V.source}}};var C,D,P;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    id: 'quantity-required',
    label: 'Quantity',
    value: '',
    placeholder: 'Enter quantity',
    required: true,
    helpText: 'This field is required for order processing'
  }
}`,...(P=(D=l.parameters)==null?void 0:D.docs)==null?void 0:P.source}}};var Q,A,I;i.parameters={...i.parameters,docs:{...(Q=i.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    id: 'population',
    label: 'City Population',
    value: 8398748,
    placeholder: 'Enter population',
    helpText: 'Enter the estimated city population'
  }
}`,...(I=(A=i.parameters)==null?void 0:A.docs)==null?void 0:I.source}}};var L,U,$;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    id: 'temperature',
    label: 'Temperature (°C)',
    value: -15,
    placeholder: 'Enter temperature',
    helpText: 'Temperature can be negative for below freezing'
  }
}`,...($=(U=c.parameters)==null?void 0:U.docs)==null?void 0:$.source}}};var F,O,R;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    id: 'optional-number',
    label: 'Optional Number',
    value: '',
    placeholder: 'Enter a number (optional)',
    helpText: 'This field is optional and can be left empty'
  }
}`,...(R=(O=u.parameters)==null?void 0:O.docs)==null?void 0:R.source}}};var z,H,_;d.parameters={...d.parameters,docs:{...(z=d.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    id: 'score',
    label: 'Test Score',
    value: 105,
    placeholder: 'Enter score (0-100)',
    error: 'Score must be between 0 and 100',
    helpText: 'Enter a score between 0 and 100'
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of how validation errors would be displayed when value is outside acceptable range.'
      }
    }
  }
}`,...(_=(H=d.parameters)==null?void 0:H.docs)==null?void 0:_.source}}};const le=["Default","WithValue","WithDecimalValue","WithError","Required","WithLargeNumber","WithNegativeNumber","EmptyValue","ValidationScenario"];export{t as Default,u as EmptyValue,l as Required,d as ValidationScenario,o as WithDecimalValue,s as WithError,i as WithLargeNumber,c as WithNegativeNumber,n as WithValue,le as __namedExportsOrder,se as default};
