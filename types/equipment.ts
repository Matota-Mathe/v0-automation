// Equipment type definitions
export interface PumpType {
  id: string
  name: string
  manufacturer: string
  flowRateMin: number
  flowRateMax: number
  description: string
  imageUrl?: string
}

export interface ReactorType {
  id: string
  name: string
  type: "coil" | "ltf-ms" | "ltf-vs" | "ltf-mv" | "other"
  volume: number
  material: string
  maxTemperature: number
  maxPressure: number
  description: string
  imageUrl?: string
}

// Default pump types
export const defaultPumpTypes: PumpType[] = [
  {
    id: "pump-1",
    name: "Syringe Pump S100",
    manufacturer: "Chemyx",
    flowRateMin: 0.01,
    flowRateMax: 50,
    description: "High-precision syringe pump for low flow rates",
    imageUrl: "/images/syringe-pump.png",
  },
  {
    id: "pump-2",
    name: "HPLC Pump P200",
    manufacturer: "Knauer",
    flowRateMin: 0.1,
    flowRateMax: 100,
    description: "HPLC pump for medium to high flow rates",
    imageUrl: "/images/hplc-pump.png",
  },
  {
    id: "pump-3",
    name: "Peristaltic Pump R300",
    manufacturer: "Cole-Parmer",
    flowRateMin: 0.5,
    flowRateMax: 200,
    description: "Peristaltic pump for high flow rates with viscous liquids",
    imageUrl: "/images/peristaltic-pump.png",
  },
]

// Default reactor types
export const defaultReactorTypes: ReactorType[] = [
  {
    id: "reactor-1",
    name: "Standard Coil Reactor",
    type: "coil",
    volume: 10,
    material: "Stainless Steel",
    maxTemperature: 150,
    maxPressure: 20,
    description: "Standard coil reactor for general applications",
    imageUrl: "/images/coil-reactor.png",
  },
  {
    id: "reactor-2",
    name: "LTF-MS Microreactor",
    type: "ltf-ms",
    volume: 1,
    material: "Glass",
    maxTemperature: 200,
    maxPressure: 10,
    description: "Microstructured reactor for fast mixing and high heat transfer",
    imageUrl: "/images/ltf-ms-reactor.png",
  },
  {
    id: "reactor-3",
    name: "LTF-VS Reactor",
    type: "ltf-vs",
    volume: 5,
    material: "PEEK",
    maxTemperature: 120,
    maxPressure: 15,
    description: "Volumetric static mixer for efficient mixing",
    imageUrl: "/images/ltf-vs-reactor.png",
  },
  {
    id: "reactor-4",
    name: "LTF-MV Reactor",
    type: "ltf-mv",
    volume: 2,
    material: "Hastelloy",
    maxTemperature: 250,
    maxPressure: 25,
    description: "Microchannel reactor for high-pressure applications",
    imageUrl: "/images/ltf-mv-reactor.png",
  },
]
