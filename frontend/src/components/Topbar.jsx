import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  "&:hover": {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const DrawerStyled = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 240,
    boxSizing: "border-box",
    top: 64, // Ajusta la posició del Drawer per sota del Topbar
    zIndex: theme.zIndex.drawer - 1, // Assegura que estigui per sota del topbar
  },
}));

const SidebarList = styled(List)(({ theme }) => ({
  paddingTop: 0, // Elimina el padding superior
}));

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    // Clear local storage i redirigeix a la pàgina de login
    localStorage.clear();
    navigate("/login");
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/statistics":
        return "Statistics";
      case "/reservations_of_the_day":
        return "Reservations of the Day";
      case "/reservations/calendar":
        return "Calendar";
      case "/reservations/table":
        return "Reservation Table";
      case "/clients":
        return "Clients";
      case "/account":
        return "Account";
      default:
        return "";
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleDrawerClose();
  };

  return (
    <>
      <AppBarStyled position="fixed">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            {getPageTitle() && `${getPageTitle()}`}
          </Typography>
          <LogoutButton color="inherit" onClick={handleLogout}>
            Logout
          </LogoutButton>
        </Toolbar>
      </AppBarStyled>
      <DrawerStyled
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Millora el rendiment de l'obertura en mòbils.
        }}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        <SidebarList>
          <ListItem button onClick={() => handleNavigation("/dashboard")}>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleNavigation("/reservations_of_the_day")}
          >
            <ListItemText primary="Reservations of the Day" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleNavigation("/reservations/calendar")}
          >
            <ListItemText primary="Calendar" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleNavigation("/reservations/table")}
          >
            <ListItemText primary="Reservation Table" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/clients")}>
            <ListItemText primary="Clients" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/account")}>
            <ListItemText primary="Account" />
          </ListItem>
        </SidebarList>
      </DrawerStyled>
    </>
  );
}

export default Topbar;
