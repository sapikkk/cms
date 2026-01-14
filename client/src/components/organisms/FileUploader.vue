<template>
  <div class="file-uploader">
    <div
      class="drop-zone"
      :class="{ 'is-dragging': isDragging, 'has-file': fileUrl }"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        @change="handleFileSelect"
        class="file-input"
      />

      <div v-if="!fileUrl" class="drop-zone-content">
        <div class="upload-icon">📁</div>
        <p class="upload-text">
          <strong>Click to upload</strong> or drag and drop
        </p>
        <p class="upload-hint">
          {{ acceptText }} (Max {{ maxSizeMB }}MB)
        </p>
      </div>

      <div v-else class="preview-content">
        <img v-if="isImage" :src="fileUrl" alt="Preview" class="image-preview" />
        <div v-else class="file-preview">
          <div class="file-icon">📄</div>
          <p class="file-name">{{ fileName }}</p>
          <p class="file-size">{{ formatFileSize(fileSize) }}</p>
        </div>
        <button @click.stop="removeFile" class="remove-btn">Remove</button>
      </div>
    </div>

    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="uploading" class="upload-status">
      <span class="spinner">⏳</span> Uploading...
    </p>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'FileUploader',
  props: {
    modelValue: String,
    accept: {
      type: String,
      default: 'image/*'
    },
    maxSizeMB: {
      type: Number,
      default: 5
    },
    acceptText: {
      type: String,
      default: 'PNG, JPG, GIF up to 10MB'
    }
  },
  emits: ['update:modelValue', 'upload'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const isDragging = ref(false)
    const fileUrl = ref(props.modelValue || '')
    const fileName = ref('')
    const fileSize = ref(0)
    const error = ref('')
    const uploading = ref(false)

    const isImage = computed(() => {
      return props.accept.includes('image')
    })

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const validateFile = (file) => {
      error.value = ''

      // Check file size
      const maxBytes = props.maxSizeMB * 1024 * 1024
      if (file.size > maxBytes) {
        error.value = `File size exceeds ${props.maxSizeMB}MB`
        return false
      }

      // Check file type
      if (props.accept && props.accept !== '*') {
        const acceptedTypes = props.accept.split(',').map(t => t.trim())
        const fileType = file.type
        const isAccepted = acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            const category = type.split('/')[0]
            return fileType.startsWith(category)
          }
          return fileType === type
        })

        if (!isAccepted) {
          error.value = 'File type not allowed'
          return false
        }
      }

      return true
    }

    const processFile = (file) => {
      if (!validateFile(file)) return

      fileName.value = file.name
      fileSize.value = file.size

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        fileUrl.value = e.target.result
        emit('update:modelValue', e.target.result)
      }
      reader.readAsDataURL(file)

      // Emit upload event
      emit('upload', file)
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        processFile(file)
      }
    }

    const handleDrop = (event) => {
      isDragging.value = false
      const file = event.dataTransfer.files[0]
      if (file) {
        processFile(file)
      }
    }

    const removeFile = () => {
      fileUrl.value = ''
      fileName.value = ''
      fileSize.value = 0
      error.value = ''
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      emit('update:modelValue', '')
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return {
      fileInput,
      isDragging,
      fileUrl,
      fileName,
      fileSize,
      error,
      uploading,
      isImage,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      removeFile,
      formatFileSize
    }
  }
}
</script>

<style scoped>
.file-uploader {
  width: 100%;
}

.drop-zone {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drop-zone:hover {
  border-color: #8B4513;
  background: #fff;
}

.drop-zone.is-dragging {
  border-color: #8B4513;
  background: #fef3e2;
  border-width: 3px;
}

.drop-zone.has-file {
  border-style: solid;
  border-color: #10b981;
}

.file-input {
  display: none;
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  font-size: 48px;
  opacity: 0.5;
}

.upload-text {
  margin: 0;
  font-size: 14px;
  color: #374151;
}

.upload-hint {
  margin: 0;
  font-size: 13px;
  color: #9ca3af;
}

.preview-content {
  position: relative;
  width: 100%;
}

.image-preview {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  object-fit: contain;
}

.file-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.file-icon {
  font-size: 64px;
}

.file-name {
  margin: 0;
  font-weight: 500;
  color: #111827;
}

.file-size {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.remove-btn {
  margin-top: 12px;
  padding: 8px 16px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #b91c1c;
}

.error-message {
  margin-top: 8px;
  color: #dc2626;
  font-size: 13px;
}

.upload-status {
  margin-top: 8px;
  color: #8B4513;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
