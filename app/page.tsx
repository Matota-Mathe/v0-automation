"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Beaker, Loader2, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        // In a real app, you'd show an error message
        console.error("Login failed")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Beaker className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">NMU Flow Chemistry Group</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/register">
            <Button variant="ghost">Sign Up</Button>
          </Link>
          <Link href="/contact">
            <Button>Contact</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto border rounded-lg p-8 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Beaker className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-1">NMU Flow Chemistry Group</h1>
          <p className="text-center text-muted-foreground mb-6">Sign in to access your lab dashboard</p>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember-me" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Button variant="outline" className="w-full" disabled>
              <svg
                className="h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
              Continue with SAML SSO
            </Button>
            <Button variant="outline" className="w-full" disabled>
              <svg
                className="h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
                <path d="M21.17 8H12V2.83c2 .98 3.73 2.72 4.72 4.72.1.21.18.43.28.65.1.22.19.45.28.68.9.23.17.46.24.7.7.23.14.47.2.71.6.24.11.49.15.74.4.25.08.51.1.77.3.26.05.53.06.8 0 .27.02.54.02.82 0 .28-.02.55-.02.83-.1.27-.02.54-.05.8-.3.27-.07.53-.11.79-.4.26-.09.51-.15.76-.6.25-.13.49-.2.73-.8.24-.16.47-.25.71-.9.23-.19.46-.29.68-.1.22-.22.44-.32.65-.11.2-.22.41-.34.61-.12.2-.25.39-.38.58-.13.19-.27.37-.42.55-.15.18-.3.34-.46.51-.16.17-.32.33-.49.48-.17.15-.35.29-.53.43-.18.14-.37.27-.56.4-.19.13-.39.25-.59.36-.2.11-.41.21-.62.31-.21.09-.42.18-.64.26-.22.08-.44.15-.66.22-.23.07-.46.13-.69.18-.24.05-.47.1-.71.14-.24.04-.49.07-.73.09-.25.03-.5.04-.75.05-.13.01-.25.01-.38.01-.13 0-.25 0-.38-.01-.25-.01-.5-.02-.75-.05-.24-.02-.49-.05-.73-.09-.24-.04-.47-.09-.71-.14-.23-.05-.46-.11-.69-.18-.22-.07-.44-.14-.66-.22-.22-.08-.43-.17-.64-.26-.21-.1-.42-.2-.62-.31-.2-.11-.4-.23-.59-.36-.19-.13-.38-.26-.56-.4-.18-.14-.36-.28-.53-.43-.17-.15-.33-.31-.49-.48-.16-.17-.31-.33-.46-.51-.15-.18-.29-.36-.42-.55-.13.19-.26.38-.38-.58-.12-.2-.23-.41-.34-.61-.1-.21-.21-.43-.32-.65-.1-.22-.2-.45-.29-.68-.09-.23-.17-.47-.25-.71-.07-.24-.14-.48-.2-.73-.06-.25-.11-.5-.15-.76-.04-.26-.08-.52-.11-.79-.03-.26-.05-.53-.05-.8 0-.28-.02-.55-.02-.83 0-.28.02-.55.02-.82.01-.27.03-.54.06-.8.04-.25.08-.51.1-.77.04-.25.09-.5.15-.74.06-.24.13-.48.2-.71.07-.24.14-.47.24-.7.09-.23.18-.46.28-.68.1-.22.18-.44.28-.65.99-2 2.72-3.74 4.72-4.72" />
              </svg>
              Continue with Passkey
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
