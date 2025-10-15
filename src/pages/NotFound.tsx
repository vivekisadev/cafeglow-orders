import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900"
    >
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-slate-900 dark:text-white mb-4">404</h1>
          <p className="text-2xl text-slate-600 dark:text-slate-300 mb-8">Page Not Found</p>
          <Button onClick={() => navigate("/")} size="lg">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </motion.div>
  );
}