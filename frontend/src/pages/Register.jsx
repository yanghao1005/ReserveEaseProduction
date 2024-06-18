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
import api from "../api"; // Import the Axios instance

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
  backgroundColor: theme.palette.background.paper, // Form background
  color: theme.palette.text.primary, // Text color
}));

const Background = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette.background.default, // Background
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.main, // Button background
  color: theme.palette.primary.contrastText, // Button text color
  "&:hover": {
    backgroundColor: theme.palette.secondary.main, // Button background on hover
    color: theme.palette.secondary.contrastText, // Button text color on hover
  },
}));

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(phoneNumber);
    try {
      await api.post("/users/", {
        email,
        password,
        name,
        phone_number: phoneNumber,
      });
      navigate("/login"); // Redirect to the login page after registration
    } catch (error) {
      setError("Error registering user");
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
            Sign up
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Restaurant Name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              name="phoneNumber"
              label="Phone Number"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              InputLabelProps={{
                style: { color: theme.palette.text.primary },
              }}
              InputProps={{
                style: { color: theme.palette.text.primary },
              }}
            />
            {error && <Typography color="error">{error}</Typography>}
            <StyledButton type="submit" fullWidth variant="contained">
              Sign Up
            </StyledButton>
            <Grid container>
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  sx={{ color: theme.palette.text.primary }}
                >
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Form>
        </PaperStyled>
      </Container>
    </Background>
  );
};

export default Register;
