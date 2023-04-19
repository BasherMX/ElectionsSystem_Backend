import {v4} from 'uuid';
import {toString} from 'qrcode';
import { pool } from "../db/db.js";


// --- GET ELECTOR QR ---
export const getElectorQrById = async (req, res) => {
    try {
        const [elector] = await pool.query('select * from elector where elector_id= ?', [req.params.id]);
        if (elector.length === 0) {
            return res.status(404).send({ error: 'elector not found' });
        }
        const QRdata = JSON.stringify({elector_id: req.params.id});
        toString(
            QRdata,
            { 
                type: 'svg' 
            },
            (err, data) => {
                if (err) {
                    res.status(500).send({
                        error: err.message
                    });
                } else {
                    var size = 200;
                    data = data.replace(/(viewBox=")([^"]*)(")/, '$1 0 0 ' + size + ' ' + size + '$3');
                    res.send(data);
                }
            }
        )
    } catch (err) {
        res.status(500).send({
            error: err.message
        });
    }
}


//--- GET VOTATION QR CODE ---
export const getVotationQrCode = async (req, res) => {
    try{
        const { elector_id, exercise_id } = req.body;
        const now = new Date();
        const hour = now.getHours()-1;
        const minute = now.getMinutes();
        const initHour = 8;
        const initMinute = 0;
        const endHour = 17;
        const endMinute = 50;
        
        //check the parameters
        if (!elector_id || !exercise_id) {
            res.status(500).send({
                error: 'Missing parameters'
            })
            return;
        }

        //check the time
        if (hour < initHour || hour > endHour || (hour === endHour && minute > endMinute)) {
            res.status(500).send({
                error: 'QR code can only be generated between '+initHour+':0'+initMinute+' and '+endHour+':'+endMinute
            });
            return;
        }
        
        //check the exercise date
        const [exercise] = await pool.query('select date, state_id from election_exercise where exercise_id= ?', [exercise_id]);
        if (exercise.length === 0) {
            return res.status(404).send({ error: 'exercise not found' });
        }
        const targetDate = new Date(exercise[0].date);
        if (now.toISOString().substring(0, 10) !== targetDate.toISOString().substring(0, 10)) {
            res.status(500).send({
                error: 'QR code can only be generated on ' + targetDate.toDateString()
            });
            return;
        }
        
        //check if the elector state and the excersice state are the same
        const [elector] = await pool.query('select state_id from elector where elector_id= ?', [elector_id]);
        if (elector.length === 0) {
            return res.status(404).send({ error: 'elector not found' });
        }
        if(exercise[0].state_id !==  elector[0].state_id){
            res.status(500).send({
                error: 'The elector is not from the same exercise state can not participate in this exercise'
            })
            return;
        }

        //check if the qr code was not generated before
        const [rows] = await pool.query('SELECT * FROM elector_exercise_vote WHERE elector_id = ? AND exercise_id = ?', [elector_id, exercise_id]);
        if (rows.length > 0) {
            const qrGenerated = rows[0].qr_generated;
            if (qrGenerated) {
                res.status(500).send({
                    error: 'The QR code was already generated, only can be generated once'
                });
                return;
            }else{
                console.log('The QR code was not generated yet');
            }
        }

        const expirationTime = now.toLocaleString(now.setMinutes(now.getMinutes() - 50));
        const QRdata = JSON.stringify({ ...req.body, expirationTime: expirationTime, token: v4() }, null, 2);
        toString(QRdata , { type: 'svg' }, async(err, data) => {
            if (err) {
                res.status(500).send({
                    error: err.message
                });
            } else {
                //create relation between elector and exercise
                await pool.query('INSERT INTO `elector_exercise_vote` (`exercise_id`, `elector_id`) VALUES (?, ?)', [exercise_id, elector_id]);

                var size = 300;
                data = data.replace(/<svg(.*?)>/, '<svg$1 width="'+size+'" height="'+size+'">');
                res.send(data);
            }
        });

    }catch(err){
        res.status(500).send({
            error : err.message
        });
    }
}
