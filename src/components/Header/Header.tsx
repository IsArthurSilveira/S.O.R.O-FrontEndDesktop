import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { User as LucideUser, LogOut } from 'lucide-react';
import ProfilePlaceholder from '../../assets/Profile.svg';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    navigate('/logout');
  };

  const getUserNameInitial = (name: string | undefined | null) => {
    if (!name) return <LucideUser size={24} />;
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-card border-b border-border shadow-sm sticky top-0 z-10">
      {/* Título - Pode ser o nome da página atual se houver necessidade */}
      <h1 className="text-xl font-semibold text-foreground">S.O.R.O. Desktop</h1>

      {/* Perfil do Usuário */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          {user?.nome || 'Usuário S.O.R.O.'}
        </span>
        <IconButton
          onClick={handleMenuOpen}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          className="p-1"
        >
          <Avatar
            alt={user?.nome || 'User'}
            src={user?.avatarUrl || ProfilePlaceholder}
            className="w-10 h-10 bg-primary/20 text-primary"
          >
            {getUserNameInitial(user?.nome)}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            className: 'mt-1 w-56 p-0 shadow-lg border border-border bg-card',
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <div className="px-4 py-2 text-sm font-medium text-foreground border-b border-border">
             {user?.email}
          </div>
          <MenuItem 
            onClick={handleLogout} 
            className="flex items-center px-4 py-2 hover:bg-accent text-foreground"
          >
            <LogOut className="mr-2 h-4 w-4 text-destructive" />
            Sair
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;