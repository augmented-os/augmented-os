import{j as t}from"./jsx-runtime-BT65X5dW.js";import{D as W}from"./DynamicForm-OHA8l7o_.js";import{r as G}from"./index-C6mWTJJr.js";import"./FormSection-BXqWezJv.js";import"./TextInput-D1rd6FA3.js";import"./input-dGyvt1gO.js";import"./utils-CytzSlOG.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-B5vUWwF_.js";import"./NumberInput-DNalEYdP.js";import"./SelectInput-bHGg1ngK.js";import"./check-BvmRBcsD.js";import"./TextareaInput-DTn6fcBx.js";import"./BooleanInput-BbQ8GhQ8.js";import"./checkbox-DAvk8bKM.js";import"./DateInput-Cgcb2E7S.js";import"./FileInput-ltJkPhXW.js";import"./button-DTZ1A7rA.js";import"./MultiSelectInput-BlXkhP6C.js";import"./EmailInput-BZWgOOXu.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-CiQj-xe7.js";import"./QueryClientProvider-9W50J78D.js";import"./iframe-CSMkAxJl.js";const Te={title:"Dynamic UI/Examples/Advanced Patterns",component:W,parameters:{docs:{description:{component:"Advanced dynamic UI patterns demonstrating complex interactions, conditional logic, and sophisticated form behaviors."}}},tags:["autodocs"]},H={componentId:"conditional-fields-demo",name:"Conditional Fields",componentType:"Form",title:"Conditional Field Visibility",fields:[{fieldKey:"userType",label:"User Type",type:"select",required:!0,options:[{value:"individual",label:"Individual"},{value:"business",label:"Business"},{value:"enterprise",label:"Enterprise"}]},{fieldKey:"firstName",label:"First Name",type:"text",required:!0},{fieldKey:"companyName",label:"Company Name",type:"text",required:!0}],actions:[{actionKey:"submit",label:"Submit",style:"primary"}]},J={componentId:"multi-step-form",name:"Multi-Step Form",componentType:"Form",title:"Multi-Step Registration",fields:[{fieldKey:"email",label:"Email Address",type:"email",required:!0,placeholder:"your.email@example.com"},{fieldKey:"password",label:"Password",type:"text",required:!0}],actions:[{actionKey:"next",label:"Next Step",style:"primary"},{actionKey:"previous",label:"Previous",style:"secondary"}]},Q={componentId:"dynamic-list-demo",name:"Dynamic List Management",componentType:"Form",title:"Manage Dynamic Lists",fields:[{fieldKey:"listTitle",label:"List Title",type:"text",required:!0,placeholder:"Enter list title"}],actions:[{actionKey:"addItem",label:"Add Item",style:"secondary"},{actionKey:"submit",label:"Save List",style:"primary"}]},n={args:{schema:H,onSubmit:e=>{console.log("Conditional form submitted:",e)}},parameters:{docs:{description:{story:"TODO: Conditional field visibility based on user selections with complex dependency chains."}}}},a={args:{schema:J,onSubmit:e=>{console.log("Multi-step form completed:",e)}},parameters:{docs:{description:{story:"TODO: Multi-step form wizard with navigation, progress tracking, and step validation."}}}},o={args:{schema:Q,onSubmit:e=>{console.log("Dynamic list submitted:",e)}},parameters:{docs:{description:{story:"TODO: Dynamic list management with add/remove functionality and nested structures."}}}},i={args:{schema:{componentId:"cross-field-validation",name:"Cross-Field Validation",componentType:"Form",title:"Advanced Validation Demo",fields:[{fieldKey:"password",label:"Password",type:"text",required:!0},{fieldKey:"confirmPassword",label:"Confirm Password",type:"text",required:!0},{fieldKey:"startDate",label:"Start Date",type:"date",required:!0},{fieldKey:"endDate",label:"End Date",type:"date",required:!0}],actions:[{actionKey:"submit",label:"Validate & Submit",style:"primary"}]},onSubmit:e=>{console.log("Cross-field validation passed:",e)}},parameters:{docs:{description:{story:"TODO: Cross-field validation with password confirmation, date ranges, and custom rules."}}}},s={render:()=>{const[e,d]=G.useState(!1);return t.jsxs("div",{children:[t.jsx("button",{onClick:()=>d(!0),className:"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",children:"Open Modal Form (TODO: Implement DynamicModal)"}),e&&t.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center",children:t.jsxs("div",{className:"bg-white p-6 rounded-lg",children:[t.jsx("p",{children:"TODO: DynamicModal component not yet implemented"}),t.jsx("button",{onClick:()=>d(!1),className:"mt-4 px-4 py-2 bg-gray-500 text-white rounded",children:"Close"})]})})]})},parameters:{docs:{description:{story:"TODO: Modal form integration with dynamic content and workflow management."}}}},r={args:{schema:{componentId:"file-upload-demo",name:"File Upload",componentType:"Form",title:"File Upload Example",fields:[{fieldKey:"documentTitle",label:"Document Title",type:"text",required:!0,placeholder:"Enter document title"},{fieldKey:"description",label:"Description",type:"textarea",placeholder:"Describe the uploaded files..."}],actions:[{actionKey:"upload",label:"Upload Files",style:"primary"}]},onSubmit:e=>{console.log("File upload form submitted:",e)}},parameters:{docs:{description:{story:"TODO: File upload integration with validation, progress tracking, and file management."}}}},l={args:{schema:{componentId:"realtime-collaboration",name:"Real-time Collaboration",componentType:"Form",title:"Collaborative Form Editing",fields:[{fieldKey:"sharedDocument",label:"Shared Document",type:"textarea",placeholder:"Start typing... (simulated real-time editing)"}],actions:[{actionKey:"save",label:"Save Changes",style:"primary"}]},onSubmit:e=>{console.log("Collaborative form saved:",e)}},parameters:{docs:{description:{story:"TODO: Real-time collaborative form editing with conflict resolution and user presence."}}}};var m,c,p,u,y;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    schema: conditionalFieldsSchema,
    onSubmit: data => {
      console.log('Conditional form submitted:', data);
      // TODO: Implement conditional form logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Conditional field visibility based on user selections with complex dependency chains.'
      }
    }
  }
}`,...(p=(c=n.parameters)==null?void 0:c.docs)==null?void 0:p.source},description:{story:`Conditional Field Visibility

TODO: Demonstrates conditional field logic with:
- Fields that show/hide based on other field values
- Complex conditional expressions
- Nested conditional dependencies
- Dynamic validation based on conditions`,...(y=(u=n.parameters)==null?void 0:u.docs)==null?void 0:y.description}}};var b,f,g,O,h;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    schema: multiStepFormSchema,
    onSubmit: data => {
      console.log('Multi-step form completed:', data);
      // TODO: Implement multi-step completion logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Multi-step form wizard with navigation, progress tracking, and step validation.'
      }
    }
  }
}`,...(g=(f=a.parameters)==null?void 0:f.docs)==null?void 0:g.source},description:{story:`Multi-Step Form Wizard

TODO: Demonstrates multi-step forms with:
- Step-by-step navigation
- Progress indicators
- Data persistence between steps
- Step validation and error handling`,...(h=(O=a.parameters)==null?void 0:O.docs)==null?void 0:h.description}}};var D,v,T,w,F;o.parameters={...o.parameters,docs:{...(D=o.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    schema: dynamicListSchema,
    onSubmit: data => {
      console.log('Dynamic list submitted:', data);
      // TODO: Implement dynamic list logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Dynamic list management with add/remove functionality and nested structures.'
      }
    }
  }
}`,...(T=(v=o.parameters)==null?void 0:v.docs)==null?void 0:T.source},description:{story:`Dynamic List Management

