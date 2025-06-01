import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{L as O}from"./label-BpIRGnnY.js";import{C as ne}from"./checkbox-B7Qu6JZP.js";import{c as o}from"./utils-fDSEsyX8.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-CFX93qP1.js";import"./check-1J8gLrA-.js";const ie=({id:s,label:le,value:l,onChange:f,options:S,required:re,error:t,helpText:h})=>{const k=(a,y)=>{f(y?[...l,a]:l.filter(r=>r!==a))};return e.jsxs("div",{className:"space-y-2",children:[e.jsx(O,{htmlFor:s,className:o("text-sm font-medium text-foreground",re&&"after:content-['*'] after:ml-1 after:text-destructive"),children:le}),e.jsx("div",{id:s,className:o("border rounded-md bg-background",t?"border-destructive":"border-input"),"aria-describedby":t?`${s}-error`:h?`${s}-help`:void 0,children:S.length===0?e.jsx("div",{className:"p-3 text-sm text-muted-foreground",children:"No options available"}):e.jsx("div",{className:"max-h-48 overflow-y-auto",children:S.map((a,y)=>{const r=l.includes(a.value),j=`${s}-option-${y}`;return e.jsxs("div",{className:o("flex items-center space-x-3 px-3 py-2 hover:bg-accent cursor-pointer","border-b border-border last:border-b-0",a.disabled&&"cursor-not-allowed opacity-50"),onClick:()=>!a.disabled&&k(a.value,!r),children:[e.jsx(ne,{id:j,checked:r,onCheckedChange:oe=>k(a.value,oe===!0),disabled:a.disabled,className:o(t&&"border-destructive data-[state=checked]:bg-destructive")}),e.jsx(O,{htmlFor:j,className:"text-sm cursor-pointer flex-1",children:a.label})]},a.value)})})}),l.length>0&&!t&&e.jsxs("div",{className:"text-sm text-muted-foreground",children:["Selected: ",l.length," item",l.length!==1?"s":""]}),t&&e.jsx("div",{id:`${s}-error`,className:"text-sm text-destructive",role:"alert",children:t}),h&&!t&&e.jsx("div",{id:`${s}-help`,className:"text-sm text-muted-foreground",children:h})]})},he={title:"DynamicUI/Fields/MultiSelectInput",component:ie,parameters:{layout:"centered",docs:{description:{component:"A multi-select checkbox component allowing users to select multiple options from a list. Features scrollable options list and selection count display."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the multi-select field"},label:{control:"text",description:"Label text displayed above the multi-select"},value:{control:"object",description:"Array of currently selected values"},onChange:{action:"changed",description:"Callback function called when selection changes"},options:{control:"object",description:"Array of selectable options"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[s=>e.jsx("div",{className:"max-w-md",children:e.jsx(s,{})})]},x=[{value:"javascript",label:"JavaScript"},{value:"typescript",label:"TypeScript"},{value:"react",label:"React"},{value:"vue",label:"Vue.js"},{value:"angular",label:"Angular"},{value:"node",label:"Node.js"},{value:"python",label:"Python"},{value:"java",label:"Java"}],ae=[{value:"technology",label:"Technology"},{value:"sports",label:"Sports"},{value:"music",label:"Music"},{value:"travel",label:"Travel"},{value:"cooking",label:"Cooking"},{value:"reading",label:"Reading"},{value:"gaming",label:"Gaming"},{value:"photography",label:"Photography"},{value:"art",label:"Art & Design"},{value:"fitness",label:"Fitness"}],se=[{value:"dashboard",label:"Dashboard Analytics"},{value:"reporting",label:"Advanced Reporting"},{value:"api",label:"API Access"},{value:"sso",label:"Single Sign-On"},{value:"backup",label:"Automated Backups"},{value:"support",label:"24/7 Support"},{value:"integrations",label:"Third-party Integrations"},{value:"mobile",label:"Mobile App Access",disabled:!0}],te=[{value:"en",label:"English"},{value:"es",label:"Spanish"},{value:"fr",label:"French"},{value:"de",label:"German"},{value:"it",label:"Italian"},{value:"pt",label:"Portuguese"},{value:"zh",label:"Chinese"},{value:"ja",label:"Japanese"},{value:"ko",label:"Korean"},{value:"ar",label:"Arabic"},{value:"hi",label:"Hindi"},{value:"ru",label:"Russian"}],n={args:{id:"skills",label:"Programming Skills",value:[],options:x}},i={args:{id:"interests-selected",label:"Interests",value:["technology","music","travel"],options:ae,helpText:"Select all interests that apply to you"}},c={args:{id:"features-error",label:"Required Features",value:[],options:se,required:!0,error:"Please select at least one feature"}},u={args:{id:"languages-required",label:"Supported Languages",value:["en"],options:te,required:!0,helpText:"Select all languages you want to support in your application"}},p={args:{id:"features-disabled",label:"Available Features",value:["dashboard","api"],options:se,helpText:"Some features may not be available in your current plan"},parameters:{docs:{description:{story:"Shows how disabled options appear in the multi-select list."}}}},d={args:{id:"languages-many",label:"Languages",value:["en","es","fr"],options:te,helpText:"Select all languages you are fluent in"}},m={args:{id:"skills-all",label:"Programming Skills",value:["javascript","typescript","react","vue","angular","node","python","java"],options:x,helpText:"All available skills have been selected"}},b={args:{id:"primary-interest",label:"Primary Interest",value:["technology"],options:ae,helpText:"Select your main area of interest"},parameters:{docs:{description:{story:"Demonstrates multi-select with only one item selected."}}}},g={args:{id:"empty-multiselect",label:"No Options Available",value:[],options:[],helpText:"Options will be loaded based on your previous selections"},parameters:{docs:{description:{story:"Demonstrates how the component behaves when no options are available."}}}},v={args:{id:"team-skills",label:"Team Skills",value:["javascript"],options:x,error:"Please select at least 3 skills for your team profile",helpText:"Select the primary skills your team possesses"},parameters:{docs:{description:{story:"Example of validation requiring a minimum number of selections."}}}};var T,A,w;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    id: 'skills',
    label: 'Programming Skills',
    value: [],
    options: skillsOptions
  }
}`,...(w=(A=n.parameters)==null?void 0:A.docs)==null?void 0:w.source}}};var N,q,P;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    id: 'interests-selected',
    label: 'Interests',
    value: ['technology', 'music', 'travel'],
    options: interestsOptions,
    helpText: 'Select all interests that apply to you'
  }
}`,...(P=(q=i.parameters)==null?void 0:q.docs)==null?void 0:P.source}}};var D,I,E;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    id: 'features-error',
    label: 'Required Features',
    value: [],
    options: featuresOptions,
    required: true,
    error: 'Please select at least one feature'
  }
}`,...(E=(I=c.parameters)==null?void 0:I.docs)==null?void 0:E.source}}};var F,C,R;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    id: 'languages-required',
    label: 'Supported Languages',
    value: ['en'],
    options: languagesOptions,
    required: true,
    helpText: 'Select all languages you want to support in your application'
  }
}`,...(R=(C=u.parameters)==null?void 0:C.docs)==null?void 0:R.source}}};var L,W,M;p.parameters={...p.parameters,docs:{...(L=p.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    id: 'features-disabled',
    label: 'Available Features',
    value: ['dashboard', 'api'],
    options: featuresOptions,
    helpText: 'Some features may not be available in your current plan'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how disabled options appear in the multi-select list.'
      }
    }
  }
}`,...(M=(W=p.parameters)==null?void 0:W.docs)==null?void 0:M.source}}};var $,V,J;d.parameters={...d.parameters,docs:{...($=d.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    id: 'languages-many',
    label: 'Languages',
    value: ['en', 'es', 'fr'],
    options: languagesOptions,
    helpText: 'Select all languages you are fluent in'
  }
}`,...(J=(V=d.parameters)==null?void 0:V.docs)==null?void 0:J.source}}};var G,H,U;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    id: 'skills-all',
    label: 'Programming Skills',
    value: ['javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'python', 'java'],
    options: skillsOptions,
    helpText: 'All available skills have been selected'
  }
}`,...(U=(H=m.parameters)==null?void 0:H.docs)==null?void 0:U.source}}};var _,z,B;b.parameters={...b.parameters,docs:{...(_=b.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    id: 'primary-interest',
    label: 'Primary Interest',
    value: ['technology'],
    options: interestsOptions,
    helpText: 'Select your main area of interest'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates multi-select with only one item selected.'
      }
    }
  }
}`,...(B=(z=b.parameters)==null?void 0:z.docs)==null?void 0:B.source}}};var K,Q,X;g.parameters={...g.parameters,docs:{...(K=g.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    id: 'empty-multiselect',
    label: 'No Options Available',
    value: [],
    options: [],
    helpText: 'Options will be loaded based on your previous selections'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the component behaves when no options are available.'
      }
    }
  }
}`,...(X=(Q=g.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,ee;v.parameters={...v.parameters,docs:{...(Y=v.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    id: 'team-skills',
    label: 'Team Skills',
    value: ['javascript'],
    options: skillsOptions,
    error: 'Please select at least 3 skills for your team profile',
    helpText: 'Select the primary skills your team possesses'
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of validation requiring a minimum number of selections.'
      }
    }
  }
}`,...(ee=(Z=v.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};const ye=["Default","WithSelectedValues","WithError","Required","WithDisabledOptions","ManyOptions","AllSelected","SingleSelection","EmptyOptions","ValidationScenario"];export{m as AllSelected,n as Default,g as EmptyOptions,d as ManyOptions,u as Required,b as SingleSelection,v as ValidationScenario,p as WithDisabledOptions,c as WithError,i as WithSelectedValues,ye as __namedExportsOrder,he as default};
