import { Resend } from "resend";

export default defineEventHandler(async (event) => {
  const { name, email, message } = await readBody(event);

  if (!name || !email || !message) {
    throw createError({ statusCode: 400, message: "All fields are required." });
  }

  const config = useRuntimeConfig();
  const resend = new Resend(config.resendApiKey);

  const { error } = await resend.emails.send({
    from: "opener.fm <noreply@opener.fm>",
    to: "arnav@opener.fm",
    replyTo: email,
    subject: `Contact from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    throw createError({ statusCode: 500, message: "Failed to send message." });
  }

  return { ok: true };
});
