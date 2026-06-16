const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

function assertEnv(name, value) {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
}




function getUploadUrl() {
  assertEnv("VITE_CLOUDINARY_CLOUD_NAME", CLOUDINARY_CLOUD_NAME);


  return `https://api.cloudinary.com/v1_1/${encodeURIComponent(
    CLOUDINARY_CLOUD_NAME
  )}/image/upload`;
}

async function sha1(value) {
  const data = new TextEncoder().encode(value); // used for computer encoding
  const hashBuffer = await crypto.subtle.digest("SHA-1", data); // used for hashing
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert to byte array

  return hashArray
    .map((item) => item.toString(16).padStart(2, "0")) //convert to hexadecimal string
    .join("");
}

async function buildSignedFields() {
  assertEnv("VITE_CLOUDINARY_API_KEY", CLOUDINARY_API_KEY);
  assertEnv("VITE_CLOUDINARY_API_SECRET", CLOUDINARY_API_SECRET);


  const timestamp = String(Math.floor(Date.now() / 1000)); //required for signed security check
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

  const formData = new FormData(); // form data as a package that holds the file before upload
  formData.append("file", file); //here we append the file (ex- image.jpg)

  if (CLOUDINARY_UPLOAD_PRESET) {
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  } else {
    // Signed upload requires API key + secret

    const signedFields = await buildSignedFields(); // here we build the signed fields
    Object.entries(signedFields).forEach(([key, value]) => {
      formData.append(key, value); // here we append the signed fields
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
