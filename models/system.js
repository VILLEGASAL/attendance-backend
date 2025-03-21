
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
 
            const query = `INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)`;
            const values = [firstName, lastName, username, password];

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

            const attendance = await db.query(query, values);
            

            return attendance.rows;
            
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

    static getUserRemainingHours = async (user_id) => {

        try{

            const query = `SELECT remaining_hours FROM users WHERE user_id = $1`;
            const value = [user_id];

            const userRemainingHours = await db.query(query, value);
            
            return userRemainingHours.rows[0].remaining_hours;

        }catch(error){

            console.log(error.message);

            return false;
        }
    } 
    
    static updateUserRemainingTime = async (hour, user_id, toAdd) => {

        try{

            if (toAdd) {
                
                const computeRemainingTime = Number(await this.getUserRemainingHours(user_id)) - Number(hour);

                const query = `UPDATE users SET remaining_hours = $1 WHERE user_id = $2`;
                const value = [computeRemainingTime, user_id];

                await db.query(query, value);

                return true;
            }

            const computeRemainingTime = Number(await this.getUserRemainingHours(user_id)) + Number(hour);

            const query = `UPDATE users SET remaining_hours = $1 WHERE user_id = $2`;
            const value = [computeRemainingTime, user_id];

            await db.query(query, value);

            return true;
            

        }catch(error){

            console.log(error.message);

            return false;
            
        }
    }

    static updateUserTotalHours = async (hours, user_id, toAdd) => {

        try {
            
            if (toAdd) {
                
                const addHour = Number(hours) + Number(await this.getUserTotalhours(user_id));

                const queryToAdd = `UPDATE users SET total_hours = $1 WHERE user_id = $2`;
                const value = [addHour, user_id];

                await db.query(queryToAdd, value);

                return true;
            }

            
            const subtractHour = Number(await this.getUserTotalhours(user_id) - Number(hours));

            const queryToSubtract = `UPDATE users SET total_hours = $1 WHERE user_id = $2`;
            const value = [subtractHour, user_id];

            await db.query(queryToSubtract, value);

            return true;
            

        } catch (error) {
            
            console.log(error.message);

            return false;
        }
    }

    static addAttendance = async (user_id, date, timeIn, timeOut, totalHours) => {

        try{

            const queryToAddAttendance = `INSERT INTO attendance(user_id, attendance_date, time_in, time_out, total_hours) VALUES ($1, $2, $3, $4, $5)`;
            const valuesToAddAttendance = [user_id, date, timeIn, timeOut, totalHours];
            await db.query(queryToAddAttendance, valuesToAddAttendance);

            await this.updateUserTotalHours(totalHours, user_id, true);
            await this.updateUserRemainingTime(totalHours, user_id, true);
            
            return true;

        }catch(error){

            console.log(error.message);

            return false;
        }
    }

    static getAttendanceTotalHours = async (attendance_id) => {

        try {

            const queryToSelectSpecificAttendance = `SELECT total_hours FROM attendance WHERE attendance_id = $1`;
            
            const attendanceID = [attendance_id];

            const attendance = await db.query(queryToSelectSpecificAttendance, attendanceID);

            return attendance.rows[0].total_hours;

        } catch (error) {

            console.log(error.message);

            return false;
        }
    }

    static deleteUserAttendance = async (attendance_id, user_id) => {

        try {

            const attendanceTotalHours = await this.getAttendanceTotalHours(attendance_id);

            await this.updateUserTotalHours(attendanceTotalHours, user_id, false);
            await this.updateUserRemainingTime(attendanceTotalHours, user_id, false);
            
            const queryToDeleteAttendance = `DELETE FROM attendance WHERE attendance_id = $1`;
            const idToDelete = [attendance_id];

            await db.query(queryToDeleteAttendance, idToDelete);

            return true;

        } catch (error) {
            
            console.log(error.message);

            return false;
            
        }   
    }
}