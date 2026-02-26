export type ExampleEvent = {
  id: string;
  title: string;
  date: string;
  source: string;
  verified: boolean;
  evidence: boolean;
  details: string;
};

export type DemoRecord = {
  id: string;
  plate: string;
  vin: string;
  model: string;
  transparency: "Alta" | "Media";
  risk: "Bajo" | "Medio";
  confidence: number;
  events: ExampleEvent[];
};

export type FeaturedVehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  imageUrl: string;
  verified: boolean;
  hasContact: boolean;
  entries: number;
};

export const demoRecords: DemoRecord[] = [
  {
    id: "record-1",
    plate: "SBT2885",
    vin: "8AFZZZ54EKS091245",
    model: "Renault Megane 2014",
    transparency: "Alta",
    risk: "Bajo",
    confidence: 92,
    events: [
      {
        id: "ev-1",
        title: "Service — Particular",
        date: "12/2024",
        source: "Particular",
        verified: true,
        evidence: false,
        details: "Service registrado por titular con continuidad en fecha y kilometraje."
      },
      {
        id: "ev-2",
        title: "Cambio de frenos — Taller García (Con evidencia)",
        date: "08/2024",
        source: "Taller García",
        verified: true,
        evidence: true,
        details: "Trabajo registrado por taller con comprobante adjunto."
      },
      {
        id: "ev-3",
        title: "Ingreso a stock — Automotora",
        date: "03/2024",
        source: "Automotora",
        verified: true,
        evidence: false,
        details: "Ingreso comercial registrado con continuidad del vehículo."
      },
      {
        id: "ev-4",
        title: "Reparación tren delantero",
        date: "11/2023",
        source: "Automotora",
        verified: false,
        evidence: true,
        details: "Sustitución de bujes y alineación completa."
      }
    ]
  },
  {
    id: "record-2",
    plate: "SCD5678",
    vin: "9BWZZZ377VT004781",
    model: "Volkswagen Gol 2015",
    transparency: "Media",
    risk: "Medio",
    confidence: 71,
    events: [
      {
        id: "ev-5",
        title: "Service general",
        date: "10/2024",
        source: "Particular",
        verified: false,
        evidence: true,
        details: "Service declarado por propietario con factura adjunta."
      },
      {
        id: "ev-6",
        title: "ITV",
        date: "02/2024",
        source: "Centro habilitado",
        verified: true,
        evidence: true,
        details: "Aprobación con observación menor resuelta."
      },
      {
        id: "ev-7",
        title: "Transferencia",
        date: "01/2024",
        source: "Registro",
        verified: true,
        evidence: false,
        details: "Transferencia digital entre usuarios verificados."
      }
    ]
  },
  {
    id: "record-3",
    plate: "SAB1234",
    vin: "JTDBR32E330023911",
    model: "Toyota Corolla 2018",
    transparency: "Alta",
    risk: "Bajo",
    confidence: 95,
    events: [
      {
        id: "ev-8",
        title: "Service 80.000 km",
        date: "09/2024",
        source: "Taller oficial",
        verified: true,
        evidence: true,
        details: "Mantenimiento completo con historial digital firmado."
      },
      {
        id: "ev-9",
        title: "Cambio de pastillas",
        date: "05/2024",
        source: "Automotora",
        verified: true,
        evidence: true,
        details: "Reemplazo de pastillas delanteras y traseras."
      },
      {
        id: "ev-10",
        title: "Transferencia",
        date: "03/2024",
        source: "Registro",
        verified: true,
        evidence: false,
        details: "Transferido a titular actual con trazabilidad completa."
      }
    ]
  }
];

export const featuredVehiclesMock: FeaturedVehicle[] = [
  {
    id: "vh-1",
    make: "Renault",
    model: "Megane",
    year: 2014,
    plate: "SBT2885",
    imageUrl: "/images/vehicles/renault-megane.jpg",
    verified: true,
    hasContact: true,
    entries: 7
  },
  {
    id: "vh-2",
    make: "Volkswagen",
    model: "Gol",
    year: 2015,
    plate: "SCD5678",
    imageUrl: "/images/vehicles/volkswagen-gol.jpg",
    verified: false,
    hasContact: true,
    entries: 4
  },
  {
    id: "vh-3",
    make: "Toyota",
    model: "Corolla",
    year: 2018,
    plate: "SAB1234",
    imageUrl: "/images/vehicles/toyota-corolla.jpg",
    verified: true,
    hasContact: false,
    entries: 8
  },
  {
    id: "vh-4",
    make: "Nissan",
    model: "Sentra",
    year: 2019,
    plate: "SFX9081",
    imageUrl: "/images/vehicles/nissan-sentra.jpg",
    verified: true,
    hasContact: true,
    entries: 6
  },
  {
    id: "vh-5",
    make: "Chevrolet",
    model: "Onix",
    year: 2020,
    plate: "SBY4012",
    imageUrl: "/images/vehicles/chevrolet-onix.jpg",
    verified: false,
    hasContact: false,
    entries: 3
  },
  {
    id: "vh-6",
    make: "Peugeot",
    model: "2008",
    year: 2021,
    plate: "SJM1120",
    imageUrl: "/images/vehicles/peugeot-2008.jpg",
    verified: true,
    hasContact: true,
    entries: 5
  }
];
