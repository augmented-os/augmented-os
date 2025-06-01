import{j as p}from"./jsx-runtime-BT65X5dW.js";import{N as O}from"./NumberInput-DNalEYdP.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./input-dGyvt1gO.js";import"./utils-CytzSlOG.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./index-B5vUWwF_.js";const K={title:"Dynamic UI/Atomic Components/Form Fields/Number Input",component:O,parameters:{layout:"centered",docs:{description:{component:"A number input component for forms with support for validation, error states, and help text. Handles both integer and decimal values."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the input field"},label:{control:"text",description:"Label text displayed above the input"},value:{control:"number",description:"Current numeric value of the input"},onChange:{action:"changed",description:"Callback function called when input value changes"},placeholder:{control:"text",description:"Placeholder text shown when input is empty"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[L=>p.jsx("div",{className:"max-w-md",children:p.jsx(L,{})})]},e={args:{id:"age",label:"Age",value:"",placeholder:"Enter your age"}},r={args:{id:"salary",label:"Annual Salary",value:75e3,placeholder:"Enter amount",helpText:"Enter your annual salary in USD"}},a={args:{id:"price",label:"Product Price",value:299.99,placeholder:"0.00",helpText:"Enter price including cents"}},t={args:{id:"quantity-error",label:"Quantity",value:"",placeholder:"Enter quantity",required:!0,error:"Quantity is required and must be a positive number"}},n={args:{id:"quantity-required",label:"Quantity",value:"",placeholder:"Enter quantity",required:!0,helpText:"This field is required for order processing"}},o={args:{id:"population",label:"City Population",value:8398748,placeholder:"Enter population",helpText:"Enter the estimated city population"}},i={args:{id:"temperature",label:"Temperature (°C)",value:-15,placeholder:"Enter temperature",helpText:"Temperature can be negative for below freezing"}},l={args:{id:"optional-number",label:"Optional Number",value:"",placeholder:"Enter a number (optional)",helpText:"This field is optional and can be left empty"}},s={args:{id:"score",label:"Test Score",value:105,placeholder:"Enter score (0-100)",error:"Score must be between 0 and 100",helpText:"Enter a score between 0 and 100"},parameters:{docs:{description:{story:"Example of how validation errors would be displayed when value is outside acceptable range."}}}};var u,c,d;e.parameters={...e.parameters,docs:{...(u=e.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    id: 'age',
    label: 'Age',
    value: '',
    placeholder: 'Enter your age'
  }
}`,...(d=(c=e.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var m,h,b;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    id: 'salary',
    label: 'Annual Salary',
    value: 75000,
    placeholder: 'Enter amount',
    helpText: 'Enter your annual salary in USD'
  }
}`,...(b=(h=r.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var g,y,v;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    id: 'price',
    label: 'Product Price',
    value: 299.99,
    placeholder: '0.00',
    helpText: 'Enter price including cents'
  }
}`,...(v=(y=a.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};var x,E,f;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    id: 'quantity-error',
    label: 'Quantity',
    value: '',
    placeholder: 'Enter quantity',
    required: true,
    error: 'Quantity is required and must be a positive number'
  }
}`,...(f=(E=t.parameters)==null?void 0:E.docs)==null?void 0:f.source}}};var T,q,S;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    id: 'quantity-required',
    label: 'Quantity',
    value: '',
    placeholder: 'Enter quantity',
    required: true,
    helpText: 'This field is required for order processing'
  }
}`,...(S=(q=n.parameters)==null?void 0:q.docs)==null?void 0:S.source}}};var w,N,W;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    id: 'population',
    label: 'City Population',
    value: 8398748,
    placeholder: 'Enter population',
    helpText: 'Enter the estimated city population'
  }
}`,...(W=(N=o.parameters)==null?void 0:N.docs)==null?void 0:W.source}}};var C,V,D;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    id: 'temperature',
    label: 'Temperature (°C)',
    value: -15,
    placeholder: 'Enter temperature',
    helpText: 'Temperature can be negative for below freezing'
  }
}`,...(D=(V=i.parameters)==null?void 0:V.docs)==null?void 0:D.source}}};var P,A,Q;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    id: 'optional-number',
    label: 'Optional Number',
    value: '',
    placeholder: 'Enter a number (optional)',
    helpText: 'This field is optional and can be left empty'
  }
}`,...(Q=(A=l.parameters)==null?void 0:A.docs)==null?void 0:Q.source}}};var j,U,I;s.parameters={...s.parameters,docs:{...(j=s.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
}`,...(I=(U=s.parameters)==null?void 0:U.docs)==null?void 0:I.source}}};const M=["Default","WithValue","WithDecimalValue","WithError","Required","WithLargeNumber","WithNegativeNumber","EmptyValue","ValidationScenario"];export{e as Default,l as EmptyValue,n as Required,s as ValidationScenario,a as WithDecimalValue,t as WithError,o as WithLargeNumber,i as WithNegativeNumber,r as WithValue,M as __namedExportsOrder,K as default};
