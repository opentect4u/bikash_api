const express = require('express'),
    attRouter = express.Router(),
    dateFormat = require('dateformat');

const { F_Select } = require('../models/MasterModule');

attRouter.get('/atten', async (req, res) => {
    var data = req.query;
    var now_date = dateFormat(new Date(), 'yyyy-mm-dd')
    var select = '*',
        table_name = 'td_attendance',
        whr = `user_id = "${data.user_id}" AND DATE(check_in) = "${now_date}"`,
        order = null;
    var res_dt = await F_Select(select, table_name, whr, order)
    res.send(res_dt)
})

attRouter.post('/atten', async (req, res) => {
    var data = req.query;
    var datetime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    var table_name = 'td_attendance',
        fields = data.sl_no > 0 ? `check_out = "${data.check_out}", modified_by = "${data.user}", modified_dt = "${datetime}"` :
            `(ardb_id, user_id, emp_code, check_in, lat_pos, long_pos, created_by, created_dt)`,
        values = `("${data.ardb_id}", "${data.user_id}", "${data.emp_code}", "${data.check_in}", "${data.lat_pos}", "${data.long_pos}", "${data.user}", "${datetime}")`,
        whr = data.sl_no > 0 ? `sl_no = ${data.sl_no}` : null,
        flag = data.sl_no > 0 ? 1 : 0;
    var res_dt = await F_Insert(table_name, fields, values, whr, flag)
    res.send(res_dt)
})

module.exports = { attRouter }