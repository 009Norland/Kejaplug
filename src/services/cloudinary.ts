// Cloudinary image upload service with timeout

// Your actual Cloudinary credentials
const CLOUDINARY_CLOUD_NAME = 'di16x5wpz'; // ✅ Your cloud name
const CLOUDINARY_UPLOAD_PRESET = 'kejaplug_uploads'; // ✅ Your upload preset
const UPLOAD_TIMEOUT = 30000; // 30 seconds timeout

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    console.log('📤 Starting upload:', file.name, `(${Math.round(file.size / 1024)}KB)`);

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File too large. Maximum size is 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'kejaplug');

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    console.log('🌐 Uploading to:', uploadUrl);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT);

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Upload failed:', data);
        
        // Specific error messages
        if (response.status === 401) {
          throw new Error('Upload preset not authorized. Make sure it is set to "Unsigned"');
        } else if (response.status === 404) {
          throw new Error('Cloud name not found. Check your cloud name');
        } else {
          throw new Error(data.error?.message || `Upload failed (${response.status})`);
        }
      }

      console.log('✅ Upload successful!');
      console.log('🔗 Image URL:', data.secure_url);
      
      return data.secure_url;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Upload timeout. File too large or slow internet connection');
      }
      throw error;
    }
  } catch (error: any) {
    console.error('💥 Upload error:', error);
    throw error;
  }
};

export const uploadMultipleToCloudinary = async (files: File[]): Promise<string[]> => {
  console.log(`📤 Uploading ${files.length} file(s)...`);
  
  const urls: string[] = [];
  
  // Upload one by one to avoid overwhelming the connection
  for (let i = 0; i < files.length; i++) {
    console.log(`  Uploading ${i + 1}/${files.length}: ${files[i].name}`);
    try {
      const url = await uploadToCloudinary(files[i]);
      urls.push(url);
    } catch (error) {
      console.error(`Failed to upload ${files[i].name}:`, error);
      throw new Error(`Failed to upload ${files[i].name}: ${error}`);
    }
  }
  
  console.log('✅ All uploads complete!');
  return urls;
};