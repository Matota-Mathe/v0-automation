export interface Chemical {
  id: string
  name: string
  casNumber: string
  bottleSize: string
  remaining: number // percentage
  sdsLink: string
  notes: string
}

export const defaultChemicals: Chemical[] = [
  {
    id: "chem-1",
    name: "Acetonitrile",
    casNumber: "75-05-8",
    bottleSize: "1L",
    remaining: 75,
    sdsLink: "https://www.sigmaaldrich.com/US/en/sds/sial/271004",
    notes: "HPLC Grade",
  },
  {
    id: "chem-2",
    name: "Methanol",
    casNumber: "67-56-1",
    bottleSize: "4L",
    remaining: 50,
    sdsLink: "https://www.sigmaaldrich.com/US/en/sds/sial/34860",
    notes: "ACS Grade",
  },
  {
    id: "chem-3",
    name: "Tetrahydrofuran",
    casNumber: "109-99-9",
    bottleSize: "500mL",
    remaining: 15,
    sdsLink: "https://www.sigmaaldrich.com/US/en/sds/sial/186562",
    notes: "Anhydrous, inhibitor-free",
  },
  {
    id: "chem-4",
    name: "Dichloromethane",
    casNumber: "75-09-2",
    bottleSize: "2L",
    remaining: 90,
    sdsLink: "https://www.sigmaaldrich.com/US/en/sds/sial/270997",
    notes: "ACS Grade",
  },
  {
    id: "chem-5",
    name: "Toluene",
    casNumber: "108-88-3",
    bottleSize: "1L",
    remaining: 10,
    sdsLink: "https://www.sigmaaldrich.com/US/en/sds/sial/244511",
    notes: "Anhydrous, 99.8%",
  },
  {
    id: "chem-6",
    name: "Dimethyl Sulfoxide",
    casNumber: "67-68-5",
    bottleSize: "500mL",
    remaining: 65,
    sdsLink: "https://www.sigmaaldrich.com/US/en/sds/sial/472301",
    notes: "ACS Grade",
  },
  {
    id: "chem-7",
    name: "N,N-Dimethylformamide",
    casNumber: "68-12-2",
    bottleSize: "1L",
    remaining: 30,
    sdsLink: "https://www.sigmaaldrich.com/US/en/sds/sial/227056",
    notes: "Anhydrous, 99.8%",
  },
]
