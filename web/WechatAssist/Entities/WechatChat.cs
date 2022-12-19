using SqlSugar;


namespace WechatAssist.Entities
{
    /// <summary>
    /// 机构实体
    /// </summary>
    [SugarTable("wechat_chat")]
    public class WechatChat
    {
        /// <summary>
        /// 主键Id
        /// </summary>
        [SugarColumn(ColumnName = "msg_id", IsPrimaryKey = true, ColumnDescription = "消息id，主键")]
        public Int64 MsgId { get; set; }

        [SugarColumn(ColumnName = "from_username", IsPrimaryKey = false, ColumnDescription = "发消息的人")]
        public string FromUsername { get; set; }

        [SugarColumn(ColumnName = "to_username", IsPrimaryKey = false, ColumnDescription = "收消息的人")]
        public string ToUsername { get; set; }

        [SugarColumn(ColumnName = "msg_type", IsPrimaryKey = false, ColumnDescription = "")]
        public MsgType MsgType { get; set; }

        [SugarColumn(ColumnName = "content", IsPrimaryKey = false, ColumnDescription = "消息内容")]
        public string Content { get; set; }

        [SugarColumn(ColumnName = "create_time", IsPrimaryKey = false, ColumnDescription = "消息时间")]
        public int CreateTime { get; set; }

        [SugarColumn(ColumnName = "voice_length", IsPrimaryKey = false, ColumnDescription = "语音时长")]
        public int VoiceLength { get; set; }

        [SugarColumn(ColumnName = "play_length", IsPrimaryKey = false, ColumnDescription = "语音？？？")]
        public int PlayLength { get; set; }

        [SugarColumn(ColumnName = "filename", IsPrimaryKey = false, ColumnDescription = "文件消息-文件名")]
        public string Filename { get; set; }

        [SugarColumn(ColumnName = "filesize", IsPrimaryKey = false, ColumnDescription = "文件消息-文件大小")]
        public string Filesize { get; set; }

        [SugarColumn(ColumnName = "media_id", IsPrimaryKey = false, ColumnDescription = "media类型消息，id")]
        public string MediaId { get; set; }

        [SugarColumn(ColumnName = "url", IsPrimaryKey = false, ColumnDescription = "链接消息")]
        public string Url { get; set; }


        [SugarColumn(ColumnName = "app_msg_type", IsPrimaryKey = false, ColumnDescription = "")]
        public AppMsgType AppMsgType { get; set; }

        [SugarColumn(ColumnName = "status_notify_code", IsPrimaryKey = false, ColumnDescription = "")]
        public int StatusNotifyCode { get; set; }

        [SugarColumn(ColumnName = "status_notify_username", IsPrimaryKey = false, ColumnDescription = "")]
        public string StatusNotifyUsername { get; set; }

        [SugarColumn(ColumnName = "forward_flag", IsPrimaryKey = false, ColumnDescription = "")]
        public int ForwardFlag { get; set; }

        [SugarColumn(ColumnName = "ticket", IsPrimaryKey = false, ColumnDescription = "")]
        public string Ticket { get; set; }

        [SugarColumn(ColumnName = "img_height", IsPrimaryKey = false, ColumnDescription = "")]
        public int ImgHeight { get; set; }

        [SugarColumn(ColumnName = "img_width", IsPrimaryKey = false, ColumnDescription = "")]
        public int ImgWidth { get; set; }

        [SugarColumn(ColumnName = "sub_msg_type", IsPrimaryKey = false, ColumnDescription = "")]
        public MsgType SubMsgType { get; set; }

        [SugarColumn(ColumnName = "new_msg_id", IsPrimaryKey = false, ColumnDescription = "")]
        public string NewMsgId { get; set; }

        [SugarColumn(ColumnName = "ori_content", IsPrimaryKey = false, ColumnDescription = "")]
        public string OriContent { get; set; }

        [SugarColumn(ColumnName = "encry_filename", IsPrimaryKey = false, ColumnDescription = "")]
        public string EncryFilename { get; set; }

        [SugarColumn(ColumnName = "is_send_by_self", IsPrimaryKey = false, ColumnDescription = "")]
        public bool IsSendBySelf { get; set; }

        [SugarColumn(ColumnName = "recall_time", IsPrimaryKey = false, ColumnDescription = "")]
        public DateTime RecallTime { get; set; }

        [SugarColumn(ColumnName = "created", IsPrimaryKey = false, ColumnDescription = "")]
        public DateTime Created { get; set; }

        [SugarColumn(ColumnName = "filepath", IsPrimaryKey = false, ColumnDescription = "文件的本地存储地址")]
        public string Filepath { get; set; }

    }

    public enum MsgType
    {
        MSGTYPE_TEXT= 1,
        MSGTYPE_IMAGE= 3,
        MSGTYPE_VOICE= 34,
        MSGTYPE_VIDEO= 43,
        MSGTYPE_MICROVIDEO= 62,
        MSGTYPE_EMOTICON= 47,
        MSGTYPE_APP= 49,
        MSGTYPE_VOIPMSG= 50,
        MSGTYPE_VOIPNOTIFY= 52,
        MSGTYPE_VOIPINVITE= 53,
        MSGTYPE_LOCATION= 48,
        MSGTYPE_STATUSNOTIFY= 51,
        MSGTYPE_SYSNOTICE= 9999,
        MSGTYPE_POSSIBLEFRIEND_MSG= 40,
        MSGTYPE_VERIFYMSG= 37,
        MSGTYPE_SHARECARD= 42,
        MSGTYPE_SYS= 10000,
        MSGTYPE_RECALLED= 10002,
    }
    public enum AppMsgType
    {
        APPMSGTYPE_TEXT = 1,
        APPMSGTYPE_IMG = 2,
        APPMSGTYPE_AUDIO = 3,
        APPMSGTYPE_VIDEO = 4,
        APPMSGTYPE_URL = 5,
        APPMSGTYPE_ATTACH = 6,
        APPMSGTYPE_OPEN = 7,
        APPMSGTYPE_EMOJI = 8,
        APPMSGTYPE_VOICE_REMIND = 9,
        APPMSGTYPE_SCAN_GOOD = 10,
        APPMSGTYPE_GOOD = 13,
        APPMSGTYPE_EMOTION = 15,
        APPMSGTYPE_CARD_TICKET = 16,
        APPMSGTYPE_REALTIME_SHARE_LOCATION = 17,
        APPMSGTYPE_TRANSFERS = 2000,
        APPMSGTYPE_RED_ENVELOPES = 2001,
        APPMSGTYPE_READER_TYPE = 100001,
    }
}
