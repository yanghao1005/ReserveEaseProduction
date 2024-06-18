import React from "react";
import {
  Typography,
  Button,
  Grid,
  Container,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";
import heroImage from "../image/portfolio.png"; // Asegúrate de ajustar la ruta a la ubicación correcta de tu imagen

const RootContainer = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  padding: 0,
  margin: 0,
}));

const Header = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: "#FFFFFF",
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
  backgroundColor: "#615EFC", // Botón de acción
  color: theme.palette.background.default, // Texto del botón
  "&:hover": {
    backgroundColor: theme.palette.secondary.main, // Botón de acción en hover
    color: theme.palette.background.default, // Texto del botón en hover
  },
}));

const HeroSection = styled("div")(({ theme }) => ({
  position: "relative",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  width: "100%",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${heroImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: 1,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.4))", // Gradiente negro
    zIndex: 2,
  },
}));

const HeroContent = styled("div")(({ theme }) => ({
  position: "relative",
  zIndex: 3,
  color: "#FFFFFF",
  textAlign: "center",
  width: "100%",
  marginBottom: theme.spacing(20), // Aumentamos el espacio inferior para mover los features más abajo
}));

const FeaturesSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(6, 0),
  color: theme.palette.text.primary,
  width: "100%",
  position: "relative",
  zIndex: 3, // Asegura que los features estén sobre el overlay
}));

const FeatureItem = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  backgroundColor: "rgba(255, 255, 255, 0.8)", // Fondo claro semitransparente para buen contraste
  color: theme.palette.text.primary,
  borderRadius: "50%",
  width: "150px",
  height: "150px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto",
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down("sm")]: {
    width: "100px",
    height: "100px",
  },
}));

const ToolbarButton = styled(Button)(({ theme }) => ({
  color: "rgba(255, 255, 255)",
  borderColor: "rgba(255, 255, 255)",
  margin: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.secondary.main, // Fondo claro en hover
  },
}));

const ToolbarContainer = styled("div")({
  marginLeft: "auto",
  display: "flex",
});

const LandingPage = () => {
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
          <HeroContent>
            <Header variant="h2" component="h1">
              Welcome to ReserveEase
            </Header>
            <Typography variant="h5" component="h2" gutterBottom>
              Manage your restaurant reservations with ease.
            </Typography>
            <StyledButton variant="contained" component={Link} to="/login">
              Get Started
            </StyledButton>
          </HeroContent>
          <FeaturesSection>
            <Container>
              <Typography
                variant="h4"
                component="h2"
                align="center"
                gutterBottom
              >
                Our Features
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={4}>
                  <FeatureItem>
                    <Typography variant="h6" component="h3">
                      Feature 1
                    </Typography>
                    <Typography>Description of feature 1.</Typography>
                  </FeatureItem>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FeatureItem>
                    <Typography variant="h6" component="h3">
                      Feature 2
                    </Typography>
                    <Typography>Description of feature 2.</Typography>
                  </FeatureItem>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FeatureItem>
                    <Typography variant="h6" component="h3">
                      Feature 3
                    </Typography>
                    <Typography>Description of feature 3.</Typography>
                  </FeatureItem>
                </Grid>
              </Grid>
            </Container>
          </FeaturesSection>
        </HeroSection>
      </RootContainer>
    </>
  );
};

export default LandingPage;
