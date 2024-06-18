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
} from "@mui/material";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from "../api"; // Import your Axios instance
import { useData } from "../DataContext"; // Import the useData hook
import FloatingActionButton from "../components/FloatingActionButton"; // Adjust the path as necessary
import ClientForm from "../components/ClientForm"; // Import the ClientForm component
import ReservationCard from "../components/ReservationCard"; // Import the ReservationCard component

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const DataGridContainer = styled("div")({
  height: "auto", // Adjust the height as necessary
  width: "100%",
});

const ClientsPage = () => {
  const { clientsData, reservationsData, loading, error, setClientsData } =
    useData();
  const [openForm, setOpenForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [openReservationsDialog, setOpenReservationsDialog] = useState(false);
  const [clientReservations, setClientReservations] = useState([]);

  useEffect(() => {
    const calculateReservations = () => {
      return clientsData.map((client) => {
        const reservationCount = reservationsData.filter(
          (reservation) => reservation.client.id === client.id
        ).length;
        return { ...client, reservationCount };
      });
    };

    setFilteredClients(calculateReservations());
  }, [clientsData, reservationsData]);

  const handleOpenForm = (client) => {
    setSelectedClient(client);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedClient(null);
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term) {
      const filtered = clientsData
        .map((client) => {
          const reservationCount = reservationsData.filter(
            (reservation) => reservation.client.id === client.id
          ).length;
          return { ...client, reservationCount };
        })
        .filter(
          (client) =>
            client.name.toLowerCase().includes(term.toLowerCase()) ||
            client.phone_number.includes(term) ||
            client.email.toLowerCase().includes(term.toLowerCase())
        );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(
        clientsData.map((client) => {
          const reservationCount = reservationsData.filter(
            (reservation) => reservation.client.id === client.id
          ).length;
          return { ...client, reservationCount };
        })
      );
    }
  };

  const handleClientSaved = async () => {
    try {
      const response = await api.get("/clients/"); // Refresh the clients data
      setClientsData(response.data);
    } catch (error) {
      console.error("Error refreshing clients:", error);
    }
  };

  const handleOpenDeleteDialog = (client) => {
    setClientToDelete(client);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setClientToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteClient = async () => {
    if (clientToDelete) {
      try {
        await api.delete(`/clients/${clientToDelete.id}/`); // Replace with your clients API endpoint
        handleClientSaved(); // Refresh the clients data
        handleCloseDeleteDialog();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleOpenReservationsDialog = (client) => {
    const reservations = reservationsData.filter(
      (reservation) => reservation.client.id === client.id
    );
    setClientReservations(reservations);
    setOpenReservationsDialog(true);
  };

  const handleCloseReservationsDialog = () => {
    setClientReservations([]);
    setOpenReservationsDialog(false);
  };

  const columns = [
    { field: "name", headerName: "Name", width: 150, flex: 1 },
    { field: "phone_number", headerName: "Phone Number", width: 150, flex: 1 },
    { field: "email", headerName: "Email", width: 200, flex: 1 },
    {
      field: "reservationCount",
      headerName: "Number of Reservations",
      width: 200,
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
          <IconButton onClick={() => handleOpenReservationsDialog(params.row)}>
            <VisibilityIcon />
          </IconButton>
        </>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading clients</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PaperStyled>
            <Typography variant="h6" gutterBottom>
              Clients
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
                rows={filteredClients}
                columns={columns}
                pageSize={filteredClients.length}
                rowsPerPageOptions={[filteredClients.length]}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 8 },
                  },
                }}
                autoHeight
                disableSelectionOnClick
              />
            </DataGridContainer>
          </PaperStyled>
        </Grid>
      </Grid>
      <FloatingActionButton
        formType="client"
        onClientSaved={handleClientSaved}
      />
      <ClientForm
        open={openForm}
        onClose={handleCloseForm}
        client={selectedClient}
        onClientSaved={handleClientSaved}
      />
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this client?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteClient} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openReservationsDialog}
        onClose={handleCloseReservationsDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Reservations</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {clientReservations.map((reservation) => (
              <Grid item xs={12} key={reservation.id}>
                <ReservationCard reservation={reservation} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReservationsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClientsPage;
