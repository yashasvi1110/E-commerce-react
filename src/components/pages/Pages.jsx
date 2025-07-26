import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";
import Header from '../common/header/Header'
import Home from '../Home';
import Footer from '../common/footer/Footer';
import Shop from '../Shop';
import ShopDetail from '../ShopDetail';
import Testimonial from '../testimonial/Testimonial';
import TestimonialMain from '../testimonial/TestimonialMain';
import Error from '../Error';
import Contact from '../Contact';
import Cart from '../Cart';
import Checkout from '../Checkout';
import BottomCartBar from '../common/BottomCartBar';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import UserProfile from '../profile/UserProfile';
import AdminOrders from '../AdminOrders';
import OrderSuccess from '../OrderSuccess';

const Pages = () => {
    return (
        <>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/shop" element={<Shop />}></Route>
                    <Route path="/shop-detail" element={<ShopDetail />}></Route>
                    <Route path="/testimonial" element={<TestimonialMain />}></Route>
                    <Route path="/cart" element={<Cart />}></Route>
                    <Route path="/checkout" element={<Checkout />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/signup" element={<Signup />}></Route>
                    <Route path="/profile" element={<UserProfile />}></Route>
                    <Route path="/error" element={<Error />}></Route>
                    <Route path="/contact" element={<Contact />}></Route>
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                </Routes>
                <BottomCartBar />
                <Footer />
            </Router>
        </>
    )
}

export default Pages
