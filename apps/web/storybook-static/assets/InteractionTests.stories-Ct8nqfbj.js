import{w as u,u as n,e as s}from"./index-BYjcW1Sr.js";import{D as j}from"./DynamicForm-OHA8l7o_.js";import"./jsx-runtime-BT65X5dW.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./FormSection-BXqWezJv.js";import"./TextInput-D1rd6FA3.js";import"./input-dGyvt1gO.js";import"./utils-CytzSlOG.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./index-B5vUWwF_.js";import"./NumberInput-DNalEYdP.js";import"./SelectInput-bHGg1ngK.js";import"./check-BvmRBcsD.js";import"./TextareaInput-DTn6fcBx.js";import"./BooleanInput-BbQ8GhQ8.js";import"./checkbox-DAvk8bKM.js";import"./DateInput-Cgcb2E7S.js";import"./FileInput-ltJkPhXW.js";import"./button-DTZ1A7rA.js";import"./MultiSelectInput-BlXkhP6C.js";import"./EmailInput-BZWgOOXu.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-CiQj-xe7.js";import"./QueryClientProvider-9W50J78D.js";import"./iframe-CSMkAxJl.js";const ye={title:"Dynamic UI/Testing/Interaction Tests",component:j,parameters:{docs:{description:{component:"Interactive tests for Dynamic UI components demonstrating user interactions, form submissions, and validation behaviors."}}},tags:["autodocs"]},b={componentId:"basic-form-test",name:"Basic Form Test",componentType:"Form",title:"Basic Form for Testing",fields:[{fieldKey:"name",label:"Name",type:"text",required:!0,placeholder:"Enter your name"},{fieldKey:"email",label:"Email",type:"email",required:!0,placeholder:"Enter your email"},{fieldKey:"message",label:"Message",type:"textarea",placeholder:"Enter your message"}],actions:[{actionKey:"submit",label:"Submit",style:"primary"},{actionKey:"cancel",label:"Cancel",style:"secondary"}]},J={componentId:"validation-test",name:"Validation Test",componentType:"Form",title:"Form Validation Testing",fields:[{fieldKey:"requiredField",label:"Required Field",type:"text",required:!0,placeholder:"This field is required"},{fieldKey:"emailField",label:"Email Field",type:"email",required:!0,placeholder:"Enter valid email"},{fieldKey:"selectField",label:"Select Field",type:"select",required:!0,options:[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"}]}],actions:[{actionKey:"submit",label:"Submit",style:"primary"}]},l={args:{schema:b,onSubmit:e=>{console.log("Form submitted:",e)}},play:async({canvasElement:e})=>{const t=u(e),a=t.getByLabelText("Name"),i=t.getByLabelText("Email"),o=t.getByLabelText("Message"),p=t.getByRole("button",{name:/submit/i});await n.type(a,"John Doe"),await n.type(i,"john.doe@example.com"),await n.type(o,"This is a test message"),await s(a).toHaveValue("John Doe"),await s(i).toHaveValue("john.doe@example.com"),await s(o).toHaveValue("This is a test message"),await n.click(p)},parameters:{docs:{description:{story:"TODO: Basic form interaction test covering field input, validation, and submission."}}}},c={args:{schema:J,onSubmit:e=>{console.log("Validation test submitted:",e)}},play:async({canvasElement:e})=>{const t=u(e),a=t.getByRole("button",{name:/submit/i});await n.click(a);const i=t.getByLabelText("Required Field");await n.type(i,"Test value");const o=t.getByLabelText("Email Field");await n.type(o,"invalid-email"),await n.clear(o),await n.type(o,"valid@example.com");const p=t.getByLabelText("Select Field");await n.selectOptions(p,"option1"),await n.click(a)},parameters:{docs:{description:{story:"TODO: Form validation test covering required fields, email validation, and error handling."}}}},r={args:{schema:b,onSubmit:e=>{console.log("Focus test submitted:",e)}},play:async({canvasElement:e})=>{const t=u(e),a=t.getByLabelText("Name");await n.click(a),await s(a).toHaveFocus(),await n.tab();const i=t.getByLabelText("Email");await s(i).toHaveFocus(),await n.click(a),await n.tab()},parameters:{docs:{description:{story:"TODO: Field focus and blur test covering keyboard navigation and focus management."}}}},m={args:{schema:{...b,actions:[{actionKey:"submit",label:"Submit",style:"primary"},{actionKey:"cancel",label:"Cancel",style:"secondary"},{actionKey:"delete",label:"Delete",style:"danger",confirmation:"Are you sure you want to delete?"}]},onSubmit:e=>{console.log("Action test submitted:",e)}},play:async({canvasElement:e})=>{const t=u(e),a=t.getByRole("button",{name:/submit/i}),i=t.getByRole("button",{name:/cancel/i}),o=t.getByRole("button",{name:/delete/i});await s(a).toBeEnabled(),await s(i).toBeEnabled(),await s(o).toBeEnabled(),await n.click(i)},parameters:{docs:{description:{story:"TODO: Action button test covering click events, confirmations, and accessibility."}}}},d={args:{schema:{componentId:"conditional-test",name:"Conditional Test",componentType:"Form",title:"Conditional Field Test",fields:[{fieldKey:"showExtra",label:"Show Extra Field",type:"boolean"},{fieldKey:"extraField",label:"Extra Field",type:"text"}],actions:[{actionKey:"submit",label:"Submit",style:"primary"}]},onSubmit:e=>{console.log("Conditional test submitted:",e)}},play:async({canvasElement:e})=>{u(e),console.log("TODO: Implement conditional field tests when visibleIf is available")},parameters:{docs:{description:{story:"TODO: Conditional field test covering dynamic field visibility and interactions."}}}};var y,v,T,g,f;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    schema: basicFormSchema,
    onSubmit: data => {
      console.log('Form submitted:', data);
      // TODO: Add submission verification
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // TODO: Implement comprehensive interaction tests

    // Test 1: Find form elements
    const nameInput = canvas.getByLabelText('Name');
    const emailInput = canvas.getByLabelText('Email');
    const messageInput = canvas.getByLabelText('Message');
    const submitButton = canvas.getByRole('button', {
      name: /submit/i
    });

    // TODO: Test 2: Fill out form fields
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john.doe@example.com');
    await userEvent.type(messageInput, 'This is a test message');

    // TODO: Test 3: Verify field values
    await expect(nameInput).toHaveValue('John Doe');
    await expect(emailInput).toHaveValue('john.doe@example.com');
    await expect(messageInput).toHaveValue('This is a test message');

    // TODO: Test 4: Submit form
    await userEvent.click(submitButton);

    // TODO: Add more comprehensive interaction tests
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Basic form interaction test covering field input, validation, and submission.'
      }
    }
  }
}`,...(T=(v=l.parameters)==null?void 0:v.docs)==null?void 0:T.source},description:{story:`Basic Form Interaction Test

TODO: Tests basic form interactions including:
- Field input and value changes
- Form submission with valid data
- Action button interactions
- Form state management`,...(f=(g=l.parameters)==null?void 0:g.docs)==null?void 0:f.description}}};var F,O,h,w,B;c.parameters={...c.parameters,docs:{...(F=c.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    schema: validationTestSchema,
    onSubmit: data => {
      console.log('Validation test submitted:', data);
      // TODO: Add validation verification
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // TODO: Implement validation tests

    // Test 1: Submit empty form to trigger validation
    const submitButton = canvas.getByRole('button', {
      name: /submit/i
    });
    await userEvent.click(submitButton);

    // TODO: Test 2: Check for validation error messages
    // await expect(canvas.getByText(/required/i)).toBeInTheDocument();

    // Test 3: Fill required field and test email validation
    const requiredField = canvas.getByLabelText('Required Field');
    await userEvent.type(requiredField, 'Test value');
    const emailField = canvas.getByLabelText('Email Field');
    await userEvent.type(emailField, 'invalid-email');

    // TODO: Test 4: Verify email validation error
    // await userEvent.click(submitButton);
    // await expect(canvas.getByText(/valid email/i)).toBeInTheDocument();

    // Test 5: Fix email and test successful validation
    await userEvent.clear(emailField);
    await userEvent.type(emailField, 'valid@example.com');

    // TODO: Test 6: Select option and submit successfully
    const selectField = canvas.getByLabelText('Select Field');
    await userEvent.selectOptions(selectField, 'option1');
    await userEvent.click(submitButton);

    // TODO: Add more validation test scenarios
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Form validation test covering required fields, email validation, and error handling.'
      }
    }
  }
}`,...(h=(O=c.parameters)==null?void 0:O.docs)==null?void 0:h.source},description:{story:`Form Validation Test

TODO: Tests form validation behaviors including:
- Required field validation
- Email format validation
- Error message display
- Validation timing (on blur, on submit)`,...(B=(w=c.parameters)==null?void 0:w.docs)==null?void 0:B.description}}};var x,E,D,I,S;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    schema: basicFormSchema,
    onSubmit: data => {
      console.log('Focus test submitted:', data);
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // TODO: Implement focus/blur tests

    // Test 1: Focus on first field
    const nameInput = canvas.getByLabelText('Name');
    await userEvent.click(nameInput);
    await expect(nameInput).toHaveFocus();

    // Test 2: Tab to next field
    await userEvent.tab();
    const emailInput = canvas.getByLabelText('Email');
    await expect(emailInput).toHaveFocus();

    // Test 3: Test blur behavior
    await userEvent.click(nameInput);
    await userEvent.tab();

    // TODO: Test 4: Verify validation on blur if applicable
    // TODO: Test 5: Test keyboard navigation through all fields
    // TODO: Test 6: Test focus management with validation errors
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Field focus and blur test covering keyboard navigation and focus management.'
      }
    }
  }
}`,...(D=(E=r.parameters)==null?void 0:E.docs)==null?void 0:D.source},description:{story:`Field Focus and Blur Test

