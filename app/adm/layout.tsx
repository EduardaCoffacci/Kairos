
import { Box } from '@mui/material';
import Sidebar from '@/componentes/adm/SidebarTemp';

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          marginLeft: '260px',
          width: 'calc(100% - 260px)',
          minHeight: '100vh',
          minWidth: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
