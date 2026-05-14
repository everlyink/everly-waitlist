export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  const { name, email, reason } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'everly <hello@everly.ink>',
        to: email,
        reply_to: 'hello@everly.ink',
        subject: 'you\'re on the list.',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>you're on the list.</title>
</head>
<body style="margin:0;padding:0;background:#FAFAF8;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF8;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- logo -->
          <tr>
            <td style="padding-bottom:40px;">
              <span style="font-family:Georgia,serif;font-size:1.2rem;color:#C0604A;letter-spacing:-0.01em;">everly|</span>
            </td>
          </tr>

          <!-- greeting -->
          <tr>
            <td style="padding-bottom:24px;border-bottom:1px solid #E8D5B0;">
              <p style="margin:0;font-family:Georgia,serif;font-size:1.5rem;color:#1C1C1A;line-height:1.4;letter-spacing:-0.01em;">
                dear ${name},
              </p>
            </td>
          </tr>

          <!-- body -->
          <tr>
            <td style="padding-top:32px;padding-bottom:32px;">
              <p style="margin:0 0 20px;font-family:Georgia,serif;font-size:1rem;color:#1C1C1A;line-height:1.8;">
                you're on the list. we'll let you know the moment everly is ready for you.
              </p>
              <p style="margin:0 0 20px;font-family:Georgia,serif;font-size:1rem;color:#1C1C1A;line-height:1.8;">
                while you wait — think about the message you'd most want to send. the one you've been meaning to write. the one that should arrive on a specific day, in a specific year, to a specific person.
              </p>
              <p style="margin:0;font-family:Georgia,serif;font-size:1rem;color:#1C1C1A;line-height:1.8;">
                that's exactly what everly is for.
              </p>
            </td>
          </tr>

          <!-- divider -->
          <tr>
            <td style="padding-bottom:32px;border-top:1px solid #E8D5B0;"></td>
          </tr>

          <!-- sign off -->
          <tr>
            <td style="padding-bottom:48px;">
              <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:0.95rem;color:#1C1C1A;line-height:1.7;">with care,</p>
              <p style="margin:0;font-family:Georgia,serif;font-size:0.95rem;color:#C0604A;">the everly team</p>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="border-top:1px solid #E8D5B0;padding-top:24px;">
              <p style="margin:0;font-family:Georgia,serif;font-size:0.75rem;color:rgba(28,28,26,0.4);line-height:1.6;">
                everly · everly.ink<br/>
                you're receiving this because you joined the everly waitlist.<br/>
                <a href="mailto:hello@everly.ink" style="color:rgba(28,28,26,0.4);">unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'failed to send email' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'server error' });
  }
}
