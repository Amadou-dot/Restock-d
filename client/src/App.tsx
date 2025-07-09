import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import AddProduct from './pages/admin/AddProduct';
import AdminProductList from './pages/admin/AdminProductList';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import PasswordReset from './pages/PasswordReset';
import Cart from './pages/shop/Cart';
import Orders from './pages/shop/Orders';
import ProductDetail from './pages/shop/ProductDetail';
import ProductList from './pages/shop/ProductList';
import Shop from './pages/shop/Shop';
import SignUp from './pages/SignUp';
import NewPassword from './pages/NewPassword';

function App() {
  return (
    <>
      <Router>
        <NavigationBar />
        <Routes>
          <Route element={<Shop />} path='/' />
          <Route element={<AddProduct />} path='/admin/add-product' />
          <Route element={<AdminProductList />} path='/admin/products' />
          <Route element={<Cart />} path='/cart' />
          <Route path='/products'>
            <Route index element={<ProductList />} />
            <Route element={<ProductDetail />} path=':id' />
          </Route>
          <Route element={<Orders />} path='/orders' />
          <Route element={<Login />} path='/login' />
          <Route element={<SignUp />} path='/signup' />
          <Route element={<PasswordReset />} path='/password-reset' />
          <Route element={<NewPassword />} path='/new-password/:token' />
          <Route element={<PageNotFound />} path='*' />
        </Routes>
      </Router>
    </>
  );
}

export default App;
