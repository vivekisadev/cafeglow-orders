import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { CheckCircle, Home } from "lucide-react";
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
      {/* Content */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white dark:bg-slate-800 border rounded-2xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Order Confirmed!</h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">Your order has been placed successfully</p>

            {order && cafe && (
              <div className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-6 mb-6 text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{cafe.name}</h3>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-slate-900 dark:text-white">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-slate-900 dark:text-white text-xl font-bold">
                    <span>Total</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t space-y-2">
                  <p className="text-slate-600 dark:text-slate-400"><span className="font-semibold">Name:</span> {order.customerName}</p>
                  <p className="text-slate-600 dark:text-slate-400"><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
                  {order.notes && (
                    <p className="text-slate-600 dark:text-slate-400"><span className="font-semibold">Notes:</span> {order.notes}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/orders")}
                size="lg"
                variant="outline"
              >
                View All Orders
              </Button>
              <Button
                onClick={() => navigate("/")}
                size="lg"
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