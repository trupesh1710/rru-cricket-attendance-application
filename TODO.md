# TODO: Integrate Supabase for User Authentication and Management

## Step 1: Install Dependencies
- [x] Install @supabase/supabase-js dependency

## Step 2: Set Up Supabase Client
- [x] Create Supabase client in App.js using environment variables

## Step 3: Database Setup (Manual)
- [x] Create 'users' table in Supabase with columns: id (auto), name, email, username, password, role
- [x] Pre-insert admin user (username: 'admin', password: 'admin123', role: 'admin')

## Step 4: Update State Management
- [x] Remove local users array from state
- [x] Add loading and error states for async operations
- [x] Add function to fetch users from Supabase for admin dashboard

## Step 5: Modify User Registration
- [x] Update handleUserRegister to insert user into Supabase with role='user' (use email as username)
- [x] Add async/await and error handling

## Step 6: Modify User Login
- [x] Update handleUserLogin to query Supabase for email/password match where role='user'
- [x] Add async/await and error handling

## Step 7: Modify Admin Login
- [x] Update handleAdminLogin to query Supabase for username/password match where role='admin'
- [x] Add async/await and error handling

## Step 8: Modify Password Reset
- [x] Update handleResetPassword to query and update password in Supabase
- [x] Add async/await and error handling

## Step 9: Modify Admin User Management
- [x] Update handleAddUser to insert user into Supabase
- [x] Update handleDeleteUser to delete from Supabase
- [x] Update handleEditUser and handleSaveEdit to update in Supabase
- [x] Add async/await and error handling for all

## Step 10: Update Components (if needed)
- [ ] Check if register form needs username field (use email as username)

## Step 11: Testing
- [ ] Test user registration
- [ ] Test user login
- [ ] Test admin login
- [ ] Test password reset
- [ ] Test admin user management (add, edit, delete)
- [ ] Ensure attendance features remain unaffected
