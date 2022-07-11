const { Label, LabelDetailDuration, Song, SongDetail } = require('./class')
const { pool } = require('../setup/connection')

class Model {

    static tableLabel(cb){

        let query = `select l.* from "Labels" l`
        pool.query(query, (err, res) => {

            if(err){
                
                cb(err, null)

            }else{
                
                let items = res.rows.map(el => {

                    return new Label(el.id, el.name, el.since, el.city)

                })
                cb(null, items)
            }
        })
    }

    static detailLabel(cb){

        let query = `select l.*,
        coalesce (cast (avg(s.duration) as float), 0) as "avg",
        coalesce (cast (min(s.duration) as float), 0)  as "min",
        coalesce (cast (max(s.duration) as float), 0) as "max"
        from "Labels" l
        left join "Songs" s on s."LabelId" = l.id
        group by l.id
        `

        pool.query(query, (err, res) => {

            if(err){

                cb(err)

            }else{

                let items = res.rows.map(el => {

                    let { id, name, since, city, avg, min , max} = el

                    return new LabelDetailDuration(id, name, since, city, avg, min , max)

                })

                cb(null, items)
            }
        })
        
    }

    static listSong(search, cb){

        let query = `select s.*
        from "Songs" s
        join "Labels" l on l.id = s."LabelId"
        order by s."totalVote" asc;
        `

        if(search){

            query = `select s.*
            from "Songs" s
            join "Labels" l on l.id = s."LabelId"
            where s.title ilike '%${search}%'
            order by s."totalVote" asc;
            `
        }


        pool.query(query, (err, res) => {

            if(err){

                cb(err)

            }else{

                let items = res.rows.map(el => {

                   return new Song(el.id, el.title, el.bandName, el.duration, el.genre, el.totalVote)

                })

                cb(null, items)
            }
        })
    }
    
    static idSong(id, cb){

        let query = `select s.*, l.name as "company"
        from "Songs" s
        join "Labels" l on l.id = s."LabelId" 
        where s.id = ${id}
        `

        pool.query(query, (err, res) => {

            if(err){

                cb(err)

            }else{

                let items = res.rows.map(el => {

                    const {id, title, bandName, duration, genre, totalVote, createdDate, lyric, imageUrl, LabelId, company} = el
                    let newIdSong = new SongDetail(id, title, bandName, duration, genre, totalVote, createdDate, lyric, imageUrl, LabelId ,company)

                    return newIdSong
                })

                cb(null, items)
            }
        })

    }


    static updateSong(title, bandName, duration, genre, createdDate, lyric, imageUrl, LabelId, cb){

       let errors =  Model.validation(title, bandName, duration, genre, createdDate, lyric, imageUrl, LabelId)


        if(errors.length){

            cb({code: 2, err:errors})

        }else{

                
            let query = `insert into "Songs" (title, "bandName", duration, genre, "createdDate", lyric, "imageUrl", "totalVote", "LabelId")
            values ($1, $2, $3, $4, $5, $6, $7, 0, $8)`
            
            pool.query(query,[title, bandName, duration, genre, createdDate, lyric, imageUrl, LabelId], (err) => {
                
                if(err){
                    
                    cb({code: 1, err})
                    
                }else{
                    
                    cb()
                }
            })
        }
        
    }

    static songEdit(id, cb){

        Model.tableLabel((err, res) => {
            if(err){

                cb(err)

            }else{

                Model.idSong(id, (err, result) => {

                    cb(null, {res, result })
                })
            }
        })
    }


    static songPost(id, title, bandName, duration, genre, createdDate, lyric, imageUrl, LabelId, cb){

        let errors = Model.validation(title, bandName, duration, genre, createdDate, lyric, imageUrl, LabelId)

        if(errors.length){

            cb({code: 2, err:errors})

        }else{

            
            let query = `
        update "Songs" s
        set 
        title = '${title}', 
        "bandName" = '${bandName}', 
        duration = ${+duration}, 
        genre = '${genre}', 
        "createdDate" = '${createdDate}', 
        lyric = '${lyric}', 
        "imageUrl" = '${imageUrl}', 
        "LabelId" = ${LabelId}
        where s.id = ${id}
        `
        pool.query(query, (err, res) => {

            if(err){
                
                cb({code: 1, err})
                
            }else{
                
                cb(null, res)
            }
        })
    }

    }
    
    static deleteSong(id, cb){

        let query = `delete from "Songs" s
        where s.id = ${id}`

        pool.query(query, (err, res) => {

            if(err){

                cb(err)

            }else{

                cb()
            }

        })

    }
    
    static increment(id, cb){

        let query = `select s."totalVote" from "Songs" s
        where s.id = ${id}`

        pool.query(query, (err, res) => {

            if(err){

                cb(err, null)

            }else{
                
                let vote = res.rows[0].totalVote
                vote++
                let query2 = `update "Songs" 
                set "totalVote" = ${vote}
                where  "Songs".id = ${id}`

                pool.query(query2, (err) =>{
                    
                    if(err){

                        cb(err, null)

                    }else{

                        cb()
                    }
                })
            }
        })
    }
    
    static validation(title, bandName, duration, genre, createdDate, lyric, imageUrl, LabelId){

        let errors = []
        if(!title){
            errors.push(`name is required`)
        }
        if(!bandName){
            errors.push(`bandName is required`)
        }
        if(!duration){
            errors.push(`duration is required`)
        }
        if(!genre){
            errors.push(`genre is required`)
        }
        if(!imageUrl){
            errors.push(`imageUrl is required`)
        }
        if(!lyric){
            errors.push(`lyric is required`)
        }
        if(!LabelId){
            errors.push(`LabelId is required`)
        }
        if(!createdDate){
            errors.push(`createdDate is required`)
        }

        if(duration < 60){

            errors.push('Minimun duration 60 seconds')
        }

        if(title.length > 100){

            errors.push('Maximum character is 100')
        }

        if(imageUrl.length > 50){

            errors.push('Image Url maximum name character is 50')
        }

        let temp = 0

        if(lyric.length > 0){

            for( let i = 0 ; i < lyric.length ; i++){

                if(lyric[i] === ' '){

                    if(lyric[i - 1] !== ' '){

                        if(lyric[i - 1] !== undefined){

                            temp++

                        }
                    }

                }

            }

            let lastWord = lyric.length - 1

            if(lyric[lastWord] !== ' '){

                temp++
            }
        }

        if(temp < 10){

            errors.push('Minimun word in lyric is 10')
        }

        if(createdDate){

            const today = new Date()
            const yesterday = new Date(createdDate)

            if(today < yesterday){
                errors.push(`Maximum year is today!`)
            }

        }

        return errors;
    }
}


module.exports = Model