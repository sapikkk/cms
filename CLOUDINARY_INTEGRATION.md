# Cloudinary Image Upload Integration

## ✨ Overview

Sistem sekarang telah terintegrasi dengan **Cloudinary** untuk upload image langsung dari dalam aplikasi. User tidak perlu lagi keluar sistem untuk upload image dan mendapatkan URL.

## 🚀 Production Deployment

- **Frontend**: https://client-ten-drab-52.vercel.app
- **Backend API**: https://antitesa-api-production.up.railway.app/api/v1
- **Status**: ✅ Live & Running

## 🎯 Features

- ✅ Upload image langsung ke Cloudinary
- ✅ Drag & drop support
- ✅ Preview image sebelum upload
- ✅ Copy URL dengan satu klik
- ✅ Progress indicator
- ✅ Validasi file type dan size
- ✅ Delete image dari Cloudinary
- ✅ Optimized image URLs

## 📦 Components Created

### Backend

1. **`server/src/services/cloudinary.service.ts`**

   - Upload image dari buffer
   - Upload image dari base64
   - Delete image
   - Get optimized URL
   - Upload multiple images

2. **`server/src/controllers/upload.controller.ts`**

   - Handle upload requests
   - Validasi dan error handling

3. **`server/src/routes/v1/upload.routes.ts`**
   - `POST /api/v1/upload/image` - Upload single image
   - `POST /api/v1/upload/images` - Upload multiple images
   - `POST /api/v1/upload/base64` - Upload from base64
   - `DELETE /api/v1/upload/image/:publicId` - Delete image
   - `GET /api/v1/upload/optimize/:publicId` - Get optimized URL

### Frontend

1. **`client/src/components/ui/CloudinaryImageUploader.vue`**

   - Drag & drop upload zone
   - Image preview
   - Copy URL button
   - Delete button
   - Progress indicator
   - Error handling

2. **`client/src/api/services/upload.service.js`**
   - API calls untuk upload
   - API calls untuk delete
   - API calls untuk optimize

### Integration

✅ **Page Builder** - Semua field image di Page Builder sudah menggunakan CloudinaryImageUploader

- Upload langsung dari editor
- Organized by page ID dalam folder
- Fallback ke manual URL input

### 2. Custom Usage in Components

## � Where It's Used

### 1. Page Builder (Dashboard)

**Automatically integrated!** Semua field yang berisi kata "image" atau "url" di Page Builder akan otomatis menggunakan CloudinaryImageUploader.

**Location:** `/dashboard/pages/{id}/builder`

**Features:**

- Drag & drop upload
- Images organized by page ID: `antitesa/pages/{pageId}/`
- Preview gambar langsung
- Copy URL dengan satu klik
- Fallback manual URL input jika user prefer paste link

**Widgets yang support:**

- HeroBanner (semua variasi)
- ContentImage (Left/Right)
- GalleryGrid
- VideoEmbed
- Dan semua widget dengan field image/imageUrl

### 2. Custom Usage in Components

### 1. Environment Variables

Tambahkan ke **`server/.env`**:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STORAGE_TYPE=cloudinary
```

### 2. Get Cloudinary Credentials

1. Sign up atau login ke [Cloudinary](https://cloudinary.com/)
2. Buka Dashboard
3. Copy credentials:
   - Cloud Name
   - API Key
   - API Secret

### 3. Cara Penggunaan di Vue Component

```vue
<template>
  <div>
    <CloudinaryImageUploader
      v-model="product.imageUrl"
      folder="antitesa/products"
      hint="Upload product image (Max 10MB)"
      @uploaded="handleUploaded"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import CloudinaryImageUploader from "@/components/ui/CloudinaryImageUploader.vue";

const product = ref({
  imageUrl: "",
});

