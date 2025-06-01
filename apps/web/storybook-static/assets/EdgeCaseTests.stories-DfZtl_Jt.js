import{w as p,e as i,u as s}from"./index-BYjcW1Sr.js";import{D as U}from"./DynamicForm-OHA8l7o_.js";import"./jsx-runtime-BT65X5dW.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./FormSection-BXqWezJv.js";import"./TextInput-D1rd6FA3.js";import"./input-dGyvt1gO.js";import"./utils-CytzSlOG.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./index-B5vUWwF_.js";import"./NumberInput-DNalEYdP.js";import"./SelectInput-bHGg1ngK.js";import"./check-BvmRBcsD.js";import"./TextareaInput-DTn6fcBx.js";import"./BooleanInput-BbQ8GhQ8.js";import"./checkbox-DAvk8bKM.js";import"./DateInput-Cgcb2E7S.js";import"./FileInput-ltJkPhXW.js";import"./button-DTZ1A7rA.js";import"./MultiSelectInput-BlXkhP6C.js";import"./EmailInput-BZWgOOXu.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-CiQj-xe7.js";import"./QueryClientProvider-9W50J78D.js";import"./iframe-CSMkAxJl.js";const ge={title:"Dynamic UI/Testing/Edge Case Tests",component:U,parameters:{docs:{description:{component:"Edge case tests for Dynamic UI components covering error conditions, boundary values, and unusual scenarios."}}},tags:["autodocs"]},W={componentId:"empty-form-test",name:"Empty Form Test",componentType:"Form",title:"Empty Form",fields:[],actions:[{actionKey:"submit",label:"Submit Empty Form",style:"primary"}]},_={componentId:"malformed-test",name:"Malformed Schema Test",componentType:"Form",title:"Malformed Schema Test",fields:[{fieldKey:"normalField",label:"Normal Field",type:"text"},{fieldKey:"fieldWithoutType",label:"Field Without Type",type:"text"},{fieldKey:"fieldWithInvalidType",label:"Field With Invalid Type",type:"text"}],actions:[{actionKey:"submit",label:"Submit",style:"primary"}]},q={componentId:"extreme-values-test",name:"Extreme Values Test",componentType:"Form",title:"Extreme Values Test",fields:[{fieldKey:"veryLongLabel",label:"This is an extremely long label that might cause layout issues and should be tested to ensure the UI handles it gracefully without breaking the design or causing overflow problems",type:"text",placeholder:"This is also a very long placeholder text that should be tested to ensure it does not break the input field layout or cause any visual issues in the form rendering"},{fieldKey:"manyOptions",label:"Field With Many Options",type:"select",options:[...Array.from({length:100},(e,t)=>({value:`option${t}`,label:`Option ${t} - This is a very long option label to test rendering`}))]},{fieldKey:"specialCharacters",label:"Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?",type:"text",placeholder:"Test with: 中文 العربية русский 🚀🎉💯"}],actions:[{actionKey:"submit",label:"Submit Extreme Values",style:"primary"}]},r={args:{schema:W,onSubmit:e=>{console.log("Empty form submitted:",e)}},play:async({canvasElement:e})=>{const t=p(e),a=t.getByRole("form",{name:/empty form/i});await i(a).toBeInTheDocument();const n=t.getByRole("button",{name:/submit empty form/i});await i(n).toBeInTheDocument(),await i(n).toBeEnabled(),await s.click(n);const o=t.queryAllByRole("textbox");await i(o).toHaveLength(0)},parameters:{docs:{description:{story:"TODO: Empty form test covering forms with no fields and graceful degradation."}}}},l={args:{schema:_,onSubmit:e=>{console.log("Malformed schema submitted:",e)}},play:async({canvasElement:e})=>{const t=p(e),a=t.getByRole("form");await i(a).toBeInTheDocument();const n=t.getByLabelText("Normal Field");await i(n).toBeInTheDocument(),await s.type(n,"Test value"),console.log("TODO: Implement comprehensive malformed schema error handling tests")},parameters:{docs:{description:{story:"TODO: Malformed schema test covering error handling and graceful degradation."}}}},c={args:{schema:q,onSubmit:e=>{console.log("Extreme values submitted:",e)}},play:async({canvasElement:e})=>{const t=p(e),a=t.getByLabelText(/extremely long label/i);await i(a).toBeInTheDocument();const n="A".repeat(1e4);await s.type(a,n),await i(a).toHaveValue(n);const o=t.getByLabelText("Field With Many Options");await i(o).toBeInTheDocument(),await s.click(o);const u=t.getByLabelText(/special characters/i),y="🚀🎉💯 中文 العربية русский";await s.type(u,y),await i(u).toHaveValue(y)},parameters:{docs:{description:{story:"TODO: Extreme values test covering long text, many options, and special characters."}}}},m={args:{schema:{componentId:"rapid-input-test",name:"Rapid Input Test",componentType:"Form",title:"Rapid Input Test",fields:[{fieldKey:"rapidField",label:"Rapid Input Field",type:"text",placeholder:"Type rapidly here"},{fieldKey:"debouncedField",label:"Debounced Field",type:"text",placeholder:"This field should debounce validation"}],actions:[{actionKey:"submit",label:"Submit",style:"primary"}]},onSubmit:e=>{console.log("Rapid input submitted:",e)}},play:async({canvasElement:e})=>{const t=p(e),a=t.getByLabelText("Rapid Input Field"),n="RapidTypingTest";for(const u of n)await s.type(a,u,{delay:1});await i(a).toHaveValue(n);const o=t.getByRole("button",{name:/submit/i});await s.click(o),await s.click(o),await s.click(o),console.log("TODO: Implement comprehensive rapid input handling tests")},parameters:{docs:{description:{story:"TODO: Rapid user input test covering fast typing, clicking, and debouncing."}}}},d={args:{schema:{componentId:"browser-compat-test",name:"Browser Compatibility Test",componentType:"Form",title:"Browser Compatibility Test",fields:[{fieldKey:"dateField",label:"Date Field",type:"date"},{fieldKey:"emailField",label:"Email Field",type:"email"},{fieldKey:"numberField",label:"Number Field",type:"number"}],actions:[{actionKey:"submit",label:"Submit",style:"primary"}]},onSubmit:e=>{console.log("Browser compatibility test submitted:",e)}},play:async({canvasElement:e})=>{const t=p(e),a=t.getByLabelText("Date Field");await i(a).toBeInTheDocument();const n=t.getByLabelText("Email Field");await s.type(n,"test@example.com");const o=t.getByLabelText("Number Field");await s.type(o,"123.45"),console.log("TODO: Implement browser-specific compatibility tests")},parameters:{docs:{description:{story:"TODO: Browser compatibility test covering cross-browser behavior and validation."}}}};var b,T,g,f,h;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    schema: emptyFormSchema,
    onSubmit: data => {
      console.log('Empty form submitted:', data);
      // TODO: Verify empty form submission behavior
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // TODO: Implement empty form tests

    // Test 1: Verify form renders without errors
    const form = canvas.getByRole('form', {
      name: /empty form/i
    });
    await expect(form).toBeInTheDocument();

    // Test 2: Verify submit button exists and is functional
    const submitButton = canvas.getByRole('button', {
      name: /submit empty form/i
    });
    await expect(submitButton).toBeInTheDocument();
    await expect(submitButton).toBeEnabled();

    // Test 3: Test submission of empty form
    await userEvent.click(submitButton);

    // TODO: Test 4: Verify no fields are present
    const inputs = canvas.queryAllByRole('textbox');
    await expect(inputs).toHaveLength(0);

    // TODO: Add more empty form edge case tests
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Empty form test covering forms with no fields and graceful degradation.'
      }
    }
  }
}`,...(g=(T=r.parameters)==null?void 0:T.docs)==null?void 0:g.source},description:{story:`Empty Form Test

