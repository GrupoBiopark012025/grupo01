import { useNotify } from "@/presentation/hooks"
import { Button } from "@/presentation/ui/shadcn/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/presentation/ui/shadcn/card"
import { Input } from "@/presentation/ui/shadcn/input"
import { Label } from "@/presentation/ui/shadcn/label"

export const LoginPage = () => {
  const notify = useNotify()

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
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
                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button onClick={() => notify.info('teste')} type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
