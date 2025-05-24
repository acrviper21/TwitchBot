const fs = require("fs");
const csv = require("csv-parser");
const { resolve } = require("path");

const permissions = new Map();

function loadCommandPermissions()
{
    return new Promise((resolve, reject) => {
        //Create a stream to read in csv file
        fs.createReadStream("commandPermissions.csv")
        .pipe(csv())
        // Get each row from the csv file
        .on("data", (row) => {
            permissions.set(parseInt(row.id), row.name);
        })
        // Called after the file is done being read
        .on("end", () =>{
            console.log("Finished reading in the file");
            for(const [key, value] of permissions)
            {
                console.log(`Key: ${key}, Value: ${value}`);
            }
            resolve(permissions);
        });
    })
}

module.exports = loadCommandPermissions;

// //Create a stream to read in csv file
// fs.createReadStream("commandPermissions.csv")
// .pipe(csv())
// // Get each row from the csv file
// .on("data", (row) => {
//     permissions.set(row.id, row.name);
// })
// // Called after the file is done being read
// .on("end", () =>{
//     console.log("Finished reading in the file");
//     for(const [key, value] of permissions)
//     {
//         console.log(`Key: ${key}, Value: ${value}`);
//     }
// });
