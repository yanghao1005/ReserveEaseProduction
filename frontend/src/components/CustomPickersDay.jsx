import React from "react";
import { Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { PickersDay } from "@mui/x-date-pickers";

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "isReserved" && prop !== "isToday" && prop !== "reservationsCount",
})(({ theme, isReserved, isToday }) => ({
  ...(isReserved && {
    border: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.action.hover,
  }),
  ...(isToday && {
    border: `2px solid ${theme.palette.secondary.main}`,
  }),
}));

const TooltipWrapper = ({ children, title }) => (
  <Tooltip title={<Typography variant="body2">{title}</Typography>}>
    <div>{children}</div>
  </Tooltip>
);

const CustomDay = (props) => {
  const { day, outsideCurrentMonth, reservationsCount, ...other } = props;
  const isReserved = reservationsCount > 0;
  const isToday = dayjs().isSame(day, "day");
  const tooltipTitle =
    reservationsCount > 0 ? `${reservationsCount} Reservations` : "";

  return (
    <TooltipWrapper title={tooltipTitle}>
      <CustomPickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        isReserved={isReserved}
        isToday={isToday}
        reservationsCount={reservationsCount}
      />
    </TooltipWrapper>
  );
};

export { CustomDay, CustomPickersDay };
