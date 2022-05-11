const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { redirect } = require('express/lib/response');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.set("view engine", "ejs");
app.set("views", "views");

const db = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    database: "pijarcamp",
    user: "root",
    password: ""
})

db.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Database is connected");
    
    // tampil data
    app.get("/", (req, res) =>{
        const selectData = "SELECT * FROM produk";
        connection.query(selectData, (err, result) => {
            console.log("hasil database: ", result);

            if(!err){
                res.render("index", {
                    title: "Daftar Produk",
                    results: result
                })
            }
        })
    });

    // Search
    app.post("/", (req, res) =>{
        const searchtData = 'SELECT * FROM produk WHERE nama_produk LIKE ? OR keterangan LIKE ? OR harga LIKE ? OR jumlah LIKE ?';
        connection.query(searchtData, ['%' + req.body.search + '%', '%' + req.body.search + '%', '%' + req.body.search + '%', '%' + req.body.search + '%'], (err, result) => {
            console.log("hasil database: ", result);

            if(!err){
                res.render("index", {
                    title: "Daftar Produk",
                    results: result
                })
            }
        })
    });


    // input
    app.post("/tambah", (req,res) =>{
        const insertData = `INSERT INTO produk (nama_produk, keterangan, harga, jumlah) VALUES ('${req.body.nama_produk}', '${req.body.keterangan}', '${req.body.harga}', '${req.body.jumlah}' )`;
        connection.query(insertData, (err, result) =>{
            if (err) throw err;
            res.redirect("/")
        })
    })

    // edit
    app.get("/edit/:id", (req, res) =>{
        const editData = 'SELECT * FROM produk WHERE idproduk = ?';
        connection.query(editData, [req.params.id], (err, result) => {
            console.log("hasil edit: ", result);

            if(!err){
                res.render('edit', {
                    results: result
                })
            }
        })
    })

    // update
    app.post("/edit/:id", (req, res) =>{
        const updateData = "UPDATE produk SET nama_produk = ?, keterangan = ?, harga = ?, jumlah = ? WHERE idproduk = ?"
        connection.query(updateData, [req.body.nama_produk,req.body.keterangan,req.body.harga,req.body.jumlah,req.params.id], (err, result) =>{
            if(!err){
                res.redirect("/");
            }
        })
    })

    // delete
    app.get("/delete/:id", (req, res) =>{
        
        const deleteData = "DELETE FROM produk WHERE idproduk = ?";
        connection.query(deleteData, [req.params.id], (err, result) =>{
            if(!err){
                res.redirect("/");
            }
        })
    })

})


app.listen(3000, () => console.log("Server is connected") )