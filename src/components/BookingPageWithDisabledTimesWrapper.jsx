import React from "react";
import { useParams } from "react-router-dom";
import BookingPageWithDisabledTimes from "./BookingPageWithDisabledTimes";

function BookingPageWithDisabledTimesWrapper() {
  const { tutorId } = useParams();
  return <BookingPageWithDisabledTimes tutorId={tutorId} />;
}

export default BookingPageWithDisabledTimesWrapper;