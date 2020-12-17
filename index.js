const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
// const {request} = require('http');
const {request, response} = require('express');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'company_db'
  });
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.listen('3000', () => {
    console.log('Server started !!!!!');
})
db.connect(err => {
    if (err) throw err
    console.log('DB connected');
})
app.post('/login', (request, response) => {
    let email = request.body.email;
    let password = request.body.password;
    if(email === "admin@gmail.com" && password === "cheems420"){
        response.status(200).json({token: "59tyg2ohwbevoil3tu0479ow8pu9fejnb74w80pu9fjvn4ow8pguj"});
    }
    else{
        response.status(401).json({token: "Unauthorized"})
    }
})
app.post('/adddepartment', (request, response) => {
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
            db.query(`DELETE FROM payroll WHERE EMP_ID = ${emp_id}`, (err, res => {
                if(err){
                    response.status(500).json({error: 'Something went wrong'})
                    console.log('error => ' + err);
                }
                else{
                    response.status(201).json({message: "Successfully deleted an employee record and payroll"});
                }
            }))
        }
    });
});
app.post('/deleteDepartment', (request, response) => {
    const {body: {dept_id}} = request;
    db.query(`DELETE FROM departments WHERE DEPT_ID = ${dept_id}`, (err, result) => {
        if (err){
            response.status(500).json({error: 'Something went wrong'})
            console.log('error => ' + err);
        }
        else{
            response.status(201).json({message: "Successfully deleted a department"});
        }
    }
    )
});
app.get('/empdetails', (request, response) => {
    db.query('SELECT * FROM employee', (err, result) => {
        if (err){
            response.status(500).json({error: 'Something went wrong'})
            console.log('error => ' + err);
        }
        else{
            // console.log(result);
            response.status(201).json({message: result});
        }
    });
});
app.get('/depdetails', (request, response) => {
    db.query('SELECT * FROM departments', (err, result) => {
        if (err){
            response.status(500).json({error: 'Something went wrong'})
            console.log('error => ' + err);
        }
        else{
            // console.log(result);
            response.status(201).json({message: result});
        }
    });
});
app.post('/empPayroll', (request, response) => {
    let id = request.body.emp_id;
    db.query(`SELECT * FROM payroll WHERE EMP_ID = ${id}`, (err, result) => {
        if (err){
            response.status(500).json({error: 'Something went wrong'})
            console.log('error => ' + err);
        }
        else{
            // console.log(result);
            response.status(201).json({message: result});
        }
    });
});
app.post('/addpayroll', (request, response) => {
    const {body: {dept_id,
                 emp_id,
                  basic, 
                  bonus, 
                  hra, 
                  medical, 
                  ta, 
                  da, 
                  tax, 
                  leaves}} = request;
    const salary = basic + bonus + hra + ta + da + medical - tax - ((basic/30)*leaves);
    let emp = {DEPT_ID: dept_id, EMP_ID: emp_id, BASIC: basic, BONUS: bonus, HRA: hra, MEDICAL_ALLOWANCE: medical, TA: ta, DA: da, TAX: tax, LEAVES: leaves, NET_SALARY: salary}
    let sql = 'INSERT INTO payroll SET ?';
    db.query(sql, emp, (err, result) => {
        if (err){
            response.status(500).json({error: 'Something went wrong'})
            console.log('error => ' + err);
        }
        else{
            // console.log(result);
            response.status(201).json({message: `Successfully added payroll for employee id ${emp_id}`});
        }
    });
});
