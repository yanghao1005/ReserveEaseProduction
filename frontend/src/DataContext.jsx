import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./api"; // Import your Axios instance

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [reservationsData, setReservationsData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservationsResponse, clientsResponse] = await Promise.all([
          api.get("/reservations/"), // Replace with your reservations API endpoint
          api.get("/clients/"), // Replace with your clients API endpoint
        ]);
        setReservationsData(reservationsResponse.data || []);
        setClientsData(clientsResponse.data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        reservationsData,
        clientsData,
        loading,
        error,
        setClientsData,
        setReservationsData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
