import { useNotify } from "@/presentation/hooks"

export const LoginPage = () => {
  const notify = useNotify()

  return <>
    <div>Login Page</div>
    <button onClick={() => notify.success('olaa')}>Clique para mensagem</button>
  </>
}
