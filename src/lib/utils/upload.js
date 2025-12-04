import cloudinary from "./cloudinary";

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} buffer - The file buffer.
 * @param {string} fileName - A descriptive name for the file (e.g., 'avatar-user123').
 * @param {string} mimeType - The file's MIME type (e.g., 'image/png').
 * @returns {Promise<string|null>} - Public URL of the uploaded file or null on failure.
 */
export async function uploadFile(buffer, fileName, mimeType) {
    return new Promise((resolve, reject) => {
        // Convert buffer to a base64 data URI
        const dataUri = `data:${mimeType};base64,${buffer.toString('base64')}`;

        // Upload to Cloudinary
        cloudinary.uploader.upload(dataUri, {
            public_id: fileName, // Use a unique name for the file in Cloudinary
            resource_type: "auto" // Let Cloudinary determine if it's an image, video, etc.
        })
        .then(result => {
            console.log("File uploaded successfully to Cloudinary:", result.secure_url);
            resolve(result.secure_url);
        })
        .catch(error => {
            console.error("Cloudinary upload error:", error);
            reject(error);
        });
    });
}


/**
 * Deletes a file from Cloudinary using its public URL.
 * @param {string} fileUrl - The full Cloudinary URL of the file to delete.
 * @returns {Promise<boolean>} - True if deletion was successful, false otherwise.
 */
export async function deleteFile(fileUrl) {
    try {
        // Cloudinary URLs have a structure like:
        // https://res.cloudinary.com/<cloud_name>/<resource_type>/upload/<version>/<public_id>.<format>
        // We need to extract the public_id.
        const urlParts = fileUrl.split('/');
        const publicIdWithFormat = urlParts[urlParts.length - 1];
        const publicId = publicIdWithFormat.split('.')[0];
        
        if (!publicId) {
            console.error("Could not extract public_id from URL:", fileUrl);
            return false;
        }

        // Determine resource type from URL (image, video, etc.)
        const resourceType = urlParts[urlParts.length - 4];

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

        if (result.result === 'ok') {
            console.log(`File deleted successfully from Cloudinary: ${publicId}`);
            return true;
        } else {
            console.error("Cloudinary deletion failed:", result);
            return false;
        }
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        return false;
    }
}
