
using SqlSugar;

namespace WechatAssist.Entities
{
    /// <summary>
    /// 机构实体
    /// </summary>
    [SugarTable("wechat_user")]
    public class WehatUser
    {
        /// <summary>
        /// 主键Id
        /// </summary>
        [SugarColumn(ColumnName = "username", IsPrimaryKey = true, ColumnDescription = "主键Id")]
        public string Username { get; set; }

        /// <summary>
        /// uin
        /// </summary>
        [SugarColumn(ColumnName = "uin", IsNullable = true, ColumnDescription = "日期")]
        public int? Uin { get; set; }
        /// <summary>
        /// 账户
        /// </summary>
        [SugarColumn(IsNullable = true, ColumnName = "nickname", ColumnDescription = "昵称")]
        public string Nickname { get; set; }


        [SugarColumn(IsNullable = true, ColumnName = "head_img_url", ColumnDescription = "头像")]
        public string HeadImgUrl { get; set; }

        [SugarColumn(IsNullable = true, ColumnName = "sex", ColumnDescription = "性别")]
        public Sex? Sex { get; set; }

        [SugarColumn(IsNullable = true, ColumnName = "sns_flag", ColumnDescription = "？？？")]
        public int? SNSFlag { get; set; }

        [SugarColumn(IsNullable = true, ColumnName = "original_nick_name", ColumnDescription = "？？？")]
        public string OriginalNickName { get; set; }


    }

    public enum Sex
    {
        Male = 1,
        Female = 2,
        Unknown = 0,
    }
}
