-- =============================================
-- MARKETPLACE PRO - Seed Data
-- =============================================
-- NOTA: Las contraseñas se hashean con bcrypt
-- desde el script JavaScript (src/seeders/seed.js).
-- Los INSERTs aquí son referenciales; para poblar
-- la base de datos ejecuta:
--   cd backend-marketplace && npm run seed
-- =============================================

USE marketplace_pro;

-- --------------------------------------------
-- Roles
-- --------------------------------------------
INSERT INTO Roles (name, createdAt, updatedAt) VALUES
  ('ADMIN', NOW(), NOW()),
  ('CUSTOMER', NOW(), NOW());

-- --------------------------------------------
-- Users
-- (passwords hasheadas con bcrypt)
-- Admin:   Admin123!
-- Antony:  Customer123!
-- --------------------------------------------
INSERT INTO Users (name, email, password, roleId, createdAt, updatedAt) VALUES
  ('Admin',  'admin@marketplace.com',    '$2a$10$EJEMPLO_HASH_ADMIN',   1, NOW(), NOW()),
  ('Antony', 'customer@marketplace.com', '$2a$10$EJEMPLO_HASH_CUSTOMER', 2, NOW(), NOW());

-- --------------------------------------------
-- Categories
-- --------------------------------------------
INSERT INTO Categories (name, description, createdAt, updatedAt) VALUES
  ('Electronics',     'Electronic devices and gadgets',                                    NOW(), NOW()),
  ('Fashion',         'Clothing, shoes and accessories',                                   NOW(), NOW()),
  ('Home & Garden',   'Home improvement and garden products',                              NOW(), NOW()),
  ('Sports',          'Sports equipment and active lifestyle',                             NOW(), NOW());

-- --------------------------------------------
-- Products
-- --------------------------------------------
INSERT INTO Products (nombre, precio, descripcion, imageUrl, categoryId, createdAt, updatedAt) VALUES
  ('Smartphone Galaxy S25 Ultra',    1299.99, 'El smartphone más avanzado con IA integrada, pantalla Dynamic AMOLED 2X de 6.9", cámara de 200MP y S Pen incluido.',                                                                     'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',   1, NOW(), NOW()),
  ('MacBook Pro 16" M4',             2499.99, 'Laptop profesional con chip M4 Ultra, 48GB RAM unificada, 1TB SSD y pantalla Liquid Retina XDR.',                                                                                          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',   1, NOW(), NOW()),
  ('Auriculares Sony WH-1000XM6',    349.99,  'Auriculares inalámbricos con cancelación de ruido líder en la industria, 40 horas de batería y sonido de alta resolución.',                                                               'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',   1, NOW(), NOW()),
  ('Chaqueta de Cuero Premium',      289.99,  'Chaqueta de cuero genuino italiano con forro de seda, diseño clásico atemporal y acabado artesanal.',                                                                                     'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',   2, NOW(), NOW()),
  ('Reloj de Pulsera Automático',    459.99,  'Reloj mecánico suizo con movimiento automático, caja de acero inoxidable 316L y cristal de zafiro.',                                                                                     'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600',   2, NOW(), NOW()),
  ('Zapatillas Running Ultraboost',  189.99,  'Zapatillas con tecnología Boost™, malla Primeknit+ transpirable y suela Continental™ para máxima tracción.',                                                                              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',   4, NOW(), NOW()),
  ('Set de Jardinería Profesional',  79.99,   'Kit completo de 15 herramientas de jardinería con mangos ergonómicos, acero inoxidable y bolsa de almacenamiento.',                                                                      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',   3, NOW(), NOW()),
  ('iPad Air M3',                    699.99,  'Tablet con chip M3, pantalla Liquid Retina de 11", 256GB almacenamiento y compatibilidad con Apple Pencil Pro.',                                                                          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',   1, NOW(), NOW()),
  ('Mochila Ejecutiva Premium',      129.99,  'Mochila de cuero con compartimiento acolchado para laptop de 16", puerto de carga USB y diseño antirrobo.',                                                                              'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',   2, NOW(), NOW()),
  ('Bicicleta Eléctrica Urbana',     1899.99, 'Bicicleta eléctrica con motor Bosch de 250W, batería de 625Wh, autonomía de 120km y cuadro de aluminio.',                                                                               'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600',   4, NOW(), NOW());
