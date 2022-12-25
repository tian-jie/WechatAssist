
require('babel-register')
const Wechat = require('./src/wechat.js')
const qrcode = require('qrcode-terminal')
const fs = require('fs')
const request = require('request')
const Database = require('./src/util/database.js')

let dotenv = require('dotenv');
dotenv.config('./env');

var log4js = require('log4js');
var logger = log4js.getLogger('result');

log4js.configure({ 
  appenders: {
    out: { type: 'console' }, 
    task: { type: 'dateFile', filename: 'logs/task',"pattern":"-yy-MM-dd.log", alwaysIncludePattern:true }, 
    result: { type: 'dateFile', filename: 'logs/result',"pattern":"-yy-MM-dd.log", alwaysIncludePattern:true}, 
    error: { type: 'dateFile', filename: 'logs/error', "pattern":"-yy-MM-dd.log",alwaysIncludePattern:true}, 
    default: { type: 'dateFile', filename: 'logs/default', "pattern":"-yy-MM-dd.log",alwaysIncludePattern:true}, 
    rate: { type: 'dateFile', filename: 'logs/rate', "pattern":"-yy-MM-dd.log",alwaysIncludePattern:true} 
  },
  categories: {
    default: { appenders: ['out','default'], level: 'debug' },
  }
});

let bot

