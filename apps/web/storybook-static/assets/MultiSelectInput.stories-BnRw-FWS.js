import{j as c}from"./jsx-runtime-CmtfZKef.js";import{M as z}from"./MultiSelectInput-GIzsWy5u.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";import"./index-C9U_LHPE.js";import"./utils-CytzSlOG.js";import"./checkbox-BGOkVoFJ.js";import"./check-M_MmD5Zy.js";const le={title:"Dynamic UI/Atomic Components/Form Fields/Multi Select Input",component:z,parameters:{layout:"centered",docs:{description:{component:"A multi-select checkbox component allowing users to select multiple options from a list. Features scrollable options list and selection count display."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the multi-select field"},label:{control:"text",description:"Label text displayed above the multi-select"},value:{control:"object",description:"Array of currently selected values"},onChange:{action:"changed",description:"Callback function called when selection changes"},options:{control:"object",description:"Array of selectable options"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[_=>c.jsx("div",{className:"max-w-md",children:c.jsx(_,{})})]},u=[{value:"javascript",label:"JavaScript"},{value:"typescript",label:"TypeScript"},{value:"react",label:"React"},{value:"vue",label:"Vue.js"},{value:"angular",label:"Angular"},{value:"node",label:"Node.js"},{value:"python",label:"Python"},{value:"java",label:"Java"}],G=[{value:"technology",label:"Technology"},{value:"sports",label:"Sports"},{value:"music",label:"Music"},{value:"travel",label:"Travel"},{value:"cooking",label:"Cooking"},{value:"reading",label:"Reading"},{value:"gaming",label:"Gaming"},{value:"photography",label:"Photography"},{value:"art",label:"Art & Design"},{value:"fitness",label:"Fitness"}],H=[{value:"dashboard",label:"Dashboard Analytics"},{value:"reporting",label:"Advanced Reporting"},{value:"api",label:"API Access"},{value:"sso",label:"Single Sign-On"},{value:"backup",label:"Automated Backups"},{value:"support",label:"24/7 Support"},{value:"integrations",label:"Third-party Integrations"},{value:"mobile",label:"Mobile App Access",disabled:!0}],U=[{value:"en",label:"English"},{value:"es",label:"Spanish"},{value:"fr",label:"French"},{value:"de",label:"German"},{value:"it",label:"Italian"},{value:"pt",label:"Portuguese"},{value:"zh",label:"Chinese"},{value:"ja",label:"Japanese"},{value:"ko",label:"Korean"},{value:"ar",label:"Arabic"},{value:"hi",label:"Hindi"},{value:"ru",label:"Russian"}],e={args:{id:"skills",label:"Programming Skills",value:[],options:u}},a={args:{id:"interests-selected",label:"Interests",value:["technology","music","travel"],options:G,helpText:"Select all interests that apply to you"}},s={args:{id:"features-error",label:"Required Features",value:[],options:H,required:!0,error:"Please select at least one feature"}},l={args:{id:"languages-required",label:"Supported Languages",value:["en"],options:U,required:!0,helpText:"Select all languages you want to support in your application"}},t={args:{id:"features-disabled",label:"Available Features",value:["dashboard","api"],options:H,helpText:"Some features may not be available in your current plan"},parameters:{docs:{description:{story:"Shows how disabled options appear in the multi-select list."}}}},r={args:{id:"languages-many",label:"Languages",value:["en","es","fr"],options:U,helpText:"Select all languages you are fluent in"}},o={args:{id:"skills-all",label:"Programming Skills",value:["javascript","typescript","react","vue","angular","node","python","java"],options:u,helpText:"All available skills have been selected"}},n={args:{id:"primary-interest",label:"Primary Interest",value:["technology"],options:G,helpText:"Select your main area of interest"},parameters:{docs:{description:{story:"Demonstrates multi-select with only one item selected."}}}},i={args:{id:"empty-multiselect",label:"No Options Available",value:[],options:[],helpText:"Options will be loaded based on your previous selections"},parameters:{docs:{description:{story:"Demonstrates how the component behaves when no options are available."}}}},p={args:{id:"team-skills",label:"Team Skills",value:["javascript"],options:u,error:"Please select at least 3 skills for your team profile",helpText:"Select the primary skills your team possesses"},parameters:{docs:{description:{story:"Example of validation requiring a minimum number of selections."}}}};var d,m,g;e.parameters={...e.parameters,docs:{...(d=e.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    id: 'skills',
    label: 'Programming Skills',
    value: [],
    options: skillsOptions
  }
}`,...(g=(m=e.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var b,v,h;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    id: 'interests-selected',
    label: 'Interests',
    value: ['technology', 'music', 'travel'],
    options: interestsOptions,
    helpText: 'Select all interests that apply to you'
  }
}`,...(h=(v=a.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};var y,S,f;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    id: 'features-error',
    label: 'Required Features',
    value: [],
    options: featuresOptions,
    required: true,
    error: 'Please select at least one feature'
  }
}`,...(f=(S=s.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};var x,k,O;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    id: 'languages-required',
    label: 'Supported Languages',
    value: ['en'],
    options: languagesOptions,
    required: true,
    helpText: 'Select all languages you want to support in your application'
  }
}`,...(O=(k=l.parameters)==null?void 0:k.docs)==null?void 0:O.source}}};var T,A,j;t.parameters={...t.parameters,docs:{...(T=t.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
}`,...(j=(A=t.parameters)==null?void 0:A.docs)==null?void 0:j.source}}};var w,q,P;r.parameters={...r.parameters,docs:{...(w=r.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    id: 'languages-many',
    label: 'Languages',
    value: ['en', 'es', 'fr'],
    options: languagesOptions,
    helpText: 'Select all languages you are fluent in'
  }
}`,...(P=(q=r.parameters)==null?void 0:q.docs)==null?void 0:P.source}}};var D,E,I;o.parameters={...o.parameters,docs:{...(D=o.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    id: 'skills-all',
    label: 'Programming Skills',
    value: ['javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'python', 'java'],
    options: skillsOptions,
    helpText: 'All available skills have been selected'
  }
}`,...(I=(E=o.parameters)==null?void 0:E.docs)==null?void 0:I.source}}};var F,R,M;n.parameters={...n.parameters,docs:{...(F=n.parameters)==null?void 0:F.docs,source:{originalSource:`{
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
}`,...(M=(R=n.parameters)==null?void 0:R.docs)==null?void 0:M.source}}};var W,C,L;i.parameters={...i.parameters,docs:{...(W=i.parameters)==null?void 0:W.docs,source:{originalSource:`{
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
}`,...(L=(C=i.parameters)==null?void 0:C.docs)==null?void 0:L.source}}};var V,N,J;p.parameters={...p.parameters,docs:{...(V=p.parameters)==null?void 0:V.docs,source:{originalSource:`{
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
}`,...(J=(N=p.parameters)==null?void 0:N.docs)==null?void 0:J.source}}};const te=["Default","WithSelectedValues","WithError","Required","WithDisabledOptions","ManyOptions","AllSelected","SingleSelection","EmptyOptions","ValidationScenario"];export{o as AllSelected,e as Default,i as EmptyOptions,r as ManyOptions,l as Required,n as SingleSelection,p as ValidationScenario,t as WithDisabledOptions,s as WithError,a as WithSelectedValues,te as __namedExportsOrder,le as default};
