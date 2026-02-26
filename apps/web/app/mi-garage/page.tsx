import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function MiGaragePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/acceso");

  if (session.user.role === Role.DEALER) redirect("/dealer");
  if (session.user.role === Role.WORKSHOP) redirect("/taller");
  if (session.user.role === Role.ADMIN) redirect("/admin");
  redirect("/particular");
}
