'use client'
import { useState } from 'react'
import type { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

function UploadBox({ label, file, onChange, required }: { label: string, file: File | null, onChange: (f: File | null) => void, required?: boolean }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-600 mb-2">
        {label}{' '}
        {required ? (
          <span className="text-rose-600">*</span>
        ) : (
          <span className="text-slate-400 text-xs">(optional)</span>
        )}
      </label>
      <div className={`relative rounded-3xl border-2 p-5 text-center transition ${file ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-white'} cursor-pointer`}>
        {file ? (
          <div>
            <p className="text-sm font-semibold text-teal-700">{file.name}</p>
            <p className="text-sm text-slate-500 mt-1">Click to change</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-600 mb-1">Click to upload {label}</p>
            <p className="text-sm text-slate-400">PDF, JPG or PNG — max 5MB</p>
          </div>
        )}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={e => onChange(e.target.files?.[0] || null)}
          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [step, setStep] = useState(1)
  const isBrowser = typeof window !== 'undefined'
  const initialRole = isBrowser && new URLSearchParams(window.location.search).get('role') === 'funder' ? 'funder' : 'business'
  const [role, setRole] = useState<'business' | 'funder'>(initialRole)
  const [portalRole] = useState<'business' | 'funder'>(initialRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [companyReg, setCompanyReg] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [companyDoc, setCompanyDoc] = useState<File|null>(null)
  const [idDoc, setIdDoc] = useState<File|null>(null)
  const [csdDoc, setCsdDoc] = useState<File|null>(null)
  const [taxDoc, setTaxDoc] = useState<File|null>(null)
  const [bbbeeDoc, setBbbeeDoc] = useState<File|null>(null)
  const [fscaDoc, setFscaDoc] = useState<File|null>(null)
  const [proofFunds, setProofFunds] = useState<File|null>(null)
  const [uploadProgress, setUploadProgress] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  async function getSupabase(): Promise<ReturnType<typeof createBrowserClient>> {
    const { createBrowserClient } = await import('@supabase/ssr')
    return createBrowserClient(
      'https://efzszombcfxyyobqehyp.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'
    )
  }

  type SupabaseClient = Awaited<ReturnType<typeof getSupabase>>

  const passwordChecks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'At least one number', met: /[0-9]/.test(password) },
  ]
  const passwordValid = passwordChecks.every(c => c.met)

  const inputBase = 'w-full rounded-3xl bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
  const getInputClass = (value: string, valid: boolean) =>
    `${inputBase} ${value ? (valid ? 'border-teal-500' : 'border-rose-500') : 'border-slate-200'}`

  async function handleLogin(currentPortalRole: string) {
    setLoading(true)
    setError('')
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }

      const userRole = data.user?.user_metadata?.role

      if (userRole === 'admin') {
        router.push('/admin')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('status, role')
        .eq('id', data.user.id)
        .single()

      if (profile?.status === 'pending') {
        await supabase.auth.signOut()
        setError('Your account is pending approval. You will be notified by email once our team has reviewed your documents.')
        setLoading(false)
        return
      }

      if (profile?.status === 'declined') {
        await supabase.auth.signOut()
        setError('Your account application was declined. Please contact us at info@fundmypo.co.za for more information.')
        setLoading(false)
        return
      }

      if (currentPortalRole === 'funder' && userRole !== 'funder') {
        await supabase.auth.signOut()
        setError('This portal is for funders only. Please use the supplier login instead.')
        setLoading(false)
        return
      }
      if (currentPortalRole === 'business' && userRole === 'funder') {
        await supabase.auth.signOut()
        setError('This portal is for suppliers only. Please use the funder login instead.')
        setLoading(false)
        return
      }

      if (userRole === 'funder') { router.push('/funder') }
      else { router.push('/dashboard') }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error: Something went wrong.')
      setLoading(false)
    }
  }

  async function uploadFile(supabase: SupabaseClient, file: File, userId: string, docName: string) {
    const ext = file.name.split('.').pop()
    const path = `${userId}/${docName}.${ext}`
    const { error } = await supabase.storage.from('verification-docs').upload(path, file, { upsert: true })
    if (error) console.error('Upload error:', docName, error.message)
    return path
  }

  async function handleRegister() {
    setLoading(true)
    setError('')
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { role, first_name: firstName, last_name: lastName, business_name: businessName, phone, company_reg: companyReg } }
      })
      if (error) { setError(error.message); setLoading(false); return }

      const userId = data.user?.id
      if (userId) {
        await supabase.from('profiles').insert({
          id: userId, email, role,
          first_name: firstName, last_name: lastName,
          business_name: businessName, phone,
          company_reg: companyReg, status: 'pending',
        })

        if (role === 'business') {
          if (companyDoc) { setUploadProgress('Uploading company certificate...'); await uploadFile(supabase, companyDoc, userId, 'company-certificate') }
          if (idDoc) { setUploadProgress('Uploading ID document...'); await uploadFile(supabase, idDoc, userId, 'id-document') }
          if (csdDoc) { setUploadProgress('Uploading CSD report...'); await uploadFile(supabase, csdDoc, userId, 'csd-report') }
          if (taxDoc) { setUploadProgress('Uploading tax clearance...'); await uploadFile(supabase, taxDoc, userId, 'tax-clearance') }
          if (bbbeeDoc) { setUploadProgress('Uploading BBB-EE certificate...'); await uploadFile(supabase, bbbeeDoc, userId, 'bbbee-certificate') }
        } else {
          if (fscaDoc) { setUploadProgress('Uploading FSCA license...'); await uploadFile(supabase, fscaDoc, userId, 'fsca-license') }
          if (idDoc) { setUploadProgress('Uploading ID document...'); await uploadFile(supabase, idDoc, userId, 'id-document') }
          if (proofFunds) { setUploadProgress('Uploading proof of funds...'); await uploadFile(supabase, proofFunds, userId, 'proof-of-funds') }
        }
      }

      // Welcome email to user
      try {
        await fetch('/api/send-email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'welcome',
            to: email,
            data: { name: firstName || businessName, businessName, role }
          })
        })
      } catch(e) { console.log('Welcome email failed:', e) }

      // Pending approval email to user
      try {
        await fetch('/api/send-email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'registration_pending',
            to: email,
            data: { name: firstName || businessName, businessName, role }
          })
        })
      } catch(e) { console.log('Pending email failed:', e) }

      // Notify admin of new registration
      try {
        await fetch('/api/send-email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'new_registration',
            to: 'admin@fundmypo.co.za',
            data: { name: `${firstName} ${lastName}`, businessName, email, role }
          })
        })
      } catch(e) { console.log('Admin notification failed:', e) }

      setUploadProgress('')
      setSuccess(true)
      setLoading(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error: Something went wrong.')
      setLoading(false)
    }
  }

  if (!isBrowser) return null

  const isFunder = portalRole === 'funder'
  const canAdvanceStepOne = Boolean(
    firstName && lastName && businessName && email && phone && password && confirmPassword && passwordValid && confirmPassword === password && (role === 'funder' || companyReg)
  )

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="bg-slate-950 px-6 md:px-8 lg:px-10 h-[65px] flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="FundMyPO" width={140} height={48} className="h-12 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${isFunder ? 'bg-teal-100 text-teal-700' : 'bg-white/10 text-white'}`}>
            {isFunder ? 'Funder Portal' : 'Supplier Portal'}
          </span>
          <Link href="/" className="text-sm text-white/80 transition hover:text-white">Back to home</Link>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl rounded-[1rem] border border-slate-200 bg-white p-6 md:p-8 shadow-[0_4px_24px_rgba(15,23,42,0.08)]">

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-950 mb-2">
              {tab === 'login' ? (isFunder ? 'Funder Sign In' : 'Supplier Sign In') : (isFunder ? 'Create Funder Account' : 'Create Supplier Account')}
            </h1>
            <p className="text-sm text-slate-500">
              {tab === 'login' ? 'Welcome back to FundMyPO' : "Join South Africa's leading PO funding platform"}
            </p>
          </div>

          <div className="flex overflow-hidden rounded-3xl border border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => { setTab('login'); setStep(1); setError('') }}
              className={`flex-1 py-3 text-sm font-semibold transition ${tab === 'login' ? 'bg-teal-600 text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'}`}>
              Sign in
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setStep(1); setError('') }}
              className={`flex-1 py-3 text-sm font-semibold transition ${tab === 'register' ? 'bg-teal-600 text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'}`}>
              Create account
            </button>
          </div>

          {error && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 mb-6 text-sm text-rose-700">
              {error}
            </div>
          )}

          {tab === 'login' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Email address</label>
                <input
                  type="email"
                  placeholder="you@company.co.za"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputBase + ' border-slate-200'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={inputBase + ' border-slate-200'}
                />
              </div>
              <div className="text-right mb-5">
                <button
                  type="button"
                  onClick={() => router.push('/forgot-password')}
                  className="text-sm font-semibold text-teal-600 transition hover:text-teal-700"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleLogin(portalRole)}
                disabled={loading}
                className="w-full rounded-3xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <p className="text-center text-sm text-slate-500 mt-5">
                No account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="font-semibold text-teal-600 hover:text-teal-700"
                >
                  Create one free
                </button>
              </p>
              <p className="text-center text-xs text-slate-400 mt-2">
                {isFunder ? (
                  <>Wrong portal? <Link href="/register" className="font-semibold text-teal-600 hover:text-teal-700">Go to supplier login</Link></>
                ) : (
                  <>Are you a funder? <Link href="/register?role=funder" className="font-semibold text-teal-600 hover:text-teal-700">Go to funder login</Link></>
                )}
              </p>
            </div>
          )}

          {tab === 'register' && (
            <div>
              {success ? (
                <div className="rounded-[1.25rem] border border-teal-100 bg-teal-50 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-700 text-white text-2xl font-bold">
                    ✓
                  </div>
                  <p className="text-lg font-semibold text-teal-900 mb-3">Application submitted!</p>
                  <p className="text-sm leading-6 text-teal-700 mb-6">
                    Your account is <strong>pending approval</strong>. Our team will review your documents within 24-48 hours and notify you by email once approved.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setTab('login'); setSuccess(false) }}
                    className="rounded-3xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                  >
                    Back to Sign in
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-6 flex flex-col gap-4 md:flex-row">
                    {['Account details', 'Verification docs'].map((label, index) => {
                      const stepNumber = index + 1
                      const active = step === stepNumber
                      const done = step > stepNumber
                      return (
                        <div key={label} className="flex-1">
                          <div className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${done || active ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                              {done ? '✓' : stepNumber}
                            </div>
                            <p className={`text-xs font-semibold ${active ? 'text-teal-700' : 'text-slate-500'}`}>
                              {label}
                            </p>
                          </div>
                          {index === 0 && <div className={`mt-3 h-1 rounded-full ${done ? 'bg-teal-600' : 'bg-slate-200'}`}></div>}
                        </div>
                      )
                    })}
                  </div>

                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-3">I am registering as a:</p>
                        <div className="grid gap-3 md:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setRole('business')}
                            className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${role === 'business' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                            Supplier / SME
                          </button>
                          <button
                            type="button"
                            onClick={() => setRole('funder')}
                            className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${role === 'funder' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                            Funder
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">First name <span className="text-rose-600">*</span></label>
                          <input
                            type="text"
                            placeholder="Sipho"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className={getInputClass(firstName, true)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Last name <span className="text-rose-600">*</span></label>
                          <input
                            type="text"
                            placeholder="Dlamini"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className={getInputClass(lastName, true)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">{role === 'business' ? 'Business name' : 'Institution name'} <span className="text-rose-600">*</span></label>
                        <input
                          type="text"
                          placeholder={role === 'business' ? 'Dlamini Suppliers (Pty) Ltd' : 'Nkosi Capital (Pty) Ltd'}
                          value={businessName}
                          onChange={e => setBusinessName(e.target.value)}
                          className={getInputClass(businessName, true)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Email address <span className="text-rose-600">*</span></label>
                        <input
                          type="email"
                          placeholder="you@company.co.za"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className={getInputClass(email, true)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Phone number <span className="text-rose-600">*</span></label>
                        <input
                          type="tel"
                          placeholder="+27 82 000 0000"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className={getInputClass(phone, true)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          {role === 'business' ? 'Company registration number' : 'FSCA registration number'}
                          {role === 'business' ? <span className="text-rose-600"> *</span> : <span className="text-slate-400 text-xs"> (optional)</span>}
                        </label>
                        <input
                          type="text"
                          placeholder={role === 'business' ? '2021/123456/07' : 'FSP 12345 (if applicable)'}
                          value={companyReg}
                          onChange={e => setCompanyReg(e.target.value)}
                          className={getInputClass(companyReg, true)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Password <span className="text-rose-600">*</span></label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min. 8 characters"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className={getInputClass(password, passwordValid)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(s => !s)}
                            className="absolute right-3 top-3 text-sm font-semibold text-teal-600 hover:text-teal-700"
                          >
                            {showPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Confirm password <span className="text-rose-600">*</span></label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Re-type your password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className={getInputClass(confirmPassword, confirmPassword === password)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(s => !s)}
                            className="absolute right-3 top-3 text-sm font-semibold text-teal-600 hover:text-teal-700"
                          >
                            {showConfirmPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        {confirmPassword.length > 0 && confirmPassword !== password && (
                          <p className="mt-2 text-xs text-rose-600">Passwords do not match.</p>
                        )}
                        {password.length > 0 && (
                          <div className="mt-4 space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                            <p className="font-semibold text-slate-700">Password requirements:</p>
                            {passwordChecks.map(({ label, met }) => (
                              <div key={label} className="flex items-center gap-2 text-sm">
                                <span className={`font-semibold ${met ? 'text-teal-600' : 'text-rose-600'}`}>{met ? 'OK' : 'X'}</span>
                                <span className={met ? 'text-teal-700' : 'text-rose-600'}>{label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-600">
                        <span className="text-rose-600">*</span> Required fields
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!firstName || !lastName || !businessName || !email || !phone || !password || !confirmPassword) {
                            setError('Please fill in all required fields.')
                            return
                          }
                          if (role === 'business' && !companyReg) {
                            setError('Please enter your company registration number.')
                            return
                          }
                          if (!passwordValid) {
                            setError('Password does not meet all requirements.')
                            return
                          }
                          if (confirmPassword !== password) {
                            setError('Passwords do not match. Please confirm your password.')
                            return
                          }
                          if (!email.includes('@')) {
                            setError('Please enter a valid email address.')
                            return
                          }
                          setError('')
                          setStep(2)
                        }}
                        disabled={!canAdvanceStepOne}
                        className={`w-full rounded-3xl px-5 py-3 text-sm font-semibold text-white transition ${canAdvanceStepOne ? 'bg-teal-600 hover:bg-teal-700' : 'bg-slate-400 cursor-not-allowed'}`}
                      >
                        Continue to verification
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <div className="rounded-3xl border border-teal-100 bg-teal-50 p-4">
                        <p className="text-sm font-semibold text-teal-800 mb-1">Your documents are secure</p>
                        <p className="text-sm text-teal-700">All documents are encrypted and only shared with verified parties.</p>
                      </div>
                      {role === 'business' ? (
                        <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-600">
                          <span className="text-rose-600">*</span> All 5 documents required for suppliers
                        </div>
                      ) : (
                        <div className="rounded-3xl bg-sky-50 p-4 text-sm text-slate-700">
                          All documents are optional for funders. Upload what you have available.
                        </div>
                      )}
                      {role === 'business' ? (
                        <div>
                          <UploadBox label="Company Registration Certificate" file={companyDoc} onChange={setCompanyDoc} required />
                          <UploadBox label="ID Copy of Director" file={idDoc} onChange={setIdDoc} required />
                          <UploadBox label="CSD Full Registration Report" file={csdDoc} onChange={setCsdDoc} required />
                          <UploadBox label="Tax Clearance Certificate" file={taxDoc} onChange={setTaxDoc} required />
                          <UploadBox label="BBB-EE Certificate or Sworn Affidavit" file={bbbeeDoc} onChange={setBbbeeDoc} required />
                        </div>
                      ) : (
                        <div>
                          <UploadBox label="FSCA License" file={fscaDoc} onChange={setFscaDoc} />
                          <UploadBox label="ID Copy of Director" file={idDoc} onChange={setIdDoc} />
                          <UploadBox label="Proof of Funds" file={proofFunds} onChange={setProofFunds} />
                        </div>
                      )}
                      {uploadProgress && (
                        <div className="rounded-3xl border border-teal-100 bg-teal-50 p-4 text-sm text-teal-700 text-center">
                          {uploadProgress}
                        </div>
                      )}
                      <div className="rounded-3xl bg-amber-50 p-4 text-sm text-amber-900 border border-amber-100">
                        <p className="font-semibold">Review process</p>
                        <p>Your account will be reviewed within 24-48 hours. You will receive an email once approved.</p>
                      </div>
                      <label className={`flex flex-col gap-3 rounded-3xl border p-4 ${agreedToTerms ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-slate-50'}`}>
                        <span className="flex items-start gap-3 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={e => setAgreedToTerms(e.target.checked)}
                            className="mt-1 h-5 w-5 rounded-lg border-slate-300 text-teal-600 focus:ring-teal-500"
                          />
                          <span className="leading-6">
                            I agree to the{' '}
                            <a href="/terms" target="_blank" className="font-semibold text-teal-600 hover:text-teal-700">Terms & Conditions</a>
                            {' '}and{' '}
                            <a href="/privacy" target="_blank" className="font-semibold text-teal-600 hover:text-teal-700">Privacy Policy</a>.
                            I confirm all documents submitted are authentic and accurate.
                          </span>
                        </span>
                      </label>
                      <div className="grid gap-3 md:grid-cols-3">
                        <button
                          type="button"
                          onClick={() => { setError(''); setStep(1) }}
                          className="rounded-3xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (role === 'business' && (!companyDoc || !idDoc || !csdDoc || !taxDoc || !bbbeeDoc)) {
                              setError('Please upload all 5 required documents.')
                              return
                            }
                            if (!agreedToTerms) { setError('Please agree to the Terms & Conditions.'); return }
                            setError('')
                            handleRegister()
                          }}
                          disabled={loading}
                          className="md:col-span-2 rounded-3xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {loading ? 'Creating account...' : 'Submit & Create account'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}