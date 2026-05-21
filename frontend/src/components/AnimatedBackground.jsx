import React, { useEffect, useRef } from 'react'

const AnimatedBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Enhanced floating legal keywords
    const keywords = ['JUSTICE', 'EVIDENCE', 'VERDICT', 'CASE', 'COURT', 'LAW', 'LEGAL', 'AI', 'JUDGE', 'ATTORNEY', 'COUNSEL', 'STATUTE', 'BRIEF', 'APPEAL', 'TRIAL', 'RULING']
    const particles = keywords.map((word, i) => ({
      text: word,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.04 + 0.02,
      size: Math.random() * 24 + 36
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < -100 || particle.x > canvas.width + 100) particle.vx *= -1
        if (particle.y < -50 || particle.y > canvas.height + 50) particle.vy *= -1

        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = '#ffffff'
        ctx.font = `700 ${particle.size}px Inter, sans-serif`
        ctx.textAlign = 'center'
        ctx.letterSpacing = '4px'
        ctx.fillText(particle.text, particle.x, particle.y)
        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {/* Scales of Justice SVG */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <svg width="400" height="400" viewBox="0 0 400 400" className="animate-pulse">
          <path
            d="M200 50 L200 350 M150 100 Q150 120 170 120 Q190 120 190 100 M210 100 Q210 120 230 120 Q250 120 250 100 M170 120 L170 140 L190 140 L190 120 M230 120 L230 140 L250 140 L250 120 M180 50 Q180 40 200 40 Q220 40 220 50"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-primary/20"
          />
        </svg>
      </div>
    </>
  )
}

export default AnimatedBackground