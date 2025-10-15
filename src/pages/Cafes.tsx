import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Coffee, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router";

export default function Cafes() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const cafes = useQuery(api.cafes.list);

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
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">CaféOrder</span>
              </div>
            </div>
            <Button
              onClick={() => navigate("/orders")}
            >
              My Orders
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">Browse Cafés</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">Discover local cafés and order your favorites</p>

          {!cafes ? (
            <div className="flex justify-center">
              <Coffee className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : cafes.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border rounded-2xl p-12 text-center">
              <p className="text-slate-600 dark:text-slate-300 text-lg">No cafés available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {cafes.map((cafe, index) => (
                <motion.div
                  key={cafe._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/cafe/${cafe._id}`)}
                  className="bg-white dark:bg-slate-800 border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{cafe.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">{cafe.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{cafe.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{cafe.phone}</span>
                      </div>
                    </div>
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