import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import twilio from 'twilio'
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);


export default async (req: Request) => {
  let next_run;
  try {
    const body = await req.json();
    next_run = body.next_run;
  } catch {
    next_run = "manual invocation";
  }

  console.log("Send reminders triggered. Next run:", next_run);

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_SERVER!
  );

  try {
    // TODO: query preferences where sms_alerts = true or email_alerts = true
    const { data: users, error } = await supabase.from(process.env.PREFERENCES_DB_NAME!).select().or('sms_alerts.eq.true,email_alerts.eq.true');
    console.log("users: ",users);
    if (error) throw error;
    // today in Chicago time as YYYY-MM-DD — matches parsedDate format in DB
    const now = new Date();
    const todayChicagoStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago' }).format(now);

    // for each user, query their favorites and join event data
    const usersWithFavorites = await Promise.all(users.map(async (user) => {
      const { data: favorites } = await supabase
        .from(process.env.FAVORITES_DB_NAME!)
        .select(`user_id, event_id, events ( title, parsedDate, doorsTime, showTime, venue ) `)
        .eq('user_id', user.user_id)
      const upcomingShows = (favorites ?? []).filter((fav) => {
        return fav.events.parsedDate === todayChicagoStr
      })
      return { ...user, upcomingShows }
    }))
    console.log("usersWithFavorites: ",usersWithFavorites);

    await Promise.all(usersWithFavorites.map(async (user) => {
      if (user.upcomingShows.length === 0) return
      if (user.sms_alerts === true && user.email_alerts === true) {
        // await sendSMS(user.phone, user.upcomingShows.length);
        await sendEmail(user.email, user.upcomingShows);
      } else if (user.sms_alerts === true) {
        // await sendSMS(user.phone, user.upcomingShows.length);
      } else if (user.email_alerts === true) {
        await sendEmail(user.email, user.upcomingShows);
      }
    }))

    console.log("Reminders sent successfully");
  } catch (error) {
    console.error("Send reminders failed:", error);
  }
};
async function sendSMS(phone: string, count: number) {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID_1995,
    process.env.TWILIO_AUTH_TOKEN_1995)
    await client.messages.create({
      body: `Reminder: you have ${count} show(s) tomorrow...`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    })
}

async function sendEmail(email: string, shows: any[]) {
  const showRows = shows.map(({ events: e }) => {
    const time = e.doorsTime || e.showTime || '';
    return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #1e293b;">
          <div style="font-size:15px;font-weight:600;color:#f1f5f9;">${e.title}</div>
          <div style="font-size:13px;color:#94a3b8;margin-top:2px;">${e.venue}${time ? ` &mdash; ${time}` : ''}</div>
        </td>
      </tr>`
  }).join('')

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="background:#0f172a;margin:0;padding:0;font-family:Inter,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:40px auto;">
          <tr>
            <td style="padding:0 24px;">
              <p style="font-size:13px;color:#14b8a6;font-weight:600;letter-spacing:0.05em;margin:0 0 8px;">OPENER.FM</p>
              <h1 style="font-size:22px;font-weight:700;color:#f1f5f9;margin:0 0 4px;">Tonight's shows</h1>
              <p style="font-size:13px;color:#64748b;margin:0 0 24px;">Here's what you saved for tonight. Doors open soon.</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${showRows}
              </table>
              <p style="font-size:12px;color:#334155;margin-top:32px;">
                <a href="https://opener.fm/favorites" style="color:#14b8a6;text-decoration:none;">View all favorites</a>
                &nbsp;&middot;&nbsp;
                <a href="https://opener.fm" style="color:#334155;text-decoration:none;">opener.fm</a>
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>`

  const { data, error } = await resend.emails.send({
    from: 'reminders@opener.fm',
    to: email,
    subject: `Tonight: ${shows.length} show${shows.length > 1 ? 's' : ''} saved`,
    html,
  })
  console.log(data, error)
}
export const config: Config = {
  schedule: "0 14 * * *", // 8am CST (UTC-6) in winter / 9am CDT (UTC-5) in summer
};
