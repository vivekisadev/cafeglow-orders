import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Coffee } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function Checkout() {
  const { cafeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const createOrder = useMutation(api.orders.create);

  const { cart, cafe } = location.state || { cart: [], cafe: null };

  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cafeId || cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderId = await createOrder({
        cafeId: cafeId as any,
        items: cart,
        totalAmount,
        customerName,
        customerPhone,
        notes: notes || undefined,
      });

      toast.success("Order placed successfully!");
      navigate(`/order/${orderId}`);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart || cart.length === 0) {
    navigate("/cafes");
    return null;
  }

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
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl px-6 py-4 shadow-lg">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="text-xl font-bold text-white">Checkout</span>
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
          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl h-fit">
              <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>
              {cafe && (
                <div className="mb-4 pb-4 border-b border-white/20">
                  <p className="text-white font-semibold">{cafe.name}</p>
                  <p className="text-white/70 text-sm">{cafe.address}</p>
                </div>
              )}
              <div className="space-y-3 mb-4">
                {cart.map((item: any) => (
                  <div key={item.menuItemId} className="flex justify-between text-white">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/20">
                <div className="flex justify-between text-white text-xl font-bold">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Details Form */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Your Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white mb-2 block">Name</Label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="backdrop-blur-xl bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white mb-2 block">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="backdrop-blur-xl bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-white mb-2 block">Special Instructions (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="backdrop-blur-xl bg-white/20 border-white/30 text-white placeholder:text-white/50 min-h-24"
                    placeholder="Any special requests?"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white border-0 shadow-lg py-6 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Coffee className="w-5 h-5 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
