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
            uploading ? "Mengupload..." : "Klik untuk upload"
          }}</strong>
          atau drag & drop
        </p>
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

const { showSuccess: showSuccessToast, showError } = useNotification();

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
  if (!disabled.value && !uploading.value) {
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
    error.value = err.message || "Gagal mengupload image";
    emit("error", err);
    showError(error.value);
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
    showError("Gagal copy URL");
  }
};

const removeImage = () => {
  if (disabled.value) return;

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
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-zone:hover:not(.is-disabled) {
  border-color: #8b5cf6;
  background: #f5f3ff;
}

.upload-zone.is-dragging {
  border-color: #8b5cf6;
  background: #ede9fe;
  transform: scale(1.01);
}

.upload-zone.has-image {
  padding: 0;
  border: none;
  background: transparent;
  min-height: auto;
}

.upload-zone.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.file-input-hidden {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.upload-icon {
  color: #8b5cf6;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 16px;
  color: #374151;
  margin: 0;
}

.upload-text strong {
  color: #8b5cf6;
  font-weight: 600;
}

.upload-hint {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.progress-bar {
  width: 100%;
  max-width: 200px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
  animation: loading 1.5s ease-in-out infinite;
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
  border-radius: 12px;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  display: block;
  background: #000;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.7) 0%,
    transparent 40%,
    transparent 60%,
    rgba(0, 0, 0, 0.7) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
}

.image-preview-wrapper:hover .image-overlay {
  opacity: 1;
}

.image-info {
  text-align: left;
}

.file-name {
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.file-url {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.image-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-action:hover:not(:disabled) {
  background: white;
  transform: scale(1.05);
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-danger:hover:not(:disabled) {
  background: #ef4444;
  color: white;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin: 12px 0 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.error-message::before {
  content: "⚠️";
}

.success-message {
  color: #10b981;
  font-size: 14px;
  margin: 12px 0 0 0;
  font-weight: 500;
}
</style>
