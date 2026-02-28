import { Badge } from "@/components/ui/badge";

type Verification = "UNVERIFIED" | "VERIFIED";
type Source = "SELF_DECLARED" | "DEALER_ENTERED" | "WORKSHOP_ENTERED" | "THIRD_PARTY";

export function VerificationChip({ value }: { value: Verification }) {
  return (
    <Badge className={value === "VERIFIED" ? "kc-veh-chip kc-veh-chip--verified" : "kc-veh-chip kc-veh-chip--unverified"}>
      {value === "VERIFIED" ? "Verificado" : "Sin verificar"}
    </Badge>
  );
}

export function SourceChip({ value }: { value: Source }) {
  const label =
    value === "SELF_DECLARED"
      ? "Autodeclarado"
      : value === "DEALER_ENTERED"
        ? "Automotora"
        : value === "WORKSHOP_ENTERED"
          ? "Taller"
          : "Tercero";
  return <Badge className="kc-veh-chip kc-veh-chip--source">{label}</Badge>;
}
