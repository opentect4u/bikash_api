const { F_Select, F_Insert } = require('../models/MasterModule');

const express = require('express'),
    tourRouter = express.Router(),
    dateFormat = require('dateformat');

tourRouter.get('/tour_diary', async (req, res) => {
    var data = req.query;
    var select = '*',
        table_name = 'td_tour_diary',
        whr = data.id > 0 ? `sl_no = "${data.id}"` : `user_id = "${data.user_id}"`,
        order = data.max > 0 ? `ORDER BY DATE(diary_date) DESC LIMIT ${data.max}` : null;
    var res_dt = await F_Select(select, table_name, whr, order)
    res.send(res_dt)
})

tourRouter.post('/tour_diary', async (req, res) => {
    var data = req.body;
    var datetime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    var table_name = 'td_tour_diary',
        fields = data.sl_no > 0 ? `diary_title = "${data.diary_title}", diary_date = "${data.diary_date}", diary_note = "${data.diary_note}", modified_by = "${data.user}", modified_dt = "${datetime}"` :
            `(user_id, diary_title, diary_date, diary_note, created_by, created_dt)`,
        values = `("${data.user_id}", "${data.diary_title}", "${data.diary_date}", "${data.diary_note}", "${data.user}", "${datetime}")`,
        whr = data.sl_no > 0 ? `sl_no = ${data.sl_no}` : null,
        flag = data.sl_no > 0 ? 1 : 0;
    var res_dt = await F_Insert(table_name, fields, values, whr, flag)
    res.send(res_dt)
})

tourRouter.get('/tour_prog', async (req, res) => {
    var data = req.query;
    var select = '*',
        table_name = 'td_tour_program',
        whr = data.id > 0 ? `sl_no = "${data.id}"` : `user_id = "${data.user_id}"`,
        order = null;
    var res_dt = await F_Select(select, table_name, whr, order)
    res.send(res_dt)
})

tourRouter.post('/tour_prog', async (req, res) => {
    var data = req.body;
    var datetime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    var table_name = 'td_tour_program',
        fields = data.sl_no > 0 ? `prog_title = "${data.prog_title}", frm_dt = "${data.frm_dt}", to_dt = "${data.to_dt}", prog_desc = "${data.prog_desc}", modified_by = "${data.user}", modified_dt = "${datetime}"` :
            `(user_id, prog_title, frm_dt, to_dt, prog_desc, created_by, created_dt)`,
        values = `("${data.user_id}", "${data.prog_title}", "${data.frm_dt}", "${data.to_dt}", "${data.prog_desc}", "${data.user}", "${datetime}")`,
        whr = data.sl_no > 0 ? `sl_no = ${data.sl_no}` : null,
        flag = data.sl_no > 0 ? 1 : 0;
    var res_dt = await F_Insert(table_name, fields, values, whr, flag)
    res.send(res_dt)
})

module.exports = { tourRouter }