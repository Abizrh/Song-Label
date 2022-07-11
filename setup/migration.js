const { pool } = require('./connection')


let tableLabels = `create table if not exists "Labels" (
    id serial primary key,
    name varchar (120) not null,
    since date not null,
    city varchar (20) not null
)`

let tableSongs = `create table if not exists "Songs" (
    id serial primary key,
    title varchar (100),
    "bandName" varchar (100),
    duration integer,
    genre varchar (10),
    "createdDate" date,
    lyric text,
    "imageUrl" varchar (150),
    "totalVote" integer,
    "LabelId" integer,
        foreign key ("LabelId")
        references "Labels"(id)
        on delete cascade
        on update cascade
)`

pool.query(tableLabels, (err, res) => {

    if(err){
        console.log(`error when insert data`, err)

    }else{

        console.log(`success create table label`)
        pool.query(tableSongs, (err, res) => {
            
            if(err){
                
                console.log(`error when insert data`, err)
                
            }else{
                
                console.log(`success create table songs`)
            }
        })
    }
})