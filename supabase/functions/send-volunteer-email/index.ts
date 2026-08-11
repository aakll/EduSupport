import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;

    const emailBody = `
      <h2>New Volunteer Application</h2>
      <p><strong>Name:</strong> ${record.first_name} ${record.last_name}</p>
      <p><strong>Email:</strong> ${record.email}</p>
      <p><strong>Role:</strong> ${record.role_applied_for}</p>
      <p><strong>Scholarship:</strong> ${record.scholarship_received}</p>
      <p><strong>University:</strong> ${record.university}</p>
      <p><strong>Major:</strong> ${record.major}</p>
      <p><strong>Level:</strong> ${record.level || "N/A"}</p>
      <p><strong>Graduation date:</strong> ${record.graduation_date}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "EduSupport <onboarding@resend.dev>",
        to: "alikawaar8@gmail.com",
        subject: `New Volunteer Application: ${record.first_name} ${record.last_name}`,
        html: emailBody,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});