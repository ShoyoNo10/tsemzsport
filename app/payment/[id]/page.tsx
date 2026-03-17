import PaymentClient from "@/components/PaymentClient";

interface PaymentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { id } = await params;

  return <PaymentClient registrationId={id} />;
}