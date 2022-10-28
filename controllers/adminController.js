const dateformat = require("dateformat");

const { F_Select } = require("../models/MasterModule");

module.exports = {
  getArdbList: (id) => {
    var select = "ardb_code, district, ardb_name, address, abv_name",
      table_name = "md_ardb_master",
      whr = id > 0 ? `ardb_code = "${id}"` : null,
      order = null;
    return new Promise(async (resolve, reject) => {
      var res_dt = await F_Select(select, table_name, whr, order);
      resolve(res_dt);
    });
  },
  getBlockMaster: (id, ardb_id) => {
    var select, table_name, whr, order;
    // select = "a.block_id, a.ardb_id, b.ardb_name, a.block_name";
    // table_name = "md_block a, md_ardb_master b";
    // whr = `a.ardb_id=b.ardb_code ${id != null ? 'AND a.block_id="' + id + '"' : ""
    //   } ${ardb_id != null ? 'AND a.ardb_id="' + ardb_id + '"' : ""}`;
    // order = null;
    select = "DISTINCT br_block_cd block_id, br_block block_name, ardb_cd ardb_id, ardb_name";
    table_name = "td_loan_data";
    whr = `1 ${id != null ? 'AND br_block_cd="' + id + '"' : ""
      } ${ardb_id != null ? 'AND ardb_cd="' + ardb_id + '"' : ""}`;
    order = null;
    return new Promise(async (resolve, reject) => {
      var res_dt = await F_Select(select, table_name, whr, order);
      resolve(res_dt);
    });
  },
  getServiceAreaMaster: (id, ardb_id, block_id) => {
    var select, table_name, whr, order;
    // select = "a.sa_id, a.ardb_id, b.ardb_name, a.block_id, c.block_name, a.sa_name";
    // table_name = "md_service_area a, md_ardb_master b, md_block c";
    // whr = `a.ardb_id=b.ardb_code AND a.block_id=c.block_id ${id != null ? 'AND a.sa_id="' + id + '"' : ""
    //   }${block_id != null ? 'AND a.block_id="' + block_id + '"' : ""} ${ardb_id != null ? 'AND a.ardb_id="' + ardb_id + '"' : ""
    //   }`;
    // order = `GROUP BY a.sa_id, a.block_id, a.ardb_id`;
    select = "DISTINCT service_area_cd sa_id, service_area sa_name, br_block_cd block_id, br_block block_name, ardb_cd ardb_id, ardb_name";
    table_name = "td_loan_data";
    whr = `1 ${id != null ? 'AND service_area_cd="' + id + '"' : ""
      }${block_id != null ? 'AND br_block_cd="' + block_id + '"' : ""} ${ardb_id != null ? 'AND ardb_cd="' + ardb_id + '"' : ""
      }`;
    order = null;
    return new Promise(async (resolve, reject) => {
      var res_dt = await F_Select(select, table_name, whr, order);
      resolve(res_dt);
    });
  },
  getVillMaster: (id, ardb_id, block_id, sa_id) => {
    var select, table_name, whr, order;
    // select =
    //   "a.vill_id, a.ardb_id, b.ardb_name, a.block_id, c.block_name, a.sa_id, d.sa_name, a.vill_name";
    // table_name =
    //   "md_village a, md_ardb_master b, md_block c, md_service_area d";
    // whr = `a.ardb_id=b.ardb_code AND a.block_id=c.block_id AND a.sa_id=d.sa_id ${id != null ? 'AND a.vill_id="' + id + '"' : ""
    //   }${block_id != null ? 'AND a.block_id="' + block_id + '"' : ""} ${ardb_id != null ? 'AND a.ardb_id="' + ardb_id + '"' : ""
    //   }${sa_id != null ? 'AND a.sa_id="' + sa_id + '"' : ""}`;
    // order = `GROUP BY a.vill_id`;
    select =
      "DISTINCT village_cd vill_id, village vill_name, service_area_cd sa_id, service_area sa_name, br_block_cd block_id, br_block block_name, ardb_cd ardb_id, ardb_name";
    table_name =
      "td_loan_data";
    whr = `1 ${id != null ? 'AND village_cd="' + id + '"' : ""
      }${block_id != null ? 'AND br_block_cd="' + block_id + '"' : ""} ${ardb_id != null ? 'AND ardb_cd="' + ardb_id + '"' : ""
      }${sa_id != null ? 'AND service_area_cd="' + sa_id + '"' : ""}`;
    order = null;
    return new Promise(async (resolve, reject) => {
      var res_dt = await F_Select(select, table_name, whr, order);
      resolve(res_dt);
    });
  },
  getUserList: (id, user_id) => {
    var select =
      "a.user_id, a.password, a.user_type, a.ardb_id, b.ardb_name, a.block_id, a.sa_id, a.vill_id, a.user_name, a.email_id, a.profile_pic, a.user_status",
      table_name = "md_user a, md_ardb_master b",
      whr = `a.ardb_id=b.ardb_code ${id > 0 ? 'AND a.id="' + id + '"' : ""} ${user_id > 0 ? 'AND a.user_id="' + user_id + '"' : ""
        }`,
      order = null;
    return new Promise(async (resolve, reject) => {
      var res_dt = await F_Select(select, table_name, whr, order);
      resolve(res_dt);
    });
  },
  getLoanData: (ardb_id, block_id, sa_id, vill_id, cust_id, loan_acc_id) => {
    var select = "a.*, IF((SELECT COUNT(*) FROM td_trans_dtls b WHERE a.ardb_cd=b.ardb_cd AND a.acc_num=b.acc_num AND a.cust_cd=b.cust_cd AND a.loan_acc_cd=b.loan_acc_cd) > 0, 'Y', 'N') paid_flag",
      table_name = 'td_loan_data a',
      whr = `ardb_cd = ${ardb_id} AND 
      br_block_cd = "${block_id}" AND 
      service_area_cd = "${sa_id}" AND 
      village_cd = "${vill_id}"
      ${cust_id > 0 ? "AND cust_cd = '" + cust_id + "'" : ''} ${loan_acc_id > 0 ? "AND loan_acc_cd = '" + loan_acc_id + "'" : ''} AND
      CAST(data_imp_dt as DATE) = (select MAX(CAST(data_imp_dt as DATE))from td_loan_data)`,
      order = `ORDER BY cust_name`;
    return new Promise(async (resolve, reject) => {
      var res_dt = await F_Select(select, table_name, whr, order);
      if (res_dt.suc > 0) {
        for (let dt of res_dt.msg) {
          select = `trans_dt, amount r_amt`
          table_name = 'td_trans_dtls'
          whr = `ardb_cd="${ardb_id}" AND acc_num="${dt.acc_num}" AND cust_cd="${dt.cust_cd}" AND loan_acc_cd="${dt.loan_acc_cd}"`
          let tr_dt = await F_Select(select, table_name, whr, null);
          dt['trans_dt'] = tr_dt.msg
        }
      }
      resolve(res_dt);
    });
  },
  getLoanDataReport: (ardb_id, frm_dt, to_dt) => {
    var select = "cust_cd, cust_name, loan_acc_name, sector, activity, lf_no, paid_flag, r_amt, updated_by, updated_dt",
      table_name = 'td_loan_data',
      whr = `ardb_cd = ${ardb_id} AND paid_flag = "Y" AND DATE(updated_dt) BETWEEN "${frm_dt}" AND "${to_dt}"`,
      order = `ORDER BY cust_name`;
    return new Promise(async (resolve, reject) => {
      var res_dt = await F_Select(select, table_name, whr, order);
      resolve(res_dt);
    });
  }
};
