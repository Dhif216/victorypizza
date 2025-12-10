import { ImageWithFallback } from './ImageWithFallback';
import { useState } from 'react';

interface FoodGalleryProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
}

export function FoodGallery({ language, theme }: FoodGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryItems = [
    {
      image: "https://images.unsplash.com/photo-1652996512830-48bc2223c312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGl6emElMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc2NDc4NjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      titleFi: "Gourmet Pizza",
      titleEn: "Gourmet Pizza",
      descFi: "Käsinvedetty taikina, premium-täytteet",
      descEn: "Hand-stretched dough, premium toppings",
      category: "Pizza"
    },
    {
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzY0NzIxOTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      titleFi: "Margareta Klassikko",
      titleEn: "Classic Margherita",
      descFi: "Tuore basilika, mozzarella, tomaatti",
      descEn: "Fresh basil, mozzarella, tomato",
      category: "Pizza"
    },
    {
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXJvbmklMjBwaXp6YXxlbnwxfHx8fDE3NjQ4MTY0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      titleFi: "Pepperoni Deluxe",
      titleEn: "Pepperoni Deluxe",
      descFi: "Runsas pepperoni, sula juusto",
      descEn: "Generous pepperoni, melted cheese",
      category: "Pizza"
    },
    {
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXdhaWlhbiUyMHBpenphfGVufDF8fHx8MTc2NDg0MTE1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      titleFi: "Hawai Erikoisuus",
      titleEn: "Hawaiian Special",
      descFi: "Kinkku, ananas, juusto",
      descEn: "Ham, pineapple, cheese",
      category: "Pizza"
    },
    {
      image: "https://images.unsplash.com/photo-1583744514765-d815be1606cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwY2hlZXNlYnVyZ2VyfGVufDF8fHx8MTc2NDg0NDAyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      titleFi: "Premium Burgeri",
      titleEn: "Premium Burger",
      descFi: "100% naudanlihaa, gourmet-täytteet",
      descEn: "100% beef, gourmet toppings",
      category: "Burger"
    },
    {
      image: "https://images.unsplash.com/photo-1575936950888-bd83b50a7f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBidXJnZXIlMjByZXN0YXVyYW50fGVufDF8fHx8MTc2NDg0NDAyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      titleFi: "Signature Burger",
      titleEn: "Signature Burger",
      descFi: "Mehukas, täydellisesti grillattu",
      descEn: "Juicy, perfectly grilled",
      category: "Burger"
    },
    {
      image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZWJhYiUyMHBsYXR0ZXJ8ZW58MXx8fHwxNzY0ODQ0MDIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      titleFi: "Kebab Lautanen",
      titleEn: "Kebab Platter",
      descFi: "Autenttinen mauste, tuore salaatti",
      descEn: "Authentic spices, fresh salad",
      category: "Kebab"
    },
    {
      image: "https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NjQ3NzIzMDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      titleFi: "Tuore Salaatti",
      titleEn: "Fresh Salad",
      descFi: "Päivittäin tuoreet vihannekset",
      descEn: "Daily fresh vegetables",
      category: "Salad"
    }
  ];

  return (
    <>
      <section id="gallery" className={`relative py-32 ${
        theme === "light" 
          ? "bg-white" 
          : "bg-black"
      }`}>
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-gray-600 text-sm tracking-[0.3em] uppercase">
                {language === 'fi' ? 'Ruokamme' : 'Our Food'}
              </span>
            </div>
            <h2 className={`text-5xl md:text-6xl mb-4 tracking-tight ${
              theme === "light" ? "text-black" : "text-white"
            }`} style={{ fontFamily: 'serif' }}>
              {language === 'fi' ? 'Kulinaarinen Galleria' : 'Culinary Gallery'}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              theme === "light" ? "text-black/60" : "text-white/60"
            }`}>
              {language === 'fi' 
                ? 'Jokainen annos valmistetaan intohimolla ja huolellisesti valituista raaka-aineista' 
                : 'Every dish crafted with passion and carefully selected ingredients'}
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryItems.map((item, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-square"
                onClick={() => setSelectedImage(item.image)}
              >
                {/* Image */}
                <ImageWithFallback 
                  src={item.image}
                  alt={language === 'fi' ? item.titleFi : item.titleEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs rounded-full mb-3 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-white text-xl mb-2">
                      {language === 'fi' ? item.titleFi : item.titleEn}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {language === 'fi' ? item.descFi : item.descEn}
                    </p>
                  </div>
                </div>

                {/* Gold Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/50 rounded-2xl transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white text-4xl"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <ImageWithFallback 
            src={selectedImage}
            alt="Selected food"
            className="max-w-full max-h-full object-contain rounded-2xl"
          />
        </div>
      )}
    </>
  );
}
