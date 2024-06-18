import React, { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { styled, useTheme } from "@mui/system";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import api from "../api"; // Importa la instancia de Axios
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"; // Importa la constante

const AvatarStyled = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
}));

const Form = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.text.primary,
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: theme.palette.background.paper, // Use theme background paper color
  color: theme.palette.text.primary, // Use theme primary text color
}));

const Background = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette.background.default, // Use theme default background color
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.main, // Primary color for button
  color: theme.palette.primary.contrastText, // Contrast text color for button
  "&:hover": {
    backgroundColor: theme.palette.secondary.main, // Secondary color on hover
    color: theme.palette.secondary.contrastText, // Contrast text color on hover
  },
}));

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    try {
      const response = await api.post("/token/", { email, password });
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      navigate("/reservations_of_the_day"); // Redirige al dashboard después de iniciar sesión
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Incorrect username or password.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Background>
      <Container component="main" maxWidth="xs">
        <PaperStyled>
          <AvatarStyled>
            <LockOutlinedIcon />
          </AvatarStyled>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Form
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{
                style: { color: theme.palette.text.primary },
              }}
              InputProps={{
                style: { color: theme.palette.text.primary },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{
                style: { color: theme.palette.text.primary },
              }}
              InputProps={{
                style: { color: theme.palette.text.primary },
              }}
            />
            {error && <Typography color="error">{error}</Typography>}
            <StyledButton type="submit" fullWidth variant="contained">
              Sign In
            </StyledButton>
            <Grid container>
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  sx={{ color: theme.palette.text.primary }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Form>
        </PaperStyled>
      </Container>
    </Background>
  );
};

export default Login;
