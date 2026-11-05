"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Factory,
  ClipboardCheck,
  MessageCircle,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/adm",
    icon: LayoutDashboard,
  },
  {
    label: "Clientes",
    href: "/adm/clientes",
    icon: Users,
  },
  {
    label: "Peças",
    href: "/adm/pecas",
    icon: Package,
  },
  {
    label: "Ordens de Serviço",
    href: "/adm/ordens-servico",
    icon: ClipboardList,
  },
  {
    label: "Produção",
    href: "/adm/producao",
    icon: Factory,
  },
  {
    label: "Inspeções",
    href: "/adm/inspecoes",
    icon: ClipboardCheck,
  },
  {
    label: "Chat",
    href: "/adm/chat",
    icon: MessageCircle,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Box
      component="aside"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "260px",
        height: "100vh",
        flexShrink: 0,
        overflowY: "auto",
        overflowX: "hidden",
        backgroundColor: "#17233B",
        color: "#fff",
        zIndex: 1200,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ px: 3, py: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#fff",
          }}
        >
          KAIROS
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#AAB4C5",
            mt: 0.5,
          }}
        >
          Painel administrativo
        </Typography>
      </Box>

      <List sx={{ px: 2, py: 0 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;

          const ativo =
            item.href === "/adm"
              ? pathname === "/adm"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                mb: 1,
                minHeight: 48,
                borderRadius: 2,
                color: ativo ? "#fff" : "#C5CDDA",
                backgroundColor: ativo ? "#E56A2F" : "transparent",
                "&:hover": {
                  backgroundColor: ativo ? "#E56A2F" : "#263650",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: "inherit",
                }}
              >
                <Icon size={20} />
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 14,
                      fontWeight: ativo ? 600 : 400,
                    }}
                  >
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
