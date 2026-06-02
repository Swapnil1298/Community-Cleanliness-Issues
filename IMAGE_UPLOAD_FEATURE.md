# Image Upload Feature Implementation

## Overview
Added comprehensive image upload functionality with support for camera capture and file explorer selection. Users can now upload images for issues and profile pictures directly from their device camera or file system.

## Features Implemented

### 1. **ImageUpload Component** (`src/Componentes/ImageUpload.jsx`)
- Reusable component for image selection
- Supports both camera capture and file selection
- Real-time image preview
- File validation (size, type)
- Error handling with toast notifications
- Max file size: 5MB
- Supported formats: JPG, PNG, GIF, WebP

### 2. **Updated AddIssue Page** (`src/Pages/AddIssue.jsx`)
- Replaced URL-only image input with ImageUpload component
- Added image file upload handling
- Images are uploaded to the server before issue submission
- Integrated with `uploadIssueImage` API

### 3. **Updated Profile Page** (`src/Pages/Profile.jsx`)
- Camera button on profile picture now opens image upload modal
- Users can update their profile picture with camera or file
- Images are uploaded directly to the server
- Page reloads after successful upload to show new image

### 4. **Backend Upload Routes** (`server/routes/upload.js`)
- POST `/api/upload/issue` - Upload issue images
- POST `/api/upload/profile` - Upload profile images
- File storage with multer middleware
- Unique filename generation
- Image validation and error handling
- Maximum file size: 5MB

### 5. **API Service Updates** (`src/api/databaseService.js`)
- `uploadIssueImage(file)` - Uploads issue image and returns URL
- `uploadProfileImage(file)` - Uploads profile image and returns URL
- Both functions use FormData for file transmission

### 6. **Server Configuration** (`server/index.js`)
- Added upload routes to Express app
- Integrated upload router with `/api/upload` prefix
- Static file serving already configured for `/uploads` directory

## File Structure

### Frontend
```
src/
├── Componentes/
│   └── ImageUpload.jsx (NEW)
├── Pages/
│   ├── AddIssue.jsx (UPDATED)
│   └── Profile.jsx (UPDATED)
└── api/
    └── databaseService.js (UPDATED)
```

### Backend
```
server/
├── routes/
│   └── upload.js (NEW)
├── index.js (UPDATED)
├── uploads/
│   ├── profiles/
│   └── issues/ (NEW - auto-created)
└── middleware/
    └── upload.js (existing)
```

## Key Improvements

1. **User-Friendly Image Selection**: Users don't need to find image URLs; they can directly upload from device
2. **Mobile Support**: Camera capture works on mobile devices and browsers with camera access
3. **Image Preview**: Users see preview before upload
4. **Validation**: Client-side validation for file type and size
5. **Error Handling**: Comprehensive error messages with toast notifications
6. **Responsive Design**: Works on all screen sizes
7. **Performance**: Images stored on server instead of relying on external URLs

## How to Use

### For Issue Reporting
1. Navigate to "Report New Issue" page
2. Fill in all required fields
3. Click "Choose from File" to select from device storage or "Take Photo" to capture from camera
4. Preview the image and adjust if needed
5. Submit the form - image uploads automatically

### For Profile Picture
1. Go to Profile page
2. Click the camera icon on your profile picture
3. Select "Choose from File" or "Take Photo"
4. Image uploads automatically
5. Page refreshes to show new profile picture

## Technical Details

### Image Upload Process
1. User selects image via camera or file explorer
2. Client-side validation (type, size)
3. Image preview generated using FileReader API
4. On form submission, image is uploaded to server using FormData
5. Server returns image URL
6. URL is saved to database with issue/user record

### Server Response Format
```json
{
  "success": true,
  "imageUrl": "/uploads/issues/timestamp-random.jpg",
  "filePath": "/uploads/issues/timestamp-random.jpg",
  "filename": "timestamp-random.jpg"
}
```

## Environment Variables
No new environment variables required. Uses existing `VITE_API_URL` configuration.

## Dependencies
- No new dependencies added
- Uses existing: multer, react-hot-toast, react-icons

## Browser Compatibility
- Camera capture: Supported in modern browsers (Chrome, Firefox, Safari, Edge)
- File selection: Universal support
- Fallback to file selection available on all browsers

## Security Considerations
- File type validation on client and server
- File size limitation (5MB)
- Unique filename generation to prevent overwrites
- Server-side storage instead of public URLs

## Testing Recommendations
1. Test image upload with various file types
2. Test camera capture on mobile devices
3. Test file size validation (>5MB)
4. Test error handling for invalid files
5. Verify image persistence in database
6. Check image URLs resolve correctly after upload

## Future Enhancements
- Image cropping/editing before upload
- Multiple image uploads for single issue
- Image compression before upload
- CDN integration for image storage
- Image metadata extraction (EXIF data)
- Thumbnail generation for performance
