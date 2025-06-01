import{j as p}from"./jsx-runtime-CmtfZKef.js";import{D as Z}from"./DynamicForm-CQvi70jR.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./FormSection-BXhPtV5Y.js";import"./TextInput-B-b59Q_e.js";import"./input-CbSxzvDx.js";import"./utils-CytzSlOG.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";import"./index-C9U_LHPE.js";import"./NumberInput-BM-Ag6sN.js";import"./SelectInput-Cji-AcSY.js";import"./check-M_MmD5Zy.js";import"./TextareaInput-d_sTEtii.js";import"./BooleanInput-DAkAH8Ho.js";import"./checkbox-BGOkVoFJ.js";import"./DateInput-DrtaTLZA.js";import"./FileInput-CkTp4YSM.js";import"./button-BIv8UjPY.js";import"./MultiSelectInput-GIzsWy5u.js";import"./EmailInput-BDtJ9KKU.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-DwxbG8kR.js";import"./QueryClientProvider-mz6q_e7V.js";import"./iframe-BVJQxLgr.js";const Fe={title:"Dynamic UI/Composite Components/Dynamic Form",component:Z,parameters:{layout:"padded",docs:{description:{component:"The main DynamicForm component that renders complete forms based on schema configuration. Supports validation, sections, conditional logic, and various field types."}}},tags:["autodocs"],argTypes:{schema:{control:"object",description:"UI component schema defining the form structure"},componentId:{control:"text",description:"Optional component ID for schema lookup"},initialData:{control:"object",description:"Initial form data"},onSubmit:{action:"form-submitted",description:"Callback function called when form is submitted"},onCancel:{action:"form-cancelled",description:"Callback function called when form is cancelled"},className:{control:"text",description:"Additional CSS classes for custom styling"}},decorators:[h=>p.jsx("div",{className:"max-w-4xl",children:p.jsx(h,{})})]},y={componentId:"contact-form",name:"Contact Form",title:"Contact Us",description:"Get in touch with our team",componentType:"Form",fields:[{fieldKey:"name",label:"Full Name",type:"text",placeholder:"Enter your full name",required:!0,validationRules:[{type:"required",message:"Name is required"},{type:"minLength",value:2,message:"Name must be at least 2 characters"}]},{fieldKey:"email",label:"Email Address",type:"email",placeholder:"Enter your email",required:!0,validationRules:[{type:"required",message:"Email is required"},{type:"email",message:"Please enter a valid email address"}]},{fieldKey:"phone",label:"Phone Number",type:"text",placeholder:"(555) 123-4567",helpText:"Optional - we'll only call if needed"},{fieldKey:"subject",label:"Subject",type:"select",required:!0,options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales Question"},{value:"feedback",label:"Feedback"}]},{fieldKey:"message",label:"Message",type:"textarea",placeholder:"Tell us how we can help you...",required:!0,validationRules:[{type:"required",message:"Message is required"},{type:"minLength",value:10,message:"Please provide at least 10 characters"}]}],actions:[{actionKey:"cancel",label:"Cancel",style:"secondary"},{actionKey:"submit",label:"Send Message",style:"primary"}]},X={componentId:"job-application",name:"Job Application Form",title:"Software Engineer Application",description:"Apply for the Software Engineer position at our company",componentType:"Form",fields:[{fieldKey:"firstName",label:"First Name",type:"text",required:!0,validationRules:[{type:"required",message:"First name is required"}]},{fieldKey:"lastName",label:"Last Name",type:"text",required:!0,validationRules:[{type:"required",message:"Last name is required"}]},{fieldKey:"email",label:"Email",type:"email",required:!0,validationRules:[{type:"required",message:"Email is required"},{type:"email",message:"Please enter a valid email address"}]},{fieldKey:"phone",label:"Phone",type:"text",required:!0},{fieldKey:"position",label:"Desired Position",type:"select",required:!0,options:[{value:"frontend",label:"Frontend Developer"},{value:"backend",label:"Backend Developer"},{value:"fullstack",label:"Full Stack Developer"},{value:"mobile",label:"Mobile Developer"}]},{fieldKey:"experience",label:"Years of Experience",type:"number",required:!0,validationRules:[{type:"required",message:"Experience is required"},{type:"min",value:0,message:"Experience cannot be negative"}]},{fieldKey:"skills",label:"Technical Skills",type:"multi-select",required:!0,options:[{value:"javascript",label:"JavaScript"},{value:"typescript",label:"TypeScript"},{value:"react",label:"React"},{value:"vue",label:"Vue.js"},{value:"angular",label:"Angular"},{value:"nodejs",label:"Node.js"},{value:"python",label:"Python"},{value:"java",label:"Java"},{value:"csharp",label:"C#"},{value:"go",label:"Go"}]},{fieldKey:"currentSalary",label:"Current Salary",type:"number",placeholder:"Optional",helpText:"Your current salary (optional, helps us make a competitive offer)"},{fieldKey:"remote",label:"Open to remote work",type:"boolean"},{fieldKey:"relocation",label:"Willing to relocate",type:"boolean"},{fieldKey:"startDate",label:"Available Start Date",type:"date",required:!0},{fieldKey:"resume",label:"Resume",type:"file",required:!0,customProps:{accept:".pdf,.doc,.docx"},helpText:"Please upload your resume in PDF or Word format"},{fieldKey:"coverLetter",label:"Cover Letter",type:"textarea",placeholder:"Tell us why you're interested in this position...",helpText:"Optional but recommended"}],layout:{spacing:"normal",sections:[{title:"Personal Information",fields:["firstName","lastName","email","phone"],collapsible:!1,defaultExpanded:!0},{title:"Professional Experience",fields:["position","experience","skills","currentSalary"],collapsible:!1,defaultExpanded:!0},{title:"Availability",fields:["remote","relocation","startDate"],collapsible:!0,defaultExpanded:!0},{title:"Documents",fields:["resume","coverLetter"],collapsible:!0,defaultExpanded:!0}]},actions:[{actionKey:"cancel",label:"Cancel",style:"secondary"},{actionKey:"draft",label:"Save Draft",style:"secondary"},{actionKey:"submit",label:"Submit Application",style:"primary"}]},u={componentId:"conditional-form",name:"Event Registration",title:"Conference Registration",description:"Register for our annual tech conference",componentType:"Form",fields:[{fieldKey:"name",label:"Full Name",type:"text",required:!0},{fieldKey:"email",label:"Email",type:"email",required:!0},{fieldKey:"ticketType",label:"Ticket Type",type:"select",required:!0,options:[{value:"general",label:"General Admission ($99)"},{value:"vip",label:"VIP Pass ($299)"},{value:"student",label:"Student Ticket ($29)"},{value:"speaker",label:"Speaker Pass (Free)"}]},{fieldKey:"studentId",label:"Student ID",type:"text",required:!0,visibleIf:'ticketType == "student"',helpText:"Please provide your valid student ID number"},{fieldKey:"university",label:"University",type:"text",required:!0,visibleIf:'ticketType == "student"'},{fieldKey:"talkTitle",label:"Talk Title",type:"text",required:!0,visibleIf:'ticketType == "speaker"'},{fieldKey:"talkDescription",label:"Talk Description",type:"textarea",required:!0,visibleIf:'ticketType == "speaker"',placeholder:"Provide a brief description of your talk..."},{fieldKey:"dietaryRestrictions",label:"Dietary Restrictions",type:"multi-select",visibleIf:'ticketType == "vip" || ticketType == "speaker"',options:[{value:"vegetarian",label:"Vegetarian"},{value:"vegan",label:"Vegan"},{value:"glutenfree",label:"Gluten-Free"},{value:"kosher",label:"Kosher"},{value:"halal",label:"Halal"}],helpText:"Select any dietary restrictions for VIP dinner and speaker reception"},{fieldKey:"accommodation",label:"Need accommodation assistance?",type:"boolean",visibleIf:'ticketType == "vip" || ticketType == "speaker"'},{fieldKey:"accommodationNotes",label:"Accommodation Details",type:"textarea",visibleIf:"accommodation == true",placeholder:"Please describe your accommodation needs..."}],actions:[{actionKey:"cancel",label:"Cancel",style:"secondary"},{actionKey:"submit",label:"Register",style:"primary"}]},ee={componentId:"async-validation",name:"User Registration",title:"Create Your Account",description:"Join our platform today",componentType:"Form",fields:[{fieldKey:"username",label:"Username",type:"text",required:!0,helpText:"Must be unique and 3-20 characters long",validationRules:[{type:"required",message:"Username is required"},{type:"minLength",value:3,message:"Username must be at least 3 characters"},{type:"maxLength",value:20,message:"Username must be no more than 20 characters"}]},{fieldKey:"email",label:"Email Address",type:"email",required:!0,helpText:"We'll send a verification email to this address",validationRules:[{type:"required",message:"Email is required"},{type:"email",message:"Please enter a valid email address"}]},{fieldKey:"password",label:"Password",type:"text",required:!0,helpText:"Must be at least 8 characters with uppercase, lowercase, and numbers",validationRules:[{type:"required",message:"Password is required"},{type:"minLength",value:8,message:"Password must be at least 8 characters"}]},{fieldKey:"confirmPassword",label:"Confirm Password",type:"text",required:!0,validationRules:[{type:"required",message:"Please confirm your password"}]},{fieldKey:"terms",label:"I agree to the Terms of Service and Privacy Policy",type:"boolean",required:!0,validationRules:[{type:"required",message:"You must agree to the terms to continue"}]}],actions:[{actionKey:"cancel",label:"Cancel",style:"secondary"},{actionKey:"submit",label:"Create Account",style:"primary"}]},e={args:{schema:y,initialData:{}}},a={args:{schema:y,initialData:{name:"John Doe",email:"john.doe@example.com",subject:"support",message:"I need help with..."}}},t={args:{schema:X,initialData:{}}},i={args:{schema:X,initialData:{firstName:"Jane",lastName:"Smith",email:"jane.smith@example.com",phone:"(555) 123-4567",position:"fullstack",experience:5,skills:["javascript","typescript","react","nodejs"],remote:!0,relocation:!1,startDate:"2024-02-01"}}},r={args:{schema:u,initialData:{}}},o={args:{schema:u,initialData:{name:"Alex Johnson",email:"alex.johnson@university.edu",ticketType:"student"}}},s={args:{schema:u,initialData:{name:"Dr. Sarah Wilson",email:"sarah.wilson@techcorp.com",ticketType:"speaker"}}},l={args:{schema:u,initialData:{name:"Michael Chen",email:"michael.chen@company.com",ticketType:"vip",accommodation:!0}}},n={args:{schema:ee,initialData:{}}},c={args:{schema:y,initialData:{name:"",email:"invalid-email",subject:"",message:"Too short"}}},m={args:{initialData:{}},parameters:{docs:{description:{story:"Shows the loading state when a form schema is being fetched from the server. This story simulates the loading state without making actual database calls."}}},render:h=>p.jsx("div",{className:"flex items-center justify-center py-8",children:p.jsx("div",{className:"text-muted-foreground",children:"Loading form schema..."})})},d={args:{schema:void 0,initialData:{}},parameters:{docs:{description:{story:"Shows the error state when no schema is available."}}}};var b,f,g;e.parameters={...e.parameters,docs:{...(b=e.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    schema: simpleContactForm,
    initialData: {}
  }
}`,...(g=(f=e.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var v,x,D;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    schema: simpleContactForm,
    initialData: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'support',
      message: 'I need help with...'
    }
  }
}`,...(D=(x=a.parameters)==null?void 0:x.docs)==null?void 0:D.source}}};var S,k,q;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    schema: jobApplicationForm,
    initialData: {}
  }
}`,...(q=(k=t.parameters)==null?void 0:k.docs)==null?void 0:q.source}}};var T,K,F;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    schema: jobApplicationForm,
    initialData: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '(555) 123-4567',
      position: 'fullstack',
      experience: 5,
      skills: ['javascript', 'typescript', 'react', 'nodejs'],
      remote: true,
      relocation: false,
      startDate: '2024-02-01'
    }
  }
}`,...(F=(K=i.parameters)==null?void 0:K.docs)==null?void 0:F.source}}};var C,j,w;r.parameters={...r.parameters,docs:{...(C=r.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    schema: conditionalForm,
    initialData: {}
  }
}`,...(w=(j=r.parameters)==null?void 0:j.docs)==null?void 0:w.source}}};var P,I,E;o.parameters={...o.parameters,docs:{...(P=o.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    schema: conditionalForm,
    initialData: {
      name: 'Alex Johnson',
      email: 'alex.johnson@university.edu',
      ticketType: 'student'
    }
  }
}`,...(E=(I=o.parameters)==null?void 0:I.docs)==null?void 0:E.source}}};var A,N,L;s.parameters={...s.parameters,docs:{...(A=s.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    schema: conditionalForm,
    initialData: {
      name: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@techcorp.com',
      ticketType: 'speaker'
    }
  }
}`,...(L=(N=s.parameters)==null?void 0:N.docs)==null?void 0:L.source}}};var R,J,V;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    schema: conditionalForm,
    initialData: {
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      ticketType: 'vip',
      accommodation: true
    }
  }
}`,...(V=(J=l.parameters)==null?void 0:J.docs)==null?void 0:V.source}}};var U,W,M;n.parameters={...n.parameters,docs:{...(U=n.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    schema: asyncValidationForm,
    initialData: {}
  }
}`,...(M=(W=n.parameters)==null?void 0:W.docs)==null?void 0:M.source}}};var O,G,Y;c.parameters={...c.parameters,docs:{...(O=c.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    schema: simpleContactForm,
    initialData: {
      name: '',
      email: 'invalid-email',
      subject: '',
      message: 'Too short'
    }
  }
}`,...(Y=(G=c.parameters)==null?void 0:G.docs)==null?void 0:Y.source}}};var $,_,B;m.parameters={...m.parameters,docs:{...($=m.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    initialData: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the loading state when a form schema is being fetched from the server. This story simulates the loading state without making actual database calls.'
      }
    }
  },
  render: args => {
    // Simulate loading state by rendering the loading UI directly
    return <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading form schema...</div>
      </div>;
  }
}`,...(B=(_=m.parameters)==null?void 0:_.docs)==null?void 0:B.source}}};var H,Q,z;d.parameters={...d.parameters,docs:{...(H=d.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    schema: undefined,
    initialData: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the error state when no schema is available.'
      }
    }
  }
}`,...(z=(Q=d.parameters)==null?void 0:Q.docs)==null?void 0:z.source}}};const Ce=["SimpleContactForm","PrefilledContactForm","ComplexJobApplication","JobApplicationWithData","ConditionalLogic","ConditionalLogicStudent","ConditionalLogicSpeaker","ConditionalLogicVIP","AsyncValidationForm","FormWithValidationErrors","LoadingState","ErrorState"];export{n as AsyncValidationForm,t as ComplexJobApplication,r as ConditionalLogic,s as ConditionalLogicSpeaker,o as ConditionalLogicStudent,l as ConditionalLogicVIP,d as ErrorState,c as FormWithValidationErrors,i as JobApplicationWithData,m as LoadingState,a as PrefilledContactForm,e as SimpleContactForm,Ce as __namedExportsOrder,Fe as default};
