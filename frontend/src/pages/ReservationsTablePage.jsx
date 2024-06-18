import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import api from "../api"; // Import your Axios instance
import { useData } from "../DataContext"; // Import the useData hook
import FloatingActionButton from "../components/FloatingActionButton"; // Adjust the path as necessary
import ReservationForm from "../components/ReservationForm"; // Import the ReservationForm component

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const DataGridContainer = styled("div")({
  height: 500, // Set a fixed height for the DataGrid container
  width: "100%",
});

const statusOptions = ["pending", "cancelled", "completed"];

const ReservationsTablePage = () => {
  const { reservationsData, loading, error, setReservationsData } = useData();
  const [openForm, setOpenForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  useEffect(() => {
    setFilteredReservations(reservationsData);
  }, [reservationsData]);

  const handleOpenForm = (reservation) => {
    setSelectedReservation(reservation);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedReservation(null);
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term) {
      const filtered = reservationsData.filter(
        (reservation) =>
          reservation.client?.name
            ?.toLowerCase()
            .includes(term.toLowerCase()) ||
          reservation.reservation_date.includes(term) ||
          reservation.status.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredReservations(filtered);
    } else {
      setFilteredReservations(reservationsData);
    }
  };

  const handleReservationSaved = async () => {
    try {
      const response = await api.get("/reservations/"); // Refresh the reservations data
      setReservationsData(response.data);
      setFilteredReservations(response.data); // Update filtered reservations
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/reservations/${id}/`, { status: newStatus }); // Adjust the endpoint as necessary
      handleReservationSaved(); // Refresh the reservations data
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
  };

  const columns = [
    {
      field: "client",
      headerName: "Client",
      valueGetter: (params) => params.name || "No Client",
      flex: 1,
    },
    {
      field: "reservation_date",
      headerName: "Reservation Date",
      valueGetter: (params) => format(new Date(params), "yyyy-MM-dd HH:mm"),
      flex: 1,
    },
    {
      field: "guest_count",
      headerName: "Guest Count",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Select
          value={params.row.status}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
          fullWidth
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "notes",
      headerName: "Notes",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenForm(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleOpenDeleteDialog(params.row)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

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
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
              margin="normal"
            />
            <DataGridContainer>
              <DataGrid
                rows={filteredReservations}
                columns={columns}
                pageSize={8}
                rowsPerPageOptions={[8]}
                autoHeight
                disableSelectionOnClick
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 8 },
                  },
                }}
              />
            </DataGridContainer>
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

export default ReservationsTablePage;
