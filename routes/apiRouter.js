const express = require("express"),
  apiRouter = express(),
  dateformat = require("dateformat"),
  fs = require('fs'),
  upload = require('express-fileupload');

apiRouter.use(upload());

const {
  getArdbList,
  getBlockMaster,
  getServiceAreaMaster,
  getVillMaster,
  getLoanData,
} = require("../controllers/adminController");
const { userLogin, userRegistration, userLogOut, saveParams, updateUserInfo, updatePass, updateProPic, checkPhone } = require("../controllers/userController");
const { F_Insert } = require("../models/MasterModule");

apiRouter.get("/ardb_list", async (req, res) => {
  var id = req.query.id > 0 ? req.query.id : null;
  var res_dt = await getArdbList(id);
  res.send(res_dt);
});

apiRouter.get("/block_list", async (req, res) => {
  var data = req.query,
    id = data.id,
    ardb_id = data.ardb_id;
  var res_dt = await getBlockMaster(id, ardb_id);
  res.send(res_dt);
});

apiRouter.get("/sa_list", async (req, res) => {
  var data = req.query,
    id = data.id,
    ardb_id = data.ardb_id,
    block_id = data.block_id;
  var res_dt = await getServiceAreaMaster(id, ardb_id, block_id);
  res.send(res_dt);
});

apiRouter.get("/vill_list", async (req, res) => {
  var data = req.query,
    id = data.id,
    ardb_id = data.ardb_id,
    block_id = data.block_id,
    sa_id = data.sa_id;
  var res_dt = await getVillMaster(id, ardb_id, block_id, sa_id);
  res.send(res_dt);
});

apiRouter.post('/loan_data', async (req, res) => {
  var data = req.body,
    ardb_id = data.ardb_id,
    block_name = data.block_name,
    sa_name = data.sa_name,
    vill_name = data.vill_name,
    cust_id = data.cust_id,
    loan_acc_id = data.loan_acc_id;
  var res_dt = await getLoanData(ardb_id, block_name, sa_name, vill_name, cust_id, loan_acc_id);
  res.send(res_dt);
})

apiRouter.post('/loan_data_save', async (req, res) => {
  var data = req.body,
    datetime = dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss');

  // var table_name = 'td_loan_data',
  //   fields = `paid_flag = "Y", r_amt = "${data.r_amt}", updated_by = "${data.user}", updated_dt = "${datetime}", lat_pos = "${data.lat_pos}", long_pos = "${data.long_pos}"`,
  //   values = null,
  //   whr = `ardb_cd = ${data.ardb_id} AND 
  //     LOWER(REPLACE(br_block, " ", "")) = "${data.block_name.toLowerCase().split(' ').join('')}" AND 
  //     LOWER(REPLACE(service_area, " ", "")) = "${data.sa_name.toLowerCase().split(' ').join('')}" AND 
  //     LOWER(REPLACE(village, " ", "")) = "${data.vill_name.toLowerCase().split(' ').join('')}" AND
  //     cust_cd = "${data.cust_id}" AND loan_acc_cd = "${data.loan_acc_cd}"`,
  //   flag = 1;

  var table_name = 'td_trans_dtls',
    fields = `(ardb_cd, acc_num, cust_cd, loan_acc_cd, trans_dt, amount, created_by, created_dt, lat_pos, long_pos)`,
    values = `("${data.ardb_id}","${data.acc_num}","${data.cust_id}","${data.loan_acc_cd}","${datetime}","${data.r_amt}","${data.user}","${datetime}","${data.lat_pos}","${data.long_pos}")`,
    whr = null,
    flag = 0;

  var res_dt = await F_Insert(table_name, fields, values, whr, flag)
  res.send(res_dt);
})

apiRouter.post('/save_params', async (req, res) => {
  var data = req.body
  var res_dt = await saveParams(data);
  res.send(res_dt)
})

apiRouter.post('/login', async (req, res) => {
  var data = req.body;
  var user_id = data.user_id,
    pass = data.pass,
    id = data.id, lat = data.lat, long = data.long;
  var res_dt = await userLogin(user_id, pass, id, lat, long);
  res.send(res_dt);
})

apiRouter.post('/logout', async (req, res) => {
  var data = req.body;
  var sl_no = data.id
  var res_dt = await userLogOut(sl_no);
  res.send(res_dt)
})

apiRouter.post('/user_registration', async (req, res) => {
  var data = req.body
  var res_dt = await userRegistration(data)
  res.send(res_dt)
})

apiRouter.post('/user_update', async (req, res) => {
  var data = req.body
  var res_dt = await updateUserInfo(data)
  res.send(res_dt);
})

apiRouter.post('/change_pass', async (req, res) => {
  var data = req.body
  var res_dt = await updatePass(data)
  res.send(res_dt)
})

apiRouter.post('/save_pro_pic', async (req, res) => {
  var files = req.files ? (req.files.file ? req.files.file : null) : null
  var data = req.body

  var dir = 'assets/uploads',
    subdir = dir + '/pro_pic';
  if (!fs.existsSync(subdir)) {
    fs.mkdirSync(subdir);
  }

  if (files) {
    var filename = files.name,
      up_path = 'uploads/pro_pic/' + filename;

    files.mv('assets/', up_path, async (err) => {
      if (err) {
        console.log(`${filename} not uploaded`);
        res.send({ suc: 0, msg: `${filename} not uploaded`, err: err })
      } else {
        console.log(`Successfully ${filename} uploaded`);
        var res_dt = await updateProPic(data, up_path)
        res.send(res_dt)
        // await SectionImageSave(data, filename);
      }
    })
  } else {
    res.send({ suc: 0, msg: "No file selected" })
  }
})

apiRouter.get('/check_phone', async (req, res) => {
  var data = req.query
  var res_dt = await checkPhone(data.user_id)
  res.send(res_dt)
})

module.exports = { apiRouter };