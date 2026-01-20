# Free Custom Domain Email Setup for PriceIQ

This guide explains how to set up professional email addresses like `hello@priceiq.com`, `privacy@priceiq.com`, etc., completely for **FREE**.

---

## Option 1: Zoho Mail (Recommended - Full Mailbox)

**Best for**: Actual email accounts with inbox, sent items, etc.  
**Free Tier**: 5 users, 5GB storage per user

### Setup Steps:

1. **Sign Up**
   - Go to [zoho.com/mail/](https://www.zoho.com/mail/)
   - Click "Get Started" → "Free Plan"
   - Enter your domain: `priceiq.com`

2. **Verify Domain Ownership**
   - Zoho will provide a TXT record
   - Add it to your DNS (Vercel/Cloudflare):
     ```
     Type: TXT
     Name: @
     Value: zoho-verification=zb12345678.zmverify.zoho.com
     ```

3. **Configure MX Records**
   Add these MX records to your DNS:
   ```
   Priority: 10 | Value: mx.zoho.com
   Priority: 20 | Value: mx2.zoho.com
   Priority: 50 | Value: mx3.zoho.com
   ```

4. **Create Email Accounts**
   - `hello@priceiq.com`
   - `privacy@priceiq.com`
   - `admin@priceiq.com`
   - `support@priceiq.com`
   - `noreply@priceiq.com`

5. **Access Your Mail**
   - Web: [mail.zoho.com](https://mail.zoho.com)
   - Mobile: Download Zoho Mail app
   - Desktop: Configure IMAP/SMTP in Outlook/Thunderbird

---

## Option 2: Cloudflare Email Routing (Easiest - Forwarding Only)

**Best for**: Simple email forwarding to your personal Gmail  
**Free Tier**: Unlimited email addresses, unlimited forwarding

### Setup Steps:

1. **Add Domain to Cloudflare** (if not already)
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Add `priceiq.com`
   - Update nameservers at your domain registrar

2. **Enable Email Routing**
   - In Cloudflare Dashboard → Email → Email Routing
   - Click "Get Started"
   - Cloudflare auto-configures DNS records

3. **Create Forwarding Rules**
   ```
   hello@priceiq.com       → [your-email]@gmail.com
   privacy@priceiq.com     → [your-email]@gmail.com
   admin@priceiq.com       → [your-email]@gmail.com
   *@priceiq.com (catch-all) → [your-email]@gmail.com
   ```

4. **Send Emails From Your Domain** (Optional)
   - Use Gmail's "Send mail as" feature
   - Settings → Accounts → "Add another email address"
   - SMTP: `smtp.gmail.com`, Port: `587`
   - Use your Gmail credentials

**Pros**: Zero setup time, unlimited aliases  
**Cons**: Can't actually "own" a mailbox (just forwarding)

---

## Option 3: ImprovMX (Alternative Forwarding)

**Best for**: Dead simple forwarding  
**Free Tier**: Unlimited aliases

### Setup Steps:

1. **Sign Up**
   - Go to [improvmx.com](https://improvmx.com)
   - Enter domain: `priceiq.com`

2. **Add MX Records**
   ```
   Priority: 10 | Value: mx1.improvmx.com
   Priority: 20 | Value: mx2.improvmx.com
   ```

3. **Create Aliases**
   ```
   hello     → [your-email]@gmail.com
   privacy   → [your-email]@gmail.com
   *         → [your-email]@gmail.com (catch-all)
   ```

---

## Recommended Setup for PriceIQ

### Best Approach (Hybrid):

1. **Use Cloudflare Email Routing** for instant setup:
   - `hello@priceiq.com` → [Your Email]
   - `privacy@priceiq.com` → Your Gmail
   - `*@priceiq.com` → Your Gmail (catch-all)

2. **Configure Gmail "Send As"**
   - Settings → Accounts → "Send mail as"
   - Add: `hello@priceiq.com`
   - Now you can receive AND send from your custom domain!

3. **Later, Migrate to Zoho** if you need:
   - Dedicated inboxes
   - Team members with separate accounts
   - Professional email client

---

## DNS Configuration Example (Cloudflare)

If using **Cloudflare Email Routing**, your DNS will look like:

```
Type    Name    Value
MX      @       route1.mx.cloudflare.net (Priority: 86)
MX      @       route2.mx.cloudflare.net (Priority: 20)
MX      @       route3.mx.cloudflare.net (Priority: 53)
TXT     @       v=spf1 include:_spf.mx.cloudflare.net ~all
TXT     _dmarc  v=DMARC1; p=none; rua=mailto:hello@priceiq.com
```

---

## Testing Your Setup

1. **Send a test email** to `hello@priceiq.com`
2. **Check your Gmail** to see if it forwarded
3. **Reply from Gmail** using "Send As" to verify outbound works

---



---

## Quick Start (Under 5 Minutes)

If you just want emails NOW:

1. Add `priceiq.com` to Cloudflare (if using Cloudflare for DNS)
2. Go to Email Routing → Get Started
3. Add rule: `*@priceiq.com` → `[your-email]@gmail.com`
4. Done! All emails now forward to your Gmail.

---

## Need Help?

- Cloudflare Docs: [developers.cloudflare.com/email-routing](https://developers.cloudflare.com/email-routing/)
- Zoho Setup: [zoho.com/mail/help/](https://www.zoho.com/mail/help/)
