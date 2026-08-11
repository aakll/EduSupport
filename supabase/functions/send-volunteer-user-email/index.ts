import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;
    const emailType = payload.type; // "submitted" or "approved"

    let subject = "";
    let body = "";

    if (emailType === "submitted") {
      subject = "We received your volunteer application";
      body = `
        <h2>Thanks for applying, ${record.first_name}!</h2>
        <p>We've received your application for <strong>${record.role_applied_for}</strong>.</p>
        <p>We'll review it and get back to you soon.</p>
      `;
    } else if (emailType === "approved") {
      subject = "You're approved as a volunteer!";
      body = `
        <h2>Congratulations, ${record.first_name}!</h2>
        <p>Your application for <strong>${record.role_applied_for}</strong> has been approved.</p>
        <p>Thank you for joining EduSupport as a volunteer — we're excited to have you!</p>
      `;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "EduSupport <onboarding@resend.dev>",
        to: record.email,
        subject,
        html: body,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});