"use client"

import { useEffect, useState } from "react"

interface CyberGlitchProps {
  text: string
}

export function CyberGlitch({ text }: CyberGlitchProps) {
  const [glitchText, setGlitchText] = useState(text)

  useEffect(() => {
    // Characters to use for glitch effect
    const glitchChars = "!<>-_\\/[]{}—=+*^?#________"

    // Create glitch effect at random intervals
    const interval = setInterval(() => {
      // Random chance to trigger glitch
      if (Math.random() < 0.1) {
        let iterations = 0

        // Create multiple rapid changes to simulate glitch
        const glitchInterval = setInterval(() => {
          setGlitchText(
            text
              .split("")
              .map((char, index) => {
                // Random chance to replace character with glitch character
                if (index < iterations) {
                  return text[index]
                }

                return glitchChars[Math.floor(Math.random() * glitchChars.length)]
              })
              .join(""),
          )

          iterations += 1 / 3

          if (iterations >= text.length) {
            clearInterval(glitchInterval)
            setGlitchText(text)
          }
        }, 30)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [text])

  return (
    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter cyber-text">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-cyan-500">
        {glitchText}
      </span>
    </h1>
  )
}