TODO: Tests field focus behaviors including:
- Focus and blur events
- Validation on blur
- Field state changes
- Accessibility focus management`,...(S=(I=r.parameters)==null?void 0:I.docs)==null?void 0:S.description}}};var k,K,q,C,L;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    schema: {
      ...basicFormSchema,
      actions: [{
        actionKey: 'submit',
        label: 'Submit',
        style: 'primary'
      }, {
        actionKey: 'cancel',
        label: 'Cancel',
        style: 'secondary'
      }, {
        actionKey: 'delete',
        label: 'Delete',
        style: 'danger',
        confirmation: 'Are you sure you want to delete?'
      }]
    },
    onSubmit: data => {
      console.log('Action test submitted:', data);
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // TODO: Implement action button tests

    // Test 1: Find all action buttons
    const submitButton = canvas.getByRole('button', {
      name: /submit/i
    });
    const cancelButton = canvas.getByRole('button', {
      name: /cancel/i
    });
    const deleteButton = canvas.getByRole('button', {
      name: /delete/i
    });

    // Test 2: Test button accessibility
    await expect(submitButton).toBeEnabled();
    await expect(cancelButton).toBeEnabled();
    await expect(deleteButton).toBeEnabled();

    // Test 3: Test cancel button
    await userEvent.click(cancelButton);

    // TODO: Test 4: Test confirmation dialog for delete button
    // await userEvent.click(deleteButton);
    // TODO: Verify confirmation dialog appears

    // TODO: Test 5: Test button states and loading states
    // TODO: Test 6: Test keyboard activation of buttons
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Action button test covering click events, confirmations, and accessibility.'
      }
    }
  }
}`,...(q=(K=m.parameters)==null?void 0:K.docs)==null?void 0:q.source},description:{story:`Action Button Test

TODO: Tests action button behaviors including:
- Button click events
- Button state changes
- Confirmation dialogs
- Button accessibility`,...(L=(C=m.parameters)==null?void 0:C.docs)==null?void 0:L.description}}};var V,A,R,H,N;d.parameters={...d.parameters,docs:{...(V=d.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'conditional-test',
      name: 'Conditional Test',
      componentType: 'Form',
      title: 'Conditional Field Test',
      fields: [{
        fieldKey: 'showExtra',
        label: 'Show Extra Field',
        type: 'boolean'
      }, {
        fieldKey: 'extraField',
        label: 'Extra Field',
        type: 'text'
        // TODO: Add visibleIf condition when implemented
        // visibleIf: 'showExtra === true',
      }],
      actions: [{
        actionKey: 'submit',
        label: 'Submit',
        style: 'primary'
      }]
    },
    onSubmit: data => {
      console.log('Conditional test submitted:', data);
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // TODO: Implement conditional field tests when visibleIf is available

    // Test 1: Find conditional trigger field
    // const showExtraCheckbox = canvas.getByLabelText('Show Extra Field');

    // Test 2: Verify extra field is initially hidden
    // await expect(canvas.queryByLabelText('Extra Field')).not.toBeInTheDocument();

    // Test 3: Toggle condition and verify field appears
    // await userEvent.click(showExtraCheckbox);
    // await expect(canvas.getByLabelText('Extra Field')).toBeInTheDocument();

    // Test 4: Toggle condition again and verify field disappears
    // await userEvent.click(showExtraCheckbox);
    // await expect(canvas.queryByLabelText('Extra Field')).not.toBeInTheDocument();

    console.log('TODO: Implement conditional field tests when visibleIf is available');
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Conditional field test covering dynamic field visibility and interactions.'
      }
    }
  }
}`,...(R=(A=d.parameters)==null?void 0:A.docs)==null?void 0:R.source},description:{story:`Conditional Field Test

TODO: Tests conditional field visibility including:
- Fields showing/hiding based on conditions
- Dynamic validation changes
- Conditional field interactions
- State management with conditions`,...(N=(H=d.parameters)==null?void 0:H.docs)==null?void 0:N.description}}};const ve=["BasicFormInteraction","FormValidationTest","FieldFocusBlurTest","ActionButtonTest","ConditionalFieldTest"];export{m as ActionButtonTest,l as BasicFormInteraction,d as ConditionalFieldTest,r as FieldFocusBlurTest,c as FormValidationTest,ve as __namedExportsOrder,ye as default};
