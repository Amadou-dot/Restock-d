# Deployment Guide for Vercel

This guide explains how to deploy your Restock'd application to Vercel.

## Prerequisites

1. **Vercel Account**: Create an account at [vercel.com](https://vercel.com)
2. **Domain Setup**: Configure `restockd.aseck.dev` to point to your Vercel deployment
3. **MongoDB Atlas**: Set up a MongoDB Atlas cluster for production database
4. **AWS S3**: Configure S3 bucket for image storage
5. **Stripe Account**: Set up production Stripe keys
6. **Resend Account**: Set up email service for password resets

## Environment Variables

Configure these environment variables in your Vercel dashboard:

### Database
- `MONGODB_URI`: Your MongoDB Atlas connection string

### Session & Security
- `SESSION_SECRET`: A secure random string for session encryption
- `NODE_ENV`: Set to "production"

### AWS Configuration
- `AWS_S3_BUCKET_NAME`: Your S3 bucket name
- `AWS_REGION`: Your AWS region (e.g., us-east-1)
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key

### URLs
- `CLIENT_URL`: https://restockd.aseck.dev

### Email Configuration
- `RESEND_API_KEY`: Your Resend API key
- `EMAIL_FROM`: noreply@aseck.dev
- `APP_NAME`: Restock'd

### Stripe Configuration
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

## Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Build Settings**:
   - Build Command: `npm run build` (for client)
   - Output Directory: `client/dist`
   - Root Directory: Leave empty (uses vercel.json)
3. **Add Environment Variables**: Add all the variables listed above
4. **Deploy**: Vercel will automatically build and deploy your app

## Domain Configuration

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains" section
3. Add `restockd.aseck.dev` as a custom domain
4. Configure DNS settings as instructed by Vercel

## Post-Deployment Checklist

- [ ] Verify all API endpoints are working
- [ ] Test user authentication flow
- [ ] Confirm cart functionality
- [ ] Test Stripe payment integration
- [ ] Verify email sending (password reset)
- [ ] Check S3 image uploads
- [ ] Test MongoDB connection
- [ ] Verify CORS settings are working

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure CLIENT_URL is set correctly
2. **Database Connection**: Verify MongoDB URI and IP whitelist
3. **Session Issues**: Check SESSION_SECRET and cookie settings
4. **S3 Upload Errors**: Verify AWS credentials and bucket permissions
5. **Email Not Sending**: Check Resend API key and email settings

### Logs:
- Check Vercel function logs in the dashboard
- Monitor MongoDB Atlas logs
- Check AWS CloudWatch for S3 errors
