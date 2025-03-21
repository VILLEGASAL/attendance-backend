import { System } from "../models/system.js";
import { SESSION } from "../app.js";


export const getUserAttendance = async(req, res) => {

    try {

        const userID = SESSION.get(req.cookies.sessionID).user_id;
        
        const attendance = await System.getUserAttendance(userID);

        res.status(200).json(attendance);

        
    } catch (error) {
        
        console.log(error.message);
    }
}

export const addAttendance = async(req, res) => {

    try{

        const user = SESSION.get(req.cookies.sessionID);

        const userID = user.user_id;
        const date = req.body["date"];
        const timeIn = req.body["time_in"];
        const timeOut = req.body["time_out"];
        const totalHours = req.body["total_time"];

        const addAttendanceRecord = await System.addAttendance(userID, date, timeIn, timeOut, totalHours);

        addAttendanceRecord ? res.status(200).send(): res.status(400).send();

    }catch(error){

        console.log(error.message);

        res.status(500).send();
    }
}

export const deleteAttendance = async (req, res) => {

    try {

        const user = SESSION.get(req.cookies.sessionID);

        const user_id = user.user_id;

        if (await System.deleteUserAttendance(req.params.id, user_id)) {
         
            return res.status(200).send(`Successfullyt Deleted an Attendance Record With an ID of: ${req.params.id}`);
        }else{

            throw new Error(`Failed to delete attendance record.`);
        }
        
    } catch (error) {
        
        console.log(error.message);

        return res.sendStatus(500);
    }
}