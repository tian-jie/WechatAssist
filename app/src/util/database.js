require('babel-register')
import mssql from 'mssql'
var log4js = require('log4js');


var logger = log4js.getLogger('result');

class Database {

  constructor(sqlConfig) {
    if (!sqlConfig) {
      sqlConfig = _sqlConfig;
    }

    this.database = null;
    logger.debug('sqlConfig: ', sqlConfig);
    mssql.connect(sqlConfig).then((conn) => {
      this.conn = conn;
    });

  }

  saveLoginUserToDatabase(wechatUser) {
    let sql = `insert into wechat_user_login (uin, username, nickname, created) values (${wechatUser.Uin},N'${wechatUser.UserName}',N'${wechatUser.NickName}','${new Date().format("yyyy-MM-dd HH:mm:ss")}')`;
    logger.debug(sql);
    this.conn.query(sql).then((result) => {
      return result;
    });
  }

  saveChatToDatabase(chat) {
    let sql = `insert into wechat_chat (msg_id, from_username, to_username, msg_type, content, create_time` +
      `, filename, filesize, media_id, url, app_msg_type, filepath) values ` +
      `(${chat.MsgId},'${chat.FromUserName}','${chat.ToUserName}',${chat.MsgType},N'${chat.Content}', ${chat.CreateTime}` +
      `, N'${chat.FileName}','${chat.FileSize}','${chat.MediaId}',N'${chat.Url}',${chat.AppMsgType},N'${chat.Filepath}')`;

    logger.debug(sql);

    this.conn.query(sql).then((result) => {
      logger.debug(`saveChatToDatabase finished. result: ${JSON.stringify(result)}`);
      return result;
    });
  }

  saveUserToDatabase(myUserName, contacts) {
    // 删掉我的全部好友，再重新添加
    let that = this;
    logger.info('contacts.length: ', contacts.length)
    this.conn.query(`delete from wechat_user where exists( select 1 from wechat_user_friends UF where UF.friend_username = wechat_user.username and my_username='${myUserName}')`).then((result) => {
      logger.debug('wechat_user cleared');
      this.conn.query(`delete from wechat_user_friends where my_username='${myUserName}'`).then((result) => {
        logger.debug('wechat_user_friends cleared');
        that.bulkSaveFriendsToDatabase(myUserName, contacts).then((err, result) => {
          logger.debug(`bulkSaveFriendsToDatabase finished. err: ${err}, result: ${JSON.stringify(result)}`);
          that.bulkSaveUserToDatabase(contacts).then((err, result) => {
            logger.debug(`bulkSaveUserToDatabase finished. err: ${err}, result: ${JSON.stringify(result)}`);
          });
        });
      });
    });
  }

  bulkSaveUserToDatabase(contacts) {
    return new Promise((resolve, reject) => {
      const table = new mssql.Table('wechat_user') // or temporary table, e.g. #temptable
      table.create = false
      table.columns.add('uin', mssql.Int, { nullable: true })
      table.columns.add('username', mssql.Char(66), { nullable: true, primary: true })
      table.columns.add('nickname', mssql.NVarChar(255), { nullable: true })
      table.columns.add('head_img_url', mssql.NVarChar(255), { nullable: true })
      table.columns.add('sex', mssql.Int, { nullable: true })
      table.columns.add('sns_flag', mssql.Int, { nullable: true })
      table.columns.add('original_nick_name', mssql.NVarChar(255), { nullable: true })
      for (var i = 0; i < contacts.length; i++) {
        var contact = contacts[i];
        table.rows.add(contact.Uin, contact.UserName, contact.NickName, contact.HeadImgUrl, contact.Sex, contact.SnsFlag, contact.OriginalNickName)
      }

      const request = new mssql.Request()
      request.bulk(table, (err, result) => {
        logger.error(`bulkSaveUserToDatabase: err: ${err}, result: ${JSON.stringify(result)}`);
        resolve(err, result);
      })


    });
  }

  bulkSaveFriendsToDatabase(myUserName, contacts) {
    logger.debug('myUserName: ', myUserName);
    return new Promise((resolve, reject) => {
      const table = new mssql.Table('wechat_user_friends') // or temporary table, e.g. #temptable
      table.create = false
      table.columns.add('my_username', mssql.Char(66), { nullable: true })
      table.columns.add('friend_username', mssql.Char(66), { nullable: true })
      for (var i = 0; i < contacts.length; i++) {
        var contact = contacts[i];
        table.rows.add(myUserName, contact.UserName)
      }

      const request = new mssql.Request()
      request.bulk(table, (err, result) => {
        logger.error(`bulkSaveFriendsToDatabase: err: ${err}, result: ${JSON.stringify(result)}`);
        resolve(err, result);
      })
    });
  }
}



exports = module.exports = Database
