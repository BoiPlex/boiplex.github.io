"use client"

import React, { useRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"
import type { MotionProps, MotionValue } from "motion/react"

import { cn } from "@/lib/utils"

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string
  iconSize?: number
  iconMagnification?: number
  disableMagnification?: boolean
  iconDistance?: number
  direction?: "top" | "middle" | "bottom"
  children: React.ReactNode
}

const DEFAULT_SIZE = 40
const DEFAULT_MAGNIFICATION = 60
const DEFAULT_DISTANCE = 140
const DEFAULT_DISABLEMAGNIFICATION = false

type DockContextValue = {
  mouseX: MotionValue<number>
  size: number
  magnification: number
  disableMagnification: boolean
  distance: number
}

const DockContext = React.createContext<DockContextValue | null>(null)

const dockVariants = cva(
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 mx-auto mt-8 flex h-[58px] w-max items-center justify-center gap-2 rounded-2xl border p-2 backdrop-blur-md"
)

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      disableMagnification = DEFAULT_DISABLEMAGNIFICATION,
      iconDistance = DEFAULT_DISTANCE,
      direction = "middle",
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue(Infinity)

    return (
      <DockContext.Provider
        value={{
          mouseX,
          size: iconSize,
          magnification: iconMagnification,
          disableMagnification,
          distance: iconDistance,
        }}
      >
        <motion.div
          ref={ref}
          onMouseMove={(event) => mouseX.set(event.clientX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          {...props}
          className={cn(dockVariants({ className }), {
            "items-start": direction === "top",
            "items-center": direction === "middle",
            "items-end": direction === "bottom",
          })}
        >
          {children}
        </motion.div>
      </DockContext.Provider>
    )
  }
)

Dock.displayName = "Dock"

export interface DockIconProps extends Omit<
  MotionProps & React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  size?: number
  magnification?: number
  disableMagnification?: boolean
  distance?: number
  mouseX?: MotionValue<number>
  className?: string
  children?: React.ReactNode
}

const DockIcon = ({
  size,
  magnification,
  disableMagnification,
  distance,
  mouseX,
  className,
  children,
  ...props
}: DockIconProps) => {
  const dock = React.useContext(DockContext)
  const ref = useRef<HTMLDivElement>(null)
  const defaultMouseX = useMotionValue(Infinity)
  const resolvedSize = size ?? dock?.size ?? DEFAULT_SIZE
  const resolvedMagnification =
    magnification ?? dock?.magnification ?? DEFAULT_MAGNIFICATION
  const resolvedDisableMagnification =
    disableMagnification ??
    dock?.disableMagnification ??
    DEFAULT_DISABLEMAGNIFICATION
  const resolvedDistance = distance ?? dock?.distance ?? DEFAULT_DISTANCE
  const resolvedMouseX = mouseX ?? dock?.mouseX ?? defaultMouseX

  const distanceCalc = useTransform(resolvedMouseX, (value: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return value - bounds.x - bounds.width / 2
  })

  const targetSize = resolvedDisableMagnification
    ? resolvedSize
    : resolvedMagnification

  const sizeTransform = useTransform(
    distanceCalc,
    [-resolvedDistance, 0, resolvedDistance],
    [resolvedSize, targetSize, resolvedSize]
  )

  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <motion.div
      ref={ref}
      style={{ width: scaleSize, height: scaleSize }}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full border border-border",
        resolvedDisableMagnification &&
          "hover:bg-muted-foreground transition-colors",
        className
      )}
      {...props}
    >
      <div className="size-full">{children}</div>
    </motion.div>
  )
}

DockIcon.displayName = "DockIcon"

export { Dock, DockIcon, dockVariants }