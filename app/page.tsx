import Link from "next/link"
import { Beaker, ChevronRight, Droplets, List, ThermometerSnowflake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Beaker className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-semibold tracking-tight">Automated Flow Chemistry Lab</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="User profile">
              <div className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <span className="text-sm font-medium">JD</span>
                </div>
              </div>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Your Smart Flow Chemistry Control Hub
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Monitor, control, and optimize your flow chemistry experiments with precision and ease. Streamline
                  your lab workflow with our integrated automation platform.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" size="lg">
                  Start Experiment
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="border-2 border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <Droplets className="h-6 w-6 text-emerald-600" />
                    </div>
                    <CardTitle className="text-xl">Pump Control</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Precisely control flow rates, manage multiple pumps, and create automated sequences for your
                    experiments.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-2 border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <ThermometerSnowflake className="h-6 w-6 text-emerald-600" />
                    </div>
                    <CardTitle className="text-xl">Temperature & Pressure Monitoring</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Real-time monitoring of critical parameters with customizable alerts and automatic safety protocols.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-2 border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <List className="h-6 w-6 text-emerald-600" />
                    </div>
                    <CardTitle className="text-xl">Experiment Recipe Logs</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Save, load, and share experiment protocols. Comprehensive logging ensures reproducibility and
                    traceability.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Powerful Analytics at Your Fingertips
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Visualize experiment data in real-time and gain insights to optimize your chemistry workflows.
                </p>
              </div>
              <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl border bg-white shadow-lg">
                <div className="p-4">
                  <div className="h-[300px] w-full rounded-lg bg-gray-100 flex items-center justify-center">
                    <div className="text-emerald-600/30 text-6xl font-bold">Dashboard Preview</div>
                  </div>
                </div>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white mt-8" size="lg">
                Explore Dashboard Features
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Automated Flow Chemistry Lab. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              GitHub Repository
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
