import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const supabaseUrl = 'https://efzszombcfxyyobqehyp.supabase.co'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    // Generate reset link via Supabase Admin API
    const resetRes = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        type: 'recovery',
        email,
        redirect_to: 'https://fundmypo.co.za/reset-password'
      })
    })

    const resetData = await resetRes.json()
    console.log('Supabase response:', JSON.stringify(resetData))

    if (!resetRes.ok) {
      console.error('Supabase link generation failed:', resetData)
      return NextResponse.json({ error: 'Failed to generate reset link' }, { status: 500 })
    }

    // Build link directly using hashed_token to avoid Supabase hash redirect
    const token = resetData.hashed_token || resetData.properties?.hashed_token
    const resetLink = token
      ? `https://fundmypo.co.za/reset-password?token_hash=${token}&type=recovery`
      : resetData.action_link

    console.log('Reset link:', resetLink)

    // Send email via Resend
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'FundMyPO <admin@fundmypo.co.za>',
        to: email,
        subject: 'Reset your FundMyPO password',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:2rem;background:#f5f5f5">
            <div style="background:#1B2B4B;padding:1.5rem;border-radius:8px 8px 0 0;text-align:center">
              <h1 style="color:#4DBFB0;margin:0;font-size:24px">FundMyPO</h1>
            </div>
            <div style="background:#fff;padding:2rem;border-radius:0 0 8px 8px;border:1px solid #e5e5e5">
              <h2 style="color:#1B2B4B;margin-top:0">Reset Your Password</h2>
              <p style="color:#666;line-height:1.6">Hi,</p>
              <p style="color:#666;line-height:1.6">Click the button below to reset your FundMyPO password. This link expires in 1 hour.</p>
              <div style="text-align:center;margin:2rem 0">
                <a href="${resetLink}"
                  style="background:#0F6E56;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">
                  Reset Password
                </a>
              </div>
              <p style="color:#999;font-size:13px;line-height:1.6">If you did not request a password reset, you can safely ignore this email.</p>
              <hr style="border:none;border-top:1px solid #e5e5e5;margin:1.5rem 0">
              <p style="color:#999;font-size:12px;text-align:center">— The FundMyPO Team</p>
            </div>
          </div>
        `
      })
    })

    const resendData = await resendRes.json()

    if (!resendRes.ok) {
      console.error('Resend failed:', resendData)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('Reset password email error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}