import{j as c}from"./jsx-runtime-CmtfZKef.js";import{S as R}from"./SelectInput-Cji-AcSY.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";import"./index-C9U_LHPE.js";import"./utils-CytzSlOG.js";import"./check-M_MmD5Zy.js";const Z={title:"Dynamic UI/Atomic Components/Form Fields/Select Input",component:R,parameters:{layout:"centered",docs:{description:{component:"A single-select dropdown component with support for validation, error states, and help text. Features accessible keyboard navigation."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the select field"},label:{control:"text",description:"Label text displayed above the select"},value:{control:"text",description:"Currently selected value"},onChange:{action:"changed",description:"Callback function called when selection changes"},options:{control:"object",description:"Array of selectable options"},placeholder:{control:"text",description:"Placeholder text shown when no option is selected"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[M=>c.jsx("div",{className:"max-w-md",children:c.jsx(M,{})})]},j=[{value:"us",label:"United States"},{value:"ca",label:"Canada"},{value:"uk",label:"United Kingdom"},{value:"de",label:"Germany"},{value:"fr",label:"France"},{value:"au",label:"Australia"},{value:"jp",label:"Japan"}],F=[{value:"low",label:"Low Priority"},{value:"medium",label:"Medium Priority"},{value:"high",label:"High Priority"},{value:"urgent",label:"Urgent"}],I=[{value:"electronics",label:"Electronics"},{value:"clothing",label:"Clothing & Apparel"},{value:"books",label:"Books & Media"},{value:"home",label:"Home & Garden"},{value:"sports",label:"Sports & Outdoors"},{value:"toys",label:"Toys & Games"}],z=[{value:"engineering",label:"Engineering"},{value:"marketing",label:"Marketing"},{value:"sales",label:"Sales"},{value:"hr",label:"Human Resources"},{value:"finance",label:"Finance"},{value:"support",label:"Customer Support",disabled:!0}],e={args:{id:"country",label:"Country",value:"",options:j,placeholder:"Select a country"}},a={args:{id:"priority-selected",label:"Priority Level",value:"high",options:F,placeholder:"Choose priority"}},t={args:{id:"category-error",label:"Product Category",value:"",options:I,placeholder:"Select a category",required:!0,error:"Please select a product category"}},o={args:{id:"department-required",label:"Department",value:"",options:z,placeholder:"Select department",required:!0,helpText:"Choose the department this request relates to"}},l={args:{id:"department-disabled",label:"Department",value:"",options:z,placeholder:"Select department",helpText:"Some departments may be temporarily unavailable"},parameters:{docs:{description:{story:"Shows how disabled options appear in the dropdown."}}}},n={args:{id:"country-help",label:"Billing Country",value:"",options:j,placeholder:"Select billing country",helpText:"This should match the country on your billing address"}},r={args:{id:"long-options",label:"Service Type",value:"",options:[{value:"basic",label:"Basic Support Package (email only)"},{value:"standard",label:"Standard Support Package (email + phone)"},{value:"premium",label:"Premium Support Package (email + phone + chat)"},{value:"enterprise",label:"Enterprise Support Package (dedicated account manager + 24/7 support)"}],placeholder:"Choose service level",helpText:"Select the support package that best fits your needs"}},s={args:{id:"timezone",label:"Timezone",value:"",options:[{value:"utc-12",label:"(UTC-12:00) International Date Line West"},{value:"utc-11",label:"(UTC-11:00) Coordinated Universal Time-11"},{value:"utc-10",label:"(UTC-10:00) Hawaii"},{value:"utc-9",label:"(UTC-09:00) Alaska"},{value:"utc-8",label:"(UTC-08:00) Pacific Time (US & Canada)"},{value:"utc-7",label:"(UTC-07:00) Mountain Time (US & Canada)"},{value:"utc-6",label:"(UTC-06:00) Central Time (US & Canada)"},{value:"utc-5",label:"(UTC-05:00) Eastern Time (US & Canada)"},{value:"utc-4",label:"(UTC-04:00) Atlantic Time (Canada)"},{value:"utc0",label:"(UTC+00:00) London, Dublin, Lisbon"},{value:"utc1",label:"(UTC+01:00) Berlin, Paris, Rome"},{value:"utc8",label:"(UTC+08:00) Beijing, Hong Kong, Singapore"},{value:"utc9",label:"(UTC+09:00) Tokyo, Seoul"}],placeholder:"Select your timezone",helpText:"Choose your local timezone for scheduling"}},i={args:{id:"empty-select",label:"No Options Available",value:"",options:[],placeholder:"No options available",helpText:"Options will be loaded based on your previous selection"},parameters:{docs:{description:{story:"Demonstrates how the component behaves when no options are available."}}}};var p,u,d;e.parameters={...e.parameters,docs:{...(p=e.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    id: 'country',
    label: 'Country',
    value: '',
    options: countryOptions,
    placeholder: 'Select a country'
  }
}`,...(d=(u=e.parameters)==null?void 0:u.docs)==null?void 0:d.source}}};var m,b,h;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    id: 'priority-selected',
    label: 'Priority Level',
    value: 'high',
    options: priorityOptions,
    placeholder: 'Choose priority'
  }
}`,...(h=(b=a.parameters)==null?void 0:b.docs)==null?void 0:h.source}}};var v,g,y;t.parameters={...t.parameters,docs:{...(v=t.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    id: 'category-error',
    label: 'Product Category',
    value: '',
    options: categoryOptions,
    placeholder: 'Select a category',
    required: true,
    error: 'Please select a product category'
  }
}`,...(y=(g=t.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var T,C,S;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    id: 'department-required',
    label: 'Department',
    value: '',
    options: departmentOptions,
    placeholder: 'Select department',
    required: true,
    helpText: 'Choose the department this request relates to'
  }
}`,...(S=(C=o.parameters)==null?void 0:C.docs)==null?void 0:S.source}}};var U,x,O;l.parameters={...l.parameters,docs:{...(U=l.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    id: 'department-disabled',
    label: 'Department',
    value: '',
    options: departmentOptions,
    placeholder: 'Select department',
    helpText: 'Some departments may be temporarily unavailable'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how disabled options appear in the dropdown.'
      }
    }
  }
}`,...(O=(x=l.parameters)==null?void 0:x.docs)==null?void 0:O.source}}};var P,w,k;n.parameters={...n.parameters,docs:{...(P=n.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    id: 'country-help',
    label: 'Billing Country',
    value: '',
    options: countryOptions,
    placeholder: 'Select billing country',
    helpText: 'This should match the country on your billing address'
  }
}`,...(k=(w=n.parameters)==null?void 0:w.docs)==null?void 0:k.source}}};var f,D,q;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    id: 'long-options',
    label: 'Service Type',
    value: '',
    options: [{
      value: 'basic',
      label: 'Basic Support Package (email only)'
    }, {
      value: 'standard',
      label: 'Standard Support Package (email + phone)'
    }, {
      value: 'premium',
      label: 'Premium Support Package (email + phone + chat)'
    }, {
      value: 'enterprise',
      label: 'Enterprise Support Package (dedicated account manager + 24/7 support)'
    }],
    placeholder: 'Choose service level',
    helpText: 'Select the support package that best fits your needs'
  }
}`,...(q=(D=r.parameters)==null?void 0:D.docs)==null?void 0:q.source}}};var E,L,A;s.parameters={...s.parameters,docs:{...(E=s.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    id: 'timezone',
    label: 'Timezone',
    value: '',
    options: [{
      value: 'utc-12',
      label: '(UTC-12:00) International Date Line West'
    }, {
      value: 'utc-11',
      label: '(UTC-11:00) Coordinated Universal Time-11'
    }, {
      value: 'utc-10',
      label: '(UTC-10:00) Hawaii'
    }, {
      value: 'utc-9',
      label: '(UTC-09:00) Alaska'
    }, {
      value: 'utc-8',
      label: '(UTC-08:00) Pacific Time (US & Canada)'
    }, {
      value: 'utc-7',
      label: '(UTC-07:00) Mountain Time (US & Canada)'
    }, {
      value: 'utc-6',
      label: '(UTC-06:00) Central Time (US & Canada)'
    }, {
      value: 'utc-5',
      label: '(UTC-05:00) Eastern Time (US & Canada)'
    }, {
      value: 'utc-4',
      label: '(UTC-04:00) Atlantic Time (Canada)'
    }, {
      value: 'utc0',
      label: '(UTC+00:00) London, Dublin, Lisbon'
    }, {
      value: 'utc1',
      label: '(UTC+01:00) Berlin, Paris, Rome'
    }, {
      value: 'utc8',
      label: '(UTC+08:00) Beijing, Hong Kong, Singapore'
    }, {
      value: 'utc9',
      label: '(UTC+09:00) Tokyo, Seoul'
    }],
    placeholder: 'Select your timezone',
    helpText: 'Choose your local timezone for scheduling'
  }
}`,...(A=(L=s.parameters)==null?void 0:L.docs)==null?void 0:A.source}}};var W,H,B;i.parameters={...i.parameters,docs:{...(W=i.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    id: 'empty-select',
    label: 'No Options Available',
    value: '',
    options: [],
    placeholder: 'No options available',
    helpText: 'Options will be loaded based on your previous selection'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the component behaves when no options are available.'
      }
    }
  }
}`,...(B=(H=i.parameters)==null?void 0:H.docs)==null?void 0:B.source}}};const $=["Default","WithValue","WithError","Required","WithDisabledOptions","WithHelpText","LongOptions","ManyOptions","EmptyOptions"];export{e as Default,i as EmptyOptions,r as LongOptions,s as ManyOptions,o as Required,l as WithDisabledOptions,t as WithError,n as WithHelpText,a as WithValue,$ as __namedExportsOrder,Z as default};
