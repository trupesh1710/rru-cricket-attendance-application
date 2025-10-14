# Setting up Automatic Absent Marking with External Cron Service

## Step 1: Get Your Supabase API Details
1. Go to your Supabase project dashboard
2. Go to Settings → API
3. Note down:
   - **Project URL**: `https://momzyjivwyfdhvjkhnjk.supabase.co`
   - **Service Role Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vbXp5aml2d3lmZGh2amtobmprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDIxMDA1MywiZXhwIjoyMDc1Nzg2MDUzfQ.R49WkYfMKfcWgOC3sUlkSbBypEc1jy0t1HKSUUhPkV8

## Step 2: Choose a Cron Service
Here are two free/reliable options:

### Option A: Cron-Job.org (Recommended - Free)
1. Go to https://cron-job.org
2. Create a free account
3. Create a new cron job with these settings:
   - **Title**: Mark Absent Users Daily
   - **URL**: `https://momzyjivwyfdhvjkhnjk.supabase.co/rest/v1/rpc/mark_absent_users`
   - **Method**: POST
   - **Headers**:
     ```
     apikey: your-anon-key
     Authorization: Bearer your-service-role-key
     Content-Type: application/json
     ```
   - **Body**: Leave empty (or `{}`)
   - **Schedule**: Custom → `50 23 * * *` (Daily at 11:50 PM)
   - **Timezone**: Your local timezone

### Option B: EasyCron.com
1. Go to https://www.easycron.com
2. Create a free account (100 executions/month free)
3. Create a new cron job:
   - **URL**: `https://your-project-id.supabase.co/rest/v1/rpc/mark_absent_users`
   - **Method**: POST
   - **Headers**:
     ```
     apikey: your-anon-key
     Authorization: Bearer your-service-role-key
     Content-Type: application/json
     ```
   - **Post Data**: Leave empty
   - **Schedule**: `50 23 * * *` (Daily at 23:50)

## Step 3: Test the Setup
1. After creating the cron job, you can test it manually from the cron service dashboard
2. Check your Supabase database to see if absent records were created
3. You can also test manually by running the SQL function:
   ```sql
   SELECT mark_absent_users();
   ```

## Security Notes
- Use the **Service Role Key** (not anon key) for this operation since it modifies data
- The function is created with `SECURITY DEFINER` which means it runs with elevated privileges
- Only users who haven't marked attendance for the current day will be marked as absent

## Monitoring
- The cron service will show you execution logs
- You can check the attendance table in Supabase to verify records are being created
- The function returns a message indicating how many users were marked absent
