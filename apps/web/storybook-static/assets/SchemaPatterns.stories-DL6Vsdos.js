import{D as S}from"./DynamicUIRenderer-DW83NvMH.js";import"./jsx-runtime-BT65X5dW.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./DynamicForm-OHA8l7o_.js";import"./FormSection-BXqWezJv.js";import"./TextInput-D1rd6FA3.js";import"./input-dGyvt1gO.js";import"./utils-CytzSlOG.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./index-B5vUWwF_.js";import"./NumberInput-DNalEYdP.js";import"./SelectInput-bHGg1ngK.js";import"./check-BvmRBcsD.js";import"./TextareaInput-DTn6fcBx.js";import"./BooleanInput-BbQ8GhQ8.js";import"./checkbox-DAvk8bKM.js";import"./DateInput-Cgcb2E7S.js";import"./FileInput-ltJkPhXW.js";import"./button-DTZ1A7rA.js";import"./MultiSelectInput-BlXkhP6C.js";import"./EmailInput-BZWgOOXu.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-CiQj-xe7.js";import"./QueryClientProvider-9W50J78D.js";import"./iframe-CSMkAxJl.js";import"./DynamicDisplay-CW0ZWIbw.js";import"./TableDisplay-CACaD82O.js";import"./CardDisplay-3IRVwmAz.js";import"./ActionButtons-4328mjEA.js";import"./DynamicUIErrorBoundary-Ca1kF0AK.js";import"./DynamicUIStateContext-BrzZPoL3.js";const ne={title:"Dynamic UI/System Integration/Schema Patterns",component:S,parameters:{docs:{description:{component:`
# Schema Patterns

A collection of reusable schema patterns and configuration examples for common UI scenarios.
These patterns can be used as templates for building new dynamic components.

**Purpose**: Provide ready-to-use schema patterns that follow best practices and common design patterns.
        `}}},argTypes:{onSubmit:{action:"submitted"},onCancel:{action:"cancelled"},onAction:{action:"action triggered"}}},w={componentId:"basic-contact-form",name:"Basic Contact Form",componentType:"Form",title:"Contact Us",description:"Get in touch with our team",fields:[{fieldKey:"name",label:"Full Name",type:"text",required:!0,placeholder:"Enter your full name"},{fieldKey:"email",label:"Email Address",type:"email",required:!0,placeholder:"your.email@company.com"},{fieldKey:"subject",label:"Subject",type:"select",required:!0,options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales Question"},{value:"feedback",label:"Feedback"}]},{fieldKey:"message",label:"Message",type:"textarea",required:!0,placeholder:"Tell us how we can help you..."}],actions:[{actionKey:"submit",label:"Send Message",style:"primary"},{actionKey:"cancel",label:"Cancel",style:"secondary"}]},P={componentId:"conditional-fields-form",name:"Conditional Fields Pattern",componentType:"Form",title:"Event Registration",description:"Register for our upcoming event",fields:[{fieldKey:"attendeeType",label:"Attendee Type",type:"select",required:!0,options:[{value:"student",label:"Student"},{value:"professional",label:"Professional"},{value:"speaker",label:"Speaker"}]},{fieldKey:"studentId",label:"Student ID",type:"text",required:!0,visibleIf:'attendeeType == "student"',placeholder:"Enter your student ID"},{fieldKey:"company",label:"Company",type:"text",required:!0,visibleIf:'attendeeType == "professional"',placeholder:"Your company name"},{fieldKey:"jobTitle",label:"Job Title",type:"text",required:!0,visibleIf:'attendeeType == "professional"',placeholder:"Your job title"},{fieldKey:"speakerBio",label:"Speaker Biography",type:"textarea",required:!0,visibleIf:'attendeeType == "speaker"',placeholder:"Brief biography for speaker introduction..."},{fieldKey:"dietaryRestrictions",label:"Dietary Restrictions",type:"multi-select",options:[{value:"vegetarian",label:"Vegetarian"},{value:"vegan",label:"Vegan"},{value:"gluten_free",label:"Gluten Free"},{value:"nut_allergy",label:"Nut Allergy"}],helpText:"Please select any dietary restrictions (optional)"}],actions:[{actionKey:"submit",label:"Register",style:"primary"}]},D={componentId:"multi-section-form",name:"Multi-Section Form Pattern",componentType:"Form",title:"Complete Profile Setup",description:"Please fill out all sections to complete your profile",layout:{sections:[{title:"Personal Information",fields:["firstName","lastName","email","phone"],collapsible:!1},{title:"Address Information",fields:["street","city","state","zipCode"],collapsible:!0,defaultExpanded:!0},{title:"Preferences",fields:["newsletter","notifications","theme"],collapsible:!0,defaultExpanded:!1}],spacing:"normal"},fields:[{fieldKey:"firstName",label:"First Name",type:"text",required:!0},{fieldKey:"lastName",label:"Last Name",type:"text",required:!0},{fieldKey:"email",label:"Email",type:"email",required:!0},{fieldKey:"phone",label:"Phone Number",type:"text",placeholder:"(555) 123-4567"},{fieldKey:"street",label:"Street Address",type:"text",required:!0},{fieldKey:"city",label:"City",type:"text",required:!0},{fieldKey:"state",label:"State",type:"select",required:!0,options:[{value:"ca",label:"California"},{value:"ny",label:"New York"},{value:"tx",label:"Texas"}]},{fieldKey:"zipCode",label:"ZIP Code",type:"text",required:!0},{fieldKey:"newsletter",label:"Subscribe to Newsletter",type:"boolean"},{fieldKey:"notifications",label:"Email Notifications",type:"boolean"},{fieldKey:"theme",label:"Preferred Theme",type:"select",options:[{value:"light",label:"Light"},{value:"dark",label:"Dark"},{value:"auto",label:"Auto"}]}],actions:[{actionKey:"submit",label:"Save Profile",style:"primary"},{actionKey:"cancel",label:"Cancel",style:"secondary"}]},F={componentId:"user-profile-display",name:"Data Display Pattern",componentType:"Display",title:"User Profile: {{name}}",customProps:{displayType:"card",fields:[{key:"name",label:"Full Name",type:"text"},{key:"email",label:"Email",type:"email"},{key:"department",label:"Department",type:"text"},{key:"role",label:"Role",type:"text"},{key:"joinDate",label:"Join Date",type:"date"},{key:"status",label:"Status",type:"badge"}],layout:"grid"},actions:[{actionKey:"edit",label:"Edit Profile",style:"primary"},{actionKey:"deactivate",label:"Deactivate",style:"danger",confirmation:"Are you sure you want to deactivate this user?"}]},x={name:"Sarah Johnson",email:"sarah.johnson@company.com",department:"Engineering",role:"Senior Software Engineer",joinDate:"2023-03-15",status:"Active"},e={args:{schema:w},parameters:{docs:{description:{story:`
**Pattern**: Basic Contact Form

A simple contact form with essential fields and validation.
Perfect for customer inquiries, feedback forms, or general contact pages.

**Features**:
- Required field validation
- Email format validation  
- Select dropdown for categorization
- Textarea for longer messages
        `}}}},t={args:{schema:P,initialData:{attendeeType:"professional"}},parameters:{docs:{description:{story:`
**Pattern**: Conditional Field Visibility

Demonstrates how fields can be shown/hidden based on other field values.
Useful for adaptive forms that change based on user selections.

**Features**:
- Dynamic field visibility with \`visibleIf\` conditions
- Different field sets for different user types
- Multi-select for optional preferences
        `}}}},a={args:{schema:D},parameters:{docs:{description:{story:`
**Pattern**: Multi-Section Layout

Organizes complex forms into logical sections with collapsible areas.
Ideal for lengthy forms like user profiles, settings, or onboarding.

**Features**:
- Grouped field sections with titles
- Collapsible sections (some expanded by default)
- Mixed field types within sections
- Progressive disclosure for better UX
        `}}}},o={args:{schema:F,data:x},parameters:{docs:{description:{story:`
**Pattern**: Structured Data Display

Shows how to display read-only data in a clean, organized format.
Perfect for profile pages, record details, or summary views.

**Features**:
- Card layout for data presentation
- Template interpolation in titles
- Action buttons for data manipulation
- Confirmation dialogs for destructive actions
        `}}}},i={args:{schema:{componentId:"empty-state-example",name:"Empty State Pattern",componentType:"Display",title:"No Data Available",customProps:{displayType:"card",fields:[]}},data:{}},parameters:{docs:{description:{story:`
**Pattern**: Empty State Handling

Demonstrates how to handle scenarios where no data is available.
Important for maintaining good UX when content is missing.

**Use Cases**:
- New user accounts with no data
- Filtered results with no matches
- Lists that haven't been populated yet
        `}}}};var n,r,s;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    schema: basicContactFormSchema
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Pattern**: Basic Contact Form

