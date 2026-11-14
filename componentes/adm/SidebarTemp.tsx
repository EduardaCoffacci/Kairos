
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
  Tooltip,
  IconButton,
} from "@mui/material";

import {
  LayoutDashboard,
  Users,
  UserCog,
  Package,
  ClipboardList,
  Factory,
  ClipboardCheck,
  ListChecks,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
} from "lucide-react";

interface SidebarProps {
  aberto: boolean;
  onToggle: () => void;
}

const menuItems = [
  { label: "Dashboard", href: "/adm/dashboard", icon: LayoutDashboard },
  { label: "Clientes", href: "/adm/clientes", icon: Users },
  { label: "Operadores", href: "/adm/operadores", icon: UserCog },
  { label: "Peças", href: "/adm/pecas", icon: Package },
  {
    label: "Ordens de Serviço",
    href: "/adm/ordens-servico",
    icon: ClipboardList,
  },
  { label: "Produção", href: "/adm/producao", icon: Factory },
  {
    label: "Processos de Usinagem",
    href: "/adm/processos-usinagem",
    icon: ListChecks,
  },
  { label: "Inspeções", href: "/adm/inspecoes", icon: ClipboardCheck },
];

export default function Sidebar({
  aberto,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();

  const itensInferiores = [
    {
      label: "Configurações",
      href: "/adm/configuracoes",
      icon: Settings,
    },
  ];

  return (
    <Box
      component="aside"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: aberto ? "260px" : "76px",
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        backgroundColor: "#17233B",
        color: "#fff",
        zIndex: 1200,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
      }}
    >
      {/* Cabeçalho */}
      <Box
        sx={{
          px: aberto ? 3 : 2,
          py: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: aberto ? "space-between" : "center",
          minHeight: 88,
        }}
      >
        {aberto && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              KAIROS
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#AAB4C5", mt: 0.5 }}
            >
              Painel administrativo
            </Typography>
          </Box>
        )}

        <Tooltip
          title={aberto ? "Recolher menu" : "Expandir menu"}
          placement="right"
        >
          <IconButton
            onClick={onToggle}
            sx={{
              color: "#fff",
              "&:hover": {
                backgroundColor: "#263650",
              },
            }}
          >
            {aberto ? (
              <ChevronLeft size={22} />
            ) : (
              <Menu size={22} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Menu principal */}
      <List
        sx={{
          px: aberto ? 2 : 1,
          py: 0,
          flexGrow: 1,
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;

          const ativo =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Tooltip
              key={item.href}
              title={!aberto ? item.label : ""}
              placement="right"
            >
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{
                  mb: 1,
                  minHeight: 48,
                  borderRadius: 2,
                  justifyContent: aberto ? "initial" : "center",
                  px: aberto ? 2 : 0,
                  color: ativo ? "#fff" : "#C5CDDA",
                  backgroundColor: ativo ? "#E56A2F" : "transparent",
                  "&:hover": {
                    backgroundColor: ativo ? "#E56A2F" : "#263650",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: aberto ? 40 : 0,
                    justifyContent: "center",
                    color: "inherit",
                  }}
                >
                  <Icon size={20} />
                </ListItemIcon>

                {aberto && (
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: 14,
                          fontWeight: ativo ? 600 : 400,
                        },
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      {/* Menu inferior */}
      <Box
        sx={{
          px: aberto ? 2 : 1,
          pb: 2,
          pt: 2,
          borderTop: "1px solid #344158",
        }}
      >
        {itensInferiores.map((item) => {
          const Icon = item.icon;
          const ativo =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Tooltip
              key={item.href}
              title={!aberto ? item.label : ""}
              placement="right"
            >
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{
                  minHeight: 48,
                  mb: 1,
                  borderRadius: 2,
                  justifyContent: aberto ? "initial" : "center",
                  px: aberto ? 2 : 0,
                  color: ativo ? "#fff" : "#C5CDDA",
                  backgroundColor: ativo ? "#E56A2F" : "transparent",
                  "&:hover": {
                    backgroundColor: "#263650",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: aberto ? 40 : 0,
                    justifyContent: "center",
                    color: "inherit",
                  }}
                >
                  <Icon size={20} />
                </ListItemIcon>

                {aberto && (
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: { fontSize: 14 },
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}

        {/* Sair */}
        <Tooltip
          title={!aberto ? "Sair" : ""}
          placement="right"
        >
          <ListItemButton
            onClick={() => {}}
            sx={{
              minHeight: 48,
              borderRadius: 2,
              justifyContent: aberto ? "initial" : "center",
              px: aberto ? 2 : 0,
              color: "#F08A8A",
              "&:hover": {
                backgroundColor: "#263650",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: aberto ? 40 : 0,
                justifyContent: "center",
                color: "inherit",
              }}
            >
              <LogOut size={20} />
            </ListItemIcon>

            {aberto && (
              <ListItemText
                primary="Sair"
                slotProps={{
                  primary: {
                    sx: { fontSize: 14 },
                  },
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
