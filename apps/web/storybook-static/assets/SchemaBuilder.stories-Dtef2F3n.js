import{j as e}from"./jsx-runtime-BT65X5dW.js";import{r as o}from"./index-C6mWTJJr.js";import{D}from"./DynamicForm-OHA8l7o_.js";import{D as w}from"./DynamicDisplay-CW0ZWIbw.js";import"./_commonjsHelpers-BosuxZz1.js";import"./FormSection-BXqWezJv.js";import"./TextInput-D1rd6FA3.js";import"./input-dGyvt1gO.js";import"./utils-CytzSlOG.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./index-B5vUWwF_.js";import"./NumberInput-DNalEYdP.js";import"./SelectInput-bHGg1ngK.js";import"./check-BvmRBcsD.js";import"./TextareaInput-DTn6fcBx.js";import"./BooleanInput-BbQ8GhQ8.js";import"./checkbox-DAvk8bKM.js";import"./DateInput-Cgcb2E7S.js";import"./FileInput-ltJkPhXW.js";import"./button-DTZ1A7rA.js";import"./MultiSelectInput-BlXkhP6C.js";import"./EmailInput-BZWgOOXu.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-CiQj-xe7.js";import"./QueryClientProvider-9W50J78D.js";import"./iframe-CSMkAxJl.js";import"./TableDisplay-CACaD82O.js";import"./CardDisplay-3IRVwmAz.js";import"./ActionButtons-4328mjEA.js";const se={title:"Dynamic UI/Development/Schema Builder",parameters:{docs:{description:{component:"Interactive schema builder for developing and testing Dynamic UI schemas."}}}},k=()=>{const[r,a]=o.useState({componentId:"builder-schema",name:"Schema Builder Test",title:"Schema Builder Test",description:"Test your schema here",componentType:"Form",version:"1.0.0",fields:[],layout:{spacing:"normal"}}),[n,d]=o.useState({}),[s,y]=o.useState("form"),K=t=>{const l={fieldKey:`field_${Date.now()}`,type:t,label:`New ${t} field`,required:!1};a(i=>({...i,fields:[...i.fields,l]}))},C=t=>{a(l=>({...l,fields:l.fields.filter(i=>i.fieldKey!==t)}))},h=(t,l)=>{a(i=>({...i,fields:i.fields.map(u=>u.fieldKey===t?{...u,...l}:u)}))};return e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2rem",height:"80vh"},children:[e.jsxs("div",{style:{border:"1px solid #ccc",padding:"1rem",overflow:"auto"},children:[e.jsx("h3",{children:"Schema Builder"}),e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsx("h4",{children:"Add Fields:"}),e.jsx("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:["text","email","number","select","checkbox","textarea","date"].map(t=>e.jsx("button",{onClick:()=>K(t),style:{padding:"0.25rem 0.5rem",fontSize:"0.8rem"},children:t},t))})]}),e.jsxs("div",{children:[e.jsx("h4",{children:"Fields:"}),r.fields.map((t,l)=>e.jsxs("div",{style:{border:"1px solid #eee",padding:"0.5rem",marginBottom:"0.5rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("strong",{children:t.type}),e.jsx("button",{onClick:()=>C(t.fieldKey),style:{color:"red"},children:"×"})]}),e.jsxs("div",{style:{fontSize:"0.8rem",marginTop:"0.25rem"},children:[e.jsx("input",{type:"text",value:t.label,onChange:i=>h(t.fieldKey,{label:i.target.value}),placeholder:"Field label",style:{width:"100%",marginBottom:"0.25rem"}}),e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"0.25rem"},children:[e.jsx("input",{type:"checkbox",checked:t.required||!1,onChange:i=>h(t.fieldKey,{required:i.target.checked})}),"Required"]})]})]},t.fieldKey))]}),e.jsxs("div",{style:{marginTop:"1rem"},children:[e.jsx("h4",{children:"Generated Schema:"}),e.jsx("textarea",{value:JSON.stringify(r,null,2),onChange:t=>{try{a(JSON.parse(t.target.value))}catch{}},style:{width:"100%",height:"200px",fontFamily:"monospace",fontSize:"0.8rem"}})]})]}),e.jsxs("div",{style:{border:"1px solid #ccc",padding:"1rem",overflow:"auto"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"},children:[e.jsx("h3",{children:"Preview"}),e.jsxs("div",{children:[e.jsxs("label",{style:{marginRight:"1rem"},children:[e.jsx("input",{type:"radio",name:"mode",value:"form",checked:s==="form",onChange:t=>y(t.target.value)}),"Form"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"mode",value:"display",checked:s==="display",onChange:t=>y(t.target.value)}),"Display"]})]})]}),r.fields.length===0?e.jsx("p",{style:{color:"#666",fontStyle:"italic"},children:"Add fields to see preview"}):s==="form"?e.jsx(D,{schema:r,initialData:n,onSubmit:t=>{console.log("Form submitted:",t),d(t),alert("Form submitted! Check console for data.")}}):e.jsx(w,{schema:r,data:n}),e.jsxs("div",{style:{marginTop:"2rem"},children:[e.jsx("h4",{children:"Test Data:"}),e.jsx("textarea",{value:JSON.stringify(n,null,2),onChange:t=>{try{d(JSON.parse(t.target.value))}catch{}},style:{width:"100%",height:"150px",fontFamily:"monospace",fontSize:"0.8rem"}})]})]})]})},m={render:()=>e.jsx(k,{}),parameters:{docs:{description:{story:"Interactive schema builder for rapid prototyping and testing of Dynamic UI schemas."}}}},f={userProfile:{componentId:"user-profile-template",name:"User Profile Template",title:"User Profile",description:"Standard user profile form",componentType:"Form",version:"1.0.0",fields:[{fieldKey:"firstName",type:"text",label:"First Name",required:!0,validationRules:[{type:"minLength",value:2,message:"First name must be at least 2 characters"},{type:"maxLength",value:50,message:"First name must be less than 50 characters"}]},{fieldKey:"lastName",type:"text",label:"Last Name",required:!0,validationRules:[{type:"minLength",value:2,message:"Last name must be at least 2 characters"},{type:"maxLength",value:50,message:"Last name must be less than 50 characters"}]},{fieldKey:"email",type:"email",label:"Email Address",required:!0},{fieldKey:"phone",type:"text",label:"Phone Number",validationRules:[{type:"pattern",value:"^\\+?[1-9]\\d{1,14}$",message:"Please enter a valid phone number"}]},{fieldKey:"bio",type:"textarea",label:"Biography",validationRules:[{type:"maxLength",value:500,message:"Biography must be less than 500 characters"}]}],layout:{spacing:"normal"}},contactForm:{componentId:"contact-form-template",name:"Contact Form Template",title:"Contact Form",description:"Standard contact form",componentType:"Form",version:"1.0.0",fields:[{fieldKey:"name",type:"text",label:"Your Name",required:!0},{fieldKey:"email",type:"email",label:"Email Address",required:!0},{fieldKey:"subject",type:"select",label:"Subject",required:!0,options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"billing",label:"Billing Question"},{value:"feedback",label:"Feedback"}]},{fieldKey:"message",type:"textarea",label:"Message",required:!0,validationRules:[{type:"minLength",value:10,message:"Message must be at least 10 characters"},{type:"maxLength",value:1e3,message:"Message must be less than 1000 characters"}]},{fieldKey:"newsletter",type:"boolean",label:"Subscribe to newsletter"}],layout:{spacing:"normal"}}},p={render:()=>{const[r,a]=o.useState("userProfile"),[n,d]=o.useState({});return e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:"2rem"},children:[e.jsx("h3",{children:"Schema Templates"}),e.jsx("p",{children:"Pre-built schema templates for common use cases."}),e.jsx("div",{style:{marginBottom:"1rem"},children:e.jsxs("label",{children:["Select Template:",e.jsxs("select",{value:r,onChange:s=>a(s.target.value),style:{marginLeft:"0.5rem",padding:"0.25rem"},children:[e.jsx("option",{value:"userProfile",children:"User Profile"}),e.jsx("option",{value:"contactForm",children:"Contact Form"})]})]})})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h4",{children:"Schema JSON:"}),e.jsx("pre",{style:{background:"#f5f5f5",padding:"1rem",overflow:"auto",fontSize:"0.8rem",maxHeight:"400px"},children:JSON.stringify(f[r],null,2)})]}),e.jsxs("div",{children:[e.jsx("h4",{children:"Preview:"}),e.jsx(D,{schema:f[r],initialData:n,onSubmit:s=>{console.log("Template form submitted:",s),d(s),alert("Form submitted! Check console for data.")}})]})]})]})},parameters:{docs:{description:{story:"Pre-built schema templates for common use cases. Use these as starting points for your own schemas."}}}},c={render:()=>{const r=[{type:"text",description:"Single-line text input",properties:["placeholder","validationRules.minLength","validationRules.maxLength","validationRules.pattern"],example:{fieldKey:"name",type:"text",label:"Name",placeholder:"Enter your name"}},{type:"email",description:"Email input with built-in validation",properties:["placeholder"],example:{fieldKey:"email",type:"email",label:"Email",placeholder:"user@example.com"}},{type:"number",description:"Numeric input",properties:["placeholder","validationRules.min","validationRules.max"],example:{fieldKey:"age",type:"number",label:"Age",validationRules:[{type:"min",value:0},{type:"max",value:120}]}},{type:"select",description:"Dropdown selection",properties:["options"],example:{fieldKey:"country",type:"select",label:"Country",options:[{value:"us",label:"United States"},{value:"ca",label:"Canada"}]}},{type:"boolean",description:"Boolean checkbox",properties:["default"],example:{fieldKey:"terms",type:"boolean",label:"I agree to the terms"}},{type:"textarea",description:"Multi-line text input",properties:["placeholder","validationRules.minLength","validationRules.maxLength"],example:{fieldKey:"description",type:"textarea",label:"Description"}},{type:"date",description:"Date picker",properties:["validationRules.min","validationRules.max"],example:{fieldKey:"birthdate",type:"date",label:"Birth Date"}}];return e.jsxs("div",{children:[e.jsx("h3",{children:"Field Type Reference"}),e.jsx("p",{children:"Complete reference for all available field types and their properties."}),e.jsx("div",{style:{display:"grid",gap:"1rem"},children:r.map(a=>e.jsxs("div",{style:{border:"1px solid #eee",padding:"1rem",borderRadius:"4px"},children:[e.jsx("h4",{style:{margin:"0 0 0.5rem 0",color:"#0066cc"},children:a.type}),e.jsx("p",{style:{margin:"0 0 1rem 0",color:"#666"},children:a.description}),e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsx("strong",{children:"Available Properties:"}),e.jsx("ul",{style:{margin:"0.5rem 0",paddingLeft:"1.5rem"},children:a.properties.map(n=>e.jsx("li",{style:{fontSize:"0.9rem"},children:e.jsx("code",{children:n})},n))})]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Example Schema:"}),e.jsx("pre",{style:{background:"#f8f8f8",padding:"0.5rem",margin:"0.5rem 0 0 0",fontSize:"0.8rem",overflow:"auto"},children:JSON.stringify(a.example,null,2)})]})]},a.type))})]})},parameters:{docs:{description:{story:"Complete reference for all available field types, their properties, and usage examples."}}}};var g,x,v;m.parameters={...m.parameters,docs:{...(g=m.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <SchemaBuilder />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive schema builder for rapid prototyping and testing of Dynamic UI schemas.'
      }
    }
  }
}`,...(v=(x=m.parameters)==null?void 0:x.docs)==null?void 0:v.source}}};var b,j,S;p.parameters={...p.parameters,docs:{...(b=p.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => {
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('userProfile');
    const [data, setData] = useState<Record<string, unknown>>({});
    return <div>
        <div style={{
        marginBottom: '2rem'
      }}>
          <h3>Schema Templates</h3>
          <p>Pre-built schema templates for common use cases.</p>
          
          <div style={{
          marginBottom: '1rem'
        }}>
            <label>
              Select Template:
              <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value as keyof typeof templates)} style={{
              marginLeft: '0.5rem',
              padding: '0.25rem'
            }}>
                <option value="userProfile">User Profile</option>
                <option value="contactForm">Contact Form</option>
              </select>
            </label>
          </div>
        </div>

        <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
      }}>
          <div>
            <h4>Schema JSON:</h4>
            <pre style={{
            background: '#f5f5f5',
            padding: '1rem',
            overflow: 'auto',
            fontSize: '0.8rem',
            maxHeight: '400px'
          }}>
              {JSON.stringify(templates[selectedTemplate], null, 2)}
            </pre>
          </div>

          <div>
            <h4>Preview:</h4>
            <DynamicForm schema={templates[selectedTemplate]} initialData={data} onSubmit={formData => {
            console.log('Template form submitted:', formData);
            setData(formData);
            alert('Form submitted! Check console for data.');
          }} />
          </div>
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Pre-built schema templates for common use cases. Use these as starting points for your own schemas.'
      }
    }
  }
}`,...(S=(j=p.parameters)==null?void 0:j.docs)==null?void 0:S.source}}};var T,R,F;c.parameters={...c.parameters,docs:{...(T=c.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => {
    const fieldTypes = [{
      type: 'text',
      description: 'Single-line text input',
      properties: ['placeholder', 'validationRules.minLength', 'validationRules.maxLength', 'validationRules.pattern'],
      example: {
        fieldKey: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Enter your name'
      }
    }, {
      type: 'email',
      description: 'Email input with built-in validation',
      properties: ['placeholder'],
      example: {
        fieldKey: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'user@example.com'
      }
    }, {
      type: 'number',
      description: 'Numeric input',
      properties: ['placeholder', 'validationRules.min', 'validationRules.max'],
      example: {
        fieldKey: 'age',
        type: 'number',
        label: 'Age',
        validationRules: [{
          type: 'min' as const,
          value: 0
        }, {
          type: 'max' as const,
          value: 120
        }]
      }
    }, {
      type: 'select',
      description: 'Dropdown selection',
      properties: ['options'],
      example: {
        fieldKey: 'country',
        type: 'select',
        label: 'Country',
        options: [{
          value: 'us',
          label: 'United States'
        }, {
          value: 'ca',
          label: 'Canada'
        }]
      }
    }, {
      type: 'boolean',
      description: 'Boolean checkbox',
      properties: ['default'],
      example: {
        fieldKey: 'terms',
        type: 'boolean',
        label: 'I agree to the terms'
      }
    }, {
      type: 'textarea',
      description: 'Multi-line text input',
      properties: ['placeholder', 'validationRules.minLength', 'validationRules.maxLength'],
      example: {
        fieldKey: 'description',
        type: 'textarea',
        label: 'Description'
      }
    }, {
      type: 'date',
      description: 'Date picker',
      properties: ['validationRules.min', 'validationRules.max'],
      example: {
        fieldKey: 'birthdate',
        type: 'date',
        label: 'Birth Date'
      }
    }];
    return <div>
        <h3>Field Type Reference</h3>
        <p>Complete reference for all available field types and their properties.</p>

        <div style={{
        display: 'grid',
        gap: '1rem'
      }}>
          {fieldTypes.map(fieldType => <div key={fieldType.type} style={{
          border: '1px solid #eee',
          padding: '1rem',
          borderRadius: '4px'
        }}>
              <h4 style={{
            margin: '0 0 0.5rem 0',
            color: '#0066cc'
          }}>{fieldType.type}</h4>
              <p style={{
            margin: '0 0 1rem 0',
            color: '#666'
          }}>{fieldType.description}</p>
              
              <div style={{
            marginBottom: '1rem'
          }}>
                <strong>Available Properties:</strong>
                <ul style={{
              margin: '0.5rem 0',
              paddingLeft: '1.5rem'
            }}>
                  {fieldType.properties.map(prop => <li key={prop} style={{
                fontSize: '0.9rem'
              }}><code>{prop}</code></li>)}
                </ul>
              </div>

              <div>
                <strong>Example Schema:</strong>
                <pre style={{
              background: '#f8f8f8',
              padding: '0.5rem',
              margin: '0.5rem 0 0 0',
              fontSize: '0.8rem',
              overflow: 'auto'
            }}>
                  {JSON.stringify(fieldType.example, null, 2)}
                </pre>
              </div>
            </div>)}
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete reference for all available field types, their properties, and usage examples.'
      }
    }
  }
}`,...(F=(R=c.parameters)==null?void 0:R.docs)==null?void 0:F.source}}};const oe=["InteractiveBuilder","SchemaTemplates","FieldTypeReference"];export{c as FieldTypeReference,m as InteractiveBuilder,p as SchemaTemplates,oe as __namedExportsOrder,se as default};
