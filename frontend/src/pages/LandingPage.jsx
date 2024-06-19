import React, { useState } from "react";
import {
  Typography,
  Button,
  Grid,
  Container,
  AppBar,
  Toolbar,
  TextField,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import heroImage from "../image/portfolio.png"; // Ensure the correct path to your image

const RootContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  padding: 0,
  margin: 0,
  height: "100vh",
}));

const Header = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary, // Darker text color
  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(2, 4),
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
    padding: theme.spacing(1, 2),
  },
  backgroundColor: "#615EFC", // Action button color
  color: theme.palette.background.default, // Button text color
  "&:hover": {
    backgroundColor: theme.palette.secondary.main, // Hover button color
    color: theme.palette.background.default, // Hover button text color
  },
  transition: "background-color 0.3s ease", // Add transition
  borderRadius: "25px", // Increased border-radius
}));

const HeroSection = styled("div")(({ theme }) => ({
  flex: "1 0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  textAlign: "left",
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.default, // Improved contrast
  width: "100%",
}));

const HeroContent = styled("div")(({ theme }) => ({
  zIndex: 3,
  color: theme.palette.text.primary, // Darker text color
  textAlign: "left",
  padding: theme.spacing(2),
}));

const HeroImage = styled("img")(({ theme }) => ({
  width: "100%",
  maxWidth: "500px",
  height: "auto",
  margin: "0 auto",
}));

const ToolbarButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  borderColor: theme.palette.secondary.main,
  margin: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.secondary.main, // Light background on hover
    color: "white",
  },
}));

const ToolbarContainer = styled("div")({
  marginLeft: "auto",
  display: "flex",
});

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="fixed" color="transparent" elevation={0}>
        <Toolbar>
          <ToolbarContainer>
            <ToolbarButton variant="outlined" component={Link} to="/login">
              Login
            </ToolbarButton>
            <ToolbarButton variant="outlined" component={Link} to="/register">
              Register
            </ToolbarButton>
          </ToolbarContainer>
        </Toolbar>
      </AppBar>
      <RootContainer>
        <HeroSection>
          <Container>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <HeroContent>
                  <Header variant="h2" component="h1">
                    Welcome to ReserveEase
                  </Header>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Manage your restaurant reservations with ease.
                  </Typography>
                  <StyledButton
                    variant="contained"
                    component={Link}
                    to="/login"
                  >
                    Get Started
                  </StyledButton>
                </HeroContent>
              </Grid>
              <Grid item xs={12} md={6}>
                <HeroImage src={heroImage} alt="Hero" />
              </Grid>
            </Grid>
          </Container>
        </HeroSection>
      </RootContainer>
    </>
  );
};

export default LandingPage;
