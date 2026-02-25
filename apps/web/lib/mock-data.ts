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
        title: "Service oficial",
        date: "12/2024",
        source: "Taller oficial",
        verified: true,
        evidence: true,
        details: "Cambio de aceite, filtros y diagnóstico electrónico."
      },
      {
        id: "ev-2",
        title: "ITV / Inspección",
        date: "08/2024",
        source: "Centro habilitado",
        verified: true,
        evidence: true,
        details: "Inspección aprobada sin observaciones críticas."
      },
      {
        id: "ev-3",
        title: "Transferencia",
        date: "03/2024",
        source: "Registro",
        verified: true,
        evidence: false,
        details: "Cambio de titularidad entre usuarios registrados."
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/Renault_Megane_IV_IMG_2894.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/VW_Gol_1.6_2019_%28cropped%29.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Toyota_Corolla_Hybrid_%28E210%29_IMG_4337.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Nissan_Sentra_SR_2020.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/80/Chevrolet_Onix_LT_2020.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f5/2020_Peugeot_2008_Allure_PureTech_1.2_Front.jpg",
    verified: true,
    hasContact: true,
    entries: 5
  }
];
