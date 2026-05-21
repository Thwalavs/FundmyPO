import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { type, to, data } = await req.json()
    const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
    let subject = ''
    let html = ''

    if (type === 'new_offer') {
      subject = 'New Funding Offer Received!'
      html = '<div style="font-family:sans-serif;padding:2rem"><h2 style="color:#085041">New Funding Offer!</h2><p>You have a new funding offer for <strong>' + data.poNumber + '</strong></p><p>Funder: ' + data.funderName + '<br>Amount: ' + data.amount + '<br>Rate: ' + data.rate + '</p><a href="https://fundmypo.co.za/dashboard" style="background:#0F6E56;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">View offer</a></div>'
    } else if (type === 'account_approved') {
      subject = 'Your FundMyPO Account Has Been Approved!'
      html = '<div style="font-family:sans-serif;padding:2rem"><h2 style="color:#085041">Account Approved!</h2><p>Hi ' + data.name + ', your account has been verified.</p><a href="https://fundmypo.co.za/register" style="background:#0F6E56;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Log in now</a></div>'
    } else if (type === 'offer_accepted') {
      subject = 'Your Funding Offer Was Accepted!'
      html = '<div style="font-family:sans-serif;padding:2rem"><h2 style="color:#085041">Offer Accepted!</h2><p>Your offer for <strong>' + data.poNumber + '</strong> has been accepted!</p><p>Amount: ' + data.amount + '<br>Rate: ' + data.rate + '<br>Term: ' + data.term + '<br>Commission: ' + data.commission + '</p><a href="https://fundmypo.co.za/funder" style="background:#0F6E56;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">View details</a></div>'
    } else if (type === 'new_po_submitted') {
      subject = 'New PO Submitted on FundMyPO'
      html = '<div style="font-family:sans-serif;padding:2rem"><h2 style="color:#085041">New PO Submitted</h2><p>A new PO has been submitted by <strong>' + data.businessName + '</strong></p><p>PO Number: ' + data.poNumber + '<br>Client: ' + data.clientName + '<br>Value: ' + data.poValue + '</p><a href="https://fundmypo.co.za/admin" style="background:#085041;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Review in admin</a></div>'
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + RESEND_API_KEY
      },
      body: JSON.stringify({
        from: 'FundMyPO <onboarding@resend.dev>',
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