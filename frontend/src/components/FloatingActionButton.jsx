import React, { useState } from "react";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReservationForm from "../components/ReservationForm"; // Asegúrate de que la ruta es correcta
import ClientForm from "../components/ClientForm"; // Asegúrate de que la ruta es correcta
import { styled } from "@mui/system";

const FloatingButton = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

const FloatingActionButton = ({
  formType,
  onClientSaved,
  onReservationSaved,
}) => {
  const [openForm, setOpenForm] = useState(false);

  const renderForm = () => {
    switch (formType) {
      case "reservation":
        return (
          <ReservationForm
            open={openForm}
            onClose={() => setOpenForm(false)}
            onReservationSaved={onReservationSaved}
          />
        );
      case "client":
        return (
          <ClientForm
            open={openForm}
            onClose={() => setOpenForm(false)}
            onClientSaved={onClientSaved}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <FloatingButton
        color="primary"
        aria-label="add"
        onClick={() => setOpenForm(true)}
      >
        <AddIcon />
      </FloatingButton>
      {renderForm()}
    </>
  );
};

export default FloatingActionButton;
