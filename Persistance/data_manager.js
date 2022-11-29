import path from "path";
import fs from "fs";
import {fileURLToPath} from "url";
import {BlackJackGame} from "../Domain/black_jack_game.js";
import mysql from "mysql2/promise";

export class DataManager {
    constructor(name) {
        this.name = name;
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        this.path = path.join(__dirname, "..", "Data", `${name}.txt`);
        let game = new BlackJackGame(name);
        this.default_balance = game.default_balance;
        this.table = "GameInfo";

        this.connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            database: 'gameInfo',
            port: 3306,
            password: 'Chen270499'
        })
    }

    async insertNewGame(gameID, playerName, playerBalance) {
        let con = this.connection;
        const sql = `INSERT INTO ${this.table} (GameID, PlayerName, PlayerBalance) VALUES (?)`;
        const values = [gameID, playerName, playerBalance];
        const [rows, fields] = await con.execute(sql, [values]);
        console.log("1 record inserted: " + rows.affectedRows);
    }

    async getBalanceFromDB(playerName, gameID) {
        const con = await this.connection;
        const sql = `SELECT playerBalance FROM ${this.table} WHERE PlayerName = ?`;
        const values = [playerName];
        let that = this;
        let playerBalance = null;

        const [rows, fields] = await con.execute(sql, values);
        if (rows.length === 0) {
            await con.execute(`INSERT INTO ${this.table} (GameID, PlayerName, PlayerBalance) VALUES (${gameID}, '${playerName}', ${this.default_balance})`);
            playerBalance = 2500;
            console.log("1 record inserted: " + rows.affectedRows);
        } else {
            playerBalance = rows[0]["playerBalance"];
            console.log(playerBalance)
        }
        return playerBalance;
    }

    async setBalanceToDB(playerName, gameID, balance) {
        const con = await this.connection;
        const [rows, fields] = await con.execute(`UPDATE GameInfo SET playerBalance = ? WHERE playerName = ?`, [balance, playerName]);
        console.log("1 record updated: " + rows.affectedRows);
    }

    getBalance() {
        try {
            const data = fs.readFileSync(this.path, "utf8");
            return parseInt(data);
        } catch (error) {
            if (error.code === "ENOENT") {
                return this.default_balance;
            }
        }
    }

    setBalance(balance) {
        fs.writeFileSync(this.path, balance.toString());
    }
}


