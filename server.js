const fs = require('fs')
const express = require('express')
const app = express()


const {Product} = require('./models')

// middleware for read json from body(client, fe)
app.use(express.json())


// default url = health check
// /health-check
// 200 is success or no issue
app.get('/', (req, res) => {
    res.status(200).json({
        "status": "Success",
        "message": "Application is running good..."
    })
})

// if url is /tegar
app.get('/tegar', (req, res) => {
    // 200 is success or no issue
    res.status(200).json({
        "message": "Ping Successfully"
    })
}) 

// const cars = JSON.parse(fs.readFileSync(`${__dirname}/assets/data/cars.json`, 'utf8'));

// kaidah API
// /api/v1/(collection) => collection harus jamak (s)
app.get('/api/v1/cars', async (req, res) => {

    const cars = await Product.findAll()

    // 200 is success or no issue
    // tidak boleh ada proses didalam respon
    res.status(200).json({
        satus: "Success",
        message: "Success get cars data",
        isSuccsess: true,
        totalData: cars.length,
        data: {
            cars,
        }

        // cara manggil data array
        // respon.
    })
}) 

// methode create / post
app.post('/api/v1/cars', (req, res) => {
    // insert into

    const newCar = req.body;

    cars.push(newCar);

    fs.writeFile(`${__dirname}/assets/data/cars.json`,JSON.stringify(cars), (err) =>{
        res.status(201).json({
            satus: "Success",
            message: "Success get cars data",
            isSuccsess: true,
            data: {
                cars: newCar,
            }
        })
    })
}) 


// methode create / post
// app.get('/api/v1/cars/:name/:id', (req, res) => {
//     // insert into
//     // select * from db where id='1' OR name='yogi'
//     console.log(req.params.id)
//     const newCar = req.body;

//     cars.push(newCar);

//     fs.writeFile(`${__dirname}/assets/data/cars.json`,JSON.stringify(cars), (err) =>{
//         res.status(201).json({
//             satus: "Success",
//             message: "Success get cars data",
//             isSuccsess: true,
//             data: {
//                 cars: newCar,
//             }
//         })
//     })
// }) 


// get car data by id
app.get('/api/v1/cars/:id', (req, res) => {

    // parsing integer
    const id =req.params.id *1;
    // console.log(req.params.id);



    const car = cars.find((i) => i.id == id);

    // salah satu basic error handling
    if(!car){
        console.log("tidak ada")
        return res.status(404).json({
            status: "Failed",
            message: `Failed get car data for id : ${id}`,
            isSuccess: false,
            data: null,
        });
    }

    res.status(200).json({
        status: "Success",
        message: "Success get car data",
        isSuccess: true,
        data: {
            car,
        }
    });
});

// metode patch hanya untuk sebagian isi dari kontent / file json saja
app.patch("/api/v1/cars/:id", (req, res) => {
    // UPDATE ..... FROM (table) WHERE id = req.params.id
    // console.log(req.body)

    const id = req.params.id * 1;

    // object destructuring
    // const {name, year, type} = req.body

    // find data by id
    const car = cars.find((i) => i.id == id);
    // console.log(car)

    // mencari data index array nya
    const carIndex = cars.findIndex((car) => car.id === id)
    console.log(`ini index array ke : ${carIndex}`)

    // error handling if id not found
    if(!car){
        console.log("tidak ada")
        return res.status(404).json({
            status: "Failed",
            message: `Failed get car data for id : ${id}`,
            isSuccess: false,
            data: null,
        });
    }

    // update sesuai request body (client/frontend)
    // object assign = menggunakan objek spread operator
    cars[carIndex] = {...cars[carIndex], ...req.body}

    const newCar = cars.find((i) => i.id === id)

    // update / rewrite data json
    fs.writeFile(`${__dirname}/assets/data/cars.json`,JSON.stringify(cars), (err) =>{
        res.status(201).json({
            satus: "Success",
            message: `Success update cars data id : ${id}`,
            isSuccsess: true,
            data: {
                newCar,
            }
        })
    })
} )


app.delete("/api/v1/cars/:id", (req, res) => {
    // UPDATE ..... FROM (table) WHERE id = req.params.id
    // console.log(req.body)

    const id = req.params.id * 1;

    // object destructuring
    // const {name, year, type} = req.body

    // find data by id
    const car = cars.find((i) => i.id == id);
    // console.log(car)

    // mencari data index array nya
    const carIndex = cars.findIndex((car) => car.id === id)
    console.log(`ini index array ke : ${carIndex}`)

    // error handling if id not found
    if(!car){
        console.log("tidak ada")
        return res.status(404).json({
            status: "Failed",
            message: `Failed delete car data for id : ${id}`,
            isSuccess: false,
            data: null,
        });
    }

    // update sesuai request body (client/frontend)
    // object assign = menggunakan objek spread operator
    cars[carIndex] = {...cars[carIndex], ...req.body}

    // melakukan penghapusan data sesuai dengan id
    cars.splice(carIndex, 1)

    // update / rewrite data json
    fs.writeFile(`${__dirname}/assets/data/cars.json`,JSON.stringify(cars), (err) =>{
        res.status(201).json({
            satus: "Success",
            message: `Success delete cars data id : ${id}`,
            isSuccsess: true,
        })
    })
} )


// middleware or handler for url didn't work / access
// make middleware = our own middleware
// 404 for if url doesn't exist, data doesn't exist, or resource doesn't exist
app.use((req, res, next) => {
    res.status(404).json({
        "status": "Failed",
        "message": "API not exist !!"
    })
})

app.listen("3000", () => {
    console.log("Server running on port 3000")
})