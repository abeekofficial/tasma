"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface OtpInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function OtpInput({ length = 6, value = "", onChange, className }: OtpInputProps) {
  const [otp, setOtp] = React.useState<string[]>(Array(length).fill(""))
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
  
  React.useEffect(() => {
    if (value) {
      const valueArray = value.split("").slice(0, length)
      const newOtp = Array(length).fill("")
      valueArray.forEach((char, index) => {
        newOtp[index] = char
      })
      setOtp(newOtp)
    }
  }, [value, length])

  const focusNext = (index: number) => {
    if (index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const focusPrev = (index: number) => {
    if (index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value
    if (!/^[a-zA-Z0-9]*$/.test(val)) return

    const char = val.slice(-1)
    
    const newOtp = [...otp]
    newOtp[index] = char
    setOtp(newOtp)
    
    if (onChange) {
      onChange(newOtp.join(""))
    }

    if (char !== "") {
      focusNext(index)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index]) {
        e.preventDefault()
        const newOtp = [...otp]
        if (index > 0) {
          newOtp[index - 1] = ""
          setOtp(newOtp)
          if (onChange) onChange(newOtp.join(""))
          focusPrev(index)
        }
      } else {
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
        if (onChange) onChange(newOtp.join(""))
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      focusPrev(index)
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      focusNext(index)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").replace(/[^a-zA-Z0-9]/g, "").slice(0, length)
    if (pastedData) {
      const newOtp = [...otp]
      pastedData.split("").forEach((char, i) => {
        newOtp[i] = char
      })
      setOtp(newOtp)
      if (onChange) onChange(newOtp.join(""))
      
      const focusIndex = Math.min(pastedData.length, length - 1)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  return (
    <div className={cn("flex gap-2 justify-center w-full", className)} onPaste={handlePaste}>
      {otp.map((char, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <input
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={char}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "w-12 h-14 text-center text-lg font-semibold rounded-xl bg-white/5 border border-white/10",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm",
              "dark:bg-black/40",
              char && "border-primary/50 bg-white/10 dark:bg-white/10"
            )}
          />
        </motion.div>
      ))}
    </div>
  )
}
