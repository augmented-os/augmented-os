import{j as e}from"./jsx-runtime-BT65X5dW.js";import{D as a}from"./DateInput-Cgcb2E7S.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./input-dGyvt1gO.js";import"./utils-CytzSlOG.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./index-B5vUWwF_.js";const te={title:"Dynamic UI/Atomic Components/Form Fields/Date Input",component:a,parameters:{layout:"centered",docs:{description:{component:"A date input component with native browser date picker support. Handles validation, error states, and various date format scenarios."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the date input field"},label:{control:"text",description:"Label text displayed above the date input"},value:{control:"text",description:"Current date value in YYYY-MM-DD format"},onChange:{action:"changed",description:"Callback function called when date value changes"},placeholder:{control:"text",description:"Placeholder text (limited browser support)"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[U=>e.jsx("div",{className:"max-w-md",children:e.jsx(U,{})})]},t={args:{id:"birth-date",label:"Date of Birth",value:"",placeholder:"Select date"}},r={args:{id:"appointment-date",label:"Appointment Date",value:"2024-03-15",helpText:"Select your preferred appointment date"}},s={args:{id:"deadline-error",label:"Project Deadline",value:"",required:!0,error:"Project deadline is required"}},o={args:{id:"start-date-required",label:"Start Date",value:"",required:!0,helpText:"Choose when you would like to begin the project"}},n={args:{id:"expiry-date",label:"Expiry Date",value:"",helpText:"Select the date when this offer expires"}},i={args:{id:"future-event",label:"Event Date",value:"2025-06-20",helpText:"Event is scheduled for June 20, 2025"},parameters:{docs:{description:{story:"Example with a future date selected."}}}},d={args:{id:"graduation-date",label:"Graduation Date",value:"2020-05-15",helpText:"When did you graduate from university?"},parameters:{docs:{description:{story:"Example with a past date selected."}}}},l={args:{id:"today-date",label:"Today's Date",value:new Date().toISOString().split("T")[0],helpText:"This is set to today's date"},parameters:{docs:{description:{story:"Example with today's date pre-selected."}}}},p={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(a,{id:"valid-date",label:"Valid Date",value:"2024-12-25",onChange:()=>{},helpText:"Christmas Day 2024"}),e.jsx(a,{id:"empty-required",label:"Empty Required Date",value:"",onChange:()=>{},required:!0,error:"This date is required"}),e.jsx(a,{id:"past-deadline",label:"Past Deadline",value:"2023-01-01",onChange:()=>{},error:"Date cannot be in the past",helpText:"Deadline must be a future date"})]}),parameters:{docs:{description:{story:"Various validation scenarios for date inputs."}}}},c={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx("h3",{className:"text-lg font-medium mb-4",children:"Project Timeline"}),e.jsx(a,{id:"project-start",label:"Start Date",value:"2024-04-01",onChange:()=>{},helpText:"When should the project begin?"}),e.jsx(a,{id:"project-milestone",label:"Milestone Date",value:"2024-06-15",onChange:()=>{},helpText:"Important project milestone"}),e.jsx(a,{id:"project-end",label:"End Date",value:"2024-08-30",onChange:()=>{},helpText:"Expected project completion"})]}),parameters:{docs:{description:{story:"Example of multiple date inputs used together for date ranges."}}}},u={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(a,{id:"leap-year",label:"Leap Year Date",value:"2024-02-29",onChange:()=>{},helpText:"February 29th in a leap year"}),e.jsx(a,{id:"new-year",label:"New Year's Day",value:"2025-01-01",onChange:()=>{},helpText:"First day of the year"}),e.jsx(a,{id:"year-end",label:"Year End",value:"2024-12-31",onChange:()=>{},helpText:"Last day of the year"})]}),parameters:{docs:{description:{story:"Examples with special dates like leap year, new year, etc."}}}};var m,h,x;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    id: 'birth-date',
    label: 'Date of Birth',
    value: '',
    placeholder: 'Select date'
  }
}`,...(x=(h=t.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var y,g,D;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    id: 'appointment-date',
    label: 'Appointment Date',
    value: '2024-03-15',
    helpText: 'Select your preferred appointment date'
  }
}`,...(D=(g=r.parameters)==null?void 0:g.docs)==null?void 0:D.source}}};var v,b,T;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    id: 'deadline-error',
    label: 'Project Deadline',
    value: '',
    required: true,
    error: 'Project deadline is required'
  }
}`,...(T=(b=s.parameters)==null?void 0:b.docs)==null?void 0:T.source}}};var f,j,C;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    id: 'start-date-required',
    label: 'Start Date',
    value: '',
    required: true,
    helpText: 'Choose when you would like to begin the project'
  }
}`,...(C=(j=o.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};var E,S,w;n.parameters={...n.parameters,docs:{...(E=n.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    id: 'expiry-date',
    label: 'Expiry Date',
    value: '',
    helpText: 'Select the date when this offer expires'
  }
}`,...(w=(S=n.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var q,I,Y;i.parameters={...i.parameters,docs:{...(q=i.parameters)==null?void 0:q.docs,source:{originalSource:`{
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
}`,...(Y=(I=i.parameters)==null?void 0:I.docs)==null?void 0:Y.source}}};var N,P,W;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`{
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
}`,...(W=(P=d.parameters)==null?void 0:P.docs)==null?void 0:W.source}}};var F,V,R;l.parameters={...l.parameters,docs:{...(F=l.parameters)==null?void 0:F.docs,source:{originalSource:`{
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
}`,...(R=(V=l.parameters)==null?void 0:V.docs)==null?void 0:R.source}}};var k,M,L;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`{
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
}`,...(L=(M=p.parameters)==null?void 0:M.docs)==null?void 0:L.source}}};var A,H,O;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
}`,...(O=(H=c.parameters)==null?void 0:H.docs)==null?void 0:O.source}}};var B,G,J;u.parameters={...u.parameters,docs:{...(B=u.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(J=(G=u.parameters)==null?void 0:G.docs)==null?void 0:J.source}}};const re=["Default","WithValue","WithError","Required","WithHelpText","FutureDate","PastDate","TodayDate","ValidationScenarios","DateRangeContext","SpecialDates"];export{c as DateRangeContext,t as Default,i as FutureDate,d as PastDate,o as Required,u as SpecialDates,l as TodayDate,p as ValidationScenarios,s as WithError,n as WithHelpText,r as WithValue,re as __namedExportsOrder,te as default};
