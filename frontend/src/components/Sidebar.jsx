import React from "react";
import { Link, useLocation } from "react-router-dom";
import { List, ListItem, ListItemText, Drawer, Box } from "@mui/material";
import { styled } from "@mui/system";

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 240,
  paddingTop: theme.spacing(2),
  overflowX: "hidden", // Prevent horizontal scrolling
  position: "absolute",
  top: 64, // Height of the Topbar
  height: "calc(100% - 64px)", // Full height minus the Topbar height
}));

const ActiveLink = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const InactiveLink = styled(ListItem)(({ theme }) => ({
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.text.secondary,
  },
}));

const LinkWrapper = styled(Link)({
  textDecoration: "none",
  color: "inherit",
});

function Sidebar({ variant, open, onClose }) {
  const location = useLocation();

  const sidebarContent = (
    <SidebarContainer>
      <List>
        <LinkWrapper to="/reservations_of_the_day">
          {location.pathname === "/reservations_of_the_day" ? (
            <ActiveLink button>
              <ListItemText primary="Reservations of the Day" />
            </ActiveLink>
          ) : (
            <InactiveLink button>
              <ListItemText primary="Reservations of the Day" />
            </InactiveLink>
          )}
        </LinkWrapper>
        <LinkWrapper to="/reservations/calendar">
          {location.pathname === "/reservations/calendar" ? (
            <ActiveLink button>
              <ListItemText primary="Calendar" />
            </ActiveLink>
          ) : (
            <InactiveLink button>
              <ListItemText primary="Calendar" />
            </InactiveLink>
          )}
        </LinkWrapper>
        <LinkWrapper to="/reservations/table">
          {location.pathname === "/reservations/table" ? (
            <ActiveLink button>
              <ListItemText primary="Reservation Table" />
            </ActiveLink>
          ) : (
            <InactiveLink button>
              <ListItemText primary="Reservation Table" />
            </InactiveLink>
          )}
        </LinkWrapper>
        <LinkWrapper to="/clients">
          {location.pathname === "/clients" ? (
            <ActiveLink button>
              <ListItemText primary="Clients" />
            </ActiveLink>
          ) : (
            <InactiveLink button>
              <ListItemText primary="Clients" />
            </InactiveLink>
          )}
        </LinkWrapper>
        <LinkWrapper to="/statistics">
          {location.pathname === "/statistics" ? (
            <ActiveLink button>
              <ListItemText primary="Statistics" />
            </ActiveLink>
          ) : (
            <InactiveLink button>
              <ListItemText primary="Statistics" />
            </InactiveLink>
          )}
        </LinkWrapper>
        <LinkWrapper to="/account">
          {location.pathname === "/account" ? (
            <ActiveLink button>
              <ListItemText primary="Account" />
            </ActiveLink>
          ) : (
            <InactiveLink button>
              <ListItemText primary="Account" />
            </InactiveLink>
          )}
        </LinkWrapper>
      </List>
    </SidebarContainer>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }} // Better open performance on mobile.
      sx={{
        display: {
          xs: "block",
          sm: "block",
          md: variant === "permanent" ? "block" : "none",
        },
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          overflowX: "hidden", // Prevent horizontal scrolling
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
}

export default Sidebar;
