<template>
  <div class="cloudinary-image-uploader">
    <div
      class="upload-zone"
      :class="{
        'is-dragging': isDragging,
        'has-image': imageUrl,
        'is-disabled': disabled || uploading,
      }"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @click="!disabled && !uploading && triggerFileInput()"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        class="file-input-hidden"
      />

      <!-- Upload Area -->
      <div v-if="!imageUrl" class="upload-content">
        <div class="upload-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <p class="upload-text">
          <strong>{{
            uploading ? "Mengupload..." : "Klik area ini atau drag & drop"
          }}</strong>
        </p>
        <button
          @click.stop="triggerFileInput"
          :disabled="disabled || uploading"
          class="btn-browse"
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Browse Files
        </button>
        <p class="upload-hint">
          {{ hint || "PNG, JPG, GIF, WebP (Max 10MB)" }}
        </p>
        <div v-if="uploading" class="progress-bar">
          <div class="progress-fill" :style="{ width: '50%' }"></div>
        </div>
      </div>

      <!-- Image Preview -->
      <div v-else class="image-preview-wrapper">
        <img
          :src="imageUrl"
          :alt="fileName || 'Preview'"
          class="image-preview"
        />
        <div class="image-overlay">
          <div class="image-info">
            <p class="file-name">{{ fileName }}</p>
            <p class="file-url">{{ publicId }}</p>
          </div>
          <div class="image-actions">
            <button @click.stop="copyUrl" class="btn-action" title="Copy URL">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <rect
                  x="9"
                  y="9"
                  width="13"
                  height="13"
                  rx="2"
                  ry="2"
                  stroke-width="2"
                />
                <path
                  d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                  stroke-width="2"
                />
              </svg>
            </button>
            <button
              @click.stop="removeImage"
              class="btn-action btn-danger"
              title="Hapus"
              :disabled="disabled"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="error-message">{{ error }}</p>

    <!-- Success Message -->
    <p v-if="showSuccess" class="success-message">
      ✓ Image uploaded successfully!
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { uploadToCloudinary } from "@/api/services/upload.service";
import { useNotification } from "@/composables/useNotification";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  folder: {
    type: String,
    default: "antitesa/general",
  },
  hint: {
    type: String,
    default: "",
  },
  maxSizeMB: {
    type: Number,
    default: 10,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  returnPublicId: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "uploaded", "error"]);

const { success: showSuccessToast, error: showErrorToast } = useNotification();

const fileInput = ref(null);
const isDragging = ref(false);
const imageUrl = ref(props.modelValue || "");
const publicId = ref("");
const fileName = ref("");
const error = ref("");
const uploading = ref(false);
const showSuccess = ref(false);

// Watch for external changes
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && newVal !== imageUrl.value) {
      imageUrl.value = newVal;
    }
  }
);

const triggerFileInput = () => {
  if (!props.disabled && !uploading.value) {
    fileInput.value?.click();
  }
};

const validateFile = (file) => {
  error.value = "";

  // Check file type
  if (!file.type.startsWith("image/")) {
    error.value = "File harus berupa gambar";
    return false;
  }

  // Check file size
  const maxBytes = props.maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    error.value = `Ukuran file tidak boleh lebih dari ${props.maxSizeMB}MB`;
    return false;
  }

  return true;
};

const uploadFile = async (file) => {
  if (!validateFile(file)) {
    return;
  }

  try {
    uploading.value = true;
    error.value = "";
    showSuccess.value = false;
    fileName.value = file.name;

    // Create FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", props.folder);

    // Upload to Cloudinary via API
    const result = await uploadToCloudinary(formData);

    // Update values
    imageUrl.value = result.url;
    publicId.value = result.publicId;

    // Emit the appropriate value based on returnPublicId prop
    const valueToEmit = props.returnPublicId ? result.publicId : result.url;
    emit("update:modelValue", valueToEmit);
    emit("uploaded", result);

    // Show success
    showSuccess.value = true;
    showSuccessToast("Image berhasil diupload!");

    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);
  } catch (err) {
    console.error("Upload error:", err);

    // Better error messages
    let errorMessage = "Gagal mengupload image";

    if (err.response) {
      const status = err.response.status;
      if (status === 401) {
        errorMessage = "Anda harus login terlebih dahulu untuk upload gambar";
      } else if (status === 404) {
        errorMessage =
          "Endpoint upload tidak ditemukan. Pastikan server sudah berjalan";
      } else if (status === 413) {
        errorMessage = "Ukuran file terlalu besar";
      } else if (err.response.data?.message) {
        errorMessage = err.response.data.message;
      }
    } else if (err.request) {
      errorMessage =
        "Tidak dapat terhubung ke server. Cek koneksi internet Anda";
    } else if (err.message) {
      errorMessage = err.message;
    }

    error.value = errorMessage;
    emit("error", err);
    showErrorToast(errorMessage);
  } finally {
    uploading.value = false;
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadFile(file);
  }
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    uploadFile(file);
  }
};

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(imageUrl.value);
    showSuccessToast("URL berhasil dicopy!");
  } catch (err) {
    showErrorToast("Gagal copy URL");
  }
};

