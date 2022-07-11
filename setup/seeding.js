const { pool } = require('./connection')

const fs = require('fs')

let labels = JSON.parse(fs.readFileSync('./data/labels.json', 'utf-8'))
let songs = JSON.parse(fs.readFileSync('./data/songs.json', 'utf-8'))

let insertLabels = `insert into "Labels" ( name, since, city) values`
let insertSongs = `insert into "Songs" ( title , "bandName", duration, genre, "createdDate", lyric, "imageUrl", "totalVote", "LabelId") values`


let values = ''

for( let i = 0 ; i < labels.length ; i++){

    values += `('${labels[i].name}', '${labels[i].since}', '${labels[i].city}'),`

}

values = values.slice(0, values.length - 1)

insertLabels += values


// insert value to table songs

let valSongs = ''

for(let i = 0 ; i < songs.length ; i++){

    valSongs += `('${songs[i].title}', '${songs[i].bandName}', ${songs[i].duration}, '${songs[i].genre}', '${songs[i].createdDate}', '${songs[i].lyric}', '${songs[i].imageUrl}', ${songs[i].totalVote}, ${songs[i].LabelId}),`

}

valSongs = valSongs.slice(0, valSongs.length - 1)
console.log(valSongs)

insertSongs += valSongs

// insert value to table labels

pool.query(insertLabels, (err, res) => {

    if(err){

        console.log(`error when insert data`)

    }else {

        pool.query(insertSongs, (err, res) => {
            
            if(err){
                
                console.log(`error when insert data ste`)
                
            }else {
                
                console.log(`succed insert value to table songs`)
            }

        })
    }
})
