import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const productsCollection = collection(db, "products");

function formatProduct(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

function normalizeProduct(product) {
  return {
    name: String(product.name ).trim(),
    category: String(product.category ).trim(),
    price: Number(product.price),
    quantity: Number(product.quantity),
    description: String(product.description ).trim(),
    imageUrl: String(product.imageUrl ).trim(),
    status: product.status === "Inactive" ? "Inactive" : "Active",
  };
}

export async function getProducts() {
  const productsQuery = query(productsCollection, orderBy("createdAt", "desc")); //gave latest product
  const snapshot = await getDocs(productsQuery); // returns all products
  return snapshot.docs.map(formatProduct); // returns formatted products like object
}

export async function createProduct(product) { // add product
  const payload = normalizeProduct(product); // normalize product
  const docRef = await addDoc(productsCollection, { // add product in firestore
    ...payload,
    createdAt: serverTimestamp(), // add timestamp
  });
  const snapshot = await getDoc(docRef); 
  return formatProduct(snapshot); // return formatted product
}

export async function updateProduct(id, product) { //update by ids
  const payload = normalizeProduct(product); //clean product
  const docRef = doc(db, "products", id);

  await updateDoc(docRef, payload);

  const snapshot = await getDoc(docRef);
  return formatProduct(snapshot);
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, "products", id));
}
