import { createFileRoute } from '@tanstack/react-router'
import { HomeComponent } from './_home'
import { useCookies } from 'react-cookie'
import { useState, useEffect } from 'react'
import type { UserResponse } from '../features/user/types'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [cookies] = useCookies(['authToken', 'userData'])
  const [user, setUser] = useState<UserResponse | undefined>(undefined)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  useEffect(() => {
    // Try to get user data from cookies
    const getUserFromCookies = () => {
      try {
        const userData = cookies.userData
        // console.log(userData)
        if (userData && typeof userData === 'object') {
          console.log('User data from cookies:', userData)
          setUser(userData)
        } else {
          console.log('No user data in cookies')
          setUser(undefined)
        }
      } catch (error) {
        console.error('Error parsing user data from cookies:', error)
        setUser(undefined)
      } finally {
        setIsLoadingUser(false)
      }
    }

    getUserFromCookies()
  }, [cookies.userData])

  return <HomeComponent user={user} isLoadingUser={isLoadingUser} />
}
