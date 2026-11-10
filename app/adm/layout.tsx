
"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "@/componentes/adm/SidebarTemp";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sidebarAberto, setSidebarAberto] = useState(true);

  const largura = sidebarAberto ? 260 : 76;

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Sidebar
        aberto={sidebarAberto}
        onToggle={() => setSidebarAberto((prev) => !prev)}
      />

      <Box
        component="main"
        sx={{
          marginLeft: `${largura}px`,
          width: `calc(100% - ${largura}px)`,
          minHeight: "100vh",
          minWidth: 0,
          transition: "margin-left 0.25s ease, width 0.25s ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
