import { BookingConfirmation } from "@/features/bookings/components/booking-confirmation";

interface BookingConfirmationPageProps {
  params: Promise<{ bookingId: string }>;
}

const BookingConfirmationPage = async ({ params }: BookingConfirmationPageProps) => {
  const { bookingId } = await params;

  return <BookingConfirmation bookingId={bookingId} />;
};

export default BookingConfirmationPage;
