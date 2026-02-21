import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import AdminScreen from "@/components/screens/admin-screen";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/acceso");
  if (session.user.role !== Role.ADMIN) redirect("/mi-garage");

  return <AdminScreen />;
}
