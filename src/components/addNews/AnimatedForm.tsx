"use client";

import { type ReactNode } from "react";

import { AnimatePresence, motion } from "framer-motion";

interface AnimatedFormProps {
  children: ReactNode;
  formKey: string;
  direction: 1 | -1;
}

export default function AnimatedForm({ children, formKey }: AnimatedFormProps) {
  return (
    <div className="3xl:mt-7 relative mt-7 flex min-h-0 w-full flex-1 overflow-hidden xl:mt-4 2xl:mt-5">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={formKey}
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
          className="flex min-h-0 w-full flex-1 overflow-hidden"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
