import { usePresenceCount } from "@/hooks/usePresenceCount";
import { motion, AnimatePresence } from "framer-motion";

const LiveCounter = () => {
  const count = usePresenceCount();

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="font-body text-[10px] tracking-[0.15em] uppercase text-foreground/50"
        >
          {count} {count === 1 ? "visitor" : "visitors"} online
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default LiveCounter;
