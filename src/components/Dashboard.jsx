import { useEffect, useState, useMemo } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";
import ProductForm from "./ProductForm";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productsApi";
import { uploadImageToCloudinary } from "../services/cloudinary";
import { BiRupee } from "react-icons/bi";

const CATEGORIES = [
  "Electronics", "Fashion", "Home", "Books",
  "Grocery", "Beauty", "Sports", "Other",
];

const emptyForm = {
  name: "",
  category: CATEGORIES[0],
  price: "",
  quantity: "",
  description: "",
  imageUrl: "",
  status: "Active",
};

function formatDate(value) {
  if (!value) return "Not available";
  
  const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) 
    ? "Not available" 
    : date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function validateProduct(form, imageFile, isEditing) {
  const errors = {};
  
  if (!form.name.trim()) errors.name = "Product name is required.";
  if (!form.category.trim()) errors.category = "Please choose a category.";
  if (form.price === "" || Number.isNaN(Number(form.price)) || Number(form.price) < 100) {
    errors.price = "Price must be 100 more.";
  }
  if (form.quantity === "" || Number.isNaN(Number(form.quantity)) || Number(form.quantity) < 0) {
    errors.quantity = "Quantity must be 0 or more.";
  }
  if (!isEditing && !imageFile) errors.image = "Please upload a product image.";
  if (isEditing && !form.imageUrl && !imageFile) errors.image = "Please upload a product image.";
  
  return errors;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [filters, setFilters] = useState({ searchTerm: "", categoryFilter: "All", statusFilter: "All" });
  const [loadingState, setLoadingState] = useState({ 
    products: true, saving: false, uploading: false, deleting: null 
  });
  const [errors, setErrors] = useState({ page: "", form: "", formFields: {}, logout: "" });

  useEffect(() => {
    let isMounted = true;
    
    getProducts()
      .then(items => {
        if (isMounted) {
          setProducts(items);
          setErrors(e => ({ ...e, page: "" }));
        }
      })
      .catch(error => {
        if (isMounted) {
          setErrors(e => ({ ...e, page: error?.message || "Could not load products." }));
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingState(l => ({ ...l, products: false }));
        }
      });
    
    return () => isMounted = false;
  }, []);

  const refreshProducts = async () => {
    const items = await getProducts();
    setProducts(items);
    setErrors(e => ({ ...e, page: "" }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview("");
    setErrors(e => ({ ...e, form: "", formFields: {} }));
    setFileInputKey(k => k + 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, form: "", formFields: { ...e.formFields, [name]: "" } }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setErrors(e => ({ ...e, formFields: { ...e.formFields, image: "" } }));
    setImagePreview(file ? URL.createObjectURL(file) : form.imageUrl || "");
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name ,
      category: product.category || CATEGORIES[0],
      price: String(product.price ?? ""),
      quantity: String(product.quantity ?? ""),
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      status: product.status || "Active",
    });
    setImageFile(null);
    setImagePreview(product.imageUrl );
    setErrors(e => ({ ...e, form: "", formFields: {} }));
    setFileInputKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const errors = validateProduct(form, imageFile, Boolean(editingProduct));
    setErrors(e => ({ ...e, formFields: errors }));
    
    if (Object.keys(errors).length > 0) return;

    setLoadingState(l => ({ ...l, saving: true }));
    
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        setLoadingState(l => ({ ...l, uploading: true }));
        imageUrl = await uploadImageToCloudinary(imageFile);
      }
      
      const payload = { ...form, imageUrl };
      if (editingProduct) await updateProduct(editingProduct.id, payload);
      else await createProduct(payload);
      
      await refreshProducts();
      resetForm();
    } catch (error) {
      setErrors(e => ({ ...e, form: error?.message || "Could not save product." }));
    } finally {
      setLoadingState(l => ({ ...l, saving: false, uploading: false }));
    }
  };

  const handleDelete = async (product) => {
    // if (!window.confirm(`Delete "${product.name}"?`)) return;
    
    setLoadingState(l => ({ ...l, deleting: product.id }));
    setErrors(e => ({ ...e, page: "" }));
    
    try {
      await deleteProduct(product.id);
      await refreshProducts();
      if (editingProduct?.id === product.id) resetForm();
    } catch (error) {
      setErrors(e => ({ ...e, page: error?.message || "Could not delete product." }));
    } finally {
      setLoadingState(l => ({ ...l, deleting: null }));
    }
  };

  const handleLogout = async () => {
    setErrors(e => ({ ...e, logout: "" }));
    try { await signOut(auth); }
    catch (error) { setErrors(e => ({ ...e, logout: error?.message || "Logout failed." })); }
  };

  const categories = useMemo(() => 
    [...new Set([...CATEGORIES, ...products.map(p => p.category).filter(Boolean)])],
    [products]
  );

  const filteredProducts = useMemo(() => 
    products.filter(product => {
      const search = filters.searchTerm.trim().toLowerCase();
      return (
        (search === "" || [product.name, product.category, product.description].join(" ").toLowerCase().includes(search)) &&
        (filters.categoryFilter === "All" || product.category === filters.categoryFilter) &&
        (filters.statusFilter === "All" || product.status === filters.statusFilter)
      );
    }),
    [products, filters]
  );

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="overflow-hidden rounded-[32px] bg-slate-900 px-6 py-8 text-white shadow-2xl shadow-slate-300/60">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-200">Product Management</p>
            <div className="min-w-64 rounded-[28px] bg-white/10 p-4 backdrop-blur">
              <div className="text-sm text-slate-300">Signed in as</div>
              <div className="mt-1 break-all text-lg font-medium text-white">{user?.email || "Unknown user"}</div>
              <button className="mt-4 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100" onClick={handleLogout} type="button">
                Logout
              </button>
              {errors.logout && <div className="mt-3 text-sm text-red-200">{errors.logout}</div>}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-6 xl:self-start">
            <ProductForm
              categories={categories}
              createdDateLabel={editingProduct ? formatDate(editingProduct.createdAt) : ""}
              error={errors.form}
              errors={errors.formFields}
              fileInputKey={fileInputKey}
              form={form}
              imagePreview={imagePreview}
              isEditing={Boolean(editingProduct)}
              onCancel={resetForm}
              onChange={handleChange}
              onImageChange={handleImageChange}
              onSubmit={handleSubmit}
              saving={loadingState.saving}
              uploading={loadingState.uploading}
            />
          </div>

          <div className="space-y-6">
            {/* Filters */}
            <div className="rounded-[28px] bg-white/90 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Product Listing</h2>
                  <p className="mt-1 text-sm text-slate-500">Search or filter by category and status.</p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                  Showing {filteredProducts.length} of {products.length}
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Search Products</span>
                  <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
                    onChange={(e) => setFilters(f => ({ ...f, searchTerm: e.target.value }))}
                    placeholder="Search by name, category, or description" value={filters.searchTerm} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Filter by Category</span>
                  <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
                    onChange={(e) => setFilters(f => ({ ...f, categoryFilter: e.target.value }))} value={filters.categoryFilter}>
                    <option value="All">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Filter by Status</span>
                  <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
                    onChange={(e) => setFilters(f => ({ ...f, statusFilter: e.target.value }))} value={filters.statusFilter}>
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>
              </div>

              {errors.page && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.page}</div>}
            </div>

            {/* Product List */}
            {loadingState.products ? (
              <div className="rounded-[28px] bg-white/90 p-10 text-center text-slate-500 shadow-lg ring-1 ring-slate-200">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-[28px] bg-white/90 p-10 text-center shadow-lg ring-1 ring-slate-200">
                <h3 className="text-xl font-semibold text-slate-900">No products found</h3>
                <p className="mt-2 text-sm text-slate-500">Try different filters or add your first product.</p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {filteredProducts.map(product => {
                  const isDeleting = loadingState.deleting === product.id;
                  const isEditing = editingProduct?.id === product.id;
                  
                  return (
                    <article key={product.id} className={`overflow-hidden rounded-[28px] bg-white/90 shadow-lg ring-1 backdrop-blur transition ${
                      isEditing ? "ring-sky-300 shadow-sky-100" : "ring-slate-200 hover:-translate-y-1 hover:shadow-xl"
                    }`}>
                      <div className="relative">
                        <img alt={product.name} className="h-56 w-full object-cover" src={product.imageUrl} />
                        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                          product.status === "Active" ? "bg-emerald-500 text-white" : "bg-slate-900 text-white"
                        }`}>{product.status}</span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
                            <p className="mt-1 text-sm font-medium text-sky-700">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-slate-900 flex items-center"><BiRupee />{product.price}</div>
                            <div className="text-sm text-slate-500">Qty: {product.quantity}</div>
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-600">{product.description}</p>
                        <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-500">
                          <span>Created {formatDate(product.createdAt)}</span>
                          <span>ID: {product.id.slice(0, 6)}</span>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            onClick={() => handleEdit(product)} type="button">Edit</button>
                          <button className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isDeleting} onClick={() => handleDelete(product)} type="button">
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
