import{D as h}from"./DynamicUIRenderer-UL-Os6h0.js";import"./jsx-runtime-CmtfZKef.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./DynamicForm-CQvi70jR.js";import"./FormSection-BXhPtV5Y.js";import"./TextInput-B-b59Q_e.js";import"./input-CbSxzvDx.js";import"./utils-CytzSlOG.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";import"./index-C9U_LHPE.js";import"./NumberInput-BM-Ag6sN.js";import"./SelectInput-Cji-AcSY.js";import"./check-M_MmD5Zy.js";import"./TextareaInput-d_sTEtii.js";import"./BooleanInput-DAkAH8Ho.js";import"./checkbox-BGOkVoFJ.js";import"./DateInput-DrtaTLZA.js";import"./FileInput-CkTp4YSM.js";import"./button-BIv8UjPY.js";import"./MultiSelectInput-GIzsWy5u.js";import"./EmailInput-BDtJ9KKU.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-DwxbG8kR.js";import"./QueryClientProvider-mz6q_e7V.js";import"./iframe-BVJQxLgr.js";import"./DynamicDisplay-CN3Fs3X6.js";import"./TableDisplay-BZ_5kpJV.js";import"./CardDisplay-DissT9ux.js";import"./ActionButtons-B9l-49-W.js";import"./DynamicUIErrorBoundary-B-AhmovT.js";import"./DynamicUIStateContext-BU6sB-Jv.js";const X={title:"Demo Tasks/E-commerce/Product Catalog",component:h,parameters:{docs:{description:{component:`
# Product Catalog Management

Product listing, inventory tracking, and catalog management workflows.
Demonstrates product management, pricing updates, and stock monitoring.

**Product States:**
- Active Product - Available for purchase
- Low Stock - Inventory running low
- Out of Stock - No inventory available
- Draft Product - Not yet published
        `}}},argTypes:{onSubmit:{action:"submitted"},onCancel:{action:"cancelled"},onAction:{action:"action triggered"}}},s={componentId:"product-catalog-demo",name:"Product Catalog",componentType:"Display",title:"{{productName}}",customProps:{displayType:"card",fields:[{key:"sku",label:"SKU"},{key:"price",label:"Price"},{key:"category",label:"Category"},{key:"stock",label:"Stock Level"},{key:"status",label:"Status"},{key:"lastUpdated",label:"Last Updated"},{key:"salesLast30Days",label:"Sales (30 days)"},{key:"supplier",label:"Supplier"}],layout:"grid"},actions:[{actionKey:"edit_product",label:"Edit Product",style:"secondary"},{actionKey:"update_price",label:"Update Price",style:"secondary"},{actionKey:"restock",label:"Restock",style:"primary",visibleIf:"stock < 10"},{actionKey:"publish",label:"Publish",style:"primary",visibleIf:'status == "draft"'},{actionKey:"disable",label:"Disable",style:"danger",visibleIf:'status == "active"'}]},t={name:"Active Product",args:{schema:s,data:{productName:"Wireless Bluetooth Headphones",sku:"WBH-2024-001",price:"$79.99",category:"Electronics > Audio",stock:"247 units",status:"active",lastUpdated:"Oct 22, 2024",salesLast30Days:"43 sold",supplier:"TechAudio Inc."}},parameters:{docs:{description:{story:"Active product with healthy stock levels and regular sales."}}}},e={name:"Low Stock Alert",args:{schema:s,data:{productName:"Smartphone Protective Case",sku:"SPC-2024-045",price:"$24.99",category:"Electronics > Accessories",stock:"8 units ⚠️",status:"active",lastUpdated:"Oct 24, 2024",salesLast30Days:"127 sold",supplier:"CaseCraft LLC"}},parameters:{docs:{description:{story:"Product with low stock levels requiring immediate restocking attention."}}}},a={name:"Out of Stock",args:{schema:{...s,actions:[{actionKey:"edit_product",label:"Edit Product",style:"secondary"},{actionKey:"urgent_restock",label:"Urgent Restock",style:"danger"},{actionKey:"contact_supplier",label:"Contact Supplier",style:"primary"},{actionKey:"find_alternative",label:"Find Alternative",style:"secondary"}]},data:{productName:"Premium Screen Protector",sku:"PSP-2024-012",price:"$12.99",category:"Electronics > Accessories",stock:"0 units ❌",status:"out_of_stock",lastUpdated:"Oct 23, 2024",salesLast30Days:"89 sold",supplier:"ProtectTech Ltd."}},parameters:{docs:{description:{story:"Product completely out of stock with urgent restocking actions available."}}}},o={name:"Draft Product",args:{schema:s,data:{productName:"Wireless Charging Pad",sku:"WCP-2024-078",price:"$34.99",category:"Electronics > Charging",stock:"150 units",status:"draft",lastUpdated:"Oct 24, 2024",salesLast30Days:"Not yet published",supplier:"ChargeTech Solutions"}},parameters:{docs:{description:{story:"New product in draft status awaiting final review and publication."}}}};var r,c,n;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  name: 'Active Product',
  args: {
    schema: productCatalogSchema,
    data: {
      productName: 'Wireless Bluetooth Headphones',
      sku: 'WBH-2024-001',
      price: '$79.99',
      category: 'Electronics > Audio',
      stock: '247 units',
      status: 'active',
      lastUpdated: 'Oct 22, 2024',
      salesLast30Days: '43 sold',
      supplier: 'TechAudio Inc.'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Active product with healthy stock levels and regular sales.'
      }
    }
  }
}`,...(n=(c=t.parameters)==null?void 0:c.docs)==null?void 0:n.source}}};var i,l,d;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  name: 'Low Stock Alert',
  args: {
    schema: productCatalogSchema,
    data: {
      productName: 'Smartphone Protective Case',
      sku: 'SPC-2024-045',
      price: '$24.99',
      category: 'Electronics > Accessories',
      stock: '8 units ⚠️',
      status: 'active',
      lastUpdated: 'Oct 24, 2024',
      salesLast30Days: '127 sold',
      supplier: 'CaseCraft LLC'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Product with low stock levels requiring immediate restocking attention.'
      }
    }
  }
}`,...(d=(l=e.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var p,u,m;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  name: 'Out of Stock',
  args: {
    schema: {
      ...productCatalogSchema,
      actions: [{
        actionKey: 'edit_product',
        label: 'Edit Product',
        style: 'secondary'
      }, {
        actionKey: 'urgent_restock',
        label: 'Urgent Restock',
        style: 'danger'
      }, {
        actionKey: 'contact_supplier',
        label: 'Contact Supplier',
        style: 'primary'
      }, {
        actionKey: 'find_alternative',
        label: 'Find Alternative',
        style: 'secondary'
      }]
    },
    data: {
      productName: 'Premium Screen Protector',
      sku: 'PSP-2024-012',
      price: '$12.99',
      category: 'Electronics > Accessories',
      stock: '0 units ❌',
      status: 'out_of_stock',
      lastUpdated: 'Oct 23, 2024',
      salesLast30Days: '89 sold',
      supplier: 'ProtectTech Ltd.'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Product completely out of stock with urgent restocking actions available.'
      }
    }
  }
}`,...(m=(u=a.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var y,g,k;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'Draft Product',
  args: {
    schema: productCatalogSchema,
    data: {
      productName: 'Wireless Charging Pad',
      sku: 'WCP-2024-078',
      price: '$34.99',
      category: 'Electronics > Charging',
      stock: '150 units',
      status: 'draft',
      lastUpdated: 'Oct 24, 2024',
      salesLast30Days: 'Not yet published',
      supplier: 'ChargeTech Solutions'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'New product in draft status awaiting final review and publication.'
      }
    }
  }
}`,...(k=(g=o.parameters)==null?void 0:g.docs)==null?void 0:k.source}}};const Y=["ActiveProduct","LowStock","OutOfStock","DraftProduct"];export{t as ActiveProduct,o as DraftProduct,e as LowStock,a as OutOfStock,Y as __namedExportsOrder,X as default};
