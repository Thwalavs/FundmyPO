'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'register' | 'login'>('login')
  const [role, setRole] = useState<'business' | 'funder'>('business')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [companyReg, setCompanyReg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  async function handleRegister() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          first_name: firstName,
          last_name: lastName,
          business_name: businessName,
          phone,
          company_reg: companyReg,
        }
      }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setSuccess(true)
    setLoading(false)
  }

  async function handleDemoLogin(type: 'business' | 'funder') {
    setLoading(true)
    setError('')
    const demoEmail = type === 'business' ? 'business@demo.com' : 'funder@demo.com'
    const { error } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: 'Demo1234!'
    })
    if (error) {
      setError('Demo login failed. Please make sure demo accounts are set up in Supabase.')
      setLoading(false)
      return
    }
    router.push(type === 'business' ? '/dashboard' : '/funder')
  }

  return (
    <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5',display:'flex',flexDirec