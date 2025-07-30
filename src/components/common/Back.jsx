import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const Back = ({title}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';
    
    const handleBackClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Back button clicked, current path:', location.pathname);
        
        // // Test alert to confirm button is working
        // alert('Back button clicked! Redirecting to home...');
        
        // For checkout and billing pages, always redirect to home
        if (location.pathname === '/checkout' || location.pathname === '/billing') {
            console.log('Redirecting to home page');
            navigate('/');
        } else {
            // For other pages, try to go back in history, fallback to home
            if (window.history.length > 1) {
                navigate(-1);
            } else {
                navigate('/');
            }
        }
    };
    
    return (
        <>
            <section className="back">
                <div className="overlay-back"></div>
                {/* Back button, hidden on home page */}
                {!isHome && (
                    <button
                        onClick={handleBackClick}
                        className="absolute left-4 top-4 bg-white border-2 border-[#81c408] rounded-full shadow-lg px-4 py-2 text-sm font-bold text-[#81c408] hover:bg-[#81c408] hover:text-white transition-all duration-200 z-50 cursor-pointer"
                        aria-label="Go back"
                        style={{ zIndex: 9999, position: 'fixed' }}
                    >
                        <i className="fa fa-arrow-left mr-2"></i>Back
                    </button>
                )}
                <h1>{title}</h1>
                <h2>Home / Pages / {location.pathname.split('/')[1]}</h2>
            </section>
            <div className="margin"></div>
        </>
    )
}

export default Back
