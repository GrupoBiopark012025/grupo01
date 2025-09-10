import { useNotify } from "@/presentation/hooks"
import { Button } from "@/presentation/ui/shadcn/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/presentation/ui/shadcn/card"
import { Input } from "@/presentation/ui/shadcn/input"
import { Label } from "@/presentation/ui/shadcn/label"
import { type FormEvent, useState } from "react";
import type { Authentication } from "@/domain/usecases";
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/presentation/stores";

type LoginPageProps = {
  getAuth: Authentication
}

export const LoginPage = (props: LoginPageProps) => {
  const notify = useNotify()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      notify.error("Preencha todos os campos")
      return
    }

    try {
      const { user } = await props.getAuth.auth({ email, password })

      notify.success(`Bem-vindo, ${user.nome}!`)
      setUser(user)
      navigate('/')
    } catch (error) {
      notify.error((error as Error).message)
    }
  }

  return (
    <div className="h-screen flex justify-center items-center bg-muted/40">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
          >
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
