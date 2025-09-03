import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getOrCreateClientIdentity } from '@/utils/clientIdentification';
import { useToast } from '@/hooks/use-toast';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
  total_amount: number;
  status: string;
  order_status?: string;
  payment_status: string;
  admin_read_at?: string;
  admin_done_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
  order_items?: Array<{
    id: string;
    product_name: string;
    quantity: number;
    product_price: number;
    subtotal: number;
    special_requests?: string;
    toppings?: string | string[];
  }>;
}

interface UseHybridOrderTrackingReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refreshOrders: () => void;
  getActiveOrders: () => Order[];
}

export const useHybridOrderTracking = (): UseHybridOrderTrackingReturn => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useCustomerAuth();
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
        console.log('🆔 [HYBRID-TRACKING] Client ID initialized:', identity.clientId.slice(-12));
      } catch (error) {
        console.error('❌ [HYBRID-TRACKING] Failed to get client identity:', error);
      }
    };

    initializeClient();
  }, []);

  // Load orders using hybrid approach
  const loadOrders = useCallback(async () => {
    if (!clientId && !isAuthenticated) {
      console.log('📋 [HYBRID-TRACKING] No client ID or authentication available yet');
      return;
    }

    console.log('📋 [HYBRID-TRACKING] Loading orders with hybrid approach:', {
      isAuthenticated,
      hasUser: !!user,
      hasClientId: !!clientId
    });

    setLoading(true);
    setError(null);

    try {
      let query = supabase
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
          user_id,
          order_items (
            id,
            product_name,
            quantity,
            product_price,
            subtotal,
            special_requests,
            toppings
          )
        `);

      // 🎯 HYBRID QUERY: Use user_id if authenticated, otherwise use clientId
      if (isAuthenticated && user) {
        console.log('📋 [HYBRID-TRACKING] Using USER-based query for authenticated user');
        query = query.eq('user_id', user.id);
      } else if (clientId) {
        console.log('📋 [HYBRID-TRACKING] Using CLIENT-based query for anonymous user');
        query = query.contains('metadata', { clientId });
      } else {
        console.log('📋 [HYBRID-TRACKING] No valid identifier available');
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) {
        console.error('❌ [HYBRID-TRACKING] Query error:', fetchError);
        setError('Failed to load orders');
        return;
      }

      console.log(`📋 [HYBRID-TRACKING] Found ${data?.length || 0} orders`);
      setOrders(data || []);

    } catch (error) {
      console.error('❌ [HYBRID-TRACKING] Load error:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [clientId, isAuthenticated, user]);

  // Load orders when dependencies change
  useEffect(() => {
    if (clientId || (isAuthenticated && user)) {
      loadOrders();
    }
  }, [clientId, isAuthenticated, user, loadOrders]);

  // Set up real-time subscription with hybrid filtering
  useEffect(() => {
    if (!clientId && !isAuthenticated) return;

    console.log('📡 [HYBRID-TRACKING] Setting up hybrid real-time subscription');

    const channelName = `hybrid-orders-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        const updatedOrder = payload.new as Order;

        console.log('📡 [HYBRID-TRACKING] Real-time update received:', {
          orderId: updatedOrder.id,
          orderNumber: updatedOrder.order_number,
          status: updatedOrder.status,
          payloadUserId: updatedOrder.user_id,
          payloadClientId: updatedOrder.metadata?.clientId,
          currentUserId: user?.id,
          currentClientId: clientId
        });

        // 🎯 HYBRID FILTERING: Check multiple conditions
        let shouldUpdate = false;
        let reason = '';

        // 1. If authenticated, check user_id
        if (isAuthenticated && user && updatedOrder.user_id === user.id) {
          shouldUpdate = true;
          reason = 'user_id match';
        }
        // 2. If not authenticated or no user_id match, check clientId
        else if (updatedOrder.metadata?.clientId === clientId) {
          shouldUpdate = true;
          reason = 'clientId match';
        }
        // 3. Check if we already have this order in our list (fallback)
        else if (orders.some(order => order.id === updatedOrder.id)) {
          shouldUpdate = true;
          reason = 'existing order';
        }

        if (shouldUpdate) {
          console.log(`✅ [HYBRID-TRACKING] Updating order (${reason}):`, updatedOrder.order_number);
          
          setOrders(prev => prev.map(order => 
            order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
          ));

          toast({
            title: 'Order Updated! 🔄',
            description: `Order #${updatedOrder.order_number} status changed`,
          });
        } else {
          console.log('⏭️ [HYBRID-TRACKING] Order update not relevant, skipping');
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        const newOrder = payload.new as Order;
        
        // Check if this new order belongs to us
        const belongsToUser = isAuthenticated && user && newOrder.user_id === user.id;
        const belongsToClient = newOrder.metadata?.clientId === clientId;
        
        if (belongsToUser || belongsToClient) {
          console.log('📡 [HYBRID-TRACKING] New order received for us:', newOrder.order_number);
          loadOrders(); // Reload to get full order with items
        }
      })
      .subscribe((status) => {
        console.log('📡 [HYBRID-TRACKING] Subscription status:', status);
      });

    return () => {
      console.log('📡 [HYBRID-TRACKING] Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [clientId, isAuthenticated, user, orders, loadOrders, toast]);

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
    refreshOrders: loadOrders,
    getActiveOrders
  };
};
