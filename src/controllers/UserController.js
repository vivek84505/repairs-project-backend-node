const pool = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

//Get users query
const getUsers = (req, res) => {
  let reqBody = req.body;
  let returnObj = {};
  const schema = Joi.object({
    user_id: Joi.string().required(),
  });

  Joi.validate(reqBody, schema, (err, value) => {
    if (!err) {
      sqlQuery = "Select * from tbl_users where 1= 1 ";

      if (typeof (reqBody.user_id != "undefined")) {
        sqlQuery += " and user_id = " + reqBody.user_id;
      }

      sqlQuery += " order by lastmodifieddate desc";

      console.log("Query => ", sqlQuery);

      pool.query(sqlQuery, (error, results) => {
        if (error) throw error;

        if (results.rowCount > 0) {
          returnObj.returnmsg = "succesfull";
          returnObj.returnval = results.rows;
          res.status(200).json(returnObj);
        } else {
          returnObj.returnmsg = "No Data found";
          //returnObj.returnval = {};
          res.status(200).json(returnObj);
        }
      });
    } else {
      returnObj.returnmsg = "InputException";
      returnObj.returnval = err.details[0].message;
      res.status(400).json(returnObj);
    }
  });
};

const addUser = (req, res) => {
  let returnObj = {};

  let reqBody = req.body;
  let userdata = {
    firstname: reqBody.firstname,
    lastname: reqBody.lastname,
    email: reqBody.email,
    password: bcrypt.hashSync(reqBody.mobile, 8),
    mobile: reqBody.mobile,
    createdby: reqBody.createdby,
    user_role: reqBody.user_role,
    city: reqBody.city,
    address: reqBody.address,
  };

  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().required(),
    createdby: Joi.string().required(),
    lastmodifiedby: Joi.string().allow(),
    user_role: Joi.number().allow(),
    city: Joi.string().allow(),
    address: Joi.string().allow(),
  });

  Joi.validate(reqBody, schema, (err, value) => {
    if (!err) {
      //check if email exists
      sqlQuery = `select * from public.tbl_users where email = '${userdata.email}' `;
      console.log("sqlQuery=======?>", sqlQuery);
      pool.query(sqlQuery, (error, results) => {
        if (results.rows.length) {
          returnObj.returnmsg = "Useralreadyexists";
          returnObj.returnval = "Email already exists.";
          res.status(200).json(returnObj);
        } else {
          //Add User to DB
          sqlQuery = `insert into public.tbl_users (firstname,lastname,email,password,mobile,createdby,user_role,city,address) 
        values ( '${userdata.firstname}' , '${userdata.lastname}','${userdata.email}','${userdata.password}','${userdata.mobile}','${userdata.createdby}','${userdata.user_role}','${userdata.city}','${userdata.address}' ) `;
          pool.query(sqlQuery, (error, results1) => {
            if (results1.rowCount > 0) {
              returnObj.returnmsg = "succesfull";
              returnObj.returnval = "User addedd succesfully";
              res.status(200).json(returnObj);
            } else {
              returnObj.returnmsg = "succesfull";
              returnObj.returnval = "Something went wrong";
              res.status(200).json(returnObj);
            }
          });
        }
      });
    } else {
      returnObj.returnmsg = "InputException";
      returnObj.returnval = err.details[0].message;
      res.status(400).json(returnObj);
    }
  });
};

const removeUser = (req, res) => {
  let returnObj = {};
  let reqBody = req.body;

  const schema = Joi.object({
    user_id: Joi.string().required(),
  });

  Joi.validate(reqBody, schema, (err, value) => {
    if (!err) {
      user_id = reqBody.user_id;
      sqlQuery = ` select * from public.tbl_users where user_id = '${user_id}' `;

      pool.query(sqlQuery, (error, results) => {
        if (results.rows.length == 0) {
          returnObj.returnmsg = "Userdoesnotxist";
          returnObj.returnval = "User does not exist.";
          res.status(200).json(returnObj);
        } else {
          sqlQuery = `delete from public.tbl_users where user_id = '${user_id}' `;
          pool.query(sqlQuery, (error, results) => {
            if (error) throw error;

            returnObj.returnmsg = "Userdeleted";
            returnObj.returnval = "User Deleted succesfully.";
            res.status(200).json(returnObj);
          });
        }
      });
    } else {
      returnObj.returnmsg = "InputException";
      returnObj.returnval = err.details[0].message;
      res.status(400).json(returnObj);
    }
  });
};

const updateUser = (req, res) => {
  let returnObj = {};
  let reqBody = req.body;
  const { user_id, firstname, lastname, email, mobile, city } = reqBody;

  const schema = Joi.object({
    user_id: Joi.string().required(),
    firstname: Joi.string().allow(),
    lastname: Joi.string().allow(),
    email: Joi.string().email().allow(),
    mobile: Joi.string().allow(),
    lastmodifiedby: Joi.string().allow(),
    user_role: Joi.number().allow(),
    city: Joi.string().allow(),
    address: Joi.string().allow(),
  });

  Joi.validate(reqBody, schema, (err, value) => {
    if (!err) {
      sqlQuery = ` select * from public.tbl_users where user_id = '${user_id}' `;
      console.log("sqlQuery-1", sqlQuery);
      pool.query(sqlQuery, (error, results) => {
        if (results.rows.length > 0) {
          sqlQuery = ` update  public.tbl_users set firstname ='${firstname}',lastname ='${lastname}',email ='${email}',mobile ='${mobile}',city ='${city}'  where user_id = '${user_id}' `;

          pool.query(sqlQuery, (error, results1) => {
            if (error) throw error;
            if (results1.rowCount > 0) {
              returnObj.returnmsg = "succesfull";
              returnObj.returnval = "User updated succesfully.";
              res.status(200).json(returnObj);
            }
          });
        } else {
          returnObj.returnmsg = "Userdoesnotxist";
          returnObj.returnval = "User does not exist.";
          res.status(200).json(returnObj);
        }
      });
    } else {
      returnObj.returnmsg = "InputException";
      returnObj.returnval = err.details[0].message;
      res.status(400).json(returnObj);
    }
  });
};

module.exports = {
  getUsers,
  addUser,
  removeUser,
  updateUser,
};
