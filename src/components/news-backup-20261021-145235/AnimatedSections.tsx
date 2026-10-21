"use client";

import { type ReactNode } from "react";

import { AnimatePresence, motion } from "framer-motion";

interface AnimatedSectionsProps {
  children: ReactNode;
  sectionKey: string;
  direction: 1 | -1;
}

export default function AnimatedSections({
  children,
  sectionKey,
}: AnimatedSectionsProps) {
  return (
    <div className="relative min-h-0 w-full flex-1 overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={sectionKey}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
          className="absolute inset-0 flex min-h-0 w-full overflow-hidden"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
