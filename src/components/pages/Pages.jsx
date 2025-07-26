import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";
import Header from '../common/header/Header'
import Home from '../Home';
import Footer from '../common/footer/Footer';
// import Shop from '../Shop';
import ShopDetail from '../ShopDetail';
import Testimonial from '../testimonial/Testimonial';
import TestimonialMain from '../testimonial/TestimonialMain';
import Error from '../Error';
import Contact from '../Contact';
import Cart from '../Cart';
import Checkout from '../Checkout';
import SearchResults from '../SearchResults';
import LightningDeals from '../LightningDeals';
import BottomCartBar from '../common/BottomCartBar';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import UserProfile from '../profile/UserProfile';
import AdminOrders from '../AdminOrders';
import OrderSuccess from '../OrderSuccess';
import { useLocation } from 'react-router-dom';
import InventoryManagement from '../admin/InventoryManagement';
import Subscribe from '../subscribe';

const PagesInner = () => {
    const location = useLocation();
    // Hide subscribe on order success and checkout pages
    const hideSubscribe = location.pathname === '/order-success' || location.pathname === '/checkout';
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    {/* <Route path="/shop" element={<Shop />}></Route> */}
                    <Route path="/shop-detail" element={<ShopDetail />}></Route>
                    <Route path="/testimonial" element={<TestimonialMain />}></Route>
                    <Route path="/cart" element={<Cart />}></Route>
                    <Route path="/checkout" element={<Checkout />}></Route>
                    <Route path="/subscribe" element={<Subscribe />}></Route>
                    <Route path="/admin/invetory" element={<InventoryManagement />}></Route>
                    <Route path="/search" element={<SearchResults />}></Route>
                    <Route path="/lightning-deals" element={<LightningDeals />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/signup" element={<Signup />}></Route>
                    <Route path="/profile" element={<UserProfile />}></Route>
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/error" element={<Error />}></Route>
                    <Route path="/contact" element={<Contact />}></Route>
                </Routes>
            </main>
            <BottomCartBar />
            <Footer hideSubscribe={hideSubscribe} />
        </div>
    )
}

const Pages = () => {
    return (
        <Router>
            <PagesInner />
        </Router>
    )
}

export default Pages
