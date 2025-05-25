"use client"

import {
  Smartphone,
  SmartphoneCharging,
  Laptop,
  Headphones,
  Gamepad2,
  Tv,
  Refrigerator,
  Lamp,
  ToyBrickIcon as Toy,
  Flower,
  Sofa,
  Gem,
  Shirt,
  CircleDot,
  type LucideIcon,
} from "lucide-react"

type IconName =
  | "smartphone"
  | "smartphone-charging"
  | "laptop"
  | "headphones"
  | "gamepad-2"
  | "tv"
  | "refrigerator"
  | "lamp"
  | "toy"
  | "flower"
  | "sofa"
  | "gem"
  | "shirt"

const iconMap: Record<IconName, LucideIcon> = {
  smartphone: Smartphone,
  "smartphone-charging": SmartphoneCharging,
  laptop: Laptop,
  headphones: Headphones,
  "gamepad-2": Gamepad2,
  tv: Tv,
  refrigerator: Refrigerator,
  lamp: Lamp,
  toy: Toy,
  flower: Flower,
  sofa: Sofa,
  gem: Gem,
  shirt: Shirt,
}

interface CategoryButtonProps {
  icon: IconName
  label: string
}

export function CategoryButton({ icon, label }: CategoryButtonProps) {
  const Icon = iconMap[icon] || CircleDot

  return (
    <div className="flex flex-col items-center min-w-[80px]">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-1">
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xs text-center">{label}</span>
    </div>
  )
}
