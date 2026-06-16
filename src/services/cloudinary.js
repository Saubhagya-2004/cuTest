const CLOUDINARY_CLOUD_NAME = "dg6xa0vkv"
const CLOUDINARY_UPLOAD_PRESET = "";
const CLOUDINARY_API_KEY ="771913546411974";
const CLOUDINARY_API_SECRET = "LcvKUp7Cdc3sy5L-xQOw20xIvI4";

function getUploadUrl() {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary cloud name is missing.");
  }

  return `https://api.cloudinary.com/v1_1/${encodeURIComponent(
    CLOUDINARY_CLOUD_NAME
  )}/image/upload`;
}

async function sha1(value) {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
}

async function buildSignedFields() {
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary upload configuration is missing.");
  }

  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = await sha1(`timestamp=${timestamp}${CLOUDINARY_API_SECRET}`);

  return {
    api_key: CLOUDINARY_API_KEY,
    timestamp,
    signature,
  };
}

export async function uploadImageToCloudinary(file) {
  if (!file) {
    throw new Error("Please select an image.");
  }

  const formData = new FormData();
  formData.append("file", file);

  if (CLOUDINARY_UPLOAD_PRESET) {
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  } else {
    const signedFields = await buildSignedFields();
    Object.entries(signedFields).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const response = await fetch(getUploadUrl(), {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Image upload failed.");
  }

  if (!data?.secure_url) {
    throw new Error("Cloudinary did not return an image URL.");
  }

  return data.secure_url;
}
