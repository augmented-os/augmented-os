import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/E-commerce/Order Processing',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# E-commerce Order Processing

Complete order lifecycle from initial placement through delivery and fulfillment.
Demonstrates order management, payment processing, and logistics workflows.

**Order Stages:**
- New Order - Fresh order awaiting payment confirmation
- Payment Confirmed - Payment processed, ready for fulfillment
- In Fulfillment - Order being picked and packed
- Shipped - Order dispatched with tracking information
- Delivered - Successfully delivered to customer
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

// Order processing schema
const orderProcessingSchema: UIComponentSchema = {
  componentId: 'order-processing-demo',
  name: 'Order Processing',
  componentType: 'Display',
  title: 'Order #{{orderNumber}}',
  customProps: {
    displayType: 'card',
    fields: [
      { key: 'customerName', label: 'Customer' },
      { key: 'orderDate', label: 'Order Date' },
      { key: 'items', label: 'Items' },
      { key: 'total', label: 'Total Amount' },
      { key: 'paymentMethod', label: 'Payment Method' },
      { key: 'shippingAddress', label: 'Shipping Address' },
      { key: 'status', label: 'Order Status' },
      { key: 'expectedDelivery', label: 'Expected Delivery' },
      { key: 'tracking', label: 'Tracking Number' }
    ],
    layout: 'grid'
  },
  actions: [
    { actionKey: 'confirm_payment', label: 'Confirm Payment', style: 'primary', visibleIf: 'status == "pending_payment"' },
    { actionKey: 'start_fulfillment', label: 'Start Fulfillment', style: 'primary', visibleIf: 'status == "paid"' },
    { actionKey: 'mark_shipped', label: 'Mark as Shipped', style: 'primary', visibleIf: 'status == "fulfilling"' },
    { actionKey: 'contact_customer', label: 'Contact Customer', style: 'secondary' },
    { actionKey: 'cancel_order', label: 'Cancel Order', style: 'danger', visibleIf: 'status != "delivered"' }
  ]
};

export const NewOrder: Story = {
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
};

export const PaymentConfirmed: Story = {
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
};

export const InFulfillment: Story = {
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
};

export const Shipped: Story = {
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
};

export const Delivered: Story = {
  name: 'Successfully Delivered',
  args: {
    schema: {
      ...orderProcessingSchema,
      actions: [
        { actionKey: 'request_review', label: 'Request Review', style: 'secondary' },
        { actionKey: 'process_return', label: 'Process Return', style: 'secondary' },
        { actionKey: 'view_receipt', label: 'View Receipt', style: 'secondary' }
      ]
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
}; 