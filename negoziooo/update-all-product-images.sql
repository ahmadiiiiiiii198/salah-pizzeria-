-- Update all product images with high-quality food photography from Unsplash
-- All images are free to use and optimized for web display

-- PIZZE
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1598023696416-0193a0bcd302?w=800&h=600&fit=crop&crop=center' WHERE name = 'Margherita' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&crop=center' WHERE name = '4 Formaggi' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&crop=center' WHERE name = '4 Stagioni' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop&crop=center' WHERE name = 'Americana' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=800&h=600&fit=crop&crop=center' WHERE name = 'Capricciosa' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=800&h=600&fit=crop&crop=center' WHERE name = 'Cotto' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?w=800&h=600&fit=crop&crop=center' WHERE name = 'Diavola' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&h=600&fit=crop&crop=center' WHERE name = 'Kebab' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1589187151053-5ec8818e661b?w=800&h=600&fit=crop&crop=center' WHERE name = 'Tonno & Cipolla' AND is_active = true;

-- PANINI & PIADINE
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=center' WHERE name = 'Chicken Burger' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop&crop=center' WHERE name = 'Panino Burger' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=600&fit=crop&crop=center' WHERE name = 'Panino Falafel' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1612392062798-2dd1e1842c5d?w=800&h=600&fit=crop&crop=center' WHERE name = 'Panino Hot Dog' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop&crop=center' WHERE name = 'Panino Kebab' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=600&fit=crop&crop=center' WHERE name = 'Panino Kofta' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&h=600&fit=crop&crop=center' WHERE name = 'Piadina Kebab' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop&crop=center' WHERE name = 'Piadina Nutella' AND is_active = true;

-- PIATTI
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&h=600&fit=crop&crop=center' WHERE name = 'Piatto Alette di Pollo' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&h=600&fit=crop&crop=center' WHERE name = 'Piatto Bistecca di Pollo' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&crop=center' WHERE name = 'Piatto Falafel' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop&crop=center' WHERE name = 'Piatto Kebab' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&crop=center' WHERE name = 'Piatto Kofta' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&h=600&fit=crop&crop=center' WHERE name = 'Piatto Nuggets & Alette di Pollo' AND is_active = true;

-- TACOS
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1565299585323-38174c4a6471?w=800&h=600&fit=crop&crop=center' WHERE name = 'Tacos con Carne Tritata' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&h=600&fit=crop&crop=center' WHERE name = 'Tacos di Kebab' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&crop=center' WHERE name = 'Tacos di Pollo' AND is_active = true;

-- MENU COMBOS
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop&crop=center' WHERE name = 'Margherita Menu' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=600&fit=crop&crop=center' WHERE name = 'Panino Kebab Menu' AND is_active = true;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&h=600&fit=crop&crop=center' WHERE name = 'Piadina Kebab Menu' AND is_active = true;
