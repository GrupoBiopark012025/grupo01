export const makeApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL

  if (!apiUrl) {
    throw new Error('VITE_API_URL não foi definida nas variáveis de ambiente.')
  }

  return apiUrl
}
