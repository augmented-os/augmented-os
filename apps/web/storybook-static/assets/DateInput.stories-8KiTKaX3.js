import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{I as te}from"./input-LIyW3PKO.js";import{L as re}from"./label-BpIRGnnY.js";import{c as g}from"./utils-fDSEsyX8.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-CFX93qP1.js";const a=({id:t,label:Q,value:X,onChange:Z,placeholder:ee,required:y,error:r,helpText:x})=>e.jsxs("div",{className:"space-y-2",children:[e.jsx(re,{htmlFor:t,className:g("text-sm font-medium text-foreground",y&&"after:content-['*'] after:ml-1 after:text-destructive"),children:Q}),e.jsx(te,{id:t,type:"date",value:X,onChange:ae=>Z(ae.target.value),placeholder:ee,required:y,className:g("w-full",r&&"border-destructive focus:ring-destructive"),"aria-describedby":r?`${t}-error`:x?`${t}-help`:void 0}),r&&e.jsx("div",{id:`${t}-error`,className:"text-sm text-destructive",role:"alert",children:r}),x&&!r&&e.jsx("div",{id:`${t}-help`,className:"text-sm text-muted-foreground",children:x})]}),ce={title:"DynamicUI/Fields/DateInput",component:a,parameters:{layout:"centered",docs:{description:{component:"A date input component with native browser date picker support. Handles validation, error states, and various date format scenarios."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the date input field"},label:{control:"text",description:"Label text displayed above the date input"},value:{control:"text",description:"Current date value in YYYY-MM-DD format"},onChange:{action:"changed",description:"Callback function called when date value changes"},placeholder:{control:"text",description:"Placeholder text (limited browser support)"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[t=>e.jsx("div",{className:"max-w-md",children:e.jsx(t,{})})]},s={args:{id:"birth-date",label:"Date of Birth",value:"",placeholder:"Select date"}},o={args:{id:"appointment-date",label:"Appointment Date",value:"2024-03-15",helpText:"Select your preferred appointment date"}},n={args:{id:"deadline-error",label:"Project Deadline",value:"",required:!0,error:"Project deadline is required"}},d={args:{id:"start-date-required",label:"Start Date",value:"",required:!0,helpText:"Choose when you would like to begin the project"}},i={args:{id:"expiry-date",label:"Expiry Date",value:"",helpText:"Select the date when this offer expires"}},l={args:{id:"future-event",label:"Event Date",value:"2025-06-20",helpText:"Event is scheduled for June 20, 2025"},parameters:{docs:{description:{story:"Example with a future date selected."}}}},p={args:{id:"graduation-date",label:"Graduation Date",value:"2020-05-15",helpText:"When did you graduate from university?"},parameters:{docs:{description:{story:"Example with a past date selected."}}}},c={args:{id:"today-date",label:"Today's Date",value:new Date().toISOString().split("T")[0],helpText:"This is set to today's date"},parameters:{docs:{description:{story:"Example with today's date pre-selected."}}}},u={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(a,{id:"valid-date",label:"Valid Date",value:"2024-12-25",onChange:()=>{},helpText:"Christmas Day 2024"}),e.jsx(a,{id:"empty-required",label:"Empty Required Date",value:"",onChange:()=>{},required:!0,error:"This date is required"}),e.jsx(a,{id:"past-deadline",label:"Past Deadline",value:"2023-01-01",onChange:()=>{},error:"Date cannot be in the past",helpText:"Deadline must be a future date"})]}),parameters:{docs:{description:{story:"Various validation scenarios for date inputs."}}}},m={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx("h3",{className:"text-lg font-medium mb-4",children:"Project Timeline"}),e.jsx(a,{id:"project-start",label:"Start Date",value:"2024-04-01",onChange:()=>{},helpText:"When should the project begin?"}),e.jsx(a,{id:"project-milestone",label:"Milestone Date",value:"2024-06-15",onChange:()=>{},helpText:"Important project milestone"}),e.jsx(a,{id:"project-end",label:"End Date",value:"2024-08-30",onChange:()=>{},helpText:"Expected project completion"})]}),parameters:{docs:{description:{story:"Example of multiple date inputs used together for date ranges."}}}},h={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(a,{id:"leap-year",label:"Leap Year Date",value:"2024-02-29",onChange:()=>{},helpText:"February 29th in a leap year"}),e.jsx(a,{id:"new-year",label:"New Year's Day",value:"2025-01-01",onChange:()=>{},helpText:"First day of the year"}),e.jsx(a,{id:"year-end",label:"Year End",value:"2024-12-31",onChange:()=>{},helpText:"Last day of the year"})]}),parameters:{docs:{description:{story:"Examples with special dates like leap year, new year, etc."}}}};var v,D,b;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    id: 'birth-date',
    label: 'Date of Birth',
    value: '',
    placeholder: 'Select date'
  }
}`,...(b=(D=s.parameters)==null?void 0:D.docs)==null?void 0:b.source}}};var f,j,T;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    id: 'appointment-date',
    label: 'Appointment Date',
    value: '2024-03-15',
    helpText: 'Select your preferred appointment date'
  }
}`,...(T=(j=o.parameters)==null?void 0:j.docs)==null?void 0:T.source}}};var C,E,S;n.parameters={...n.parameters,docs:{...(C=n.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    id: 'deadline-error',
    label: 'Project Deadline',
    value: '',
    required: true,
    error: 'Project deadline is required'
  }
}`,...(S=(E=n.parameters)==null?void 0:E.docs)==null?void 0:S.source}}};var w,q,I;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    id: 'start-date-required',
    label: 'Start Date',
    value: '',
    required: true,
    helpText: 'Choose when you would like to begin the project'
  }
}`,...(I=(q=d.parameters)==null?void 0:q.docs)==null?void 0:I.source}}};var N,Y,P;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    id: 'expiry-date',
    label: 'Expiry Date',
    value: '',
    helpText: 'Select the date when this offer expires'
  }
}`,...(P=(Y=i.parameters)==null?void 0:Y.docs)==null?void 0:P.source}}};var W,F,V;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    id: 'future-event',
    label: 'Event Date',
    value: '2025-06-20',
    helpText: 'Event is scheduled for June 20, 2025'
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with a future date selected.'
      }
    }
  }
}`,...(V=(F=l.parameters)==null?void 0:F.docs)==null?void 0:V.source}}};var L,R,k;p.parameters={...p.parameters,docs:{...(L=p.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    id: 'graduation-date',
    label: 'Graduation Date',
    value: '2020-05-15',
    helpText: 'When did you graduate from university?'
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with a past date selected.'
      }
    }
  }
}`,...(k=(R=p.parameters)==null?void 0:R.docs)==null?void 0:k.source}}};var M,H,$;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    id: 'today-date',
    label: "Today's Date",
    value: new Date().toISOString().split('T')[0],
    // Current date in YYYY-MM-DD format
    helpText: 'This is set to today\\'s date'
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with today\\'s date pre-selected.'
      }
    }
  }
}`,...($=(H=c.parameters)==null?void 0:H.docs)==null?void 0:$.source}}};var A,O,B;u.parameters={...u.parameters,docs:{...(A=u.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <DateInput id="valid-date" label="Valid Date" value="2024-12-25" onChange={() => {}} helpText="Christmas Day 2024" />
      <DateInput id="empty-required" label="Empty Required Date" value="" onChange={() => {}} required={true} error="This date is required" />
      <DateInput id="past-deadline" label="Past Deadline" value="2023-01-01" onChange={() => {}} error="Date cannot be in the past" helpText="Deadline must be a future date" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Various validation scenarios for date inputs.'
      }
    }
  }
}`,...(B=(O=u.parameters)==null?void 0:O.docs)==null?void 0:B.source}}};var G,J,U;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Project Timeline</h3>
      <DateInput id="project-start" label="Start Date" value="2024-04-01" onChange={() => {}} helpText="When should the project begin?" />
      <DateInput id="project-milestone" label="Milestone Date" value="2024-06-15" onChange={() => {}} helpText="Important project milestone" />
      <DateInput id="project-end" label="End Date" value="2024-08-30" onChange={() => {}} helpText="Expected project completion" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple date inputs used together for date ranges.'
      }
    }
  }
}`,...(U=(J=m.parameters)==null?void 0:J.docs)==null?void 0:U.source}}};var _,z,K;h.parameters={...h.parameters,docs:{...(_=h.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <DateInput id="leap-year" label="Leap Year Date" value="2024-02-29" onChange={() => {}} helpText="February 29th in a leap year" />
      <DateInput id="new-year" label="New Year's Day" value="2025-01-01" onChange={() => {}} helpText="First day of the year" />
      <DateInput id="year-end" label="Year End" value="2024-12-31" onChange={() => {}} helpText="Last day of the year" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Examples with special dates like leap year, new year, etc.'
      }
    }
  }
}`,...(K=(z=h.parameters)==null?void 0:z.docs)==null?void 0:K.source}}};const ue=["Default","WithValue","WithError","Required","WithHelpText","FutureDate","PastDate","TodayDate","ValidationScenarios","DateRangeContext","SpecialDates"];export{m as DateRangeContext,s as Default,l as FutureDate,p as PastDate,d as Required,h as SpecialDates,c as TodayDate,u as ValidationScenarios,n as WithError,i as WithHelpText,o as WithValue,ue as __namedExportsOrder,ce as default};
