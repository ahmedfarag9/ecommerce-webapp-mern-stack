import axios from "axios";
import { base_url } from "../../utils/base_url";

const getBlogCategories = async () => {
  const response = await axios.get(`${base_url}blog-category/`);

  return response.data;
};

const blogCategoryService = {
  getBlogCategories,
};

export default blogCategoryService;
