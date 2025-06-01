import{D as C}from"./DynamicUIRenderer-DW83NvMH.js";import"./jsx-runtime-BT65X5dW.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./DynamicForm-OHA8l7o_.js";import"./FormSection-BXqWezJv.js";import"./TextInput-D1rd6FA3.js";import"./input-dGyvt1gO.js";import"./utils-CytzSlOG.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./index-B5vUWwF_.js";import"./NumberInput-DNalEYdP.js";import"./SelectInput-bHGg1ngK.js";import"./check-BvmRBcsD.js";import"./TextareaInput-DTn6fcBx.js";import"./BooleanInput-BbQ8GhQ8.js";import"./checkbox-DAvk8bKM.js";import"./DateInput-Cgcb2E7S.js";import"./FileInput-ltJkPhXW.js";import"./button-DTZ1A7rA.js";import"./MultiSelectInput-BlXkhP6C.js";import"./EmailInput-BZWgOOXu.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-CiQj-xe7.js";import"./QueryClientProvider-9W50J78D.js";import"./iframe-CSMkAxJl.js";import"./DynamicDisplay-CW0ZWIbw.js";import"./TableDisplay-CACaD82O.js";import"./CardDisplay-3IRVwmAz.js";import"./ActionButtons-4328mjEA.js";import"./DynamicUIErrorBoundary-Ca1kF0AK.js";import"./DynamicUIStateContext-BrzZPoL3.js";const re={title:"Demo Tasks/E-commerce/Order Processing",component:C,parameters:{docs:{description:{component:`
# E-commerce Order Processing

Complete order lifecycle from initial placement through delivery and fulfillment.
Demonstrates order management, payment processing, and logistics workflows.

**Order Stages:**
- New Order - Fresh order awaiting payment confirmation
- Payment Confirmed - Payment processed, ready for fulfillment
- In Fulfillment - Order being picked and packed
- Shipped - Order dispatched with tracking information
- Delivered - Successfully delivered to customer
        `}}},argTypes:{onSubmit:{action:"submitted"},onCancel:{action:"cancelled"},onAction:{action:"action triggered"}}},e={componentId:"order-processing-demo",name:"Order Processing",componentType:"Display",title:"Order #{{orderNumber}}",customProps:{displayType:"card",fields:[{key:"customerName",label:"Customer"},{key:"orderDate",label:"Order Date"},{key:"items",label:"Items"},{key:"total",label:"Total Amount"},{key:"paymentMethod",label:"Payment Method"},{key:"shippingAddress",label:"Shipping Address"},{key:"status",label:"Order Status"},{key:"expectedDelivery",label:"Expected Delivery"},{key:"tracking",label:"Tracking Number"}],layout:"grid"},actions:[{actionKey:"confirm_payment",label:"Confirm Payment",style:"primary",visibleIf:'status == "pending_payment"'},{actionKey:"start_fulfillment",label:"Start Fulfillment",style:"primary",visibleIf:'status == "paid"'},{actionKey:"mark_shipped",label:"Mark as Shipped",style:"primary",visibleIf:'status == "fulfilling"'},{actionKey:"contact_customer",label:"Contact Customer",style:"secondary"},{actionKey:"cancel_order",label:"Cancel Order",style:"danger",visibleIf:'status != "delivered"'}]},r={name:"New Order - Pending Payment",args:{schema:e,data:{orderNumber:"ORD-2024-001847",customerName:"Sarah Johnson",orderDate:"Oct 24, 2024 2:47 PM",items:"3 items: Wireless Headphones, Phone Case, Screen Protector",total:"$127.99",paymentMethod:"Credit Card ending in 4567",shippingAddress:"1234 Oak Street, San Francisco, CA 94102",status:"pending_payment",expectedDelivery:"Oct 28-30, 2024",tracking:"Pending shipment"}},parameters:{docs:{description:{story:"New customer order awaiting payment confirmation from payment processor."}}}},n={name:"Payment Confirmed",args:{schema:e,data:{orderNumber:"ORD-2024-001847",customerName:"Sarah Johnson",orderDate:"Oct 24, 2024 2:47 PM",items:"3 items: Wireless Headphones, Phone Case, Screen Protector",total:"$127.99",paymentMethod:"Credit Card ending in 4567 ✅",shippingAddress:"1234 Oak Street, San Francisco, CA 94102",status:"paid",expectedDelivery:"Oct 28-30, 2024",tracking:"Preparing for fulfillment"}},parameters:{docs:{description:{story:"Payment successfully processed and order ready to enter fulfillment workflow."}}}},t={name:"In Fulfillment",args:{schema:e,data:{orderNumber:"ORD-2024-001847",customerName:"Sarah Johnson",orderDate:"Oct 24, 2024 2:47 PM",items:"3 items: Wireless Headphones ✅, Phone Case ✅, Screen Protector ✅",total:"$127.99",paymentMethod:"Credit Card ending in 4567 ✅",shippingAddress:"1234 Oak Street, San Francisco, CA 94102",status:"fulfilling",expectedDelivery:"Oct 28-30, 2024",tracking:"Being packed at fulfillment center"}},parameters:{docs:{description:{story:"Order items being picked, packed, and prepared for shipment."}}}},a={name:"Shipped - In Transit",args:{schema:e,data:{orderNumber:"ORD-2024-001847",customerName:"Sarah Johnson",orderDate:"Oct 24, 2024 2:47 PM",items:"3 items: Wireless Headphones, Phone Case, Screen Protector",total:"$127.99",paymentMethod:"Credit Card ending in 4567 ✅",shippingAddress:"1234 Oak Street, San Francisco, CA 94102",status:"shipped",expectedDelivery:"Oct 29, 2024 by 8 PM",tracking:"1ZR6E4781234567890 (UPS)"}},parameters:{docs:{description:{story:"Order shipped and in transit to customer with tracking information available."}}}},s={name:"Successfully Delivered",args:{schema:{...e,actions:[{actionKey:"request_review",label:"Request Review",style:"secondary"},{actionKey:"process_return",label:"Process Return",style:"secondary"},{actionKey:"view_receipt",label:"View Receipt",style:"secondary"}]},data:{orderNumber:"ORD-2024-001847",customerName:"Sarah Johnson",orderDate:"Oct 24, 2024 2:47 PM",items:"3 items: Wireless Headphones, Phone Case, Screen Protector",total:"$127.99",paymentMethod:"Credit Card ending in 4567 ✅",shippingAddress:"1234 Oak Street, San Francisco, CA 94102",status:"delivered",expectedDelivery:"Delivered Oct 29, 2024 at 3:42 PM",tracking:"Delivered - Left at front door"}},parameters:{docs:{description:{story:"Order successfully delivered with completion actions available."}}}};var o,i,d;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  name: 'New Order - Pending Payment',
  args: {
    schema: orderProcessingSchema,
    data: {
      orderNumber: 'ORD-2024-001847',
      customerName: 'Sarah Johnson',
      orderDate: 'Oct 24, 2024 2:47 PM',
      items: '3 items: Wireless Headphones, Phone Case, Screen Protector',
      total: '$127.99',
      paymentMethod: 'Credit Card ending in 4567',
      shippingAddress: '1234 Oak Street, San Francisco, CA 94102',
      status: 'pending_payment',
      expectedDelivery: 'Oct 28-30, 2024',
      tracking: 'Pending shipment'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'New customer order awaiting payment confirmation from payment processor.'
      }
    }
  }
}`,...(d=(i=r.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};var c,m,p;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
  name: 'Payment Confirmed',
  args: {
    schema: orderProcessingSchema,
    data: {
      orderNumber: 'ORD-2024-001847',
      customerName: 'Sarah Johnson',
      orderDate: 'Oct 24, 2024 2:47 PM',
      items: '3 items: Wireless Headphones, Phone Case, Screen Protector',
      total: '$127.99',
      paymentMethod: 'Credit Card ending in 4567 ✅',
      shippingAddress: '1234 Oak Street, San Francisco, CA 94102',
      status: 'paid',
      expectedDelivery: 'Oct 28-30, 2024',
      tracking: 'Preparing for fulfillment'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Payment successfully processed and order ready to enter fulfillment workflow.'
      }
    }
  }
}`,...(p=(m=n.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var l,y,u;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  name: 'In Fulfillment',
  args: {
    schema: orderProcessingSchema,
    data: {
      orderNumber: 'ORD-2024-001847',
      customerName: 'Sarah Johnson',
      orderDate: 'Oct 24, 2024 2:47 PM',
      items: '3 items: Wireless Headphones ✅, Phone Case ✅, Screen Protector ✅',
      total: '$127.99',
      paymentMethod: 'Credit Card ending in 4567 ✅',
      shippingAddress: '1234 Oak Street, San Francisco, CA 94102',
      status: 'fulfilling',
      expectedDelivery: 'Oct 28-30, 2024',
      tracking: 'Being packed at fulfillment center'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Order items being picked, packed, and prepared for shipment.'
      }
    }
  }
}`,...(u=(y=t.parameters)==null?void 0:y.docs)==null?void 0:u.source}}};var h,g,f;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  name: 'Shipped - In Transit',
  args: {
    schema: orderProcessingSchema,
    data: {
      orderNumber: 'ORD-2024-001847',
      customerName: 'Sarah Johnson',
      orderDate: 'Oct 24, 2024 2:47 PM',
      items: '3 items: Wireless Headphones, Phone Case, Screen Protector',
      total: '$127.99',
      paymentMethod: 'Credit Card ending in 4567 ✅',
      shippingAddress: '1234 Oak Street, San Francisco, CA 94102',
      status: 'shipped',
      expectedDelivery: 'Oct 29, 2024 by 8 PM',
      tracking: '1ZR6E4781234567890 (UPS)'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Order shipped and in transit to customer with tracking information available.'
      }
    }
  }
}`,...(f=(g=a.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};var S,P,O;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  name: 'Successfully Delivered',
  args: {
    schema: {
      ...orderProcessingSchema,
      actions: [{
        actionKey: 'request_review',
        label: 'Request Review',
        style: 'secondary'
      }, {
        actionKey: 'process_return',
        label: 'Process Return',
        style: 'secondary'
      }, {
        actionKey: 'view_receipt',
        label: 'View Receipt',
        style: 'secondary'
      }]
    },
    data: {
      orderNumber: 'ORD-2024-001847',
      customerName: 'Sarah Johnson',
      orderDate: 'Oct 24, 2024 2:47 PM',
      items: '3 items: Wireless Headphones, Phone Case, Screen Protector',
      total: '$127.99',
      paymentMethod: 'Credit Card ending in 4567 ✅',
      shippingAddress: '1234 Oak Street, San Francisco, CA 94102',
      status: 'delivered',
      expectedDelivery: 'Delivered Oct 29, 2024 at 3:42 PM',
      tracking: 'Delivered - Left at front door'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Order successfully delivered with completion actions available.'
      }
    }
  }
}`,...(O=(P=s.parameters)==null?void 0:P.docs)==null?void 0:O.source}}};const ne=["NewOrder","PaymentConfirmed","InFulfillment","Shipped","Delivered"];export{s as Delivered,t as InFulfillment,r as NewOrder,n as PaymentConfirmed,a as Shipped,ne as __namedExportsOrder,re as default};
