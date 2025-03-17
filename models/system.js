
import { db } from "../models/db_connection.js";

await db.connect();

export class System {

    static getUserByUsername = async(username) => {

        try {

            const query = `SELECT * FROM users WHERE username = $1`;

            const values = [username];

            const user = await db.query(query, values);

            return user.rows[0] || null;
            
        } catch (error) {
            
            console.log(error.message);
        }
    }

    static getUserById = async(id) => {

        try {

            const query = `SELECT * FROM users WHERE user_id = $1`;

            const values = [id];

            const user = await db.query(query, values);

            return user.rows[0];
            
        } catch (error) {
            
            console.log(error.message);
        }
    }

    static checkDuplicateUsername = async(username) => {

        try {

            const query = `SELECT username from users WHERE username = $1`;
            const values = [username];

            const usernames = await db.query(query, values);

            return usernames.rows; 
            
        } catch (error) {
            
            console.log(error.message);
        }
    }


    static registerUser = async(firstName, lastName, username, password) => {

        try {
 
            const query = `INSERT INTO users (first_name, last_name, username, password, total_hours, remaining_hours) VALUES ($1, $2, $3, $4, $5, $6)`;
            const values = [firstName, lastName, username, password, 0, 0];

            await db.query(query, values);

            return true;    
            
        } catch (error) {
            
            console.log(error.message);

            return false;
        }
    }

    static getUserAttendance = async(user_id) => {

        const today = new Date();
        const currentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        
        try {

            const query = `SELECT * FROM attendance WHERE user_id = $1`;
            const values = [user_id];

            const user = await db.query(query, values);

            return user.rows;
            
        } catch (error) {
            
            console.log(error.message);
            
        }
    }

    static getUserTotalhours = async(user_id) => {

        try {

            const queryToGetUserTotalHours = `SELECT total_hours FROM users WHERE user_id = $1`;
            const valuesToGetUserTotalHours = [user_id];

            const userTotalHours =  await db.query(queryToGetUserTotalHours, valuesToGetUserTotalHours);

            return userTotalHours.rows[0].total_hours;

        } catch (error) {

            console.log(error.message);

            return false;
        }
    }

    
    static updateUserRemainingTime = async (user_id) => {

        try{

            const computeRemainingTime = 270 - Number(await this.getUserTotalhours(user_id));

            const query = `UPDATE users SET remaining_hours = $1 WHERE user_id = $2`;
            const value = [computeRemainingTime, user_id];

            await db.query(query, value);

            return true;

        }catch(error){

            console.log(error.message);

            return false;
            
        }
    }

    static updateUserTotalHours = async (addedHours, user_id) => {

        try {

            const addHour = Number(addedHours) + Number(await this.getUserTotalhours(user_id));

            const query = `UPDATE users SET total_hours = $1 WHERE user_id = $2`;
            const value = [addHour, user_id]

            await db.query(query, value);

        } catch (error) {
            
            console.log(error.message);
        }
    }

    static addAttendance = async (user_id, date, timeIn, timeOut, totalHours) => {

        try{

            const queryToAddAttendance = `INSERT INTO attendance(user_id, attendance_date, time_in, time_out, total_hours) VALUES ($1, $2, $3, $4, $5)`;
            const valuesToAddAttendance = [user_id, date, timeIn, timeOut, totalHours];
            await db.query(queryToAddAttendance, valuesToAddAttendance);

            await this.updateUserTotalHours(totalHours, user_id);
            await this.updateUserRemainingTime(user_id);
            
            return true;

        }catch(error){

            console.log(error.message);

            return false;
        }
    }
}