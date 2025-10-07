import React from 'react';
import { Star, MapPin } from 'lucide-react';

const CommunityTestimonials = () => {
  const testimonials = [
    {
      name: "Leyla Ahmad",
      location: "London, UK",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leyla",
      quote: "I found amazing Kurdish friends through KurdMatch. It's wonderful to connect with people who understand our culture and heritage!",
      rating: 5
    },
    {
      name: "Azad Karim",
      location: "Toronto, Canada",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Azad",
      quote: "As someone living abroad, KurdMatch helped me stay connected to my roots. I've met incredible people and even found my partner!",
      rating: 5
    },
    {
      name: "Shilan Mustafa",
      location: "Stockholm, Sweden",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shilan",
      quote: "The best platform for Kurdish people worldwide. Safe, respectful, and truly focused on our community values.",
      rating: 5
    }
  ];

  const locations = [
    { city: "Erbil", country: "Kurdistan", top: "45%", left: "55%" },
    { city: "London", country: "UK", top: "30%", left: "48%" },
    { city: "Stockholm", country: "Sweden", top: "20%", left: "52%" },
    { city: "Toronto", country: "Canada", top: "35%", left: "20%" },
    { city: "Sydney", country: "Australia", top: "70%", left: "85%" }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-white to-purple-50 relative overflow-hidden">
      {/* Background Map Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #9333EA 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Community</span> Says
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Real stories from Kurdish people who found connection, friendship, and love through KurdMatch
          </p>
        </div>

        {/* World Map with Locations */}
        <div className="relative mb-16 h-[400px] max-w-5xl mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Decorative world map visual */}
              <svg viewBox="0 0 800 400" className="w-full h-full opacity-20">
                <defs>
                  <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#9333EA', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <circle cx="400" cy="200" r="150" fill="url(#mapGradient)" opacity="0.1" />
                <circle cx="400" cy="200" r="120" fill="url(#mapGradient)" opacity="0.1" />
                <circle cx="400" cy="200" r="90" fill="url(#mapGradient)" opacity="0.1" />
              </svg>

              {/* Location Pins */}
              {locations.map((location, index) => (
                <div 
                  key={index}
                  className="absolute animate-fade-in"
                  style={{ 
                    top: location.top, 
                    left: location.left,
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <div className="relative group cursor-pointer">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2 shadow-lg group-hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    {/* Location Label */}
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-sm font-semibold text-gray-900">{location.city}</div>
                      <div className="text-xs text-gray-600">{location.country}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-purple-100">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-purple-200"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityTestimonials;
