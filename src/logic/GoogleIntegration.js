export const createMeetEvent = async (accessToken, eventDetails) => {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            summary: eventDetails.summary || 'Interview Session',
            description: eventDetails.description || 'Automated Interview Scheduling',
            start: {
                dateTime: eventDetails.start, 
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
                dateTime: eventDetails.end,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            attendees: eventDetails.attendees.map(email => ({ email })),
            conferenceData: {
                createRequest: {
                    requestId: Math.random().toString(36).substring(7),
                    conferenceSolutionKey: { type: 'hangoutsMeet' }
                }
            }
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create calendar event: ' + await response.text());
    }

    return await response.json();
};

export const sendInviteEmail = async (accessToken, toEmail, subject, bodyHtml) => {
    const emailStr = [
        `To: ${toEmail}`,
        'Subject: ' + subject,
        'Content-Type: text/html; charset="UTF-8"',
        '',
        bodyHtml
    ].join('\r\n');

    const base64EncodedEmail = btoa(unescape(encodeURIComponent(emailStr)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            raw: base64EncodedEmail
        })
    });

    if (!response.ok) {
        throw new Error('Failed to send email: ' + await response.text());
    }

    return await response.json();
};
