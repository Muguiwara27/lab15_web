const { sequelize, Role, User, Category, Product } = require('../models');
require('dotenv').config();

async function seed() {
  await sequelize.authenticate();
  console.log('Database connected.');

  await sequelize.sync({ force: true });
  console.log('Tables created.');

  const adminRole = await Role.create({ name: 'ADMIN' });
  const customerRole = await Role.create({ name: 'CUSTOMER' });
  console.log('Roles created.');

  await User.create({
    name: 'Admin',
    email: 'admin@marketplace.com',
    password: 'Admin123!',
    roleId: adminRole.id,
  });

  await User.create({
    name: 'Antony',
    email: 'customer@marketplace.com',
    password: 'Customer123!',
    roleId: customerRole.id,
  });
  console.log('Users created.');

  const electronics = await Category.create({
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
  });
  const fashion = await Category.create({
    name: 'Fashion',
    description: 'Clothing, shoes and accessories',
  });
  const home = await Category.create({
    name: 'Home & Garden',
    description: 'Home improvement and garden products',
  });
  const sports = await Category.create({
    name: 'Sports',
    description: 'Sports equipment and active lifestyle',
  });
  console.log('Categories created.');

  const products = [
    {
      nombre: 'Smartphone Galaxy S25 Ultra',
      precio: 1299.99,
      descripcion: 'El smartphone más avanzado con IA integrada, pantalla Dynamic AMOLED 2X de 6.9", cámara de 200MP y S Pen incluido.',
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
      categoryId: electronics.id,
    },
    {
      nombre: 'MacBook Pro 16" M4',
      precio: 2499.99,
      descripcion: 'Laptop profesional con chip M4 Ultra, 48GB RAM unificada, 1TB SSD y pantalla Liquid Retina XDR.',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
      categoryId: electronics.id,
    },
    {
      nombre: 'Auriculares Sony WH-1000XM6',
      precio: 349.99,
      descripcion: 'Auriculares inalámbricos con cancelación de ruido líder en la industria, 40 horas de batería y sonido de alta resolución.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      categoryId: electronics.id,
    },
    {
      nombre: 'Chaqueta de Cuero Premium',
      precio: 289.99,
      descripcion: 'Chaqueta de cuero genuino italiano con forro de seda, diseño clásico atemporal y acabado artesanal.',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
      categoryId: fashion.id,
    },
    {
      nombre: 'Reloj de Pulsera Automático',
      precio: 459.99,
      descripcion: 'Reloj mecánico suizo con movimiento automático, caja de acero inoxidable 316L y cristal de zafiro.',
      imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600',
      categoryId: fashion.id,
    },
    {
      nombre: 'Zapatillas Running Ultraboost',
      precio: 189.99,
      descripcion: 'Zapatillas con tecnología Boost™, malla Primeknit+ transpirable y suela Continental™ para máxima tracción.',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      categoryId: sports.id,
    },
    {
      nombre: 'Set de Jardinería Profesional',
      precio: 79.99,
      descripcion: 'Kit completo de 15 herramientas de jardinería con mangos ergonómicos, acero inoxidable y bolsa de almacenamiento.',
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
      categoryId: home.id,
    },
    {
      nombre: 'iPad Air M3',
      precio: 699.99,
      descripcion: 'Tablet con chip M3, pantalla Liquid Retina de 11", 256GB almacenamiento y compatibilidad con Apple Pencil Pro.',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',
      categoryId: electronics.id,
    },
    {
      nombre: 'Mochila Ejecutiva Premium',
      precio: 129.99,
      descripcion: 'Mochila de cuero con compartimiento acolchado para laptop de 16", puerto de carga USB y diseño antirrobo.',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
      categoryId: fashion.id,
    },
    {
      nombre: 'Bicicleta Eléctrica Urbana',
      precio: 1899.99,
      descripcion: 'Bicicleta eléctrica con motor Bosch de 250W, batería de 625Wh, autonomía de 120km y cuadro de aluminio.',
      imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600',
      categoryId: sports.id,
    },
  ];

  await Product.bulkCreate(products);
  console.log('Products created.');

  console.log('\n=== SEED COMPLETED SUCCESSFULLY ===');
  console.log('\nCredentials:');
  console.log('  ADMIN:    admin@marketplace.com / Admin123!');
  console.log('  CUSTOMER: customer@marketplace.com / Customer123!');
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = seed;
