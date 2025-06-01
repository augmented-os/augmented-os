import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/E-commerce/Product Catalog',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Product Catalog Management

Product listing, inventory tracking, and catalog management workflows.
Demonstrates product management, pricing updates, and stock monitoring.

**Product States:**
- Active Product - Available for purchase
- Low Stock - Inventory running low
- Out of Stock - No inventory available
- Draft Product - Not yet published
        `
      }
    }
  },
  argTypes: {
    onSubmit: { action: 'submitted' },
    onCancel: { action: 'cancelled' },
    onAction: { action: 'action triggered' },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicUIRenderer>;

// Product catalog schema
const productCatalogSchema: UIComponentSchema = {
  componentId: 'product-catalog-demo',
  name: 'Product Catalog',
  componentType: 'Display',
  title: '{{productName}}',
  customProps: {
    displayType: 'card',
    fields: [
      { key: 'sku', label: 'SKU' },
      { key: 'price', label: 'Price' },
      { key: 'category', label: 'Category' },
      { key: 'stock', label: 'Stock Level' },
      { key: 'status', label: 'Status' },
      { key: 'lastUpdated', label: 'Last Updated' },
      { key: 'salesLast30Days', label: 'Sales (30 days)' },
      { key: 'supplier', label: 'Supplier' }
    ],
    layout: 'grid'
  },
  actions: [
    { actionKey: 'edit_product', label: 'Edit Product', style: 'secondary' },
    { actionKey: 'update_price', label: 'Update Price', style: 'secondary' },
    { actionKey: 'restock', label: 'Restock', style: 'primary', visibleIf: 'stock < 10' },
    { actionKey: 'publish', label: 'Publish', style: 'primary', visibleIf: 'status == "draft"' },
    { actionKey: 'disable', label: 'Disable', style: 'danger', visibleIf: 'status == "active"' }
  ]
};

export const ActiveProduct: Story = {
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
};

export const LowStock: Story = {
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
};

export const OutOfStock: Story = {
  name: 'Out of Stock',
  args: {
    schema: {
      ...productCatalogSchema,
      actions: [
        { actionKey: 'edit_product', label: 'Edit Product', style: 'secondary' },
        { actionKey: 'urgent_restock', label: 'Urgent Restock', style: 'danger' },
        { actionKey: 'contact_supplier', label: 'Contact Supplier', style: 'primary' },
        { actionKey: 'find_alternative', label: 'Find Alternative', style: 'secondary' }
      ]
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
};

export const DraftProduct: Story = {
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
}; 