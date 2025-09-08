import { LoginPage } from "@/presentation/pages/login"
import { Factories } from "@/main/factories";

export const LoginFactory = () => {
  return <LoginPage
    getAuth={Factories.makeRemoteAuthentication()}
  />
}
