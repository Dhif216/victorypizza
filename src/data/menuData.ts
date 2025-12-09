export interface MenuItem {
  id: number;
  nameFi: string;
  nameEn: string;
  ingredients: string;
  ingredientsEn?: string;
  imageUrl?: string;  // Add image URL field
  prices: {
    norm?: number;
    perhe?: number;
    pannu?: number;
    single?: number;
  };
}

export const menuData = {
  pizzas: [
    {
      id: 1,
      nameFi: "Margareta",
      nameEn: "Margherita",
      ingredients: "Juusto, Tuoremaatti",
      ingredientsEn: "Cheese, Fresh Tomato",
      imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
      prices: { norm: 9.5, perhe: 12.5, pannu: 12 }
    },
    {
      id: 2,
      nameFi: "Bolognese",
      nameEn: "Bolognese",
      ingredients: "Jauheliha, Juusto",
      ingredientsEn: "Ground Beef, Cheese",
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
      prices: { norm: 9, perhe: 13.5, pannu: 13 }
    },
    {
      id: 3,
      nameFi: "Hawai",
      nameEn: "Hawaiian",
      ingredients: "Kinkku, Ananas",
      ingredientsEn: "Ham, Pineapple",
      imageUrl: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop",
      prices: { norm: 9, perhe: 13.5, pannu: 13 }
    },
    {
      id: 4,
      nameFi: "Americano",
      nameEn: "Americano",
      ingredients: "Kinkku, Ananas, Aurajuusto",
      ingredientsEn: "Ham, Pineapple, Blue Cheese",
      imageUrl: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop",
      prices: { norm: 9.5, perhe: 14.5, pannu: 14 }
    },
    {
      id: 6,
      nameFi: "Fruitti di Mare",
      nameEn: "Fruitti di Mare",
      ingredients: "Tonnikala, Katkarapu",
      ingredientsEn: "Tuna, Shrimp",
      imageUrl: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop",
      prices: { norm: 10, perhe: 15.5, pannu: 15 }
    },
    {
      id: 8,
      nameFi: "Opera Special",
      nameEn: "Opera Special",
      ingredients: "Kinkku, Tonnikala, Salami",
      ingredientsEn: "Ham, Tuna, Salami",
      imageUrl: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=300&fit=crop",
      prices: { norm: 9.5, perhe: 14.5, pannu: 14 }
    },
    {
      id: 10,
      nameFi: "Romeo",
      nameEn: "Romeo",
      ingredients: "Salami, Ananas, Katkarapu, Aurajuusto",
      ingredientsEn: "Salami, Pineapple, Shrimp, Blue Cheese",
      imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
      prices: { norm: 10.5, perhe: 16, pannu: 15.5 }
    },
    {
      id: 11,
      nameFi: "Julia",
      nameEn: "Julia",
      ingredients: "Kinkku, Ananas, Katkarapu, Aurajuusto",
      ingredientsEn: "Ham, Pineapple, Shrimp, Blue Cheese",
      imageUrl: "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?w=400&h=300&fit=crop",
      prices: { norm: 10.5, perhe: 16, pannu: 15.5 }
    },
    {
      id: 12,
      nameFi: "Chicken Pizza",
      nameEn: "Chicken Pizza",
      ingredients: "Kana, Ananas, Aurajuusto",
      ingredientsEn: "Chicken, Pineapple, Blue Cheese",
      imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
      prices: { norm: 10.5, perhe: 16, pannu: 15.5 }
    },
    {
      id: 13,
      nameFi: "Kebab Pizza",
      nameEn: "Kebab Pizza",
      ingredients: "Kebab, Sipuli, Tomaatti, Jalopeno",
      ingredientsEn: "Kebab, Onion, Tomato, Jalapeño",
      imageUrl: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=400&h=300&fit=crop",
      prices: { norm: 10.5, perhe: 16, pannu: 15.5 }
    },
    {
      id: 14,
      nameFi: "Mexicano",
      nameEn: "Mexicano",
      ingredients: "Pepperoni, Ananas, Jalopeno",
      ingredientsEn: "Pepperoni, Pineapple, Jalapeño",
      imageUrl: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=300&fit=crop",
      prices: { norm: 10.5, perhe: 16, pannu: 15.5 }
    },
    {
      id: 15,
      nameFi: "Quattro Pizza",
      nameEn: "Quattro Pizza",
      ingredients: "Kinkku, Katkarapu, Tonnikala, Aurajuusto",
      ingredientsEn: "Ham, Shrimp, Tuna, Blue Cheese",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
      prices: { norm: 10.5, perhe: 16, pannu: 15.5 }
    },
    {
      id: 16,
      nameFi: "Vega Pizza",
      nameEn: "Vega Pizza",
      ingredients: "Sieni, Tomaatti, Paprika, Oliivi, Sipuli",
      ingredientsEn: "Mushroom, Tomato, Bell Pepper, Olive, Onion",
      imageUrl: "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400&h=300&fit=crop",
      prices: { norm: 12, perhe: 16.5, pannu: 16 }
    },
    {
      id: 18,
      nameFi: "Pekoni",
      nameEn: "Bacon",
      ingredients: "Pekoni, Kananmuna, Kinkku, Aurajuusto",
      ingredientsEn: "Bacon, Egg, Ham, Blue Cheese",
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
      prices: { norm: 12, perhe: 16.5, pannu: 16 }
    },
    {
      id: 19,
      nameFi: "Beef Pizza",
      nameEn: "Beef Pizza",
      ingredients: "Jauheliha, Kinkku, Salami, Pepperoni, Pekoni",
      ingredientsEn: "Ground Beef, Ham, Salami, Pepperoni, Bacon",
      imageUrl: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=400&h=300&fit=crop",
      prices: { norm: 12, perhe: 16.5, pannu: 16 }
    },
    {
      id: 20,
      nameFi: "Victory Special",
      nameEn: "Victory Special",
      ingredients: "Kebab, Pepperoni, Sipuli, Sieni, Aurajuusto, BBQ-kastike",
      ingredientsEn: "Kebab, Pepperoni, Onion, Mushroom, Blue Cheese, BBQ Sauce",
      imageUrl: "https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?w=400&h=300&fit=crop",
      prices: { norm: 13.5, perhe: 17.5, pannu: 16.5 }
    }
  ] as MenuItem[],
  
  burgers: [
    {
      id: 1,
      nameFi: "Juustoburger",
      nameEn: "Cheeseburger",
      ingredients: "120g 100% naudanlihapihvi, hampurilaiskastike",
      ingredientsEn: "120g 100% beef patty, burger sauce",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      prices: { single: 10.5 }
    },
    {
      id: 2,
      nameFi: "Kanaburger",
      nameEn: "Chicken Burger",
      ingredients: "100g 100% Kana, curry kastike",
      ingredientsEn: "100g 100% Chicken, curry sauce",
      imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop",
      prices: { single: 11.5 }
    },
    {
      id: 3,
      nameFi: "Mexicano burger",
      nameEn: "Mexicano Burger",
      ingredients: "210g 100% naudanlihapihvi, mexicano kastike",
      ingredientsEn: "210g 100% beef patty, Mexican sauce",
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
      prices: { single: 11.5 }
    },
    {
      id: 4,
      nameFi: "Super burger",
      nameEn: "Super Burger",
      ingredients: "120g 100% naudanlihapihvi, kananmuna, hampurilaiskastike",
      ingredientsEn: "120g 100% beef patty, egg, burger sauce",
      imageUrl: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop",
      prices: { single: 12 }
    },
    {
      id: 5,
      nameFi: "Pekoniburger",
      nameEn: "Bacon Burger",
      ingredients: "120g 100% naudanlihapihvi, pekoni, hampurilaiskastike",
      ingredientsEn: "120g 100% beef patty, bacon, burger sauce",
      imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
      prices: { single: 12 }
    },
    {
      id: 6,
      nameFi: "Megaburger",
      nameEn: "Megaburger",
      ingredients: "3x 120g 100% naudanlihapihvi, hampurilaiskastike, Sipulirengas",
      ingredientsEn: "3x 120g 100% beef patties, burger sauce, onion rings",
      imageUrl: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop",
      prices: { single: 18 }
    }
  ] as MenuItem[],
  
  kebabs: [
    {
      id: 1,
      nameFi: "Kebab ranskalaiset",
      nameEn: "Kebab with Fries",
      ingredients: "Kebab, Ranskalaiset, Salaatti",
      ingredientsEn: "Kebab, French Fries, Salad",
      imageUrl: "https://imageproxy.wolt.com/menu/menu-images/43f3059e-f9fa-11e8-b58d-0a5864637fc4_KebabRanskalaisilla.jpeg",
      prices: { single: 9.5 }
    },
    {
      id: 2,
      nameFi: "Kebab lohkoperunat",
      nameEn: "Kebab with Wedges",
      ingredients: "Kebab, Lohkoperunat, Salaatti",
      ingredientsEn: "Kebab, Potato Wedges, Salad",
      imageUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop",
      prices: { single: 9.5 }
    },
    {
      id: 3,
      nameFi: "Kebab iskender",
      nameEn: "Kebab Iskender",
      ingredients: "Kebab, leipä leikattuna,juguritia kastike",
      ingredientsEn: "Kebab, bread sliced, salad yogurt sauce",
      imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
      prices: { single: 9.5 }
    },
    {
      id: 4,
      nameFi: "Kebab rulla",
      nameEn: "Kebab Roll",
      ingredients: "Kebab, salaatti majoneesi kastike",
      ingredientsEn: "Kebab, salad, mayo sauce",
      imageUrl: "https://i.redd.it/ri9zlytg3iy61.jpg",
      prices: { single: 9.5 }
    },
    {
      id: 5,
      nameFi: "Pita kebab",
      nameEn: "Pita Kebab",
      ingredients: "Kebab ja salaatti",
      ingredientsEn: "Kebab and salad",
      imageUrl: "https://images.arla.com/recordid/82D53EDF-7244-4A13-9FBA91333D6A8C61/pitakebab.jpg?width=1200&height=630&mode=crop&format=jpg",
      prices: { single: 9 }
    },
    {
      id: 6,
      nameFi: "Kana kebab ranskalaisilla",
      nameEn: "Chicken Kebab with Fries",
      ingredients: "Kana kebab, salaattia, salaatti kastike currykastike ja Ranskalaiset",
      ingredientsEn: "Chicken kebab, salad, salad sauce plus curry sauce and fries",
      imageUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop",
      prices: { single: 10 }
    },
    {
      id: 7,
      nameFi: "Kana kebab lohkoperunat",
      nameEn: "Chicken Kebab with Wedges",
      ingredients: "Salaatti kana kebab lohkoperuna Currykastike",
      ingredientsEn: "Salad chicken kebab potato wedges curry sauce",
      imageUrl: "https://suolahdenpizzeria.fi/wp-content/uploads/2025/01/48-Kanadoner-lohkoperunoilla.jpg",
      prices: { single: 10 }
    },
    {
      id: 8,
      nameFi: "Pita kana kebab",
      nameEn: "Pita Chicken Kebab",
      ingredients: "Pitä kana kebab, Currykastike salaatti, Salaatti",
      ingredientsEn: "Pita chicken kebab, curry sauce salad",
      imageUrl: "https://marinellapizzeria.fi/wp-content/uploads/2024/04/chicken-kebab-voner-pita-1.jpg",
      prices: { single: 9 }
    }
  ] as MenuItem[],
  
  salads: [
    {
      id: 1,
      nameFi: "Tonnikala salaatti",
      nameEn: "Tuna Salad",
      ingredients: "Salaatti, tomaatti, kurkku, paprika",
      ingredientsEn: "Salad, tomato, cucumber, bell pepper",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      prices: { single: 10 }
    },
    {
      id: 2,
      nameFi: "Kreikkalainen salaatti",
      nameEn: "Greek Salad",
      ingredients: "Feta, salaatti, tomaatti, kurkku erikois-kastike",
      ingredientsEn: "Feta, salad, tomato, cucumber, special sauce",
      imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
      prices: { single: 10 }
    },
    {
      id: 3,
      nameFi: "Kana salaatti",
      nameEn: "Chicken Salad",
      ingredients: "Salaatti, tomaatti, sipuli, kurkku, ananas kuutio kana",
      ingredientsEn: "Salad, tomato, onion, cucumber, pineapple cubed chicken",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      prices: { single: 10 }
    },
    {
      id: 4,
      nameFi: "Katkarapu salaatti",
      nameEn: "Shrimp Salad",
      ingredients: "Katkarapu, salaatti, tomaatti kurkku sieni",
      ingredientsEn: "Shrimp, salad, tomato, cucumber, mushroom",
      imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=300&fit=crop",
      prices: { single: 10 }
    }
  ] as MenuItem[],
  
  pasta: [
    {
      id: 1,
      nameFi: "Pasta Carbonara",
      nameEn: "Pasta Carbonara",
      ingredients: "Pasta, pekoni, kerma, kananmuna, juusto",
      ingredientsEn: "Pasta, bacon, cream, egg, cheese",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/33/Espaguetis_carbonara.jpg",
      prices: { single: 11 }
    },
    {
      id: 2,
      nameFi: "Pasta Bolognese",
      nameEn: "Pasta Bolognese",
      ingredients: "Pasta, jauheliha, tomaattikastike, juusto",
      ingredientsEn: "Pasta, ground beef, tomato sauce, cheese",
      imageUrl: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/spaghetti_bolognese_43191_16x9.jpg",
      prices: { single: 10.5 }
    },
    {
      id: 3,
      nameFi: "Pasta Alfredo",
      nameEn: "Pasta Alfredo",
      ingredients: "Pasta, kerma, kana, juusto",
      ingredientsEn: "Pasta, cream, chicken, cheese",
      imageUrl: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      prices: { single: 12 }
    },
    {
      id: 4,
      nameFi: "Pasta Pesto",
      nameEn: "Pasta Pesto",
      ingredients: "Pasta, pesto, pinjansiemenet, juusto",
      ingredientsEn: "Pasta, pesto, pine nuts, cheese",
      imageUrl: "https://images.unsplash.com/photo-1707448460889-e268eb742820?q=80&w=742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      prices: { single: 11.5 }
    },
    {
      id: 5,
      nameFi: "Pasta Arrabbiata",
      nameEn: "Pasta Arrabbiata",
      ingredients: "Pasta, tomaattikastike, chili, valkosipuli",
      ingredientsEn: "Pasta, tomato sauce, chili, garlic",
      imageUrl: "https://carlsbadcravings.com/wp-content/uploads/2022/09/arrabiata-sauce-with-penne-6a.jpg",
      prices: { single: 10 }
    }
  ] as MenuItem[],
  drinks: [
    {
      id: 1,
      nameFi: "Limu / Juomat",
      nameEn: "Soft Drinks",
      ingredients: "Coca-Cola, Coca-Cola Zero, Fanta, Sprite, Jaffa",
      ingredientsEn: "Coca-Cola, Coca-Cola Zero, Fanta, Sprite, Jaffa",
      imageUrl: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&h=300&fit=crop",
      prices: { single: 2.5 }
    },
    {
      id: 2,
      nameFi: "Kahvi / Teet",
      nameEn: "Coffee / Teas",
      ingredients: "",
      ingredientsEn: "",
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
      prices: { single: 1.5 }
    },
    {
      id: 3,
      nameFi: "Mehut",
      nameEn: "Juices",
      ingredients: "",
      ingredientsEn: "",
      imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop",
      prices: { single: 2.5 }
    }
  ] as MenuItem[]
};
