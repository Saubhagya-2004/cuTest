import React, { useEffect, useState } from "react";
import {
  createProduct,
  getProducts,
  deleteProduct,
} from "../services/productsApi";
import { uploadImageToCloudinary } from "../services/cloudinary";
import { useForm } from "react-hook-form";

const categories = ["Electronics", "Fashion", "Home", "Sports", "Books"];
const statusOptions = ["Active", "Inactive"];

export default function Product() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      category: "Electronics",
      price: "",
      quantity: "",
      description: "",
      status: "Active",
    },
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoadingProducts(true);
      setError("");
      try {
        const items = await getProducts();
        if (mounted) setProducts(items);
      } catch (e) {
        if (mounted) setError(e?.message);
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const refreshProducts = async () => {
    setLoadingProducts(true);
    setError("");
    try {
      const items = await getProducts();
      setProducts(items);
    } catch (e) {
      setError(e?.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const onImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setSuccess("");
    setError("");
    setImagePreview(file ? URL.createObjectURL(file) : "");
    console.log(imagePreview);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!imageFile) throw new Error("Please select an image.");
      const imageUrl = await uploadImageToCloudinary(imageFile);
      console.log(imageUrl);
      const payload = {
        name: data.name,
        category: data.category,
        price: data.price,
        quantity: data.quantity,
        description: data.description || "",
        imageUrl,
        status: data.status === "Inactive" ? "Inactive" : "Active",
      };

      await createProduct(payload);

      reset();
      setImageFile(null);
      setImagePreview("");
      setSuccess("Product added successfully.");

      await refreshProducts();
    } catch (err) {
      setError(err?.message);
    } finally {
      setSaving(false);
    }
  };

  //Delete
  const handleDelete = async (product) => {
    setSaving(true);
    try {
      await deleteProduct(product.id);
      await refreshProducts();
      setSuccess("Product deleted successfully.");
      console.log("Product deleted successfully.");
    } catch (err) {
      setError(err.messag);
      console.log(err.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="border-amber-400 m-6 border-2 p-2 rounded-2xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4">
          <label>
            Product Name
            <input
              className="border-2 m-5 p-4 rounded-2xl"
              placeholder="e.g. Wireless Headphones"
              {...register("name", { required: "Product Name is required" })}
            />
          </label>
          {errors.name ? (
            <div style={{ marginTop: 4, color: "red" }}>
              {errors.name.message}
            </div>
          ) : null}
        </div>

        <div className="mt-4">
          <label>
            Product Category
            <select
              className="border-2 border-teal-400 p-2 rounded-2xl ml-4"
              {...register("category", { required: "Category is required" })}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          {errors.category ? (
            <div style={{ marginTop: 4, color: "red" }}>
              {errors.category.message}
            </div>
          ) : null}
        </div>

        <div className="mt-4">
          <label>
            Product Price
            <input
            type="number"
              className="border-2 m-5 p-4 rounded-2xl"
              placeholder="e.g. 199.99"
              {...register("price", { required: "Price is required" })}
            />
          </label>
          {errors.price ? (
            <div style={{ marginTop: 4, color: "red" }}>
              {errors.price.message}
            </div>
          ) : null}
        </div>

        <div className="mt-4">
          <label>
            Product Quantity
            <input
            type = 'number'
              className="border-2 m-5 p-4 rounded-2xl"
              placeholder="e.g. 10"
              {...register("quantity", { required: "Quantity is required" })}
            />
          </label>
          {errors.quantity ? (
            <div style={{ marginTop: 4, color: "red" }}>
              {errors.quantity.message}
            </div>
          ) : null}
        </div>

        <div className="flex justify-between items-center mt-3">
          <label>
            <span>Product Status</span>
            <select
              className="border-2 rounded-2xl ml-5 p-2"
              {...register("status")}
              defaultValue="Active"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4">
          <label>
            Product Image
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="border-2 m-5 p-4 rounded-2xl"
              required
            />
          </label>

          {imagePreview ? (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="preview"
                style={{
                  maxWidth: 240,
                  maxHeight: 200,
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />
              <span>{imagePreview}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-4">
          <label>
            Product Description
            <input
              className="border-2 m-5 p-4 rounded-2xl"
              placeholder="e.g. Write your thought"
              {...register("description")}
            />
          </label>
        </div>

        {error ? (
          <div style={{ marginTop: 8, color: "red" }}>{error}</div>
        ) : null}
        {success ? (
          <div style={{ marginTop: 8, color: "green" }}>{success}</div>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="
    group relative overflow-hidden
    inline-flex items-center justify-center
    rounded-full px-6 py-3.5
    font-extrabold text-white
    bg-gradient-to-br from-[#0052CC] via-[#003E9B] to-[#0052CC]
    shadow-[0_18px_55px_rgba(0,82,204,0.18)]
  "
        >
          <span
          
            className="
      absolute inset-y-0 -left-20 w-12
      bg-white/30 blur-md
      skew-x-[-20deg]
      animate-shine
    "
          />
          <span className="relative z-10">
            {saving ? "Saving..." : "Add Product"}
          </span>
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-bold">Product List</h3>

        {loadingProducts ? (
          <div style={{ marginTop: 8 }}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={{ marginTop: 8 }}>No products found.</div>
        ) : (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {products.map((p) => (
              <div
                key={p.id}
                className="border border-gray-300 rounded-2xl p-3"
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 12,
                        objectFit: "cover",
                      }}
                    />
                  ) : null}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ color: "#444" }}>{p.category}</div>
                    <div style={{ color: "#444" }}>Price: {p.price}</div>
                    <div style={{ color: "#444" }}>Qty: {p.quantity}</div>
                    <div
                      className={`inline-block px-2 py-1 rounded border text-xs font-medium ${
                        p.status === "Active"
                          ? "border-green-600 bg-green-100 text-green-700"
                          : "border-red-600 bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </div>
                    <div
                      className="border-2 rounded-2xl flex items-center justify-center mt-3 p-[10px] cursor-pointer"
                      onClick={() => handleDelete(p)}
                      type="button"
                    >
                     <button
  type="button"
  onClick={() => handleDelete(p)}
  className="
    group relative overflow-hidden
    inline-flex items-center justify-center
    rounded-full px-6 py-3.5
    font-extrabold text-white
    bg-gradient-to-r from-red-500 via-pink-500 to-red-700
    shadow-lg
  "
>
  <span className="shine absolute" />
  <span className="relative z-10">
    Delete
  </span>
</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
