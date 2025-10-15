import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Coffee, Clock, MapPin, Phone, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const cafes = useQuery(api.cafes.list);
  const cafe = cafes?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">CaféOrder</span>
            </div>
            
            <div className="flex items-center gap-4">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Button
                        onClick={() => navigate("/menu")}
                        variant="ghost"
                      >
                        View Menu
                      </Button>
                      <Button
                        onClick={() => navigate("/orders")}
                      >
                        My Orders
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => navigate("/auth")}
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

      {/* Cafe Information Section */}
      <div className="container mx-auto px-4 pt-32 pb-20">
        {!cafe ? (
          <div className="flex justify-center">
            <Coffee className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            {/* Hero Image */}
            <div className="bg-white dark:bg-slate-800 border rounded-3xl overflow-hidden mb-8">
              <div className="relative h-96">
                <img src={cafe.image} alt={cafe.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">{cafe.name}</h1>
                  <p className="text-xl text-white/90">{cafe.description}</p>
                </div>
              </div>
            </div>

            {/* Cafe Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Contact & Location */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white dark:bg-slate-800 border rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Contact & Location</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Address</p>
                      <p className="text-slate-900 dark:text-white font-medium">{cafe.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Phone</p>
                      <p className="text-slate-900 dark:text-white font-medium">{cafe.phone}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Opening Hours */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white dark:bg-slate-800 border rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Opening Hours</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Working Days</p>
                      <p className="text-slate-900 dark:text-white font-medium">{cafe.workingDays || "Monday - Sunday"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Timing</p>
                      <p className="text-slate-900 dark:text-white font-medium">
                        {cafe.openingTime || "9:00 AM"} - {cafe.closingTime || "10:00 PM"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Order?</h2>
              <p className="text-white/90 text-lg mb-6">Scan the QR code at your table or browse our menu online</p>
              <Button
                onClick={() => navigate("/menu")}
                size="lg"
                className="bg-white text-purple-600 hover:bg-white/90 text-lg px-8"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                View Menu
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}