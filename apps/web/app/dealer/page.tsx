import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import DealerScreen from "@/components/screens/dealer-screen";

export default async function DealerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/acceso");
  if (session.user.role !== Role.DEALER && session.user.role !== Role.ADMIN) redirect("/mi-garage");

  return <DealerScreen />;
}
