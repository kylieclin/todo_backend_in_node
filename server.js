const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const mysqlCreds = require('./mysqlcreds.js');
const database = mysql.createConnection(mysqlCreds);
const server = express();

server.use(cors());
server.use(express.json());

server.get('/api/todo_items', (req,res)=>{
    database.connect(()=>{
        const query = "SELECT * FROM `todo_items`";
        database.query(query, (error, data)=>{
            const output ={
                success: false
            }

            if(!error){
                output.success = true;
                output.data = data;
            } else {
                output.error = error
            }
            res.send(output);
        })
    })
})

server.post('/api/todo_items',(req, res)=>{
    database.connect(()=>{
        if(req.body.todo === undefined){
            res.send({
                success: false,
                message: 'must add items into todolist'
            })
            break;
        }

        const query = 'INSERT INTO `todo_items` SET `title`="'+req.body.todo+'"';
        database.query(query,(error,result)=>{
            if(!error){
                res.send({
                    success: true,
                    id: result.insertId
                })
            } else {
                res.send({
                    success: false,
                    error
                })
            }
        })
    })
})

server.delete('/api/todo_items/:id',(req,res)=>{
    database.connect(()=>{

        if(req.params.id === undefined){
            res.send({
                success: false,
                message: 'must have an id to delete item'
            })
            break;
        }

        const query = 'DELETE FROM `todo_items` WHERE `id`='+req.params.id;
        database.query(query,(error)=>{
            if(!error){
                res.send({
                    success: true
                })
            } else {
                res.send({
                    success: false,
                    error
                })
            }
        })
    })
})

server.listen(3001, ()=>{
    console.log('server is running on port 3001');
});