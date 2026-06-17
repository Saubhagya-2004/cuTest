import React, { useMemo, useState } from "react";
import { createProduct } from "../services/productsApi";

export default function Product() {
  const categories = useMemo(
    () => [
      "Electronics",
      "Fashion",
      "Home",
      "Books",
      "Grocery",
      "Beauty",
      "Sports",
      "Other",
    ],
    [],
  );

  const statusOptions = ["Active", "Inactive"];

  const emptyForm = {
    name: "",
    category: categories[0],
    price: "",
    quantity: "",
    description: "",
    imageUrl: "",
    status: "Active",
  };

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
    setSuccess("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        imageUrl: "",
        price: form.price,
        quantity: form.quantity,
        description: form.description || "",
        status: "Active",
      };

      await createProduct(payload);

      setForm(emptyForm);
      setSuccess("Product added successfully.");
    } catch (err) {
      setError(err?.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-amber-400 m-6 border-2 p-2 rounded-2xl">
      <form onSubmit={onSubmit}>
        <div className="mt-4">
          <label>
            Product Name
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="e.g. Wireless Headphones"
              required
              className="border-2 m-5 p-4 rounded-2xl"
            />
          </label>
        </div>
        <div className=" mt-8">
          <label>
            Product Category
            <select
              className="border-2 border-teal-400 p-2 rounded-2xl ml-4"
              name="category"
              value={form.category}
              onChange={onChange}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4">
          <label>
            Product quantity
            <input
              name="quantity"
              value={form.quantity}
              onChange={onChange}
              placeholder="e.g. 10"
              required
              className="border-2 m-5 p-4 rounded-2xl"
            />
          </label>
        </div>
        <div className="flex justify-between items-center">
          <label>
            <span>Product Status</span>
            <select
              className="border-2 rounded-2xl ml-5"
              name="status"
              onChange={onChange}
              value={form.status}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
  type="button"
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
    Button Text
  </span>
</button>
        flex
        <div className="mt-4">
          <label>
            Product Description
            <input
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="e.g. Write your thought"
              className="border-2 m-5 p-4 rounded-2xl "
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
          disabled={saving}
          type="submit"
          className="bg-gray-600 border-2 rounded-2xl mt-5 text-white p-2"
        >
          {saving ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
