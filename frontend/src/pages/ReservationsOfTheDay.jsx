import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Box,
  Card,
  CardContent,
  AppBar,
  Toolbar,
} from "@mui/material";
import { styled, ThemeProvider } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, PickersDay } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import api from "../api"; // Import your Axios instance
import { useData } from "../DataContext"; // Import the useData hook
import FloatingActionButton from "../components/FloatingActionButton"; // Import the FloatingActionButton component
import ReservationForm from "../components/ReservationForm"; // Import the ReservationForm component
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../theme"; // Import the theme
import ReservationCardDnd from "../components/ReservationCardDnd"; // Import the DnD ReservationCard component

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflowY: "hidden", // Eliminate scroll
  maxHeight: "calc(100vh - 64px - 32px)", // Adjust height to fit within the window minus the topbar and some padding
  overflowX: "hidden", // Prevent horizontal scrolling
}));

const FloatingCancel = styled(IconButton)(({ theme }) => ({
  position: "fixed",
  bottom: 80,
  right: 16,
  width: 56,
  height: 56,
  backgroundColor: "white",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "black",
  cursor: "pointer",
  zIndex: 1300,
  boxShadow: theme.shadows[4],
}));

const ItemType = "RESERVATION";

const Column = ({ status, reservations, moveReservation, openEditDialog }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item) => moveReservation(item.id, status),
  });

  // Sort reservations by time
  const sortedReservations = reservations.sort((a, b) => {
    return new Date(a.reservation_date) - new Date(b.reservation_date);
  });

  return (
    <PaperStyled ref={drop}>
      <Typography variant="h6" gutterBottom>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Typography>
      {sortedReservations.map((reservation, index) => (
        <ReservationCardDnd
          key={reservation.id}
          reservation={reservation}
          index={index}
          moveReservation={moveReservation}
          onClick={() => openEditDialog(reservation)}
        />
      ))}
    </PaperStyled>
  );
};

