import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { LoginFactory } from "@/main/factories/pages/login.factory";
import { PrivateRoute } from "@/presentation/components";

const router = createBrowserRouter([
  {
    path: '',
    element: (
      <PrivateRoute>
        Componente Privado
      </PrivateRoute>
    )
  },
  {
    path: '/login',
    element: <LoginFactory/>
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
