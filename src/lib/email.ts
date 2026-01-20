import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    if (!process.env.RESEND_API_KEY) {
        console.log(`[DEV MODE] Email to ${to} suppressed (No API Key). Subject: ${subject}`);
        return { success: true, id: 'mock-id' };
    }

    try {
        const data = await resend.emails.send({
            from: 'PriceIQ <onboarding@resend.dev>', // Default Resend testing domain
            to,
            subject,
            html,
        });

        return { success: true, data };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error };
    }
}
