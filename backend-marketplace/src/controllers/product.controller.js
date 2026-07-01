const { Product, Category } = require('../models');

const getAll = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const where = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await Product.findAll({
      where,
      include: [{ model: Category, as: 'category' }],
      order: [['createdAt', 'DESC']],
    });

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category' }],
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, precio, descripcion, imageUrl, categoryId } = req.body;

    const product = await Product.create({
      nombre,
      precio,
      descripcion,
      imageUrl,
      categoryId,
    });

    const productWithRelation = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }],
    });

    res.status(201).json(productWithRelation);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const { nombre, precio, descripcion, imageUrl, categoryId } = req.body;
    await product.update({ nombre, precio, descripcion, imageUrl, categoryId });

    const updatedProduct = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }],
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
