import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import OrderTrackingSection from '@/components/OrderTrackingSection';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { useToast } from '@/hooks/use-toast';

const OrderState: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useCustomerAuth();
  const { toast } = useToast();

  // 🎯 AUTO-LOAD: Show welcome message for auto-redirected users
  useEffect(() => {
    const autoParam = searchParams.get('auto');
    const orderParam = searchParams.get('order');

    if (autoParam === 'true' && orderParam) {
      console.log('🎯 Auto-redirected to order state page for order:', orderParam);

      // Show welcome message for auto-redirected users
      toast({
        title: '🎉 Order Completed!',
        description: 'Welcome to your order status page. Your orders will update in real-time.',
        duration: 5000,
      });
    }
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-purple-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-pizza-orange"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            
            <h1 className="text-xl font-bold text-gray-900">
              {searchParams.get('auto') === 'true' ? 'Order Completed!' : 'Order Status'}
            </h1>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
      </div>

      {/* Order Tracking Content */}
      <div className="py-8">
        {/* 🎯 ALWAYS SHOW ORDER TRACKING - No authentication required for client-based tracking */}
        <OrderTrackingSection />
      </div>
    </div>
  );
};

export default OrderState;
