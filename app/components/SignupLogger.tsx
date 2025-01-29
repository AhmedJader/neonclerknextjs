'use client'
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export default function SignupLogger() {
  const { user } = useUser()

  useEffect(() => {
    if (user && user.id) {
      const signupUser = async () => {
        const response = await fetch('/api/signup')
        if (response.ok) {
          console.log('User signup logged in DB')
        } else {
          console.error('Error logging user signup')
        }
      }
      signupUser()
    }
  }, [user])

  return null // No UI needed
}
