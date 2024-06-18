import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Autocomplete,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import api from "../api"; // Import your Axios instance
import { useData } from "../DataContext"; // Adjust the path as necessary
import AddIcon from "@mui/icons-material/Add";
import ClientForm from "./ClientForm"; // Import ClientForm

const ReservationForm = ({
  open,
  onClose,
  reservation,
  onReservationSaved,
}) => {
  const { clientsData, setClientsData } = useData();
  const [clientName, setClientName] = useState("");
  const [clientPhoneNumber, setClientPhoneNumber] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [clientId, setClientId] = useState(null);
  const [openClientForm, setOpenClientForm] = useState(false); // New state for ClientForm
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation dialog

  const theme = useTheme();

  useEffect(() => {
    if (reservation) {
      setClientName(reservation.client.name);
      setClientPhoneNumber(reservation.client.phone_number);
      setClientEmail(reservation.client.email);
      const localDate = new Date(reservation.reservation_date);
      localDate.setMinutes(
        localDate.getMinutes() - localDate.getTimezoneOffset()
      );
      setReservationDate(localDate.toISOString().slice(0, 16));
      setGuestCount(reservation.guest_count);
      setStatus(reservation.status);
      setNotes(reservation.notes);
      setClientId(reservation.client.id);
    } else {
      resetReservationForm();
    }
  }, [reservation]);

  function resetReservationForm() {
    setClientName("");
    setClientPhoneNumber("");
    setClientEmail("");
    setReservationDate("");
    setGuestCount("");
    setStatus("");
    setNotes("");
    setClientId(null);
  }

  const handleSubmit = async () => {
    try {
      const reservationData = {
        client_id: clientId,
        reservation_date: reservationDate,
        guest_count: guestCount,
        status,
        notes,
      };

      if (reservation) {
        // Update the reservation
        await api.put(`/reservations/${reservation.id}/`, reservationData);
      } else {
        // Create a new reservation
        await api.post("/reservations/", reservationData);
      }

      resetReservationForm();

      onReservationSaved();
      onClose();
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };

  const handleDelete = async () => {
    if (reservation) {
      try {
        await api.delete(`/reservations/${reservation.id}/`);
        resetReservationForm();
        onReservationSaved();
        onClose();
      } catch (error) {
        console.error("Error deleting reservation:", error);
      }
    }
    setOpenDeleteDialog(false);
  };

  const handleClientSelect = (client) => {
    if (client) {
      setClientName(client.label);
      setClientPhoneNumber(client.phone_number);
      setClientEmail(client.email);
      setClientId(client.id);
    } else {
      setClientName("");
      setClientPhoneNumber("");
      setClientEmail("");
      setClientId(null);
    }
  };

  const clientOptions = clientsData.map((client) => ({
    id: client.id,
    label: client.name,
    phone_number: client.phone_number,
    email: client.email,
  }));

  const handleClientSaved = async () => {
    try {
      const response = await api.get("/clients/"); // Refresh the clients data
      setClientsData(response.data);
    } catch (error) {
      console.error("Error refreshing clients:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {reservation ? "Edit Reservation" : "Create Reservation"}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenClientForm(true)}
            startIcon={<AddIcon />}
          >
            Create Client
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Autocomplete
            options={clientOptions}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                {option.label} ({option.phone_number})
              </Box>
            )}
            value={
              clientOptions.find((option) => option.id === clientId) || null
            }
            onChange={(event, newValue) => handleClientSelect(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                label="Client Name"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  style: { color: theme.palette.primary.main }, // Change text color
                }}
                InputLabelProps={{
                  style: { color: theme.palette.secondary.main }, // Change label color
                }}
              />
            )}
          />
        </Box>
        <Box mb={2}>
          <Autocomplete
            options={clientOptions}
            getOptionLabel={(option) => option.phone_number}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                {option.phone_number} ({option.label})
              </Box>
            )}
            value={
              clientOptions.find((option) => option.id === clientId) || null
            }
            onChange={(event, newValue) => handleClientSelect(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                label="Client Phone Number"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  style: { color: theme.palette.primary.main }, // Change text color
                }}
                InputLabelProps={{
                  style: { color: theme.palette.secondary.main }, // Change label color
                }}
              />
            )}
          />
        </Box>
        <Box mb={2}>
          <Autocomplete
            options={clientOptions}
            getOptionLabel={(option) => option.email}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                {option.email} ({option.label})
              </Box>
            )}
            value={
              clientOptions.find((option) => option.id === clientId) || null
            }
            onChange={(event, newValue) => handleClientSelect(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                label="Client Email"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  style: { color: theme.palette.primary.main }, // Change text color
                }}
                InputLabelProps={{
                  style: { color: theme.palette.secondary.main }, // Change label color
                }}
              />
            )}
          />
        </Box>
        <TextField
          margin="normal"
          label="Reservation Date"
          type="datetime-local"
          value={reservationDate}
          onChange={(e) => setReservationDate(e.target.value)}
          fullWidth
          InputLabelProps={{
            shrink: true,
            style: { color: theme.palette.secondary.main }, // Change label color
          }}
          InputProps={{
            style: { color: theme.palette.primary.main }, // Change text color
          }}
        />
        <TextField
          margin="normal"
          label="Guest Count"
          type="number"
          value={guestCount}
          onChange={(e) => setGuestCount(e.target.value)}
          fullWidth
          InputProps={{
            style: { color: theme.palette.primary.main }, // Change text color
          }}
          InputLabelProps={{
            style: { color: theme.palette.secondary.main }, // Change label color
          }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel style={{ color: theme.palette.secondary.main }}>
            Status
          </InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Status"
            style={{ color: theme.palette.primary.main }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          label="Notes"
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          InputProps={{
            style: { color: theme.palette.primary.main }, // Change text color
          }}
          InputLabelProps={{
            style: { color: theme.palette.secondary.main }, // Change label color
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        {reservation && (
          <Button onClick={() => setOpenDeleteDialog(true)} color="error">
            Delete
          </Button>
        )}
        <Button onClick={handleSubmit} color="primary">
          {reservation ? "Save" : "Create"}
        </Button>
      </DialogActions>
      <ClientForm
        open={openClientForm}
        onClose={() => setOpenClientForm(false)}
        onClientSaved={handleClientSaved}
      />
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this reservation?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ReservationForm;
