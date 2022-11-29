import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
    host: '127.0.0.1', user: 'root', database: 'gameInfo', port: 3306
})


let table = "GameInfo";
let gameID = "1234567890";
let playerBalance = 100000000;
let playerName = "test001";
let defaultBalance = 2500;

// const [rows, fields] = await connection.execute(`SELECT playerBalance FROM ${table} WHERE playerName = ?`, [playerName]);
// console.log(rows);

const sql = `SELECT playerBalance FROM ${table} WHERE playerName = ?`;
const values = [playerName];
const [rows, fields] = await connection.execute(sql, values);
const data = [gameID, playerName, defaultBalance];
if (rows.length === 0) {
    await connection.execute(`INSERT INTO ${table} (GameID, PlayerName, PlayerBalance) VALUES (${gameID}, '${playerName}', ${defaultBalance})`);
    playerBalance = defaultBalance;
}
console.log(rows);

// const sql = `INSERT INTO ${table} (GameID, PlayerName, PlayerBalance) VALUES (?)`;
// const values = [gameID, playerName, playerBalance];
// connection.query(sql, [values], function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted: " + result.affectedRows);
//     console.log(result);
// });

// const sql = `SELECT playerBalance FROM ${table} WHERE playerName = ? and gameID = ?`;
// const values = [playerName, gameID];
// let playerBalance = null;
// connection.query(sql, values, function (err, result, fields) {
//     if (err) throw err;
//     console.log(fields);
//     console.log(result);
//     playerBalance = result[0].playerBalance;
// });


// const sql = `SELECT playerBalance FROM ${table} WHERE playerName = ?`;
// const values = [playerName];
// connection.query(sql, values, function (err, result, fields) {
//     if (err) throw err;
//     console.log(fields);
//     if (result.length === 0) {
//         connection.query(`INSERT INTO ${table} (GameID, PlayerName, PlayerBalance) VALUES (?)`,
//             [[gameID, playerName, defaultBalance]],
//             function (err, result) {
//             if (err) throw err;
//             console.log("1 record inserted: " + result.affectedRows);
//             });
//         }
//     }
// );

// const sql = "UPDATE gameInfo SET playerBalance = ? WHERE playerName = ? and gameID = ?";
// const values = [playerBalance, playerName, gameID];
// connection.query(sql, values, function (err, result) {
//     if (err) throw err;
//     console.log(result.affectedRows + " record(s) updated");
// });