TODO: Demonstrates dynamic list handling with:
- Add/remove list items dynamically
- Reorderable list items
- Nested form structures
- Bulk operations on list items`,...(F=(w=o.parameters)==null?void 0:w.docs)==null?void 0:F.description}}};var x,S,C,M,I;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'cross-field-validation',
      name: 'Cross-Field Validation',
      componentType: 'Form',
      title: 'Advanced Validation Demo',
      // TODO: Add cross-field validation examples
      fields: [{
        fieldKey: 'password',
        label: 'Password',
        type: 'text',
        // TODO: Change to password type
        required: true
      }, {
        fieldKey: 'confirmPassword',
        label: 'Confirm Password',
        type: 'text',
        // TODO: Change to password type
        required: true
        // TODO: Add cross-field validation
      }, {
        fieldKey: 'startDate',
        label: 'Start Date',
        type: 'date',
        required: true
      }, {
        fieldKey: 'endDate',
        label: 'End Date',
        type: 'date',
        required: true
        // TODO: Add date range validation
      }],
      actions: [{
        actionKey: 'submit',
        label: 'Validate & Submit',
        style: 'primary'
      }]
    },
    onSubmit: data => {
      console.log('Cross-field validation passed:', data);
      // TODO: Implement validation logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Cross-field validation with password confirmation, date ranges, and custom rules.'
      }
    }
  }
}`,...(C=(S=i.parameters)==null?void 0:S.docs)==null?void 0:C.source},description:{story:`Cross-Field Validation

TODO: Demonstrates complex validation with:
- Fields that validate against other fields
- Custom validation functions
- Async validation with API calls
- Real-time validation feedback`,...(I=(M=i.parameters)==null?void 0:M.docs)==null?void 0:I.description}}};var K,q,E,k,A;s.parameters={...s.parameters,docs:{...(K=s.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return <div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Open Modal Form (TODO: Implement DynamicModal)
        </button>
        
        {/* TODO: Uncomment when DynamicModal is implemented
         <DynamicModal
          schema={{
            componentId: 'modal-form-demo',
            name: 'Modal Form',
            componentType: 'Modal',
            title: 'Modal Form Example',
            fields: [
              {
                fieldKey: 'modalInput',
                label: 'Modal Input',
                type: 'text',
                required: true,
                placeholder: 'Enter text in modal',
              },
            ],
            actions: [
              {
                actionKey: 'submit',
                label: 'Submit',
                style: 'primary',
              },
              {
                actionKey: 'cancel',
                label: 'Cancel',
                style: 'secondary',
              },
            ],
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(data) => {
            console.log('Modal form submitted:', data);
            setIsModalOpen(false);
          }}
         />
         */}
        
        {isModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <p>TODO: DynamicModal component not yet implemented</p>
              <button onClick={() => setIsModalOpen(false)} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
                Close
              </button>
            </div>
          </div>}
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Modal form integration with dynamic content and workflow management.'
      }
    }
  }
}`,...(E=(q=s.parameters)==null?void 0:q.docs)==null?void 0:E.source},description:{story:`Modal Form Integration

