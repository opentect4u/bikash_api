const express = require("express"),
  adminRouter = express.Router(),
  dateFormat = require("dateformat");

const {
  getArdbList,
  getBlockMaster,
  getServiceAreaMaster,
  getVillMaster,
  getUserList,
  getLoanDataReport,
} = require("../controllers/adminController");
const { adminLogin, userLogOut } = require("../controllers/userController");
const { F_Insert, F_Select } = require("../models/MasterModule");

adminRouter.use((req, res, next) => {
  var url = req.path
  var user = req.session.user
  if (url == '/login' || user) {
    next()
  } else {
    res.redirect('/admin/login')
  }
})

adminRouter.get('/dashboard', (req, res) => {
  res.render('dashboard/view')
})

adminRouter.get("/ardb_master", async (req, res) => {
  var id = req.query.id > 0 ? req.query.id : null;
  var res_dt = await getArdbList(id);
  res_dt = res_dt.suc > 0 ? res_dt.msg : null;
  res.render("admin/ardb_master_view", {
    ardb_list: res_dt,
    heading: "ARDB Master",
    sub_heading: "ARDB List",
  });
});

adminRouter.get("/ardb_master_edit", async (req, res) => {
  var data = req.query,
    id = data.id;
  var ardb_data = null;
  if (id > 0) {
    var res_dt = await getArdbList(id);
    ardb_data = res_dt.suc > 0 ? res_dt.msg[0] : null;
    // console.log(ardb_data);
  }
  res.render("admin/ardb_master_edit", {
    ardb_data,
    heading: "ARDB Master",
    sub_heading: "ARDB Master Entry",
  });
});

adminRouter.get('/ardb_master_save', async (req, res) => {
  // console.log(__dirname);
  var data = req.body
  var table_name = `md_ardb_master`,
    fields = data.flag > 0 ? `district = "${data.district}", ardb_name = "${data.ardb_name}", address = "${data.address}", abv_name = "${data.abv_name}", modified_by = "${data.user}", modified_dt = "${datetime}"` :
      `(ardb_code, district, ardb_name, address, abv_name, created_by, created_dt)`,
    values = `("${data.ardb_code}", "${data.district}", "${data.ardb_name}", "${data.address}", "${data.abv_name}", "${data.created_by}", "${data.created_dt}")`,
    whr,
    flag;
  var res_dt = await F_Insert(table_name, fields, values, whr, flag)
})

adminRouter.get("/block_master", async (req, res) => {
  var res_dt = await getBlockMaster(null, null);
  res_dt = res_dt.suc > 0 ? res_dt.msg : null;
  res.render("admin/block_master_view", {
    ardb_list: res_dt,
    heading: "Block Master",
    sub_heading: "Block List",
  });
});

adminRouter.get("/block_master_edit", async (req, res) => {
  var data = req.query,
    id = data.id,
    ardb_id = data.ardb_id;
  var block_data = null;
  if (id > 0 || ardb_id > 0) {
    var res_dt = await getBlockMaster(id, ardb_id);
    block_data = res_dt.suc > 0 ? res_dt.msg[0] : null;
    // console.log(block_data);
  }

  var ardb_list = await getArdbList(null);

  res.render("admin/block_master_edit", {
    block_data,
    heading: "Block Master",
    sub_heading: "Block Master Entry",
    ardb_list: ardb_list.suc > 0 ? ardb_list.msg : null,
  });
});

adminRouter.get("/sa_master", async (req, res) => {
  var res_dt = await getServiceAreaMaster(null, null, null);
  res_dt = res_dt.suc > 0 ? res_dt.msg : null;
  res.render("admin/sa_master_view", {
    sa_list: res_dt,
    heading: "Sarvice Area Master",
    sub_heading: "Sarvice Area List",
  });
});

adminRouter.get("/sa_master_edit", async (req, res) => {
  var data = req.query,
    id = data.id,
    ardb_id = data.ardb_id,
    block_id = data.block_id;
  var sa_data = null,
    block_list = null;
  if (id > 0 || ardb_id > 0) {
    var res_dt = await getServiceAreaMaster(id, ardb_id, block_id);
    sa_data = res_dt.suc > 0 ? res_dt.msg[0] : null;
    block_list = await getBlockMaster(null, ardb_id);
    // console.log(sa_data);
  }

  var ardb_list = await getArdbList(null);

  res.render("admin/sa_master_edit", {
    sa_data,
    heading: "Sarvice Area Master",
    sub_heading: "Sarvice Area Master Entry",
    ardb_list: ardb_list.suc > 0 ? ardb_list.msg : null,
    block_list: block_list
      ? block_list.suc > 0
        ? block_list.msg
        : null
      : null,
  });
});

adminRouter.get("/vill_master", async (req, res) => {
  var res_dt = await getVillMaster(null, null, null, null);
  res_dt = res_dt.suc > 0 ? res_dt.msg : null;
  res.render("admin/vill_master_view", {
    vill_list: res_dt,
    heading: "Village Master",
    sub_heading: "Village List",
  });
});

