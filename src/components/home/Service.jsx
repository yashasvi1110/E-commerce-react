import React from 'react'

const services = [
  {
    img: "../img/featur-1.jpg",
    label: "Fresh Apples",
    offer: "20% OFF",
    labelBg: "bg-green-500",
    offerText: "text-white"
  },
  {
    img: "../img/featur-2.jpg",
    label: "Tasty Fruits",
    offer: "Free delivery",
    labelBg: "bg-gray-100",
    offerText: "text-green-700"
  },
  {
    img: "../img/featur-3.jpg",
    label: "Exotic Vegetable",
    offer: "Discount 30$",
    labelBg: "bg-yellow-400",
    offerText: "text-white"
  }
];

const Service = () => {
  return (
    <div className="mt-10 mx-2 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 max-w-2xl mx-auto">
      {services.map((s, i) => (
        <div key={i} className="border-2 border-orange-400 rounded-xl bg-white flex flex-col items-center p-2 h-64 relative overflow-hidden">
          <div className="w-full h-32 relative flex items-center justify-center mb-2">
            <img src={s.img} className="w-full h-full object-cover rounded-t-xl" alt="" />
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 px-3 py-1 rounded-b-xl text-xs font-bold ${s.labelBg} ${s.offerText} w-11/12 text-center opacity-95`}>
              <span>{s.label}</span>
              <span className="block text-xs font-normal">{s.offer}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Service;