TODO: Tests edge cases with empty forms including:
- Forms with no fields
- Forms with no actions
- Empty schema handling
- Graceful degradation`,...(h=(f=r.parameters)==null?void 0:f.docs)==null?void 0:h.description}}};var v,O,w,F,x;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    schema: malformedSchema,
    onSubmit: data => {
      console.log('Malformed schema submitted:', data);
      // TODO: Verify error handling
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // TODO: Implement malformed schema tests

    // Test 1: Verify form still renders despite malformed elements
    const form = canvas.getByRole('form');
    await expect(form).toBeInTheDocument();

    // Test 2: Verify normal field still works
    const normalField = canvas.getByLabelText('Normal Field');
    await expect(normalField).toBeInTheDocument();
    await userEvent.type(normalField, 'Test value');

    // TODO: Test 3: Verify error handling for malformed fields
    // TODO: Test 4: Check console errors or error boundaries
    // TODO: Test 5: Verify form submission still works for valid fields

    console.log('TODO: Implement comprehensive malformed schema error handling tests');
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Malformed schema test covering error handling and graceful degradation.'
      }
    }
  }
}`,...(w=(O=l.parameters)==null?void 0:O.docs)==null?void 0:w.source},description:{story:`Malformed Schema Test

TODO: Tests handling of malformed schemas including:
- Missing required properties
- Invalid field types
- Circular references
- Schema validation errors`,...(x=(F=l.parameters)==null?void 0:F.docs)==null?void 0:x.description}}};var D,B,E,I,S;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    schema: extremeValuesSchema,
    onSubmit: data => {
      console.log('Extreme values submitted:', data);
      // TODO: Verify extreme value handling
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // TODO: Implement extreme values tests

    // Test 1: Verify long label renders without breaking layout
    const longLabelField = canvas.getByLabelText(/extremely long label/i);
    await expect(longLabelField).toBeInTheDocument();

    // Test 2: Test very long text input
    const longText = 'A'.repeat(10000); // 10,000 character string
    await userEvent.type(longLabelField, longText);
    await expect(longLabelField).toHaveValue(longText);

    // Test 3: Test select field with many options
    const manyOptionsField = canvas.getByLabelText('Field With Many Options');
    await expect(manyOptionsField).toBeInTheDocument();

    // TODO: Test 4: Test performance with many options
    await userEvent.click(manyOptionsField);
    // TODO: Verify dropdown opens without performance issues

    // Test 5: Test special characters and Unicode
    const specialCharsField = canvas.getByLabelText(/special characters/i);
    const unicodeText = '🚀🎉💯 中文 العربية русский';
    await userEvent.type(specialCharsField, unicodeText);
    await expect(specialCharsField).toHaveValue(unicodeText);

    // TODO: Add more extreme value tests
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Extreme values test covering long text, many options, and special characters.'
      }
    }
  }
}`,...(E=(B=c.parameters)==null?void 0:B.docs)==null?void 0:E.source},description:{story:`Extreme Values Test

