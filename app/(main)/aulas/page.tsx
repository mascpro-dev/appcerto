"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlayCircle, LayoutGrid, User, Trophy, Share2 } from "lucide-react";

// No seu menu mobile e desktop, o link deve ser exatamente este:
const menuItems = [
  { name: "Início", href: "/", icon: LayoutGrid },
  { name: "Aulas", href: "/aulas", icon: PlayCircle }, // Este link abre a vitrine de aulas
  { name: "Perfil", href: "/perfil", icon: User, isFloating: true },
  { name: "Rank", href: "/comunidade", icon: Trophy },
  { name: "Rede", href: "/rede", icon: Share2 },
];