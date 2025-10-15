import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { CheckCircle, Coffee, Home } from "lucide-react";
import { useNavigate, useParams } from "react-router";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const order = useQuery(api.orders.get, orderId ? { id: orderId as Id<"orders"> } : "skip");
  const cafe = useQuery(api.cafes.get, order ? { id: order.cafeId } : "skip");

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

      {/* Content */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
            <p className="text-xl text-white/90 mb-8">Your order has been placed successfully</p>

            {order && cafe && (
              <div className="backdrop-blur-xl bg-white/15 border border-white/30 rounded-2xl p-6 mb-6 text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{cafe.name}</h3>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-white">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="flex justify-between text-white text-xl font-bold">
                    <span>Total</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
                  <p className="text-white/80"><span className="font-semibold">Name:</span> {order.customerName}</p>
                  <p className="text-white/80"><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
                  {order.notes && (
                    <p className="text-white/80"><span className="font-semibold">Notes:</span> {order.notes}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/orders")}
                size="lg"
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                View All Orders
              </Button>
              <Button
                onClick={() => navigate("/")}
                size="lg"
                className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white border-0"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
