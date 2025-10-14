import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get today's date
    const today = new Date().toISOString().split('T')[0]

    // Get all users
    const { data: users, error: usersError } = await supabaseClient
      .from('users')
      .select('id')
      .eq('role', 'user')

    if (usersError) {
      throw usersError
    }

    // Get attendance records for today
    const { data: todayAttendance, error: attendanceError } = await supabaseClient
      .from('attendance')
      .select('user_id')
      .eq('date', today)

    if (attendanceError) {
      throw attendanceError
    }

    // Find users who haven't marked attendance today
    const attendedUserIds = new Set(todayAttendance.map(a => a.user_id))
    const absentUsers = users.filter(user => !attendedUserIds.has(user.id))

    // Mark absent for users who haven't attended
    if (absentUsers.length > 0) {
      const absentRecords = absentUsers.map(user => ({
        user_id: user.id,
        date: today,
        time: '23:50:00', // 11:50 PM
        status: 'Absent',
        location: 'Auto-marked absent'
      }))

      const { error: insertError } = await supabaseClient
        .from('attendance')
        .insert(absentRecords)

      if (insertError) {
        throw insertError
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Marked ${absentUsers.length} users as absent for ${today}`,
        absentCount: absentUsers.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error marking absent:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
