const Router = require('@koa/router')
const Body = require('koa-body');

const { setting } = require('../data/setting')

const common = require('../controller/common')
const catalog = require('../controller/catalog')

const router = new Router({
  prefix: setting.prefix
})

router.get('/common/get', common.get)
router.post('/common/put', common.put)
router.post('/common/post', common.post)
router.post('/common/delete', common.delete)

router.get('/catalog/get', catalog.get)
router.post('/catalog/put', Body(), catalog.put)
router.post('/catalog/post', Body(), catalog.post)
router.get('/catalog/delete', catalog.delete)

module.exports = router