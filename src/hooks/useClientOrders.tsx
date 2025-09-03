import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getOrCreateClientIdentity } from '@/utils/clientIdentification';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address: string;
  total_amount: number;
  status: string;
  order_status?: string;
  payment_status: string;
  admin_read_at?: string;
  admin_done_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
  order_items: Array<{
    id: string;
    product_name: string;
    quantity: number;
    product_price: number;
    unit_price?: number;
    price?: number;
    subtotal: number;
    special_requests?: string;
    toppings?: string | string[];
    size?: string;
    metadata?: any;
  }>;
}

interface UseClientOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
  getActiveOrders: () => Order[];
}

export const useClientOrders = (): UseClientOrdersReturn => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  // Get client identity on mount
  useEffect(() => {
    const initializeClient = async () => {
      try {
        const identity = await getOrCreateClientIdentity();
        setClientId(identity.clientId);
        console.log('🆔 [CLIENT-ORDERS] Client ID initialized:', identity.clientId.slice(-12));
      } catch (error) {
        console.error('❌ [CLIENT-ORDERS] Failed to get client identity:', error);
      }
    };

    initializeClient();
  }, []);

  // Load orders by client ID
  const loadClientOrders = useCallback(async () => {
    if (!clientId) {
      console.log('📋 [CLIENT-ORDERS] No client ID available yet');
      return;
    }

    console.log('📋 [CLIENT-ORDERS] Loading orders for client:', clientId.slice(-12));
    setLoading(true);
    setError(null);

    try {
      // Query orders that have this clientId in their metadata
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_name,
          customer_email,
          customer_phone,
          customer_address,
          total_amount,
          status,
          order_status,
          payment_status,
          admin_read_at,
          admin_done_at,
          created_at,
          updated_at,
          metadata,
          order_items (
            id,
            product_name,
            quantity,
            product_price,
            subtotal,
            special_requests,
            toppings
          )
        `)
        .contains('metadata', { clientId })
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('❌ [CLIENT-ORDERS] Query error:', fetchError);
        setError('Failed to load orders');
        return;
      }

      console.log(`📋 [CLIENT-ORDERS] Found ${data?.length || 0} orders for client`);
      setOrders(data || []);

    } catch (error) {
      console.error('❌ [CLIENT-ORDERS] Load error:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  // Load orders when client ID is available
  useEffect(() => {
    if (clientId) {
      loadClientOrders();
    }
  }, [clientId, loadClientOrders]);

  // Set up real-time subscription for client orders
  useEffect(() => {
    if (!clientId) return;

    console.log('📡 [CLIENT-ORDERS] Setting up real-time subscription for client:', clientId.slice(-12));

    const channelName = `client-orders-${clientId}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        const updatedOrder = payload.new as Order;

        console.log('📡 [CLIENT-ORDERS] Real-time update received:', {
          orderId: updatedOrder.id,
          orderNumber: updatedOrder.order_number,
          status: updatedOrder.status,
          hasMetadata: !!updatedOrder.metadata,
          payloadClientId: updatedOrder.metadata?.clientId,
          expectedClientId: clientId,
          payloadUserId: updatedOrder.user_id
        });

        // 🎯 HYBRID FILTERING: Check if this order belongs to our client OR if we have any orders with this ID
        const belongsToClient = updatedOrder.metadata?.clientId === clientId;
        const isOurOrder = orders.some(order => order.id === updatedOrder.id);

        if (belongsToClient || isOurOrder) {
          console.log('✅ [CLIENT-ORDERS] Order update matches our client or existing order:', updatedOrder.order_number);

          setOrders(prev => prev.map(order =>
            order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
          ));

          toast({
            title: 'Order Updated! 🔄',
            description: `Order #${updatedOrder.order_number} status changed`,
          });
        } else {
          console.log('⏭️ [CLIENT-ORDERS] Order update not for our client, skipping');
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        const newOrder = payload.new as Order;
        
        // Check if this order belongs to our client
        if (newOrder.metadata?.clientId === clientId) {
          console.log('📡 [CLIENT-ORDERS] New order received for our client:', newOrder.order_number);
          loadClientOrders(); // Reload to get full order with items
        }
      })
      .subscribe((status) => {
        console.log('📡 [CLIENT-ORDERS] Subscription status:', status);
      });

    return () => {
      console.log('📡 [CLIENT-ORDERS] Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [clientId, loadClientOrders, toast]);

  // Get active orders (not delivered/cancelled)
  const getActiveOrders = useCallback((): Order[] => {
    const activeStatuses = ['confirmed', 'preparing', 'ready', 'arrived', 'pending'];
    return orders.filter(order => {
      const currentStatus = order.status || order.order_status;
      return activeStatuses.includes(currentStatus) && !order.admin_done_at;
    });
  }, [orders]);

  return {
    orders,
    loading,
    error,
    refreshOrders: loadClientOrders,
    getActiveOrders
  };
};

export default useClientOrders;
