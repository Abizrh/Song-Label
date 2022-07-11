const router = require('express').Router()
const { CONNREFUSED } = require('dns')
const Controller = require('../controllers/controller')


router.get('/', Controller.showLanding)
router.get('/labels', Controller.showLabel)
router.get('/labels/detail', Controller.labelDetail)
router.get('/songs', Controller.songList)
router.get('/songs/add',Controller.createSong)
router.get('/songs/:id', Controller.songId)
router.post('/songs/add',Controller.updateSong)
router.get('/songs/:id/edit', Controller.editSong)
router.post('/songs/:id/edit', Controller.postSong)
router.get('/songs/:id/delete', Controller.deleteSong)
router.get('/songs/:id/vote', Controller.incrementVote)


module.exports = router