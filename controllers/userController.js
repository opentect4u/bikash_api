const dateFormat = require("dateformat"),
    bcrypt = require('bcrypt');
const { F_Select, F_Insert } = require("../models/MasterModule");

const record_login = (id, user_id, lat, long) => {
    return new Promise(async (resolve, reject) => {
        var datetime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        if (id > 0) {
        } else {
            var rec_table_name = 'td_audit_trail',
                rec_select = 'sl_no, user_id',
                rec_whr = `user_id = '${user_id}' AND logout_dt is null`;
            var rec_ex_dt = await F_Select(rec_select, rec_table_name, rec_whr, null);
            if (rec_ex_dt.suc > 0 && rec_ex_dt.msg.length > 0) {
                var rec_ex_table_name = 'td_audit_trail',
                    rec_ex_fields = `logout_dt = "${datetime}"`,
                    rec_ex_values = null,
                    rec_ex_whr = `user_id = "${user_id}"`,
                    rec_ex_flag = 1;
                await F_Insert(rec_ex_table_name, rec_ex_fields, rec_ex_values, rec_ex_whr, rec_ex_flag)
            }
        }
        var table_name = 'td_audit_trail',
            fields = id > 0 ? `logout_dt = "${datetime}"` :
                `(user_id, login_dt, lat_pos, long_pos)`,
            values = `("${user_id}", "${datetime}", "${lat}", "${long}")`,
            whr = id > 0 ? `sl_no = ${id}` : null,
            flag = id > 0 ? 1 : 0;
        var res_dt = await F_Insert(table_name, fields, values, whr, flag)
        resolve(res_dt)
    })
}

module.exports = {
    userLogin: (user_id, password, id, lat, long) => {
        var select, table_name, whr, order;
        select = '*'
        table_name = 'md_user'
        whr = `user_status = 'A' AND user_type = 'U' AND user_id = '${user_id}'`
        order = null
        return new Promise(async (resolve, reject) => {
            var user_dt = await F_Select(select, table_name, whr, order)
            var res_dt = '';
            if (user_dt.suc > 0) {
                if (user_dt.msg.length > 0) {
                    if (await bcrypt.compare(password, user_dt.msg[0].password)) {
                        var rec_dt = await record_login(id, user_dt.msg[0].user_id, lat, long)
                        var rec_id = rec_dt.suc > 0 ? rec_dt.lastId.insertId : 0
                        user_dt.msg[0]['rec_id'] = rec_id
                        res_dt = user_dt
                    } else {
                        res_dt = { suc: 0, msg: "Check Your User ID or Password" }
                    }
                } else {
                    res_dt = { suc: 0, msg: "Check Your User ID or Password" }
                }
            } else {
                res_dt = user_dt
            }
            resolve(res_dt)
        })
    },
    userRegistration: async (data) => {
        var datetime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        var select, table_name, whr, order, fields, values, flag;
        table_name = 'md_user'

        select = `COUNT(user_id) user`;
        whr = `user_id = "${data.user_id}"`;
        order = null;

        return new Promise(async (resolve, reject) => {
            var user_dt = await F_Select(select, table_name, whr, order)
            var res_dt = '';
            if (user_dt.suc > 0) {
                if (user_dt.msg[0].user > 0) {
                    res_dt = { suc: 0, msg: 'User id is alrady exist' }
                } else {
                    pass = bcrypt.hashSync(data.password, 10);
                    fields = `(user_id, password, user_type, ardb_id, block_id, sa_id, vill_id, user_name, email_id, created_by, created_dt)`
                    values = `("${data.user_id}", "${pass}", "U", "${data.ardb_id}", "${data.block_id}", "${data.sa_id}", "${data.vill_id}", "${data.user_name}", "${data.email_id}", "${data.user}", "${datetime}")`
                    whr = null;
                    flag = 0;
                    res_dt = await F_Insert(table_name, fields, values, whr, flag)
                }
            } else {
                res_dt = user_dt
            }
            resolve(res_dt)
        })
    },
    userLogOut: (id) => {
        return new Promise(async (resolve, reject) => {
            var res_dt = await record_login(id, null, null, null)
            resolve(res_dt)
        })
    },
    saveParams: (data) => {
        var datetime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        var table_name = 'md_user',
            fields = `block_id = "${data.block_id}", sa_id = "${data.sa_id}", vill_id = "${data.vill_id}", modified_by = "${data.user}", modified_dt = "${datetime}"`,
            values = null,
            whr = `user_id = ${data.user_id}`,
            flag = 1;
        return new Promise(async (resolve, reject) => {
            var res_dt = await F_Insert(table_name, fields, values, whr, flag)
            resolve(res_dt)
        })
    },
    updateUserInfo: (data) => {
        var datetime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        var table_name = 'md_user',
            fields = `user_name = "${data.user_name}", email_id = "${data.email_id}", modified_by = "${data.user}", modified_dt = "${datetime}"`,
            values = null,
            whr = `user_id = ${data.user_id}`,
            flag = 1;
        return new Promise(async (resolve, reject) => {
            var res_dt = await F_Insert(table_name, fields, values, whr, flag)
            resolve(res_dt)
        })
    },
    updatePass: async (data) => {
        var datetime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        var chk_table_name = 'md_user'
        var select = `user_id, password`;
        var chk_whr = `user_id = "${data.user_id}"`;
        var chk_order = null;
        return new Promise(async (resolve, reject) => {
            var res_dt = ''

            var chk_dt = await F_Select(select, chk_table_name, chk_whr, chk_order)

            if (chk_dt.suc > 0 && chk_dt.msg.length > 0) {
                if (await bcrypt.compare(data.old_pass, chk_dt.msg[0].password)) {

                    var pass = bcrypt.hashSync(data.password, 10);
                    var table_name = 'md_user',
                        fields = `password = "${pass}", modified_by = "${data.user}", modified_dt = "${datetime}"`,
                        values = null,
                        whr = `user_id = ${data.user_id}`,
                        flag = 1;

                    res_dt = await F_Insert(table_name, fields, values, whr, flag)
                    resolve(res_dt)
                } else {
                    res_dt = { suc: 0, msg: "Please Check Your Old Password" }
                    resolve(res_dt)
                }
            } else {
                res_dt = { suc: 0, msg: "No User Found", err: chk_dt.msg }
                resolve(res_dt)
            }
        })
    },
    adminLogin: (user_id, password, id, lat, long) => {
        var select, table_name, whr, order;
        select = '*'
        table_name = 'md_user'
        whr = `user_status = 'A' AND user_type = 'A' AND user_id = '${user_id}'`
        order = null
        return new Promise(async (resolve, reject) => {
            var user_dt = await F_Select(select, table_name, whr, order)
            var res_dt = '';
            if (user_dt.suc > 0) {
                if (user_dt.msg.length > 0) {
                    if (await bcrypt.compare(password, user_dt.msg[0].password)) {
                        var rec_dt = await record_login(id, user_dt.msg[0].user_id, lat, long)
                        var rec_id = rec_dt.suc > 0 ? rec_dt.lastId.insertId : 0
                        user_dt.msg[0]['rec_id'] = rec_id
                        res_dt = user_dt
                    } else {
                        res_dt = { suc: 0, msg: "Check Your User ID or Password" }
                    }
                } else {
                    res_dt = { suc: 0, msg: "Check Your User ID or Password" }
                }
            } else {
                res_dt = user_dt
            }
            resolve(res_dt)
        })
    }
}