import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { styled } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const Root = styled("div")({
  display: "flex",
});

const Content = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: "64px", // Height of the Topbar
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  [theme.breakpoints.up("md")]: {
    marginLeft: 240, // Width of the Sidebar
  },
}));

function MainLayout() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Root>
      <Topbar onMenuClick={handleMenuClick} />
      <Sidebar
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={isSmallScreen ? sidebarOpen : true}
        onClose={handleSidebarClose}
      />
      <Content>
        <Outlet />
      </Content>
    </Root>
  );
}

export default MainLayout;
