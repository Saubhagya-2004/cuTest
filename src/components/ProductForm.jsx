const statusOptions = ["Active", "Inactive"];

export default function ProductForm({
  categories,
  createdDateLabel,
  error,
  errors,
  fileInputKey,
  form,
  imagePreview,
  isEditing,
  onCancel,
  onChange,
  onImageChange,
  onSubmit,
  saving,
  uploading,
}) {
  const isBusy = saving || uploading;
  const submitLabel = uploading
    ? "Uploading image..."
    : saving
      ? "Saving..."
      : isEditing
        ? "Update Product"
        : "Add Product";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[28px] bg-white/90 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isEditing
              ? "Update product details and save your changes."
              : "Enter the product details to create a new item."}
          </p>
        </div>
        {createdDateLabel ? (
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Created {createdDateLabel}
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Product Name
          </span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            name="name"
            onChange={onChange}
            placeholder="Wireless Headphones"
            value={form.name}
          />
          {errors.name ? (
            <span className="mt-1 block text-xs text-red-600">{errors.name}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Product Category
          </span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            name="category"
            onChange={onChange}
            value={form.category}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category ? (
            <span className="mt-1 block text-xs text-red-600">
              {errors.category}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Product Price
          </span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            min="0"
            name="price"
            onChange={onChange}
            placeholder="199.99"
            step="0.01"
            type="number"
            value={form.price}
          />
          {errors.price ? (
            <span className="mt-1 block text-xs text-red-600">
              {errors.price}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Product Quantity
          </span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            min="0"
            name="quantity"
            onChange={onChange}
            placeholder="25"
            step="1"
            type="number"
            value={form.quantity}
          />
          {errors.quantity ? (
            <span className="mt-1 block text-xs text-red-600">
              {errors.quantity}
            </span>
          ) : null}
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Product Status
          </span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
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

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Product Image
          </span>
          <input
            key={fileInputKey}
            accept="image/*"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-[11px] text-slate-900 outline-none transition focus:border-sky-400"
            onChange={onImageChange}
            type="file"
          />
          {errors.image ? (
            <span className="mt-1 block text-xs text-red-600">
              {errors.image}
            </span>
          ) : null}
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Product Description
        </span>
        <textarea
          className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
          name="description"
          onChange={onChange}
          placeholder="Add a short product description"
          value={form.description}
        />
        {errors.description ? (
          <span className="mt-1 block text-xs text-red-600">
            {errors.description}
          </span>
        ) : null}
      </label>

      {imagePreview ? (
        <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
          <img
            alt={form.name || "Product preview"}
            className="h-56 w-full object-cover"
            src={imagePreview}
          />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isBusy}
          type="submit"
        >
          {submitLabel}
        </button>
        {isEditing ? (
          <button
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
