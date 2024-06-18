import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import api from "../api"; // Import your Axios instance
import { useData } from "../DataContext"; // Import the useData hook

const ClientForm = ({ open, onClose, client, onClientSaved }) => {
  const { clientsData } = useData();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const theme = useTheme();

  useEffect(() => {
    if (client) {
      setName(client.name);
      setPhoneNumber(client.phone_number);
      setEmail(client.email);
    } else {
      setName("");
      setPhoneNumber("");
      setEmail("");
    }
  }, [client]);

  const handleSubmit = async () => {
    try {
      // Check for duplicate phone number and email
      const isDuplicatePhoneNumber = clientsData.some(
        (c) =>
          c.phone_number === phoneNumber && c.id !== (client ? client.id : null)
      );
      const isDuplicateEmail = clientsData.some(
        (c) =>
          c.email === email &&
          c.email !== "" &&
          c.id !== (client ? client.id : null)
      );

      if (isDuplicatePhoneNumber) {
        setError("Phone number already exists.");
        return;
      }

      if (isDuplicateEmail) {
        setError("Email already exists.");
        return;
      }

      const clientData = {
        name,
        phone_number: phoneNumber,
        email,
      };

      if (client) {
        // Update the client
        await api.put(`/clients/${client.id}/`, clientData);
      } else {
        // Create a new client
        await api.post("/clients/", clientData);
      }
      setEmail("");
      setName("");
      setPhoneNumber("");
      onClientSaved(); // Notify parent about the changes
      onClose();
    } catch (error) {
      console.error("Error creating/updating client:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{client ? "Edit Client" : "Create Client"}</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          margin="normal"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          InputProps={{
            style: { color: theme.palette.primary.main },
          }}
          InputLabelProps={{
            style: { color: theme.palette.secondary.main },
          }}
        />
        <TextField
          margin="normal"
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          fullWidth
          InputProps={{
            style: { color: theme.palette.primary.main },
          }}
          InputLabelProps={{
            style: { color: theme.palette.secondary.main },
          }}
        />
        <TextField
          margin="normal"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          InputProps={{
            style: { color: theme.palette.primary.main },
          }}
          InputLabelProps={{
            style: { color: theme.palette.secondary.main },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {client ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientForm;
