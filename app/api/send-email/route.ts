import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { type, to, data } = await request.json()
    let subject = ''
    let html = ''
    if (type === 'new_offer') {
      subject = 'New funding offer received — FundMyPO'
      html = '<div style="font-family:sans-serif;padding:2rem"><h2 style="color:#085041">New Funding Offer!</h2><p>You have a new funding offer for <strong>' + data.poNumber + '</strong></p><p>Funder: ' + data.funderName + '<br>Amount: ' + data.amount + '<br>Rate: ' + data.rate + '</p><a href="https://fundmypo.co.za/dashboard" style="background:#0F6E56;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">View offer</a></div>'
    } else if (type === 'account_approved') {
      subject = 'Your FundMyPO account has been approved!'
      html = '<div style="font-family:sans-serif;padding:2rem"><h2 style="color:#085041">Account Approved!</h2><p>Hi ' + data.name + ', your account has been verified.</p><a href="https://fundmypo.co.za/register" style="background:#0F6E56;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Log in now</a></div>'
    } else if (type === 'offer_accepted') {
      subject = 'Your funding offer has been accepted — FundMyPO'
      html = '<div style="font-family:sans-serif;padding:2rem"><h2 style="color:#085041">Offer Accepted!</h2><p>Your offer for <strong>' + data.poNumber + '</strong> has been accepted!</p><a href="https://fundmypo.co.za/funder" style="background:#0F6E56;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">View details</a></div>'
    } else if (type === 'new_po_submitted') {
      subject = 'New PO submitted — FundMyPO Admin'
      html = '<div style="font-family:sans-serif;padding:2rem"><h2 style="color:#085041">New PO Submitted</h2><p>A new PO has been submitted by <strong>' + data.businessName + '</strong></p><a href="https://fundmypo.co.za/admin" style="background:#085041;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Review in admin</a></div>'
    }
    const sendTo = 'vsiphoesihle@gmail.com'
    const { data: emailData, error } = await resend.emails.send({ from: 'FundMyPO <onboarding@resend.dev>', to: [sendTo], subject, html })
    if (error) return NextResponse.json({ error }, { status: 400 })
    return NextResponse.json({ success: true, data: emailData })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
