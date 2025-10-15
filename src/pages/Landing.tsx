import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Coffee, ShoppingBag, Sparkles, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-400 -z-10" />
      
      {/* Blurred gradient circles */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />

      {/* Glassmorphic Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-lg">CaféOrder</span>
            </div>
            
            <div className="flex items-center gap-4">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Button
                        onClick={() => navigate("/cafes")}
                        variant="ghost"
                        className="text-white hover:bg-white/20 backdrop-blur-sm"
                      >
                        Browse Cafés
                      </Button>
                      <Button
                        onClick={() => navigate("/orders")}
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm shadow-lg"
                      >
                        My Orders
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => navigate("/auth")}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm shadow-lg"
                    >
                      Sign In
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 backdrop-blur-xl bg-white/15 border border-white/20 rounded-full px-6 py-3 mb-8 shadow-lg">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-medium">Order from your favorite local cafés</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
            Delicious Food,
            <br />
            <span className="bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
              Delivered Fresh
            </span>
          </h1>

          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-lg">
            Browse menus from local cafés, place your order, and enjoy freshly prepared food and drinks. 
            Skip the line and order ahead.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(isAuthenticated ? "/cafes" : "/auth")}
              size="lg"
              className="backdrop-blur-xl bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 text-lg px-8 py-6 rounded-2xl shadow-2xl"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              {isAuthenticated ? "Browse Cafés" : "Get Started"}
            </Button>
            <Button
              onClick={() => navigate("/cafes")}
              size="lg"
              variant="outline"
              className="backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 text-lg px-8 py-6 rounded-2xl"
            >
              View Menu
            </Button>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto"
        >
          {[
            {
              icon: Coffee,
              title: "Local Cafés",
              description: "Support your neighborhood coffee shops and eateries",
            },
            {
              icon: UtensilsCrossed,
              title: "Fresh & Fast",
              description: "Order ahead and skip the wait. Pick up when ready",
            },
            {
              icon: ShoppingBag,
              title: "Easy Ordering",
              description: "Simple menu browsing and secure checkout process",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-xl hover:bg-white/15 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-6 shadow-lg">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-white/80 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}