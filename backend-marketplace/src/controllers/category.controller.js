const { Category, Product } = require('../models');

const getAll = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
    });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product, as: 'Products' }],
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists.' });
    }

    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const { name, description } = req.body;
    await category.update({ name, description });

    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const productCount = await Product.count({ where: { categoryId: req.params.id } });
    if (productCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. ${productCount} product(s) are assigned to it.`,
      });
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