TODO: Demonstrates modal forms with:
- Dynamic modal content
- Form submission within modals
- Modal chaining and workflows
- Context preservation`,...(A=(k=s.parameters)==null?void 0:k.docs)==null?void 0:A.description}}};var N,U,P,R,V;r.parameters={...r.parameters,docs:{...(N=r.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'file-upload-demo',
      name: 'File Upload',
      componentType: 'Form',
      title: 'File Upload Example',
      // TODO: Add file upload fields when available
      fields: [{
        fieldKey: 'documentTitle',
        label: 'Document Title',
        type: 'text',
        required: true,
        placeholder: 'Enter document title'
      },
      // TODO: Add file upload field type
      {
        fieldKey: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Describe the uploaded files...'
      }],
      actions: [{
        actionKey: 'upload',
        label: 'Upload Files',
        style: 'primary'
      }]
    },
    onSubmit: data => {
      console.log('File upload form submitted:', data);
      // TODO: Implement file upload logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: File upload integration with validation, progress tracking, and file management.'
      }
    }
  }
}`,...(P=(U=r.parameters)==null?void 0:U.docs)==null?void 0:P.source},description:{story:`File Upload Integration

TODO: Demonstrates file upload handling with:
- Multiple file selection
- File type validation
- Upload progress tracking
- File preview and management`,...(V=(R=r.parameters)==null?void 0:R.docs)==null?void 0:V.description}}};var j,L,z,B,_;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'realtime-collaboration',
      name: 'Real-time Collaboration',
      componentType: 'Form',
      title: 'Collaborative Form Editing',
      // TODO: Add collaboration-aware fields
      fields: [{
        fieldKey: 'sharedDocument',
        label: 'Shared Document',
        type: 'textarea',
        placeholder: 'Start typing... (simulated real-time editing)'
      }],
      actions: [{
        actionKey: 'save',
        label: 'Save Changes',
        style: 'primary'
      }]
    },
    onSubmit: data => {
      console.log('Collaborative form saved:', data);
      // TODO: Implement real-time collaboration logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Real-time collaborative form editing with conflict resolution and user presence.'
      }
    }
  }
}`,...(z=(L=l.parameters)==null?void 0:L.docs)==null?void 0:z.source},description:{story:`Real-time Collaboration

TODO: Demonstrates real-time features with:
- Live form updates from other users
- Conflict resolution strategies
- User presence indicators
- Collaborative editing features`,...(_=(B=l.parameters)==null?void 0:B.docs)==null?void 0:_.description}}};const we=["ConditionalFields","MultiStepForm","DynamicLists","CrossFieldValidation","ModalFormIntegration","FileUploadIntegration","RealTimeCollaboration"];export{n as ConditionalFields,i as CrossFieldValidation,o as DynamicLists,r as FileUploadIntegration,s as ModalFormIntegration,a as MultiStepForm,l as RealTimeCollaboration,we as __namedExportsOrder,Te as default};
