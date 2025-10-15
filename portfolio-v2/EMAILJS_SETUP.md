# EmailJS Setup Guide

This guide will help you set up EmailJS to receive email notifications when someone submits the contact form on your portfolio.

## Step 1: Create an EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add an Email Service

1. After logging in, go to the **Email Services** page
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. **Copy the Service ID** (you'll need this later)

## Step 3: Create an Email Template

1. Go to the **Email Templates** page
2. Click **Create New Template**
3. Use this template structure:

### Template Content:

**Subject:**
```
New Contact Message from {{from_name}}
```

**Body:**
```
You have received a new message from your portfolio website!

From: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Subject: {{subject}}

Message:
{{message}}

---
Sent from your Portfolio Contact Form
```

4. **Copy the Template ID** (you'll need this later)
5. Click **Save**

## Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** in the API Keys section
3. **Copy the Public Key**

## Step 5: Add EmailJS Credentials to .env File

1. Open your `.env` file (create one if it doesn't exist by copying `.env.example`)
2. Add these values:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

Replace the placeholders with your actual values from EmailJS.

## Step 6: Restart Your Development Server

```bash
npm run dev
```

## Testing

1. Go to your portfolio website
2. Navigate to the Contact section
3. Fill out the form and submit
4. Check your email inbox - you should receive the notification!

## Troubleshooting

- **Not receiving emails?**
  - Check your EmailJS dashboard for failed sends
  - Verify your service is connected properly
  - Check spam folder

- **Error in console?**
  - Verify all three environment variables are set correctly
  - Make sure you restarted the dev server after adding .env variables

- **Template not working?**
  - Make sure template variable names match exactly (case-sensitive)
  - Test the template in EmailJS dashboard first

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- 2 email templates
- 1 email service

For higher limits, consider upgrading to a paid plan.

## Security Note

Your EmailJS Public Key is safe to use in frontend code. It's designed to be public and doesn't give access to your email account.

---

## Additional Features

The contact form already includes:
- ✅ Email notifications to your inbox
- ✅ Messages saved in Firebase (Admin can view in Messages tab)
- ✅ Unread message count badge in admin sidebar
- ✅ Mark messages as read/unread
- ✅ Delete messages from admin panel
- ✅ Auto-refresh unread count every 30 seconds
