import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { ownerEmail, taskTitle, scheduledDate, scheduledTime, price, notes } = await request.json()

  try {
    await resend.emails.send({
      from: 'Lakehouse HQ <onboarding@resend.dev>',
      to: ownerEmail,
      subject: `Task Request Received: ${taskTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0A2342; color: white; padding: 40px; border-radius: 12px;">
          <h1 style="color: #E8A838; margin-bottom: 8px;">⚓ Lakehouse HQ</h1>
          <h2 style="color: white; margin-bottom: 24px;">Your request has been received</h2>
          <div style="background: #1B4F8A; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p style="color: #5BA4CF; font-size: 12px; margin: 0 0 4px;">Service</p>
            <p style="color: white; font-size: 18px; font-weight: bold; margin: 0 0 16px;">${taskTitle}</p>
            <p style="color: #5BA4CF; font-size: 12px; margin: 0 0 4px;">Scheduled Date</p>
            <p style="color: white; margin: 0 0 16px;">${scheduledDate}</p>
            <p style="color: #5BA4CF; font-size: 12px; margin: 0 0 4px;">Preferred Time</p>
            <p style="color: white; margin: 0 0 16px;">${scheduledTime}</p>
            <p style="color: #5BA4CF; font-size: 12px; margin: 0 0 4px;">Price</p>
            <p style="color: #E8A838; font-weight: bold; margin: 0;">${price > 0 ? '$' + price : 'Quote will be provided'}</p>
            ${notes ? `<p style="color: #5BA4CF; font-size: 12px; margin: 16px 0 4px;">Your Notes</p><p style="color: white; margin: 0;">${notes}</p>` : ''}
          </div>
          <p style="color: #5BA4CF; font-size: 14px;">We will confirm your request shortly.</p>
        </div>
      `
    })

    await resend.emails.send({
      from: 'Lakehouse HQ <onboarding@resend.dev>',
      to: 'tcoppy7@gmail.com',
      subject: `New Task Request: ${taskTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0A2342; color: white; padding: 40px; border-radius: 12px;">
          <h1 style="color: #E8A838; margin-bottom: 8px;">⚓ Lakehouse HQ</h1>
          <h2 style="color: white; margin-bottom: 24px;">New task request incoming</h2>
          <div style="background: #1B4F8A; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p style="color: #5BA4CF; font-size: 12px; margin: 0 0 4px;">Owner</p>
            <p style="color: white; margin: 0 0 16px;">${ownerEmail}</p>
            <p style="color: #5BA4CF; font-size: 12px; margin: 0 0 4px;">Service</p>
            <p style="color: white; font-size: 18px; font-weight: bold; margin: 0 0 16px;">${taskTitle}</p>
            <p style="color: #5BA4CF; font-size: 12px; margin: 0 0 4px;">Scheduled Date</p>
            <p style="color: white; margin: 0 0 16px;">${scheduledDate}</p>
            <p style="color: #5BA4CF; font-size: 12px; margin: 0 0 4px;">Preferred Time</p>
            <p style="color: white; margin: 0 0 16px;">${scheduledTime}</p>
            <p style="color: #5BA4CF; font-size: 12px; margin: 0 0 4px;">Price</p>
            <p style="color: #E8A838; font-weight: bold; margin: 0;">${price > 0 ? '$' + price : 'Quote needed'}</p>
            ${notes ? `<p style="color: #5BA4CF; font-size: 12px; margin: 16px 0 4px;">Notes</p><p style="color: white; margin: 0;">${notes}</p>` : ''}
          </div>
          <a href="http://localhost:3000/operator" style="background: #E8A838; color: #0A2342; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View in Operator Dashboard</a>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
