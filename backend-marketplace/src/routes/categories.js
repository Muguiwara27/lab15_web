const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authenticate, authorize('ADMIN'), create);
router.put('/:id', authenticate, authorize('ADMIN'), update);
router.delete('/:id', authenticate, authorize('ADMIN'), remove);

module.exports = router;