adminRouter.get("/vill_master_edit", async (req, res) => {
  var data = req.query,
    id = data.id,
    ardb_id = data.ardb_id,
    block_id = data.block_id,
    sa_id = data.sa_id;
  var vill_data = null,
    sa_list = null,
    block_list = null;
  if (id > 0 || ardb_id > 0 || block_id > 0 || sa_id > 0) {
    var res_dt = await getVillMaster(id, ardb_id, block_id, sa_id);
    vill_data = res_dt.suc > 0 ? res_dt.msg[0] : null;
    block_list = await getBlockMaster(null, ardb_id);
    sa_list = await getServiceAreaMaster(null, ardb_id, block_id);
    // console.log(sa_data);
  }

  var ardb_list = await getArdbList(null);

  res.render("admin/vill_master_edit", {
    vill_data,
    heading: "Sarvice Area Master",
    sub_heading: "Sarvice Area Master Entry",
    ardb_list: ardb_list.suc > 0 ? ardb_list.msg : null,
    block_list: block_list
      ? block_list.suc > 0
        ? block_list.msg
        : null
      : null,
    sa_list: sa_list ? (sa_list.suc > 0 ? sa_list.msg : null) : null,
  });
});

adminRouter.get("/create_user", async (req, res) => {
  var res_dt = await getUserList(null, null);
  res_dt = res_dt.suc > 0 ? res_dt.msg : null;
  res.render("admin/create_user_view", {
    user_list: res_dt,
    heading: "User Master",
    sub_heading: "User List",
  });
});

adminRouter.get("/create_user_edit", async (req, res) => {
  var data = req.query,
    id = data.id,
    user_id = data.user_id;
  var user_data = null,
    vill_list = null,
    sa_list = null,
    block_list = null;
  if (id > 0) {
    var res_dt = await getUserList(id, user_id);
    user_data = res_dt.suc > 0 ? res_dt.msg[0] : null;
    block_list = await getBlockMaster(null, user_data.ardb_id);
    sa_list = await getServiceAreaMaster(
      null,
      user_data.ardb_id,
      user_data.block_id
    );
    vill_list = await getVillMaster(
      null,
      user_data.ardb_id,
      user_data.block_id,
      user_data.sa_id
    );
    // console.log(sa_data);
  }

  var ardb_list = await getArdbList(null);

  res.render("admin/create_user_edit", {
    user_data,
    heading: "User Master",
    sub_heading: "User Entry",
    ardb_list: ardb_list.suc > 0 ? ardb_list.msg : null,
    block_list: block_list
      ? block_list.suc > 0
        ? block_list.msg
        : null
      : null,
    sa_list: sa_list ? (sa_list.suc > 0 ? sa_list.msg : null) : null,
    vill_list: vill_list ? (vill_list.suc > 0 ? vill_list.msg : null) : null,
  });
});

adminRouter.get('/loan_data', async (req, res) => {
  res.render('report/loan_data_in', {
    heading: "Recovery Record",
    sub_heading: "Recovery Record",
  })
})

adminRouter.post('/loan_data', async (req, res) => {
  var ardb_id = 26,
    frm_dt = req.body.frm_dt,
    to_dt = req.body.to_dt;
  var loan_data = await getLoanDataReport(ardb_id, frm_dt, to_dt)
  res.render('report/loan_data_out', {
    heading: "Recovery Record",
    sub_heading: "Recovery Record",
    frm_dt, to_dt, loan_data: loan_data.suc > 0 ? loan_data.msg : null
  })
})

adminRouter.post('/update_user_status', async (req, res) => {
  var data = req.body,
    datetime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
  data['user'] = 'admin';
  var table_name = 'md_user',
    fields = `user_status = "${data.flag}", modified_by = "${data.user}", modified_dt = "${datetime}"`,
    values = null,
    whr = `user_id = ${data.user_id}`,
    flag = 1;
  var res_dt = await F_Insert(table_name, fields, values, whr, flag)
  res.send(res_dt)
})

adminRouter.get('/login', (req, res) => {
  res.render("login/login");
})

adminRouter.post('/login', async (req, res) => {
  var data = req.body;
  var res_dt = await adminLogin(data.user_id, data.password, 0, 0, 0)
  if (res_dt.suc > 0) {
    req.session.user = res_dt.msg[0]
    res.redirect('/admin/dashboard')
  } else {
    req.session.message = { type: 'warning', message: 'Please check your user-id or password' };
    res.redirect('/admin/login');
  }
  // console.log(res_dt);
  // res.render("login/login");
})

adminRouter.get('/logout', async (req, res) => {
  var user = req.session.user
  var user_id = user.user_id,
    rec_id = user.rec_id
  var res_dt = await userLogOut(rec_id)
  if (res_dt.suc > 0) {
    req.session.destroy(() => {
      res.redirect('/admin/login');
    });
  } else {
    res.redirect('/admin/dashboard')
  }
})

module.exports = { adminRouter };
