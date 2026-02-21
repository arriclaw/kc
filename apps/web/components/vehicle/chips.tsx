import { Badge } from "@/components/ui/badge";

type Verification = "UNVERIFIED" | "VERIFIED";
type Source = "SELF_DECLARED" | "DEALER_ENTERED" | "THIRD_PARTY";

export function VerificationChip({ value }: { value: Verification }) {
  return (
    <Badge
      className={
        value === "VERIFIED"
          ? "border-emerald-300/50 bg-emerald-300/15 text-emerald-100"
          : "border-amber-300/50 bg-amber-300/15 text-amber-100"
      }
    >
      {value === "VERIFIED" ? "Verificado" : "Sin verificar"}
    </Badge>
  );
}

export function SourceChip({ value }: { value: Source }) {
  const label =
    value === "SELF_DECLARED" ? "Autodeclarado" : value === "DEALER_ENTERED" ? "Automotora" : "Tercero";
  return <Badge className="border-cyan-300/45 bg-cyan-300/12 text-cyan-100">{label}</Badge>;
}
