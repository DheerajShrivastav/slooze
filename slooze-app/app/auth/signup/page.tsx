'use client'

import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RegisterResponse {
  register: {
    token: string
    user: {
      id: string
      email: string
      name: string
    }
  }
}

interface RegisterInput {
  input: {
    email: string
    password: string
    name: string
    country: string
  }
}

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        name
      }
    }
  }
`

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    country: 'AMERICA',
  })

  const [register, { loading, error }] = useMutation<
    RegisterResponse,
    RegisterInput
  >(REGISTER_MUTATION)
  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await register({
        variables: {
          input: {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            country: formData.country,
          },
        },
      })

      if (data?.register?.token) {
        localStorage.setItem('token', data.register.token)
        localStorage.setItem('user', JSON.stringify(data.register.user))
        window.location.href = '/'
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-8">
      <Card className="w-full max-w-md bg-white shadow-xl border-none">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-black text-primary">
            Join Slooze
          </CardTitle>
          <p className="text-muted-foreground">
            Create an account to start ordering
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Full Name
              </label>
              <Input
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Email</label>
              <Input
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="AMERICA">America</option>
                <option value="INDIA">India</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-sm">{error.message}</p>}

            <Button
              type="submit"
              className="w-full h-12 text-lg font-bold"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-primary font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