const CancelledColumn = ({
  status,
  reservations,
  moveReservation,
  openEditDialog,
}) => {
  const [showCancelled, setShowCancelled] = useState(false);

  const handleToggleCancelled = () => {
    setShowCancelled((prev) => !prev);
  };

  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item) => moveReservation(item.id, status),
  });

  return (
    <FloatingCancel ref={drop} onClick={handleToggleCancelled}>
      <CloseIcon />
      {showCancelled && (
        <PaperStyled
          sx={{
            position: "absolute",
            top: -320,
            right: 0,
            width: 240,
            height: 300,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Cancelled
          </Typography>
          {reservations.map((reservation, index) => (
            <ReservationCardDnd
              key={reservation.id}
              reservation={reservation}
              index={index}
              moveReservation={moveReservation}
              onClick={() => openEditDialog(reservation)}
            />
          ))}
        </PaperStyled>
      )}
    </FloatingCancel>
  );
};

// Custom styled PickersDay
const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isReserved" && prop !== "isToday",
})(({ theme, isReserved, isToday }) => ({
  ...(isReserved && {
    border: `2px solid ${theme.palette.primary.main}`,
  }),
  ...(isToday && {
    border: `2px solid ${theme.palette.secondary.main}`,
  }),
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const ReservationsOfTheDay = () => {
  const { reservationsData, loading, error, setReservationsData } = useData();
  const [columns, setColumns] = useState({
    pending: [],
    completed: [],
    cancelled: [],
  });
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [open, setOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [totalGuests, setTotalGuests] = useState(0);
  const [reservedDays, setReservedDays] = useState([]);

  useEffect(() => {
    const startOfDay = currentDate.startOf("day").toDate();
    const endOfDay = currentDate.endOf("day").toDate();

    const pending = [];
    const cancelled = [];
    const completed = [];
    let guests = 0;
    const daysWithReservations = new Set();

    reservationsData.forEach((reservation) => {
      const reservationDate = new Date(reservation.reservation_date);
      if (reservationDate >= startOfDay && reservationDate <= endOfDay) {
        if (reservation.status === "pending") {
          pending.push(reservation);
        } else if (reservation.status === "cancelled") {
          cancelled.push(reservation);
        } else if (reservation.status === "completed") {
          completed.push(reservation);
        }
        guests += reservation.guest_count;
      }
      daysWithReservations.add(
        dayjs(reservationDate).startOf("day").format("YYYY-MM-DD")
      );
    });

    setColumns({
      pending,
      cancelled,
      completed,
    });

    setTotalGuests(guests);
    setReservedDays(Array.from(daysWithReservations));
  }, [reservationsData, currentDate]);

  const moveReservation = (id, newStatus) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      let reservation;
      Object.keys(newColumns).forEach((status) => {
        const index = newColumns[status].findIndex((item) => item.id === id);
        if (index !== -1) {
          [reservation] = newColumns[status].splice(index, 1);
        }
      });
      reservation.status = newStatus;
      newColumns[newStatus].push(reservation);
      return newColumns;
    });

    // Update reservation status in the backend
    api
      .patch(`/reservations/${id}/`, { status: newStatus })
      .then(() => {
        setReservationsData((prevData) =>
          prevData.map((reservation) =>
            reservation.id === id
              ? { ...reservation, status: newStatus }
              : reservation
          )
        );
      })
      .catch((error) => {
        console.error("Error updating reservation status:", error);
      });
  };

  const openEditDialog = (reservation) => {
    setSelectedReservation(reservation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReservation(null);
  };

  const handleReservationSaved = () => {
    setOpen(false);
    setSelectedReservation(null);
    // Refresh the reservations data
    api
      .get("/reservations/")
      .then((response) => {
        setReservationsData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
      });
  };

  const handlePreviousDay = () => {
    setCurrentDate(currentDate.subtract(1, "day"));
  };

  const handleNextDay = () => {
    setCurrentDate(currentDate.add(1, "day"));
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  const formattedDate = currentDate.format("YYYY-MM-DD");

  const CustomDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const isReserved = reservedDays.includes(day.format("YYYY-MM-DD"));
    const isToday = dayjs().isSame(day, "day");

    return (
      <CustomPickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        isReserved={isReserved}
        isToday={isToday}
      />
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading reservations</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "white",
            borderBottom: "1px solid black",
            top: 64, // Adjust to fit just below the main topbar
            left: { xs: 0, md: 240 }, // Adjust to fit just beside the sidebar on larger screens
            width: { xs: "100%", md: "calc(100% - 240px)" }, // Adjust to take full width minus the sidebar on larger screens
            zIndex: (theme) => theme.zIndex.drawer - 1, // Ensure it stays below the topbar
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
            <Box
              display="flex"
              alignItems="center"
              sx={{ width: "100%", flexWrap: "wrap" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flex: "1 1 auto",
                  justifyContent: "flex-start",
                  flexWrap: "nowrap",
                  mb: { xs: 1, md: 0 },
                }}
              >
                <Card
                  sx={{
                    flex: { xs: "1 1 45%", md: "0 1 auto" },
                    mr: { xs: 1, md: 2 }, // Add space between cards
                    mb: { xs: 1, md: 0 },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                    >
                      Total Reservations
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}
                    >
                      {columns.pending.length +
                        columns.cancelled.length +
                        columns.completed.length}
                    </Typography>
                  </CardContent>
                </Card>
                <Card
                  sx={{
                    flex: { xs: "1 1 45%", md: "0 1 auto" },
                    mr: { xs: 1, md: 2 }, // Add space between cards
                    mb: { xs: 1, md: 0 },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                    >
                      Total Guests
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}
                    >
                      {totalGuests}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                  flex: "1 1 auto",
                  flexWrap: "nowrap",
                }}
              >
                <IconButton
                  onClick={handlePreviousDay}
                  sx={{ mr: 1, mb: { xs: 1, md: 0 } }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={currentDate}
                    onChange={(newValue) => setCurrentDate(newValue)}
                    slots={{ day: CustomDay }}
                    slotProps={{
                      day: { reservedDays },
                      textField: {
                        sx: {
                          mr: 1,
                          mb: { xs: 2, md: 0 }, // Add margin bottom for small screens
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
                <IconButton
                  onClick={handleNextDay}
                  sx={{ ml: 1, mb: { xs: 1, md: 0 } }}
                >
                  <ArrowForwardIcon />
                </IconButton>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleToday}
                  sx={{ mb: { xs: 1, md: 0 } }}
                >
                  Today
                </Button>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Container
          maxWidth="lg"
          sx={{
            mt: { xs: "144px", md: "128px" }, // Adjust top margin to ensure it starts below both topbars
            mb: 4,
            ml: { xs: 0, md: "240px" }, // Adjust to fit beside the sidebar on larger screens
            overflowX: "hidden",
            overflowY: "hidden",
          }}
        >
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Column
                status="pending"
                reservations={columns.pending}
                moveReservation={moveReservation}
                openEditDialog={openEditDialog}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Column
                status="completed"
                reservations={columns.completed}
                moveReservation={moveReservation}
                openEditDialog={openEditDialog}
              />
            </Grid>
          </Grid>
          <CancelledColumn
            status="cancelled"
            reservations={columns.cancelled}
            moveReservation={moveReservation}
            openEditDialog={openEditDialog}
          />
        </Container>

        <ReservationForm
          open={open}
          onClose={handleClose}
          reservation={selectedReservation}
          onReservationSaved={handleReservationSaved}
        />

        <FloatingActionButton
          formType="reservation"
          onReservationSaved={handleReservationSaved}
        />
      </DndProvider>
    </ThemeProvider>
  );
};

export default ReservationsOfTheDay;
