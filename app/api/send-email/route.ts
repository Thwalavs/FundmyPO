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
        <h2 style="color:#085041">Welcome to FundMyPO, ${data.name}!</h2>
        <p style="color:#444;line-height:1.8">Thank you for registering on FundMyPO. Your account is currently under review and will be verified within 24-48 hours.</p>
        <p style="color:#444;line-height:1.8">${data.role === 'funder' ? 'Once approved you will be able to browse purchase orders and submit funding offers.' : 'Once approved you will be able to submit purchase orders and receive competitive funding offers.'}</p>
        <div style="background:#E1F5EE;padding:1rem;border-radius:8px;margin:1rem 0">
          <p style="color:#085041;font-weight:500;margin:0">What happens next?</p>
          <p style="color:#0F6E56;font-size:14px;margin:.5rem 0 0">Our team will review your documents and verify your account. You will receive another email once approved.</p>
        </div>
        <a href="https://fundmypo.co.za/register" style="display:inline-block;background:#0F6E56;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:1rem">Log in to FundMyPO</a>
        <p style="color:#888;font-size:12px;margin-top:2rem">If you have any questions contact us at info@fundmypo.co.za</p>
      </div>`

    } else if (type === 'registration_pending') {
      subject = 'Your FundMyPO Application Has Been Received'
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <div style="background:#1B2B4B;padding:1.5rem 2rem;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">Application Received!</h1>
        </div>
        <div style="background:#fff;border:1px solid #e5e5e5;border-top:none;padding:2rem;border-radius:0 0 8px 8px">
          <p style="color:#444;line-height:1.8">Hi <strong>${data.name}</strong>,</p>
          <p style="color:#444;line-height:1.8">Thank you for registering on FundMyPO. We have received your application and documents for <strong>${data.businessName}</strong>.</p>
          <div style="background:#FEF3C7;padding:1rem;border-radius:8px;margin:1.5rem 0;border-left:4px solid #F59E0B">
            <p style="color:#92400E;margin:0;font-weight:600;margin-bottom:4px">Account Pending Approval</p>
            <p style="color:#92400E;margin:0;font-size:14px">Our team will review your documents within 24hours. You will receive another email once your account has been approved.</p>
          </div>
          <p style="color:#444;line-height:1.8;font-size:14px">While you wait, if you have any questions feel free to reach out to us.</p>
          <p style="color:#888;font-size:12px;margin-top:2rem">Email: info@fundmypo.co.za | WhatsApp: 067 316 2771</p>
        </div>
      </div>`

    } else if (type === 'new_registration') {
      subject = `New Registration: ${data.businessName} (${data.role === 'funder' ? 'Funder' : 'Supplier'})`
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <h2 style="color:#1B2B4B">New Registration on FundMyPO</h2>
        <p style="color:#444">A new user has registered and is awaiting approval.</p>
        <div style="background:#f5f5f5;padding:1rem;border-radius:8px;margin:1rem 0">
          <p style="margin:0 0 8px;color:#444"><strong>Name:</strong> ${data.name}</p>
          <p style="margin:0 0 8px;color:#444"><strong>Business:</strong> ${data.businessName}</p>
          <p style="margin:0 0 8px;color:#444"><strong>Email:</strong> ${data.email}</p>
          <p style="margin:0;color:#444"><strong>Role:</strong> ${data.role === 'funder' ? 'Funder' : 'Supplier / SME'}</p>
        </div>
        <a href="https://fundmypo.co.za/admin" style="display:inline-block;background:#1B2B4B;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:1rem">Review in Admin Panel</a>
        <p style="color:#888;font-size:12px;margin-top:2rem">Log in to the admin panel to view their documents and approve or decline their application.</p>
      </div>`

    } else if (type === 'account_approved') {
      subject = 'Your FundMyPO Account Has Been Approved!'
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <div style="background:#0F6E56;padding:1.5rem 2rem;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Account Approved!</h1>
        </div>
        <div style="background:#fff;border:1px solid #e5e5e5;border-top:none;padding:2rem;border-radius:0 0 8px 8px">
          <p style="color:#444;line-height:1.8">Hi <strong>${data.name}</strong>,</p>
          <p style="color:#444;line-height:1.8">Great news! Your FundMyPO account has been reviewed and <strong style="color:#0F6E56">approved</strong>.</p>
          <p style="color:#444;line-height:1.8">
            ${data.role === 'funder'
              ? 'You can now log in and start browsing available purchase orders and submitting funding offers.'
              : 'You can now log in and start submitting purchase orders to receive competitive funding offers from our verified funders.'}
          </p>
          <div style="background:#E1F5EE;padding:1rem;border-radius:8px;margin:1.5rem 0">
            <p style="color:#085041;margin:0;font-size:14px">Your business <strong>${data.businessName}</strong> is now active on the platform.</p>
          </div>
          <a href="https://fundmypo.co.za/register" style="display:inline-block;background:#0F6E56;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">Log in to FundMyPO</a>
          <p style="color:#888;font-size:12px;margin-top:2rem">If you have any questions contact us at info@fundmypo.co.za or WhatsApp 067 316 2771</p>
        </div>
      </div>`

    } else if (type === 'account_declined') {
      subject = 'Update on Your FundMyPO Application'
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <div style="background:#1B2B4B;padding:1.5rem 2rem;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Application Update</h1>
        </div>
        <div style="background:#fff;border:1px solid #e5e5e5;border-top:none;padding:2rem;border-radius:0 0 8px 8px">
          <p style="color:#444;line-height:1.8">Hi <strong>${data.name}</strong>,</p>
          <p style="color:#444;line-height:1.8">Thank you for applying to join FundMyPO. After reviewing your application and documents, we are unable to approve your account at this time.</p>
          <div style="background:#FEE2E2;padding:1rem;border-radius:8px;margin:1.5rem 0;border-left:4px solid #DC2626">
            <p style="color:#991B1B;margin:0;font-size:14px">This may be due to incomplete or invalid documentation. Please ensure all documents are valid and up to date.</p>
          </div>
          <p style="color:#444;line-height:1.8">If you believe this is an error or would like to reapply with updated documents, please contact us directly.</p>
          <a href="mailto:info@fundmypo.co.za" style="display:inline-block;background:#1B2B4B;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">Contact Us</a>
          <p style="color:#888;font-size:12px;margin-top:2rem">Email: info@fundmypo.co.za | WhatsApp: 067 316 2771</p>
        </div>
      </div>`

    } else if (type === 'new_offer') {
      subject = 'New Funding Offer Received!'
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <h2 style="color:#085041">New Funding Offer!</h2>
        <p style="color:#444">You have a new funding offer for <strong>${data.poNumber}</strong></p>
        <p style="color:#444">Funder: ${data.funderName}<br>Amount: ${data.amount}<br>Rate: ${data.rate}</p>
        <a href="https://fundmypo.co.za/dashboard" style="display:inline-block;background:#0F6E56;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">View offer</a>
      </div>`

    } else if (type === 'offer_accepted') {
      subject = 'Your Funding Offer Was Accepted!'
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <div style="background:#0F6E56;padding:1.5rem 2rem;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Offer Accepted!</h1>
        </div>
        <div style="background:#fff;border:1px solid #e5e5e5;border-top:none;padding:2rem;border-radius:0 0 8px 8px">
          <p style="color:#444;line-height:1.8">Hi <strong>${data.funderName}</strong>,</p>
          <p style="color:#444;line-height:1.8">Your funding offer for <strong>${data.poNumber}</strong> has been accepted!</p>
          <div style="background:#E1F5EE;padding:1rem;border-radius:8px;margin:1.5rem 0">
            <p style="color:#085041;margin:0;font-weight:600;margin-bottom:8px">Deal Details</p>
            <p style="margin:0 0 6px;color:#085041"><strong>Amount:</strong> ${data.amount}</p>
            <p style="margin:0 0 6px;color:#085041"><strong>Rate:</strong> ${data.rate}</p>
            <p style="margin:0 0 6px;color:#085041"><strong>Term:</strong> ${data.term}</p>
            <p style="margin:0;color:#085041"><strong>Commission:</strong> ${data.commission}</p>
          </div>
          <p style="color:#444;font-size:14px;line-height:1.8">Please proceed with the funding disbursement. The FundMyPO team will be in touch to facilitate the process.</p>
          <a href="https://fundmypo.co.za/funder" style="display:inline-block;background:#0F6E56;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">View in Funder Portal</a>
          <p style="color:#888;font-size:12px;margin-top:2rem">Email: info@fundmypo.co.za | WhatsApp: 067 316 2771</p>
        </div>
      </div>`

    } else if (type === 'admin_offer_accepted') {
      subject = `Offer Accepted: ${data.poNumber} — Action Required`
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <div style="background:#1B2B4B;padding:1.5rem 2rem;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">Offer Accepted — Action Required</h1>
        </div>
        <div style="background:#fff;border:1px solid #e5e5e5;border-top:none;padding:2rem;border-radius:0 0 8px 8px">
          <p style="color:#444;line-height:1.8">A supplier has accepted a funding offer on FundMyPO.</p>
          <div style="background:#f5f5f5;padding:1rem;border-radius:8px;margin:1.5rem 0">
            <p style="margin:0 0 8px;color:#444"><strong>PO Number:</strong> ${data.poNumber}</p>
            <p style="margin:0 0 8px;color:#444"><strong>Supplier:</strong> ${data.businessName}</p>
            <p style="margin:0 0 8px;color:#444"><strong>Funder:</strong> ${data.funderName}</p>
            <p style="margin:0 0 8px;color:#444"><strong>Amount:</strong> ${data.amount}</p>
            <p style="margin:0 0 8px;color:#444"><strong>Rate:</strong> ${data.rate}</p>
            <p style="margin:0 0 8px;color:#444"><strong>Term:</strong> ${data.term}</p>
          </div>
          <p style="color:#444;font-size:14px">Please contact the funder to facilitate the disbursement.</p>
          <a href="https://fundmypo.co.za/admin" style="display:inline-block;background:#1B2B4B;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;margin-top:1rem">View in Admin Panel</a>
        </div>
      </div>`

    } else if (type === 'offer_accepted_supplier') {
      subject = `Congratulations! Your PO ${data.poNumber} Has Been Funded!`
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <div style="background:#0F6E56;padding:1.5rem 2rem;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">Your PO Has Been Funded!</h1>
        </div>
        <div style="background:#fff;border:1px solid #e5e5e5;border-top:none;padding:2rem;border-radius:0 0 8px 8px">
          <p style="color:#444;line-height:1.8">Hi <strong>${data.name}</strong>,</p>
          <p style="color:#444;line-height:1.8">Great news! You have accepted a funding offer for your purchase order <strong>${data.poNumber}</strong>.</p>
          <div style="background:#E1F5EE;padding:1rem;border-radius:8px;margin:1.5rem 0;border-left:4px solid #0F6E56">
            <p style="color:#085041;margin:0;font-weight:600;margin-bottom:8px">Funding Details</p>
            <p style="margin:0 0 6px;color:#085041"><strong>Amount:</strong> ${data.amount}</p>
            <p style="margin:0 0 6px;color:#085041"><strong>Interest rate:</strong> ${data.rate}</p>
            <p style="margin:0;color:#085041"><strong>Term:</strong> ${data.term}</p>
          </div>
          <p style="color:#444;font-size:14px;line-height:1.8">The funder will process the disbursement within 24 hours. You will be contacted directly once funds are released.</p>
          <a href="https://fundmypo.co.za/dashboard" style="display:inline-block;background:#0F6E56;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;margin-top:1rem">View Dashboard</a>
          <p style="color:#888;font-size:12px;margin-top:2rem">Email: info@fundmypo.co.za | WhatsApp: 067 316 2771</p>
        </div>
      </div>`

    } else if (type === 'po_under_review') {
      subject = `Your PO ${data.poNumber} is Now Live on FundMyPO`
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <div style="background:#1B2B4B;padding:1.5rem 2rem;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">PO Submitted Successfully!</h1>
        </div>
        <div style="background:#fff;border:1px solid #e5e5e5;border-top:none;padding:2rem;border-radius:0 0 8px 8px">
          <p style="color:#444;line-height:1.8">Hi <strong>${data.name}</strong>,</p>
          <p style="color:#444;line-height:1.8">Your purchase order <strong>${data.poNumber}</strong> has been successfully submitted to the FundMyPO marketplace.</p>
          <div style="background:#FEF3C7;padding:1rem;border-radius:8px;margin:1.5rem 0;border-left:4px solid #F59E0B">
            <p style="color:#92400E;margin:0;font-weight:600;margin-bottom:4px">Status: Under Review</p>
            <p style="color:#92400E;margin:0;font-size:14px">Verified funders are now reviewing your PO and will submit competitive funding offers shortly.</p>
          </div>
          <div style="background:#f5f5f5;padding:1rem;border-radius:8px;margin:1.5rem 0">
            <p style="margin:0 0 8px;color:#444"><strong>PO Number:</strong> ${data.poNumber}</p>
            <p style="margin:0 0 8px;color:#444"><strong>Client:</strong> ${data.clientName}</p>
            <p style="margin:0 0 8px;color:#444"><strong>PO Value:</strong> ${data.poValue}</p>
            <p style="margin:0;color:#444"><strong>Funding needed:</strong> ${data.fundingNeeded}</p>
          </div>
          <p style="color:#444;font-size:14px;line-height:1.8">Log in to your dashboard to track your application and view offers as they come in.</p>
          <a href="https://fundmypo.co.za/dashboard" style="display:inline-block;background:#0F6E56;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;margin-top:1rem">Track My Application</a>
          <p style="color:#888;font-size:12px;margin-top:2rem">Email: info@fundmypo.co.za | WhatsApp: 067 316 2771</p>
        </div>
      </div>`

    } else if (type === 'new_po_available') {
      subject = `New PO Available: ${data.poNumber} — ${data.sector}`
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <div style="background:#1B2B4B;padding:1.5rem 2rem;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">New PO on the Marketplace!</h1>
        </div>
        <div style="background:#fff;border:1px solid #e5e5e5;border-top:none;padding:2rem;border-radius:0 0 8px 8px">
          <p style="color:#444;line-height:1.8">Hi <strong>${data.name}</strong>,</p>
          <p style="color:#444;line-height:1.8">A new purchase order has been listed on the FundMyPO marketplace and is available for funding.</p>
          <div style="background:#f5f5f5;padding:1rem;border-radius:8px;margin:1.5rem 0">
            <p style="margin:0 0 8px;color:#444"><strong>PO Number:</strong> ${data.poNumber}</p>
            <p style="margin:0 0 8px;color:#444"><strong>Client:</strong> ${data.clientName}</p>
            <p style="margin:0 0 8px;color:#444"><strong>Sector:</strong> ${data.sector}</p>
            <p style="margin:0 0 8px;color:#444"><strong>PO Value:</strong> ${data.poValue}</p>
            <p style="margin:0;color:#444"><strong>Funding needed:</strong> ${data.fundingNeeded}</p>
          </div>
          <p style="color:#444;font-size:14px;line-height:1.8">Log in to the funder portal to view full details and submit a funding offer.</p>
          <a href="https://fundmypo.co.za/register?role=funder" style="display:inline-block;background:#0F6E56;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;margin-top:1rem">View PO & Make an Offer</a>
          <p style="color:#888;font-size:12px;margin-top:2rem">Email: info@fundmypo.co.za | WhatsApp: 067 316 2771</p>
        </div>
      </div>`

    } else if (type === 'new_po_submitted') {
      subject = 'New PO Submitted on FundMyPO'
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <h2 style="color:#085041">New PO Submitted</h2>
        <p style="color:#444">A new PO has been submitted by <strong>${data.businessName}</strong></p>
        <p style="color:#444">PO Number: ${data.poNumber}<br>Client: ${data.clientName}<br>Value: ${data.poValue}</p>
        <a href="https://fundmypo.co.za/admin" style="display:inline-block;background:#085041;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Review in admin</a>
      </div>`

    } else if (type === 'offer_declined') {
      subject = `Your Funding Offer for ${data.poNumber} Was Declined`
      html = `<div style="font-family:sans-serif;padding:2rem;max-width:600px">
        <div style="background:#1B2B4B;padding:1.5rem 2rem;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">Offer Update</h1>
        </div>
        <div style="background:#fff;border:1px solid #e5e5e5;border-top:none;padding:2rem;border-radius:0 0 8px 8px">
          <p style="color:#444;line-height:1.8">Hi <strong>${data.funderName}</strong>,</p>
          <p style="color:#444;line-height:1.8">Unfortunately your funding offer for <strong>${data.poNumber}</strong> has been declined.</p>
          <div style="background:#FEE2E2;padding:1rem;border-radius:8px;margin:1.5rem 0;border-left:4px solid #DC2626">
            <p style="color:#991B1B;margin:0;font-weight:600;margin-bottom:4px">Reason provided:</p>
            <p style="color:#991B1B;margin:0;font-size:14px">${data.reason}</p>
          </div>
          <div style="background:#f5f5f5;padding:1rem;border-radius:8px;margin:1.5rem 0">
            <p style="margin:0 0 8px;color:#444"><strong>PO Number:</strong> ${data.poNumber}</p>
            <p style="margin:0 0 8px;color:#444"><strong>Offer Amount:</strong> ${data.amount}</p>
            <p style="margin:0;color:#444"><strong>Rate:</strong> ${data.rate}</p>
          </div>
          <p style="color:#444;font-size:14px">Other purchase orders are available on the marketplace.</p>
          <a href="https://fundmypo.co.za/register?role=funder" style="display:inline-block;background:#1B2B4B;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;margin-top:1rem">Browse Marketplace</a>
          <p style="color:#888;font-size:12px;margin-top:2rem">Email: info@fundmypo.co.za | WhatsApp: 067 316 2771</p>
        </div>
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}