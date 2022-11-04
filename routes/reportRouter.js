const express = require("express"),
    reportRouter = express.Router(),
    dateFormat = require("dateformat");

const { F_Select } = require("../models/MasterModule");

// reportRouter.use((req, res, next) => {
//     var url = req.path
//     var user = req.session.user
//     if (url == '/login' || user) {
//         next()
//     } else {
//         res.redirect('/admin/login')
//     }
// })

reportRouter.get('/tour_diary', async (req, res) => {
    var ardb_id = req.session.user.ardb_id;
    var select = 'user_name, user_id',
        table_name = 'md_user',
        whr = `ardb_id = "${ardb_id}" AND user_type = 'U' AND user_status = 'A'`,
        order = null;
    var res_dt = await F_Select(select, table_name, whr, order)
    // console.log(res_dt);
    res.render('report/tour_diary_in', {
        heading: "Tour Diary",
        emp_list: res_dt.suc > 0 ? res_dt.msg : null
    })
})

reportRouter.post('/tour_diary', async (req, res) => {
    var data = req.body,
        ardb_id = req.session.user.ardb_id,
        frm_dt = data.frm_dt,
        to_dt = data.to_dt,
        emp_name = data.emp_name;
    // console.log();
    var select = '*',
        table_name = 'td_tour_diary',
        whr = data.id > 0 ? `sl_no = "${data.id}"` : `ardb_id = "${ardb_id}" AND user_id = "${data.emp_id}" AND diary_date BETWEEN "${frm_dt}" AND "${to_dt}"`,
        order = null;
    var res_dt = await F_Select(select, table_name, whr, order)
    res.render('report/tour_diary_out', {
        heading: "Tour Diary",
        diary_dt: res_dt.suc > 0 ? res_dt.msg : null,
        frm_dt, to_dt, emp_name, dateFormat
    })
})

reportRouter.get('/tour_prog', async (req, res) => {
    var ardb_id = req.session.user.ardb_id;
    var select = 'user_name, user_id',
        table_name = 'md_user',
        whr = `ardb_id = "${ardb_id}" AND user_type = 'U' AND user_status = 'A'`,
        order = null;
    var res_dt = await F_Select(select, table_name, whr, order)
    // console.log(res_dt);
    res.render('report/tour_prog_in', {
        heading: "Tour Program",
        emp_list: res_dt.suc > 0 ? res_dt.msg : null
    })
})

reportRouter.post('/tour_prog', async (req, res) => {
    var data = req.body,
        ardb_id = req.session.user.ardb_id,
        frm_dt = data.frm_dt,
        to_dt = data.to_dt,
        emp_name = data.emp_name;
    // console.log();
    var select = '*',
        table_name = 'td_tour_program',
        whr = data.id > 0 ? `sl_no = "${data.id}"` : `ardb_id = "${ardb_id}" AND user_id = "${data.emp_id}" AND frm_dt >= "${frm_dt}" AND to_dt <= "${to_dt}"`,
        order = null;
    var res_dt = await F_Select(select, table_name, whr, order)
    res.render('report/tour_prog_out', {
        heading: "Tour Program",
        prog_dt: res_dt.suc > 0 ? res_dt.msg : null,
        frm_dt, to_dt, emp_name, dateFormat
    })
})

reportRouter.get('/attendance', async (req, res) => {
    var ardb_id = req.session.user.ardb_id;
    var select = 'user_name, user_id',
        table_name = 'md_user',
        whr = `ardb_id = "${ardb_id}" AND user_type = 'U' AND user_status = 'A'`,
        order = null;
    var res_dt = await F_Select(select, table_name, whr, order)
    // console.log(res_dt);
    res.render('report/atten_in', {
        heading: "Attendance Report",
        emp_list: res_dt.suc > 0 ? res_dt.msg : null
    })
})

reportRouter.post('/attendance', async (req, res) => {
    var data = req.body,
        ardb_id = req.session.user.ardb_id,
        frm_dt = data.frm_dt,
        to_dt = data.to_dt,
        emp_name = data.emp_name;
    // console.log();
    var select = '*',
        table_name = 'td_attendance',
        whr = data.id > 0 ? `sl_no = "${data.id}"` : `ardb_id = "${ardb_id}" AND user_id = "${data.emp_id}" AND atten_date BETWEEN "${frm_dt}" AND "${to_dt}"`,
        order = null;
    var res_dt = await F_Select(select, table_name, whr, order)
    res.render('report/atten_out', {
        heading: "Attendance Report",
        prog_dt: res_dt.suc > 0 ? res_dt.msg : null,
        frm_dt, to_dt, emp_name, dateFormat
    })
})

module.exports = { reportRouter }