"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, type, label, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === "password"
    const inputType = isPassword ? (showPassword ? "text" : "password") : type

    const hasValue = props.value !== undefined && props.value !== "" || props.defaultValue !== undefined

    return (
      <div className={cn("relative group w-full", className)}>
        <motion.label
          initial={false}
          animate={{
            y: isFocused || hasValue ? -24 : 12,
            scale: isFocused || hasValue ? 0.85 : 1,
            color: isFocused ? "var(--color-primary)" : "var(--color-muted-foreground)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute left-3 origin-[0] pointer-events-none text-muted-foreground transition-colors"
        >
          {label}
        </motion.label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "flex h-12 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm shadow-sm transition-all",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black/20",
              isPassword && "pr-10"
            )}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            placeholder={label}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
              tabIndex={-1}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={showPassword ? "hide" : "show"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>
          )}
        </div>
      </div>
    )
  }
)
AnimatedInput.displayName = "AnimatedInput"
