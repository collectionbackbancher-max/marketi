# Profile Page Guide

## Overview

The Profile page allows users to view and manage their business information. It integrates seamlessly with the Supabase database and provides a clean, intuitive interface for editing business details.

## Features

### 1. View Mode
When users first visit the Profile page, they see a read-only view of their business information displayed in a grid layout with visual icons:

- **Business Name** - Main business identifier
- **Industry** - What sector the business operates in
- **Business Type** - Whether it's local, online, or service-based
- **City** - Location of the business
- **Main Goal** - Primary marketing objective
- **Monthly Budget** - Marketing budget range

Each field is displayed in its own card with a color-coded icon for easy scanning.

### 2. Edit Mode
Users can click the "Edit Profile" button to enter edit mode where they can:

- Update any of the 6 business fields
- See real-time validation feedback
- Cancel changes to revert to the last saved state
- Save changes with a loading state indicator

### 3. Supabase Integration
All changes are automatically saved to the `business_profiles` table with:

- Automatic user association (linked via `user_id`)
- Timestamp tracking with `updated_at` field
- Error handling with user-friendly messages
- Success confirmation after saves

## User Experience

### Initial Load
- Loading spinner displays while fetching profile data
- Profile data is fetched from Supabase based on the authenticated user
- If no profile exists, user is directed to complete their profile first

### Editing
- Clicking "Edit Profile" button switches to edit mode
- All form fields are pre-populated with current values
- Changes are reflected in real-time as user types
- "Cancel" button reverts any unsaved changes
- "Save Changes" button updates the database

### Feedback
- Success message appears for 3 seconds after saving
- Error messages display with clear problem descriptions
- Loading state during save operation
- Form is disabled while saving to prevent multiple submissions

## Database Schema

The profile data is stored in the `business_profiles` table with the following fields:

```sql
- id (uuid) - Primary key
- user_id (uuid) - Foreign key to auth.users
- business_name (text) - Name of the business
- industry (text) - Industry category
- business_type (text) - Type: local, online, or service
- city (text) - Business location
- budget_range (text) - Monthly marketing budget range
- goals (text) - Main marketing goal
- created_at (timestamp) - When profile was created
- updated_at (timestamp) - When profile was last updated
```

## Available Options

### Industries
- Retail
- Food & Beverage
- Services
- E-commerce
- Healthcare
- Education
- Technology
- Real Estate
- Consulting
- Other

### Business Types
- Local (Physical Location)
- Online (Digital)
- Service-Based

### Main Goals
- Get more customers
- Increase sales
- Build brand awareness
- Get more leads
- Engage customers online

### Budget Ranges
- Under $500
- $500 - $1,000
- $1,000 - $2,500
- $2,500 - $5,000
- $5,000+

## Styling & Responsiveness

The Profile page uses:
- Tailwind CSS for styling
- Responsive grid layout that adapts to mobile, tablet, and desktop
- Color-coded icons for visual distinction
- Smooth transitions and hover states
- Accessible form inputs with proper labels

## Navigation

The Profile page is accessible via:
- Dashboard navigation menu
- URL: `/profile` (when routed via App.tsx)
- Can be accessed at any time by authenticated users

## Technical Details

### Component Location
`src/components/ProfilePage.tsx`

### State Management
- `loading` - Indicates profile is being fetched
- `saving` - Indicates changes are being saved
- `isEditing` - Toggles between view and edit modes
- `profile` - Current saved profile data
- `editedProfile` - Working copy during editing
- `error` - Error messages
- `success` - Success messages

### Error Handling
- Network errors from Supabase are caught and displayed
- Invalid form submissions are prevented
- Graceful fallback if profile doesn't exist
- Console logging for debugging

## Future Enhancements

Potential improvements:
- Profile image upload
- Batch updates
- Profile validation rules
- Change history tracking
- Profile templates or presets
