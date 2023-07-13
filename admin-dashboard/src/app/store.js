import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customers/customerSlice";
import productReducer from "../features/product/productSlice";
import brandReducer from "../features/brand/brandSlice";
import ProductCategoryReducer from "../features/productCategory/productCategorySlice";
import blogCategoryReducer from "../features/blogCategory/blogCategorySlice";
import blogReducer from "../features/blogs/blogSlice";
import colorReducer from "../features/color/colorSlice";
import enquiryReducer from "../features/enquiry/enquirySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    product: productReducer,
    brand: brandReducer,
    productCategory: ProductCategoryReducer,
    blogs: blogReducer,
    blogCategory: blogCategoryReducer,
    color: colorReducer,
    enquiry: enquiryReducer,
  },
});
