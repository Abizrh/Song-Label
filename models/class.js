const { clearScreenDown } = require("readline")

class Label {

    constructor(id, name, since, city){

        this.id = id
        this.name = name
        this.since = since
        this.city = city
    }

    get toDate(){
        let date = new Date(this.since)
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let newDate = date.toLocaleDateString('id-ID', options)
        return newDate

    }
}



class LabelDetailDuration extends Label {

    constructor(id, name, since, city, avarageDuration, minDuration, maxDuration){
        super(id, name, since, city)
        this.avarageDuration = avarageDuration
        this.minDuration = minDuration
        this.maxDuration = maxDuration
    }
}


class Song {

    constructor(id, title, bandName, duration, genre, totalVote){

        this.id = id
        this.title = title
        this.bandName = bandName
        this.duration = duration
        this.genre = genre
        this.totalVote = totalVote
    }
}

class SongDetail extends Song {

    constructor(id, title, bandName, duration, genre, totalVote, createdDate, lyric, imageUrl, LabelId, companyName){

        super(id, title, bandName, duration, genre, totalVote)

        this.createdDate = createdDate
        this.lyric = lyric
        this.imageUrl = imageUrl
        this.LabelId = LabelId
        this.companyName = companyName
    }

    get toDateSong(){
        let date = new Date(this.createdDate)
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let newDate = date.toLocaleDateString('id-ID', options)
        return newDate

    }

    get formatDate() {
        let date_format = new Date();
        return  date_format.toISOString().split('T')[0];
    }
}

// 
// const tes = new Label(1, 'abi', '1976-12-10T17:00:00.000Z', 'bogor')
// console.log(tes.toDate('1976-12-10T17:00:00.000Z'))
// console.log(tes)

module.exports = {
    Label,
    LabelDetailDuration,
    Song,
    SongDetail
}
