import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Coffee, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

type CartItem = {
  menuItemId: Id<"menuItems">;
  name: string;
  price: number;
  quantity: number;
};

export default function CafeMenu() {
  const { cafeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Array<CartItem>>([]);

  const cafe = useQuery(api.cafes.get, cafeId ? { id: cafeId as Id<"cafes"> } : "skip");
  const menuItems = useQuery(api.menuItems.listByCafe, cafeId ? { cafeId: cafeId as Id<"cafes"> } : "skip");

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const addToCart = (item: any) => {
    const existingItem = cart.find((i) => i.menuItemId === item._id);
    if (existingItem) {
      setCart(cart.map((i) =>
        i.menuItemId === item._id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, {
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
      }]);
    }
    toast.success(`Added ${item.name} to cart`);
  };

  const updateQuantity = (menuItemId: Id<"menuItems">, delta: number) => {
    setCart(cart.map((item) =>
      item.menuItemId === menuItemId
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter((item) => item.quantity > 0));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = menuItems ? Array.from(new Set(menuItems.map((item) => item.category))) : [];

  return (
    <div className="min-h-screen relative overflow-hidden pb-32">
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
                onClick={() => navigate("/cafes")}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <span className="text-xl font-bold text-white">{cafe?.name || "Menu"}</span>
            </div>
            {totalItems > 0 && (
              <div className="flex items-center gap-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl px-4 py-2">
                <ShoppingCart className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">{totalItems} items</span>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <div className="container mx-auto px-4 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {cafe && (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden mb-8 shadow-xl">
              <div className="relative h-64">
                <img src={cafe.image} alt={cafe.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h1 className="text-4xl font-bold text-white mb-2">{cafe.name}</h1>
                  <p className="text-white/90">{cafe.description}</p>
                </div>
              </div>
            </div>
          )}

          {!menuItems ? (
            <div className="flex justify-center">
              <Coffee className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : (
            categories.map((category) => (
              <div key={category} className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">{category}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems
                    .filter((item) => item.category === category)
                    .map((item, index) => {
                      const cartItem = cart.find((i) => i.menuItemId === item._id);
                      return (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-xl hover:bg-white/15 transition-all duration-300"
                        >
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-bold text-white">{item.name}</h3>
                              <Badge className="bg-white/20 text-white border-white/30">
                                ${item.price.toFixed(2)}
                              </Badge>
                            </div>
                            <p className="text-white/80 text-sm mb-4">{item.description}</p>
                            {cartItem ? (
                              <div className="flex items-center justify-between backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => updateQuantity(item._id, -1)}
                                  className="text-white hover:bg-white/20 h-8 w-8"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-white font-semibold">{cartItem.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => updateQuantity(item._id, 1)}
                                  className="text-white hover:bg-white/20 h-8 w-8"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => addToCart(item)}
                                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                              >
                                Add to Cart
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>

      {/* Floating Cart */}
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl"
        >
          <div className="backdrop-blur-xl bg-white/15 border border-white/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm">Total ({totalItems} items)</p>
                <p className="text-3xl font-bold text-white">${totalAmount.toFixed(2)}</p>
              </div>
              <Button
                onClick={() => navigate(`/checkout/${cafeId}`, { state: { cart, cafe } })}
                size="lg"
                className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white border-0 shadow-lg px-8"
              >
                Checkout
                <ShoppingCart className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
