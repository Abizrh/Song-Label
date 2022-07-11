
const Model = require('../models/model')


class Controller {

    static showLanding(req, res){

        res.render('landing')
        
    }

    static showLabel(req, res){

        Model.tableLabel((err, data) => {

            if(err){

                res.send(err)

            }else{


                res.render('tableLabel', {data})
            }

        })
    }
    
    static labelDetail(req, res){

        Model.detailLabel((err, data) => {

            if(err){

                res.send(err)

            }else{


                res.render('labelDetail', {data})
            }


        })
    }

    static songList(req, res){

        let { search } = req.query

        // console.log(search)
        Model.listSong(search, (err, data) => {

            if(err){

                res.send(err)

            }else{


                res.render('songs', {data})
            }


        })
    }

    

    static songId(req, res){

        Model.idSong(req.params.id, (err, data) => {

            if(err){

                res.send(err)

            }else{

                res.render('idSong', {data})
            }


        })
    }

    static createSong(req, res){

        // console.log(req.body)
        let { errors } = req.query

        

        Model.tableLabel((err, data) => {

            if(err){

                res.send(err)

            }else{
                res.render('formAddSong', {data, errors})
            }


        })
    }


    static updateSong(req, res){

        const { title, bandName, duration, genre, createdDate, lyric, imageUrl, LabelId } = req.body

        Model.updateSong(title, bandName, +duration, genre, createdDate, lyric, imageUrl, +LabelId, (err) => {
            
            if(err){

                if(err.code){

                    res.redirect(`/songs/add?errors=${err.err.join(';')}`)

                }else{

                    res.send(err)
                }
                
                
            }else{
                
                res.redirect('/songs')
            }
            
            
        })
    }

    static editSong(req, res){

        let { errors } = req.query
        
        Model.songEdit(req.params.id, (err, data) => {

            // console.log(data)
            if(err){

                res.send(err)

            }else{

                res.render('songEdit', {label: data.res, songDetail: data.result, errors})
            }


        })
    }

    static postSong(req, res){

        let id = req.params.id
        const { title, bandName, duration, genre, createdDate, lyric, imageUrl, LabelId } = req.body
        
        Model.songPost(+id, title, bandName, +duration, genre, createdDate, lyric, imageUrl, +LabelId, (err, data) => {

            if(err){

                if(err.code){

                    res.redirect(`/songs/${id}/edit?errors=${err.err.join(';')}`)

                }else{

                    res.send(err)

                }
                
            }else{

                res.redirect('/songs')
            }


        })
    }

    static deleteSong(req, res){

        let id = req.params.id

        Model.deleteSong(+id, (err) => {

            if(err){

                res.send(err)

            }else{

                res.redirect('/songs')
            }

        })
    }

    static incrementVote(req, res){

        let id = req.params.id

        Model.increment(+id, (err) => {

            if(err){

                res.send(err)

            }else{

                res.redirect(`/songs/${id}`)
            }
        })

    }
}

module.exports= Controller