A simple contact form with essential fields and validation.
Perfect for customer inquiries, feedback forms, or general contact pages.

**Features**:
- Required field validation
- Email format validation  
- Select dropdown for categorization
- Textarea for longer messages
        \`
      }
    }
  }
}`,...(s=(r=e.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};var l,c,d;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    schema: conditionalFieldsSchema,
    initialData: {
      attendeeType: 'professional' // Pre-select to show conditional fields
    }
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Pattern**: Conditional Field Visibility

Demonstrates how fields can be shown/hidden based on other field values.
Useful for adaptive forms that change based on user selections.

**Features**:
- Dynamic field visibility with \\\`visibleIf\\\` conditions
- Different field sets for different user types
- Multi-select for optional preferences
        \`
      }
    }
  }
}`,...(d=(c=t.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var p,m,u;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    schema: multiSectionFormSchema
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Pattern**: Multi-Section Layout

Organizes complex forms into logical sections with collapsible areas.
Ideal for lengthy forms like user profiles, settings, or onboarding.

**Features**:
- Grouped field sections with titles
- Collapsible sections (some expanded by default)
- Mixed field types within sections
- Progressive disclosure for better UX
        \`
      }
    }
  }
}`,...(u=(m=a.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var y,f,b;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    schema: dataDisplaySchema,
    data: sampleUserData
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Pattern**: Structured Data Display

Shows how to display read-only data in a clean, organized format.
Perfect for profile pages, record details, or summary views.

**Features**:
- Card layout for data presentation
- Template interpolation in titles
- Action buttons for data manipulation
- Confirmation dialogs for destructive actions
        \`
      }
    }
  }
}`,...(b=(f=o.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var h,g,v;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'empty-state-example',
      name: 'Empty State Pattern',
      componentType: 'Display',
      title: 'No Data Available',
      customProps: {
        displayType: 'card',
        fields: []
      }
    },
    data: {}
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Pattern**: Empty State Handling

Demonstrates how to handle scenarios where no data is available.
Important for maintaining good UX when content is missing.

**Use Cases**:
- New user accounts with no data
- Filtered results with no matches
- Lists that haven't been populated yet
        \`
      }
    }
  }
}`,...(v=(g=i.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};const re=["BasicContactForm","ConditionalFields","MultiSectionForm","DataDisplayPattern","EmptyStatePattern"];export{e as BasicContactForm,t as ConditionalFields,o as DataDisplayPattern,i as EmptyStatePattern,a as MultiSectionForm,re as __namedExportsOrder,ne as default};
