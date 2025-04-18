import ClientRootLayout from "./clientLayout"

export const metadata = {
  title: "Automated Flow Chemistry Lab",
  description: "Control and monitor your flow chemistry experiments",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return <ClientRootLayout children={children} />
}


import './globals.css'