const handleUploaded = (result) => {
  console.log("Uploaded:", result);
  // result contains: url, publicId, width, height, format, size
};
</script>
```

### 4. Props Available

```javascript
{
  modelValue: String,      // v-model binding untuk URL
  folder: String,          // Folder di Cloudinary (default: 'antitesa/general')
  hint: String,           // Custom hint text
  maxSizeMB: Number,      // Max file size (default: 10)
  disabled: Boolean,      // Disable upload
  returnPublicId: Boolean // Return publicId instead of URL (default: false)
}
```

### 5. Events

```javascript
@update:modelValue  // Emit when image uploaded (URL or publicId)
@uploaded          // Emit full result object
@error            // Emit when error occurs
```

## 📝 Usage Examples

### Example 1: Simple Upload

```vue
<CloudinaryImageUploader v-model="imageUrl" />
```

### Example 2: With Custom Folder

```vue
<CloudinaryImageUploader
  v-model="product.coverImage"
  folder="antitesa/books"
  hint="Upload book cover (PNG, JPG)"
/>
```

### Example 3: Return Public ID

```vue
<CloudinaryImageUploader
  v-model="product.imagePublicId"
  folder="antitesa/merchandise"
  :return-public-id="true"
/>
```

### Example 4: With Event Handlers

```vue
<CloudinaryImageUploader
  v-model="imageUrl"
  @uploaded="onImageUploaded"
  @error="onUploadError"
/>

<script setup>
const onImageUploaded = (result) => {
  console.log("Image uploaded successfully!");
  console.log("URL:", result.url);
  console.log("Public ID:", result.publicId);
  console.log("Size:", result.size, "bytes");
};

const onUploadError = (error) => {
  console.error("Upload failed:", error);
};
</script>
```

## 🎨 Features Detail

### Drag & Drop

User bisa drag & drop image langsung ke upload zone

### Copy URL

Klik tombol copy untuk langsung copy URL ke clipboard

### Image Preview

Image otomatis di-preview setelah upload

### Validation

- File type: Hanya accept image files
- File size: Max 10MB (configurable)
- Format: PNG, JPG, GIF, WebP

### Folders Organization

Images akan tersimpan di folder yang ditentukan:

- `antitesa/general` - Default
- `antitesa/pages/{pageId}` - **Page Builder images (automatic)**
- `antitesa/products` - Product images
- `antitesa/books` - Book covers
- `antitesa/merchandise` - Merchandise images
- `antitesa/events` - Event banners

## 🔐 Security

- ✅ Authentication required untuk semua upload endpoints
- ✅ File type validation di frontend & backend
- ✅ File size limit enforcement
- ✅ Rate limiting (via existing middleware)
- ✅ CORS configured

## 🚀 API Endpoints

### Upload Single Image

```bash
POST /api/v1/upload/image
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- file: <image file>
- folder: "antitesa/products" (optional)
```

### Upload Multiple Images

```bash
POST /api/v1/upload/images
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- files: <array of image files>
- folder: "antitesa/products" (optional)
```

### Delete Image

```bash
DELETE /api/v1/upload/image/:publicId
Authorization: Bearer <token>
```

## 🎯 Features

1. **User Experience**

   - No need to leave the system
   - Instant URL generation
   - Visual preview
   - Easy copy & paste
   - **Integrated in Page Builder** - Upload directly from widget editor

2. **Developer Experience**

   - Simple component API
   - Reusable across the app
   - Type-safe service layer
   - Error handling built-in

3. **Performance**

   - Cloudinary CDN
   - Automatic optimization
   - Responsive images
   - Format conversion

4. **Maintenance**
   - Centralized image storage
   - Easy to organize (folders)
   - Version control
   - Backup & recovery

## 📋 Next Steps

1. ✅ Set up Cloudinary account
2. ✅ Add credentials to `.env`
3. ✅ Import component where needed
4. ✅ Test upload functionality
5. ⏭️ (Optional) Add image transformation options
6. ⏭️ (Optional) Add bulk upload UI
7. ⏭️ (Optional) Add image cropping

## 🐛 Troubleshooting

### Upload fails with 401

- Check if token is valid
- Verify authentication middleware is working

### Upload fails with Cloudinary error

- Verify CLOUDINARY\_\* env variables are set
- Check Cloudinary account limits
- Verify API credentials are correct

### Image not displaying

- Check URL is accessible
- Verify CORS settings
- Check browser console for errors

## 💡 Tips

1. Use descriptive folder names for better organization
2. Set appropriate maxSizeMB based on use case
3. Handle @error event to show user-friendly messages
4. Consider adding image cropping for profile pictures
5. Use returnPublicId=true if you need to store publicId in DB

---

**Ready to use! 🎉**