async function main() {
  let db = new Database({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_HOST,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      // encrypt: true, // for azure
      // trustServerCertificate: false, // change to true for local dev / self-signed certs
      cryptoCredentialsDetails: {
        minVersion: 'TLSv1'
      },
      validateConnection: false,
      trustServerCertificate: true,
    }

  });

  await sleep(1000);

  /**
   * 尝试获取本地登录数据，免扫码
   * 这里演示从本地文件中获取数据
   */
  try {
    bot = new Wechat(require('./sync-data.json'))
  } catch (e) {
    bot = new Wechat()
  }
  /**
   * 启动机器人
   */
  if (bot.PROP.uin) {
    // 存在登录数据时，可以随时调用restart进行重启
    bot.restart()
  } else {
    bot.start()
  }
  /**
   * uuid事件，参数为uuid，根据uuid生成二维码
   */
  bot.on('uuid', uuid => {
    qrcode.generate('https://login.weixin.qq.com/l/' + uuid, {
      small: true
    })
    logger.info('二维码链接：', 'https://login.weixin.qq.com/qrcode/' + uuid)
  })
  /**
   * 登录用户头像事件，手机扫描后可以得到登录用户头像的Data URL
   */
  bot.on('user-avatar', avatar => {
    logger.info('登录用户头像Data URL：', avatar)
  })
  /**
   * 登录成功事件
   */
  bot.on('login', () => {
    logger.info('登录成功: ', JSON.stringify(bot.botData));
    // 保存数据，将数据序列化之后保存到任意位置
    fs.writeFileSync('./sync-data.json', JSON.stringify(bot.botData))
    try {
      db.saveLoginUserToDatabase(bot.botData.user);
      //db.saveUserToDatabase(bot.botData.user);
    } catch (e) {
      logger.error(e);
    }
  })
  /**
   * 登出成功事件
   */
  bot.on('logout', () => {
    logger.info('登出成功: ', JSON.stringify(bot.botData));
    // 清除数据
    fs.unlinkSync('./sync-data.json')
  })
  /**
   * 联系人更新事件，参数为被更新的联系人列表
   */
  bot.on('contacts-updated-finished', contacts => {
    logger.debug('联系人数量：', Object.keys(bot.contacts).length)
    // 联系人存数据库
    db.saveUserToDatabase(bot.user.UserName, contacts);
  })
  /**
   * 错误事件，参数一般为Error对象
   */
  bot.on('error', err => {
    logger.error('错误：', err)
  })
  /**
   * 如何发送消息
   */
  bot.on('login', () => {
    /**
     * 演示发送消息到文件传输助手
     * 通常回复消息时可以用 msg.FromUserName
     */
    let ToUserName = 'filehelper'

    /**
     * 发送文本消息，可以包含emoji(😒)和QQ表情([坏笑])
     */
    bot.sendMsg('机器人已上线', ToUserName)
      .catch(err => {
        bot.emit('error', err)
      })

    //   /**
    //    * 通过表情MD5发送表情
    //    */
    //   bot.sendMsg({
    //     emoticonMd5: '00c801cdf69127550d93ca52c3f853ff'
    //   }, ToUserName)
    //     .catch(err => {
    //       bot.emit('error', err)
    //     })

    //   /**
    //    * 以下通过上传文件发送图片，视频，附件等
    //    * 通用方法为入下
    //    * file为多种类型
    //    * filename必填，主要为了判断文件类型
    //    */
    //   // bot.sendMsg({
    //   //   file: Stream || Buffer || ArrayBuffer || File || Blob,
    //   //   filename: 'bot-qrcode.jpg'
    //   // }, ToUserName)
    //   //   .catch(err => {
    //   //     bot.emit('error',err)
    //   //   })

    //   /**
    //    * 发送图片
    //    */
    //   bot.sendMsg({
    //     file: request('https://raw.githubusercontent.com/nodeWechat/wechat4u/master/bot-qrcode.jpg'),
    //     filename: 'bot-qrcode.jpg'
    //   }, ToUserName)
    //     .catch(err => {
    //       bot.emit('error', err)
    //     })

    //   /**
    //    * 发送表情
    //    */
    //   bot.sendMsg({
    //     file: fs.createReadStream('./media/test.gif'),
    //     filename: 'test.gif'
    //   }, ToUserName)
    //     .catch(err => {
    //       bot.emit('error', err)
    //     })

    //   /**
    //    * 发送视频
    //    */
    //   bot.sendMsg({
    //     file: fs.createReadStream('./media/test.mp4'),
    //     filename: 'test.mp4'
    //   }, ToUserName)
    //     .catch(err => {
    //       bot.emit('error', err)
    //     })

    //   /**
    //    * 发送文件
    //    */
    //   bot.sendMsg({
    //     file: fs.createReadStream('./media/test.txt'),
    //     filename: 'test.txt'
    //   }, ToUserName)
    //     .catch(err => {
    //       bot.emit('error', err)
    //     })

    //   /**
    //    * 发送撤回消息请求
    //    */
    //   bot.sendMsg('测试撤回', ToUserName)
    //     .then(res => {
    //       // 需要取得待撤回消息的MsgID
    //       return bot.revokeMsg(res.MsgID, ToUserName)
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // })

    /**
     * 如何处理会话消息
     */
    bot.on('message', msg => {
      /**
       * 获取消息时间
       */
      //console.log(`----------${msg.getDisplayTime()}----------`)
      /**
       * 获取消息发送者的显示名
       */
      let username = bot.contacts[msg.FromUserName].getDisplayName()
      //console.log(username)
      /**
       * 判断消息类型
       */
      logger.info(msg.Content)

      switch (msg.MsgType) {
        case bot.CONF.MSGTYPE_TEXT:
          /**
           * 文本消息
           */
          db.saveChatToDatabase(msg);
          break
        case bot.CONF.MSGTYPE_IMAGE:
          /**
           * 图片消息
           */
          logger.info('图片消息，保存到本地')
          bot.getMsgImg(msg.MsgId).then(res => {
            fs.writeFileSync(`./media/${msg.MsgId}.jpg`, res.data)
            msg.Filepath = `/media/${msg.MsgId}.jpg`
            db.saveChatToDatabase(msg);
          }).catch(err => {
            bot.emit('error', err)
          })
          break
        case bot.CONF.MSGTYPE_VOICE:
          /**
           * 语音消息
           */
          logger.info('语音消息，保存到本地')
          bot.getVoice(msg.MsgId).then(res => {
            fs.writeFileSync(`./media/${msg.MsgId}.mp3`, res.data)
            msg.Filepath = `/media/${msg.MsgId}.mp3`
            db.saveChatToDatabase(msg);

          }).catch(err => {
            bot.emit('error', err)
          })
          break
        case bot.CONF.MSGTYPE_EMOTICON:
          /**
           * 表情消息
           */
          logger.info('表情消息，保存到本地')
          bot.getMsgImg(msg.MsgId).then(res => {
            fs.writeFileSync(`./media/${msg.MsgId}.gif`, res.data)
            msg.Filepath = `/media/${msg.MsgId}.gif`
            db.saveChatToDatabase(msg);
          }).catch(err => {
            bot.emit('error', err)
          })
          break
        case bot.CONF.MSGTYPE_VIDEO:
        case bot.CONF.MSGTYPE_MICROVIDEO:
          /**
           * 视频消息
           */
          logger.info('视频消息，保存到本地')
          bot.getVideo(msg.MsgId).then(res => {
            fs.writeFileSync(`./media/${msg.MsgId}.mp4`, res.data)
            msg.Filepath = `/media/${msg.MsgId}.mp4`
            db.saveChatToDatabase(msg);
          }).catch(err => {
            bot.emit('error', err)
          })
          break
        case bot.CONF.MSGTYPE_APP:
          if (msg.AppMsgType == 6) {
            /**
             * 文件消息
             */
            logger.info('文件消息，保存到本地')
            bot.getDoc(msg.FromUserName, msg.MediaId, msg.FileName).then(res => {
              fs.writeFileSync(`./media/${msg.MsgId}-${msg.FileName}`, res.data)
              msg.Filepath = `/media/${msg.MsgId}-${msg.FileName}`
              db.saveChatToDatabase(msg);
              logger.info(res.type);
            }).catch(err => {
              bot.emit('error', err)
            })
          }
          break
        default:
          break
      }
    })
    // /**
    //  * 如何处理红包消息
    //  */
    // bot.on('message', msg => {
    //   if (msg.MsgType == bot.CONF.MSGTYPE_SYS && /红包/.test(msg.Content)) {
    //     // 若系统消息中带有‘红包’，则认为是红包消息
    //     // wechat4u并不能自动收红包
    //   }
    // })
    // /**
    //  * 如何处理转账消息
    //  */
    // bot.on('message', msg => {
    //   if (msg.MsgType == bot.CONF.MSGTYPE_APP && msg.AppMsgType == bot.CONF.APPMSGTYPE_TRANSFERS) {
    //     // 转账
    //   }
    // })
    // /**
    //  * 如何处理撤回消息
    //  */
    // bot.on('message', msg => {
    //   if (msg.MsgType == bot.CONF.MSGTYPE_RECALLED) {
    //     // msg.Content是一个xml，关键信息是MsgId
    //     let MsgId = msg.Content.match(/<msgid>(.*?)<\/msgid>.*?<replacemsg><!\[CDATA\[(.*?)\]\]><\/replacemsg>/)[0]
    //     // 得到MsgId后，根据MsgId，从收到过的消息中查找被撤回的消息
    //   }
    // })
    // /**
    //  * 如何处理好友请求消息
    //  */
    // bot.on('message', msg => {
    //   if (msg.MsgType == bot.CONF.MSGTYPE_VERIFYMSG) {
    //     bot.verifyUser(msg.RecommendInfo.UserName, msg.RecommendInfo.Ticket)
    //       .then(res => {
    //         console.log(`通过了 ${bot.Contact.getDisplayName(msg.RecommendInfo)} 好友请求`)
    //       })
    //       .catch(err => {
    //         bot.emit('error', err)
    //       })
    //   }
    // })
    // /**
    //  * 如何直接转发消息
    //  */
    // bot.on('message', msg => {
    //   console.debug('message: ', JSON.stringify(msg));
    //   // 不是所有消息都可以直接转发
    //   // bot.forwardMsg(msg, 'filehelper')
    //   //   .catch(err => {
    //   //     bot.emit('error', err)
    //   //   })
    // })
    // /**
    //  * 如何获取联系人头像
    //  */
    // bot.on('message', msg => {
    //   bot.getHeadImg(bot.contacts[msg.FromUserName].HeadImgUrl).then(res => {
    //     fs.writeFileSync(`./media/${msg.FromUserName}.jpg`, res.data)
    //   }).catch(err => {
    //     bot.emit('error', err)
    //   })
    // })

  });
}

main();



function sleep(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
} 