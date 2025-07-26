import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const Back = ({title}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';
    return (
        <>
            <section className="back">
                <div className="overlay-back"></div>
                {/* Back button, hidden on home page */}
                {!isHome && (
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-4 top-4 bg-white border border-gray-300 rounded-full shadow px-3 py-1 text-sm font-semibold text-[#81c408] hover:bg-[#81c408] hover:text-white transition z-10"
                        aria-label="Go back"
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
