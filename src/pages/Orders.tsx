import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Coffee, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router";

export default function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const orders = useQuery(api.orders.listByUser);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Coffee className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "confirmed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "preparing": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200";
      case "ready": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "completed": return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                size="icon"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">My Orders</span>
              </div>
            </div>
            <Button
              onClick={() => navigate("/cafes")}
            >
              Browse Cafés
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {!orders ? (
            <div className="flex justify-center">
              <Coffee className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border rounded-2xl p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No orders yet</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">Start by browsing our cafés and placing your first order!</p>
              <Button
                onClick={() => navigate("/cafes")}
              >
                Browse Cafés
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="bg-white dark:bg-slate-800 border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
                        {new Date(order._creationTime).toLocaleDateString()} at{" "}
                        {new Date(order._creationTime).toLocaleTimeString()}
                      </p>
                      <p className="text-slate-900 dark:text-white font-semibold">{order.customerName}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-900 dark:text-white">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-slate-900 dark:text-white font-bold text-lg">Total</span>
                    <span className="text-slate-900 dark:text-white font-bold text-xl">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}