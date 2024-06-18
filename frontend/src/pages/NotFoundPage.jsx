import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
  textAlign: "center",
}));

const StyledIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: "8rem",
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const NotFoundPage = () => {
  return (
    <StyledContainer>
      <StyledIcon />
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        It might have been moved or deleted.
      </Typography>
      <StyledButton variant="contained" color="primary" component={Link} to="/">
        Go to Home
      </StyledButton>
    </StyledContainer>
  );
};

export default NotFoundPage;
