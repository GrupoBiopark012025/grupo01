import { toast } from "sonner"

type NotifyProps = {
  success: (text: string) => void
  error: (error: string) => void
  info: (text: string) => void
  warning: (text: string) => void
}

export const useNotify = (): NotifyProps => {
  const success = (text: string): void => {
    toast.success(text)
  }

  const error = (error: string): void => {
    toast.error(error)
  }

  const info = (text: string): void => {
    toast.info(text)
  }

  const warning = (text: string): void => {
    toast.warning(text)
  }

  return { success, error, info, warning }
}
