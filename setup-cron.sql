    -- Create the mark_absent function that can be called directly
    CREATE OR REPLACE FUNCTION mark_absent_users()
    RETURNS TEXT AS $$
    DECLARE
        today_date DATE := CURRENT_DATE;
        absent_count INTEGER := 0;
        user_record RECORD;
    BEGIN
        -- Loop through all users with role 'user'
        FOR user_record IN
            SELECT id FROM users WHERE role = 'user'
        LOOP
            -- Check if user already has attendance for today
            IF NOT EXISTS (
                SELECT 1 FROM attendance
                WHERE user_id = user_record.id
                AND date = today_date
            ) THEN
                -- Insert absent record
                INSERT INTO attendance (user_id, date, time, status, location)
                VALUES (user_record.id, today_date, '23:50:00', 'Absent', 'Auto-marked absent');

                absent_count := absent_count + 1;
            END IF;
        END LOOP;

        RETURN 'Marked ' || absent_count || ' users as absent for ' || today_date;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Unschedule the existing job if it exists
    SELECT cron.unschedule('mark-absent-daily');

-- Create a cron job to run the mark_absent_users function daily at 11:50 PM IST (6:20 PM UTC)
SELECT cron.schedule(
  'mark-absent-daily', -- job name
  '20 18 * * *',       -- cron schedule: 20 18 * * * (6:20 PM UTC daily, which is 11:50 PM IST)
  'SELECT mark_absent_users();' -- SQL command to execute
);

    -- To unschedule the job later if needed:
    -- SELECT cron.unschedule('mark-absent-daily');

    -- To view scheduled jobs:
    -- SELECT * FROM cron.job;

    -- To run manually for testing:
    -- SELECT mark_absent_users();
