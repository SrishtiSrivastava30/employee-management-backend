const express = require('express');
const mysql = require('mysql');
// const {request} = require('http');
const {request, response} = require('express');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'company_db'
  });
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.listen('3000', () => {
    console.log('Server started !!!!!');
})
db.connect(err => {
    if (err) throw err
    console.log('DB connected');
})
app.post('/adddepartment', (request, response) => {
    // const id = request.body.id;
    // const name = request.body.name;
    // const hod = request.body.hod;
    const {body: {id, name, hod}} = request;
    let emp = {DEPT_ID: id, DEPT_NAME: name, HEAD_OF_DEPARTMENTS: hod}
    let sql = 'INSERT INTO departments SET ?';
    db.query(sql, emp, (err, result) => {
        if (err){
            response.status(500).json({error: 'Something went wrong'})
            console.log('error => ' + err);
        }
        else{
            // console.log(result);
            response.status(201).json({message: "Successfully added a department"});
        }
    });
});
app.post('/addemployee', (request, response) => {
    const {body: {dept_id, emp_id, name, phone, email, address}} = request;
    let emp = {DEPT_ID: dept_id, EMP_ID: emp_id, EMP_NAME: name, EMP_PHONE: phone, EMP_MAIL: email, EMP_ADDRESS: address}
    let sql = 'INSERT INTO employee SET ?';
    db.query(sql, emp, (err, result) => {
        if (err){
            response.status(500).json({error: 'Something went wrong'})
            console.log('error => ' + err);
        }
        else{
            // console.log(result);
            response.status(201).json({message: "Successfully added a new employee"});
        }
    });
});
app.post('/deleteemployee', (request, response) => {
    const {body: {emp_id}} = request;
    db.query(`DELETE FROM employee WHERE EMP_ID = ${emp_id}`, (err, result) => {
        if (err){
            response.status(500).json({error: 'Something went wrong'})
            console.log('error => ' + err);
        }
        else{
            // console.log(result);
            response.status(201).json({message: "Successfully deleted an employee record"});
        }
    });
});