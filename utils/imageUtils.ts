/**
 * Image Processing Utilities
 * Helper functions for image handling and optimization
 */

/**
 * Validate image size
 * @param uri - Image URI
 * @param maxSizeBytes - Maximum size in bytes
 * @returns True if valid
 */
export async function validateImageSize(
  uri: string,
  maxSizeBytes: number = 5 * 1024 * 1024 // 5MB default
): Promise<boolean> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob.size <= maxSizeBytes;
  } catch (error) {
    console.error("Image validation error:", error);
    return false;
  }
}

/**
 * Validate base64 string size
 * @param base64 - Base64 encoded string
 * @param maxSizeBytes - Maximum size in bytes
 * @returns True if valid
 */
export function validateBase64Size(
  base64: string,
  maxSizeBytes: number = 5 * 1024 * 1024
): boolean {
  // Base64 size is approximately 4/3 of original
  const sizeInBytes = (base64.length * 3) / 4;
  return sizeInBytes <= maxSizeBytes;
}

/**
 * Format file size for display
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Calculate image dimensions
 * @param uri - Image URI
 * @returns Width and height
 */
export function getImageDimensions(
  uri: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    import("react-native")
      .then(({ Image }) => {
        Image.getSize(
          uri,
          (width: number, height: number) => resolve({ width, height }),
          (error: Error) => reject(error)
        );
      })
      .catch(reject);
  });
}
