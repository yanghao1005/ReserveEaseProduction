import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { Bar, Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useData } from "../DataContext"; // Import the useData hook

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflowY: "hidden", // Eliminate vertical scroll
  overflowX: "hidden", // Prevent horizontal scrolling
}));

const DatePickerContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const StatisticsPage = () => {
  const { reservationsData, loading, error } = useData();
  const [monthlyReservations, setMonthlyReservations] = useState([]);
  const [monthlyGuestCounts, setMonthlyGuestCounts] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [yearlyComparisonData, setYearlyComparisonData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [timeRange, setTimeRange] = useState({
    start: dayjs().startOf("month"),
    end: dayjs().endOf("month"),
  });

  useEffect(() => {
    const calculateStatistics = () => {
      const monthlyReservationsData = Array(12).fill(0);
      const monthlyGuestCountsData = Array(12).fill(0);
      const hoursData = Array(24).fill(0);
      const yearlyData = {};
      const clientData = {};

      reservationsData.forEach((reservation) => {
        const date = new Date(reservation.reservation_date);
        const month = date.getMonth();
        const year = date.getFullYear();
        const hour = date.getHours();
        if (year === selectedYear) {
          monthlyReservationsData[month] += 1;
          monthlyGuestCountsData[month] += reservation.guest_count;
        }
        if (
          dayjs(date).isAfter(timeRange.start) &&
          dayjs(date).isBefore(timeRange.end)
        ) {
          hoursData[hour] += 1;
        }

        if (!yearlyData[year]) {
          yearlyData[year] = Array(12).fill(0);
        }
        yearlyData[year][month] += 1;

        const clientId = reservation.client.id;
        if (!clientData[clientId]) {
          clientData[clientId] = 0;
        }
        clientData[clientId] += 1;
      });

      setMonthlyReservations(monthlyReservationsData);
      setMonthlyGuestCounts(monthlyGuestCountsData);
      setPeakHours(hoursData);
      setYearlyComparisonData(yearlyData);
    };

    if (!loading && !error) {
      calculateStatistics();
    }
  }, [reservationsData, selectedYear, timeRange, loading, error]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading reservations</div>;
  }

  const years = Array.from(
    new Set(
      reservationsData.map((reservation) =>
        new Date(reservation.reservation_date).getFullYear()
      )
    )
  );

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleTimeRangeChange = (newValue, key) => {
    setTimeRange((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const monthlyReservationsData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: `Number of Reservations in ${selectedYear}`,
        data: monthlyReservations,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
      {
        label: `Total Guests in ${selectedYear}`,
        data: monthlyGuestCounts,
        backgroundColor: "rgba(153,102,255,0.4)",
        borderColor: "rgba(153,102,255,1)",
        borderWidth: 1,
      },
    ],
  };

  const peakHoursData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Reservations per Hour",
        data: peakHours,
        backgroundColor: "rgba(153,102,255,0.4)",
        borderColor: "rgba(153,102,255,1)",
        borderWidth: 1,
      },
    ],
  };

  const yearlyComparisonDatasets = Object.keys(yearlyComparisonData).map(
    (year, index) => ({
      label: `Reservations in ${year}`,
      data: yearlyComparisonData[year],
      backgroundColor: `rgba(${75 + index * 40}, ${192 - index * 40}, ${
        192 - index * 40
      }, 0.4)`,
      borderColor: `rgba(${75 + index * 40}, ${192 - index * 40}, ${
        192 - index * 40
      }, 1)`,
      borderWidth: 1,
    })
  );

  const yearlyComparisonChartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: yearlyComparisonDatasets,
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        height: "100vh",
        overflow: "hidden", // Eliminate scroll
      }}
    >
      <Grid container spacing={3} sx={{ height: "100%" }}>
        <Grid item xs={12} md={6} sx={{ height: "50%" }}>
          <PaperStyled>
            <Typography variant="h6" gutterBottom>
              Monthly Reservations
            </Typography>
            <TextField
              select
              label="Select Year"
              value={selectedYear}
              onChange={handleYearChange}
              variant="outlined"
              margin="normal"
              fullWidth
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
            <Box sx={{ flexGrow: 1 }}>
              <Bar
                data={monthlyReservationsData}
                options={{ maintainAspectRatio: false }}
              />
            </Box>
          </PaperStyled>
        </Grid>
        <Grid item xs={12} md={6} sx={{ height: "50%" }}>
          <PaperStyled>
            <Typography variant="h6" gutterBottom>
              Peak Hours
            </Typography>
            <DatePickerContainer>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Time"
                  value={timeRange.start}
                  onChange={(newValue) =>
                    handleTimeRangeChange(newValue, "start")
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" margin="normal" />
                  )}
                  views={["year", "month", "day"]}
                />
                <DatePicker
                  label="End Time"
                  value={timeRange.end}
                  onChange={(newValue) =>
                    handleTimeRangeChange(newValue, "end")
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" margin="normal" />
                  )}
                  views={["year", "month", "day"]}
                />
              </LocalizationProvider>
            </DatePickerContainer>
            <Box sx={{ flexGrow: 1 }}>
              <Line
                data={peakHoursData}
                options={{ maintainAspectRatio: false }}
              />
            </Box>
          </PaperStyled>
        </Grid>
        <Grid item xs={12} md={12} sx={{ height: "50%" }}>
          <PaperStyled>
            <Typography variant="h6" gutterBottom>
              Yearly Comparison
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Line
                data={yearlyComparisonChartData}
                options={{ maintainAspectRatio: false }}
              />
            </Box>
          </PaperStyled>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StatisticsPage;
