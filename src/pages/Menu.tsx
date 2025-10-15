import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Coffee, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type CartItem = {
  menuItemId: Id<"menuItems">;
  name: string;
  price: number;
  quantity: number;
};

export default function Menu() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Array<CartItem>>([]);

  const cafes = useQuery(api.cafes.list);
  const cafe = cafes?.[0]; // Get the first (and only) cafe
  const menuItems = useQuery(api.menuItems.listByCafe, cafe ? { cafeId: cafe._id } : "skip");

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pb-32">
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
              <span className="text-xl font-bold text-slate-900 dark:text-white">{cafe?.name || "Menu"}</span>
            </div>
            {totalItems > 0 && (
              <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 rounded-full px-4 py-2">
                <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-900 dark:text-purple-200 font-semibold">{totalItems} items</span>
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
            <div className="bg-white dark:bg-slate-800 border rounded-2xl overflow-hidden mb-8">
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
              <Coffee className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : (
            categories.map((category) => (
              <div key={category} className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{category}</h2>
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
                          className="bg-white dark:bg-slate-800 border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
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
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.name}</h3>
                              <Badge variant="secondary">
                                ${item.price.toFixed(2)}
                              </Badge>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{item.description}</p>
                            {cartItem ? (
                              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 rounded-xl p-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => updateQuantity(item._id, -1)}
                                  className="h-8 w-8"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-slate-900 dark:text-white font-semibold">{cartItem.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => updateQuantity(item._id, 1)}
                                  className="h-8 w-8"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => addToCart(item)}
                                className="w-full"
                                variant="outline"
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
          <div className="bg-white dark:bg-slate-800 border rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total ({totalItems} items)</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">${totalAmount.toFixed(2)}</p>
              </div>
              <Button
                onClick={() => navigate("/checkout", { state: { cart, cafe } })}
                size="lg"
                className="px-8"
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
