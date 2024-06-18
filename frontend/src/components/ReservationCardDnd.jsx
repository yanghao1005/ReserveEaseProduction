import React from "react";
import { useDrag } from "react-dnd";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import PhoneIcon from "@mui/icons-material/Phone";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.secondary.main,
  color: "white",
}));

const InfoItem = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  "& svg": {
    marginRight: theme.spacing(1),
  },
}));

const ItemType = "RESERVATION";

const ReservationCardDnd = ({ reservation, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: reservation.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const timeString = new Date(reservation.reservation_date).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <Card
      ref={drag}
      style={{
        marginBottom: 16,
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
      }}
      onClick={onClick}
    >
      <CardContentStyled>
        <Typography variant="h5" component="div" sx={{ flex: 1 }}>
          {reservation.client?.name}
        </Typography>
        <Box sx={{ flex: 1 }}>
          <InfoItem>
            <PhoneIcon />
            <Typography variant="body1">
              {reservation.client?.phone_number}
            </Typography>
          </InfoItem>

          <InfoItem>
            <GroupIcon />
            <Typography variant="body1">{reservation.guest_count}</Typography>
          </InfoItem>

          <InfoItem>
            <AccessTimeIcon />
            <Typography variant="body1">{timeString}</Typography>
          </InfoItem>
        </Box>
      </CardContentStyled>
    </Card>
  );
};

export default ReservationCardDnd;
