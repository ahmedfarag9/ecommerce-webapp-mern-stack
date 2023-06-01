import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Resetpassword from './pages/Resetpassword';
import Forgotpassword from './pages/Forgotpassword';
import MainLayout from './components/MainLayout';
import Enquiries from './pages/Enquiries';
import Bloglist from './pages/Bloglist';
import Blogcatlist from './pages/Blogcatlist';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Colorlist from './pages/Colorlist';
import Categorylist from './pages/Categorylist';
import Brandlist from './pages/Brandlist';
import Productlist from './pages/Productlist';
import Addblog from './pages/Addblog';
import Addblogcat from './pages/Addblogcat';
import Addcolor from './pages/Addcolor';
import Addcat from './pages/Addcat';
import Addbrand from './pages/Addbrand';
import Addproduct from './pages/Addproduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='enquiries' index element={<Enquiries />} />
          <Route path='blog-list' index element={<Bloglist />} />
          <Route path='blog' index element={<Addblog />} />
          <Route path='blog-category-list' index element={<Blogcatlist />} />
          <Route path='blog-category' index element={<Addblogcat />} />
          <Route path='orders' index element={<Orders />} />
          <Route path='customers' index element={<Customers />} />
          <Route path='list-color' index element={<Colorlist />} />
          <Route path='color' index element={<Addcolor/>} />
          <Route path='list-category' index element={<Categorylist />} />
          <Route path='category' index element={<Addcat />} />
          <Route path='list-brand' index element={<Brandlist />} />
          <Route path='brand' index element={<Addbrand />} />
          <Route path='list-product' index element={<Productlist />} />
          <Route path='product' index element={<Addproduct />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;