import { Image } from "@/routes/cart/-types";

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface Order {
  uuid: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  discount: number;
  total: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postcode: string;
  shipping_notes?: string;
  payment_method?: string;
  payment_status: PaymentStatus;
  paid_at?: Date;
  tracking_number?: string;
  shipped_at?: Date;
  delivered_at?: Date;
  cancelled_at?: Date;
  cancellation_reason?: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  uuid: string;
  orderId: string;
  variantId: string;
  product_title: string;
  variant_title: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItemWithVariant extends OrderItem {
  variant: {
    uuid: string;
    title: string;
    images: Image[];
  };
}

export interface OrderResponse extends Order {
  items: OrderItemWithVariant[];
}

export interface CreateOrderRequest {
  token: string;
  cartItemIds: string[];
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postcode: string;
  shipping_notes?: string;
  payment_method?: string;
}


export interface AdminOrderResponse extends OrderResponse {
  user: {
    uuid: string;
    email: string;
    name: string;
    phone: string | null;
  };
}

export interface GetAllOrdersResponse {
  data: AdminOrderResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}