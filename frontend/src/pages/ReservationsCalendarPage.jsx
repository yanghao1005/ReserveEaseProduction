import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api"; // Import your Axios instance
import { useData } from "../DataContext"; // Import the useData hook
import FloatingActionButton from "../components/FloatingActionButton"; // Adjust the path as necessary
import ReservationForm from "../components/ReservationForm"; // Import the ReservationForm component
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import Big Calendar styles

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const localizer = momentLocalizer(moment);

const ReservationsCalendarPage = () => {
  const { reservationsData, loading, error, setReservationsData } = useData();
  const [openForm, setOpenForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  useEffect(() => {
    if (!loading && !error) {
      setReservationsData(reservationsData);
    }
  }, [reservationsData, loading, error, setReservationsData]);

  const handleOpenForm = (reservation) => {
    setSelectedReservation(reservation);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedReservation(null);
  };

  const handleReservationSaved = async () => {
    try {
      const response = await api.get("/reservations/"); // Refresh the reservations data
      setReservationsData(response.data);
    } catch (error) {
      console.error("Error refreshing reservations:", error);
    }
  };

  const handleOpenDeleteDialog = (reservation) => {
    setReservationToDelete(reservation);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setReservationToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteReservation = async () => {
    if (reservationToDelete) {
      try {
        await api.delete(`/reservations/${reservationToDelete.id}/`); // Replace with your reservations API endpoint
        handleReservationSaved(); // Refresh the reservations data
        handleCloseDeleteDialog();
      } catch (error) {
        console.error("Error deleting reservation:", error);
      }
    }
  };

  const events = reservationsData.map((reservation) => ({
    id: reservation.id,
    title: `${reservation.client?.name} - ${reservation.guest_count} guests`,
    start: new Date(reservation.reservation_date),
    end: new Date(
      new Date(reservation.reservation_date).getTime() + 2 * 60 * 60 * 1000
    ), // Assuming each reservation is 2 hours
    notes: reservation.notes,
  }));

  const handleSelectEvent = (event) => {
    const reservation = reservationsData.find((r) => r.id === event.id);
    setSelectedReservation(reservation);
    setOpenForm(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading reservations</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PaperStyled>
            <Typography variant="h6" gutterBottom>
              Reservations
            </Typography>
            <div style={{ height: 600 }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                onSelectEvent={handleSelectEvent}
              />
            </div>
          </PaperStyled>
        </Grid>
      </Grid>
      <FloatingActionButton
        formType="reservation"
        onReservationSaved={handleReservationSaved}
      />
      <ReservationForm
        open={openForm}
        onClose={handleCloseForm}
        reservation={selectedReservation}
        onReservationSaved={handleReservationSaved}
      />
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Reservation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this reservation?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteReservation} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReservationsCalendarPage;
