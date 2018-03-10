const express = require('express');
const router = express.Router();
const Category = require('../controllers/category');

/**
 * 分类列表
 */
router.get('/index',Category.index);

/**
 * 分类详情
 */
router.get('/:id',Category.get);

/**
 * 分类保存
 */
router.post('/save',Category.save);

/**
 * 更新分类
 */
router.post('/update/:id',Category.update);

/**
 * 删除分类
 */
router.post('/delete/:id',Category.delete);

/**
 *
 */
router.get('/set-nav/:id',Category.setNav);

module.exports = router;