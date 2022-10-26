const dateformat = require("dateformat"),
    bcrypt = require('bcrypt');
const { F_Select, F_Insert } = require("../models/MasterModule");

const record_login = (id, user_id, lat, long) => {
    return new Promise(async (resolve, reject) => {
        var datetime = dateformat(new Date(), 'yyyy-mm-dd')
        var table_name = 'td_audit_trail',
            fields = id > 0 ? `logout_dt = ${datetime}` :
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
        whr = `user_id = '${user_id}' OR user_id = '${user_id}'`
        order = null
        return new Promise(async (resolve, reject) => {
            var user_dt = await F_Select(select, table_name, whr, order)
            var res_dt = '';
            if (user_dt.suc > 0) {
                if (user_dt.msg.length > 0) {
                    console.log('a', await bcrypt.compare(password, user_dt.msg[0].password));
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
        var datetime = dateformat(new Date(), 'yyyy-mm-dd')
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
                    pass = bcrypt.hashSync(data.pass, 10);
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
    }
}