TODO: Tests handling of extreme values including:
- Very long text inputs
- Large numbers of options
- Special characters and Unicode
- Performance with large datasets`,...(S=(I=c.parameters)==null?void 0:I.docs)==null?void 0:S.description}}};var R,V,L,K,k;m.parameters={...m.parameters,docs:{...(R=m.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'rapid-input-test',
      name: 'Rapid Input Test',
      componentType: 'Form',
      title: 'Rapid Input Test',
      fields: [{
        fieldKey: 'rapidField',
        label: 'Rapid Input Field',
        type: 'text',
        placeholder: 'Type rapidly here'
      }, {
        fieldKey: 'debouncedField',
        label: 'Debounced Field',
        type: 'text',
        placeholder: 'This field should debounce validation'
      }],
      actions: [{
        actionKey: 'submit',
        label: 'Submit',
        style: 'primary'
      }]
    },
    onSubmit: data => {
      console.log('Rapid input submitted:', data);
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // TODO: Implement rapid input tests

    // Test 1: Rapid typing test
    const rapidField = canvas.getByLabelText('Rapid Input Field');

    // Simulate very fast typing
    const rapidText = 'RapidTypingTest';
    for (const char of rapidText) {
      await userEvent.type(rapidField, char, {
        delay: 1
      }); // Very fast typing
    }
    await expect(rapidField).toHaveValue(rapidText);

    // Test 2: Rapid button clicking
    const submitButton = canvas.getByRole('button', {
      name: /submit/i
    });

    // TODO: Test rapid clicking (should be handled gracefully)
    await userEvent.click(submitButton);
    await userEvent.click(submitButton);
    await userEvent.click(submitButton);

    // TODO: Test 3: Concurrent field updates
    // TODO: Test 4: Debouncing behavior
    // TODO: Test 5: Memory leaks with rapid interactions

    console.log('TODO: Implement comprehensive rapid input handling tests');
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Rapid user input test covering fast typing, clicking, and debouncing.'
      }
    }
  }
}`,...(L=(V=m.parameters)==null?void 0:V.docs)==null?void 0:L.source},description:{story:`Rapid User Input Test

TODO: Tests rapid user interactions including:
- Fast typing and input changes
- Rapid button clicking
- Concurrent user actions
- Debouncing and throttling`,...(k=(K=m.parameters)==null?void 0:K.docs)==null?void 0:k.description}}};var C,M,A,H,N;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'browser-compat-test',
      name: 'Browser Compatibility Test',
      componentType: 'Form',
      title: 'Browser Compatibility Test',
      fields: [{
        fieldKey: 'dateField',
        label: 'Date Field',
        type: 'date'
      }, {
        fieldKey: 'emailField',
        label: 'Email Field',
        type: 'email'
      }, {
        fieldKey: 'numberField',
        label: 'Number Field',
        type: 'number'
      }],
      actions: [{
        actionKey: 'submit',
        label: 'Submit',
        style: 'primary'
      }]
    },
    onSubmit: data => {
      console.log('Browser compatibility test submitted:', data);
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // TODO: Implement browser compatibility tests

    // Test 1: Date field behavior
    const dateField = canvas.getByLabelText('Date Field');
    await expect(dateField).toBeInTheDocument();

    // Test 2: Email field validation
    const emailField = canvas.getByLabelText('Email Field');
    await userEvent.type(emailField, 'test@example.com');

    // Test 3: Number field behavior
    const numberField = canvas.getByLabelText('Number Field');
    await userEvent.type(numberField, '123.45');

    // TODO: Test 4: Browser-specific validation messages
    // TODO: Test 5: Accessibility features across browsers
    // TODO: Test 6: Performance differences

    console.log('TODO: Implement browser-specific compatibility tests');
  },
  parameters: {
    docs: {
      description: {
        story: 'TODO: Browser compatibility test covering cross-browser behavior and validation.'
      }
    }
  }
}`,...(A=(M=d.parameters)==null?void 0:M.docs)==null?void 0:A.source},description:{story:`Browser Compatibility Test

TODO: Tests browser-specific edge cases including:
- Different input behaviors across browsers
- Browser-specific validation
- Accessibility differences
- Performance variations`,...(N=(H=d.parameters)==null?void 0:H.docs)==null?void 0:N.description}}};const fe=["EmptyFormTest","MalformedSchemaTest","ExtremeValuesTest","RapidUserInputTest","BrowserCompatibilityTest"];export{d as BrowserCompatibilityTest,r as EmptyFormTest,c as ExtremeValuesTest,l as MalformedSchemaTest,m as RapidUserInputTest,fe as __namedExportsOrder,ge as default};
