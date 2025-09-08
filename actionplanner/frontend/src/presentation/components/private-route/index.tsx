import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/presentation/hooks'

type PrivateRouteProps = {
  children: React.ReactNode
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isTokenValid } = useAuth()

  const validLogin = isTokenValid()
  if (!validLogin) {
    return <Navigate to='/login' replace />
  }

  return children
}
