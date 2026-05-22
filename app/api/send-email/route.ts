import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { type, to, data } = await req.json()
    const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
    let subject = ''
    let html = ''

    if (type === 'welcome') {
      subject = 'Welcome to FundMyPO!'
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <h2 style="color:#085041">Welcome to FundMyPO, ${data.name}! 🎉</h2>
        <p style="color:#444;line-height:1.8">Thank you for registering on FundMyPO. Your account is currently under review and will be verified within 24-48 hours.</p>
        <p style="color:#444;line-height:1.8">${data.role === 'funder' ? 'Once approved you will be able to browse purchase orders and submit funding offers.' : 'Once approved you will be able to submit purchase orders and receive competitive funding offers.'}</p>
        <div style="background:#E1F5EE;padding:1rem;border-radius:8px;margin:1rem 0">
          <p style="color:#085041;font-weight:500;margin:0">What happens next?</p>
          <p style="color:#0F6E56;font-size:14px;margin:.5rem 0 0">Our team will review your documents and verify your account. You will receive another email once approved.</p>
        </div>
        <a href="https://fundmypo.co.za/register" style="display:inline-block;background:#0F6E56;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:1rem">Log in to FundMyPO</a>
        <p style="color:#888;font-size:12px;margin-top:2rem">If you have any questions contact us at support@fundmypo.co.za</p>
      </div>`
    } else if (type === 'new_offer') {
      subject = 'New Funding Offer Received!'
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <h2 style="color:#085041">New Funding Offer!</h2>
        <p style="color:#444">You have a new funding offer for <strong>${data.poNumber}</strong></p>
        <p style="color:#444">Funder: ${data.funderName}<br>Amount: ${data.amount}<br>Rate: ${data.rate}</p>
        <a href="https://fundmypo.co.za/dashboard" style="display:inline-block;background:#0F6E56;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">View offer</a>
      </div>`
    } else if (type === 'account_approved') {
      subject = 'Your FundMyPO Account Has Been Approved!'
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <h2 style="color:#085041">Account Approved! ✅</h2>
        <p style="color:#444">Hi ${data.name}, your account has been verified and approved.</p>
        <p style="color:#444">You can now log in and start using FundMyPO.</p>
        <a href="https://fundmypo.co.za/register" style="display:inline-block;background:#0F6E56;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Log in now</a>
      </div>`
    } else if (type === 'offer_accepted') {
      subject = 'Your Funding Offer Was Accepted!'
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <h2 style="color:#085041">Offer Accepted! 🎉</h2>
        <p style="color:#444">Your offer for <strong>${data.poNumber}</strong> has been accepted!</p>
        <p style="color:#444">Amount: ${data.amount}<br>Rate: ${data.rate}<br>Term: ${data.term}<br>Commission: ${data.commission}</p>
        <a href="https://fundmypo.co.za/funder" style="display:inline-block;background:#0F6E56;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">View details</a>
      </div>`
    } else if (type === 'new_po_submitted') {
      subject = 'New PO Submitted on FundMyPO'
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <h2 style="color:#085041">New PO Submitted</h2>
        <p style="color:#444">A new PO has been submitted by <strong>${data.businessName}</strong></p>
        <p style="color:#444">PO Number: ${data.poNumber}<br>Client: ${data.clientName}<br>Value: ${data.poValue}</p>
        <a href="https://fundmypo.co.za/admin" style="display:inline-block;background:#085041;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Review in admin</a>
      </div>`
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + RESEND_API_KEY
      },
      body: JSON.stringify({
        from: 'FundMyPO <noreply@fundmypo.co.za>',
        to: [to],
        subject,
        html
      })
    })

    const result = await res.json()
    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}