const removeImage = () => {
  if (props.disabled) return;

  imageUrl.value = "";
  publicId.value = "";
  fileName.value = "";
  error.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  emit("update:modelValue", "");
};
</script>

<style scoped>
.cloudinary-image-uploader {
  width: 100%;
}

.upload-zone {
  position: relative;
  border: 2px dashed #e0d4f7;
  border-radius: 16px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #faf8ff 0%, #f5f3ff 100%);
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-zone:hover:not(.is-disabled) {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.15);
  transform: translateY(-2px);
}

.upload-zone.is-dragging {
  border-color: #7c3aed;
  border-style: solid;
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  transform: scale(1.02);
  box-shadow: 0 12px 32px rgba(139, 92, 246, 0.25);
}

.upload-zone.has-image {
  padding: 0;
  border: none;
  background: transparent;
  min-height: auto;
}

.upload-zone.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.file-input-hidden {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.upload-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
  margin-bottom: 8px;
}

.upload-icon svg {
  width: 36px;
  height: 36px;
}

.upload-text {
  font-size: 17px;
  color: #1f2937;
  margin: 0;
  line-height: 1.5;
}

.upload-text strong {
  color: #7c3aed;
  font-weight: 600;
  display: block;
  font-size: 18px;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  padding: 8px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.btn-browse {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 4px 0;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
}

.btn-browse:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
}

.btn-browse:active:not(:disabled) {
  transform: translateY(0);
}

.btn-browse:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-browse svg {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.progress-bar {
  width: 100%;
  max-width: 240px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  margin-top: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #7c3aed, #6d28d9);
  border-radius: 6px;
  animation: loading 1.8s ease-in-out infinite;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

.image-preview-wrapper {
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.image-preview-wrapper:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.image-preview {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  display: block;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    transparent 30%,
    transparent 70%,
    rgba(0, 0, 0, 0.8) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
}

.image-preview-wrapper:hover .image-overlay {
  opacity: 1;
}

.image-info {
  text-align: left;
}

.file-name {
  color: white;
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 6px 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.file-url {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.image-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  color: #374151;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
}

.btn-action:hover:not(:disabled) {
  background: white;
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-action:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
}

.btn-danger:hover:not(:disabled) {
  background: #ef4444;
  color: white;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin: 16px 0 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  font-weight: 500;
}

.error-message::before {
  content: "⚠️";
  font-size: 16px;
}

.success-message {
  color: #10b981;
  font-size: 14px;
  margin: 16px 0 0 0;
  font-weight: 600;
  padding: 12px 16px;
  background: #d1fae5;
  border: 1px solid #6ee7b7;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Dark Mode Support */
.dark .upload-zone {
  background: linear-gradient(135deg, #1e1b2e 0%, #27233a 100%);
  border-color: #3d3456;
}

.dark .upload-zone:hover:not(.is-disabled) {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #27233a 0%, #2d1b4e 100%);
}

.dark .upload-zone.is-dragging {
  background: linear-gradient(135deg, #2d1b4e 0%, #3d2561 100%);
}

.dark .upload-text {
  color: #e5e7eb;
}

.dark .upload-hint {
  color: #9ca3af;
  background: #1f2937;
  border-color: #374151;
}

.dark .btn-browse {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
}

.dark .btn-browse:hover:not(:disabled) {
  background: linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%);
}
</style>
