"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PasswordStrengthProps {
  password?: string
  className?: string
}

export function PasswordStrength({ password = "", className }: PasswordStrengthProps) {
  const calculateStrength = (pass: string) => {
    let score = 0
    if (!pass) return 0
    if (pass.length >= 8) score += 1
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) score += 1
    if (pass.match(/\d/)) score += 1
    if (pass.match(/[^a-zA-Z\d]/)) score += 1
    return score
  }

  const score = calculateStrength(password)
  
  const getStrengthLabel = () => {
    if (score === 0) return "Too short"
    if (score === 1) return "Weak"
    if (score === 2) return "Fair"
    if (score === 3) return "Good"
    return "Strong"
  }

  const getBarColor = (index: number) => {
    if (index >= score) return "bg-white/10 dark:bg-white/5"
    if (score <= 1) return "bg-red-500"
    if (score === 2) return "bg-orange-500"
    if (score === 3) return "bg-yellow-500"
    return "bg-emerald-500"
  }

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="flex h-1.5 w-full gap-1">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className={cn("h-full flex-1 rounded-full", getBarColor(index))}
            layout
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
        <span>Password strength</span>
        <span className="font-medium">{getStrengthLabel()}</span>
      </div>
    </div>
  )
}
