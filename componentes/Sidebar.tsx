"use client";

import Link from "next/link";
import { PlayCircle, LayoutGrid, User, Trophy, Share2, Map } from "lucide-react";

const menuItems = [
  { name: "Visão Geral", href: "/", icon: LayoutGrid },
  { name: "Evolução", href: "/evolucao", icon: PlayCircle }, // Mantém suas aulas originais
  { name: "Jornada", href: "/jornada", icon: Map }, // Nova aba para a Jornada do Embaixador
  { name: "Minha Rede", href: "/rede", icon: Share2 },
  { name: "Comunidade", href: "/comunidade", icon: Trophy },
];