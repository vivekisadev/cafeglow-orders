import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Coffee, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router";
import { Id } from "@/convex/_generated/dataModel";

export default function Cafes() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const cafes = useQuery(api.cafes.list);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-blue-400">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
          <Coffee className="w-8 h-8 text-white animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/auth");
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
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">CaféOrder</span>
              </div>
            </div>
            <Button
              onClick={() => navigate("/orders")}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
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
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Browse Cafés</h1>
          <p className="text-xl text-white/90 mb-12 drop-shadow">Discover local cafés and order your favorites</p>

          {!cafes ? (
            <div className="flex justify-center">
              <Coffee className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : cafes.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 text-center">
              <p className="text-white text-lg">No cafés available at the moment.</p>
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
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-xl hover:bg-white/15 transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{cafe.name}</h3>
                    <p className="text-white/80 mb-4">{cafe.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/70">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{cafe.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
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
