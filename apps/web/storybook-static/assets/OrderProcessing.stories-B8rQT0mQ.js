import{D as C}from"./DynamicUIRenderer-UL-Os6h0.js";import"./jsx-runtime-CmtfZKef.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./DynamicForm-CQvi70jR.js";import"./FormSection-BXhPtV5Y.js";import"./TextInput-B-b59Q_e.js";import"./input-CbSxzvDx.js";import"./utils-CytzSlOG.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";import"./index-C9U_LHPE.js";import"./NumberInput-BM-Ag6sN.js";import"./SelectInput-Cji-AcSY.js";import"./check-M_MmD5Zy.js";import"./TextareaInput-d_sTEtii.js";import"./BooleanInput-DAkAH8Ho.js";import"./checkbox-BGOkVoFJ.js";import"./DateInput-DrtaTLZA.js";import"./FileInput-CkTp4YSM.js";import"./button-BIv8UjPY.js";import"./MultiSelectInput-GIzsWy5u.js";import"./EmailInput-BDtJ9KKU.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-DwxbG8kR.js";import"./QueryClientProvider-mz6q_e7V.js";import"./iframe-BVJQxLgr.js";import"./DynamicDisplay-CN3Fs3X6.js";import"./TableDisplay-BZ_5kpJV.js";import"./CardDisplay-DissT9ux.js";import"./ActionButtons-B9l-49-W.js";import"./DynamicUIErrorBoundary-B-AhmovT.js";import"./DynamicUIStateContext-BU6sB-Jv.js";const re={title:"Demo Tasks/E-commerce/Order Processing",component:C,parameters:{docs:{description:{component:`
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
