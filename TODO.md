# TODO: Fix Attendance Saving to Supabase

- [x] Change initial attendance state to empty array
- [x] Add fetchAttendance function to load attendance records from Supabase
- [x] Call fetchAttendance in useEffect on app initialization
- [x] Modify handleMarkAttendance to insert into 'attendance' table and refetch
- [x] Update handleDeleteUser to delete attendance records from DB and refetch
