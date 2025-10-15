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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-blue-400">
        <Coffee className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-200 border-yellow-500/30";
      case "confirmed": return "bg-blue-500/20 text-blue-200 border-blue-500/30";
      case "preparing": return "bg-purple-500/20 text-purple-200 border-purple-500/30";
      case "ready": return "bg-green-500/20 text-green-200 border-green-500/30";
      case "completed": return "bg-gray-500/20 text-gray-200 border-gray-500/30";
      case "cancelled": return "bg-red-500/20 text-red-200 border-red-500/30";
      default: return "bg-white/20 text-white border-white/30";
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-400 -z-10" />
      <div className="fixed top-0 left-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">My Orders</span>
              </div>
            </div>
            <Button
              onClick={() => navigate("/cafes")}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
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
              <Coffee className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
              <p className="text-white/80 mb-6">Start by browsing our cafés and placing your first order!</p>
              <Button
                onClick={() => navigate("/cafes")}
                className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white border-0"
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
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl hover:bg-white/15 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white/70 text-sm mb-1">
                        {new Date(order._creationTime).toLocaleDateString()} at{" "}
                        {new Date(order._creationTime).toLocaleTimeString()}
                      </p>
                      <p className="text-white font-semibold">{order.customerName}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-white/90">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Total</span>
                    <span className="text-white font-bold text-xl">${order.totalAmount.toFixed(2)}</span>
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
