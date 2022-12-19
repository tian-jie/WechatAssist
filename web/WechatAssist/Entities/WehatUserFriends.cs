using SqlSugar;

namespace WechatAssist.Entities
{
    /// <summary>
    /// 机构实体
    /// </summary>
    [SugarTable("wechat_user_friends")]
    public class WehatUserFriends
    {
        /// <summary>
        /// 主键Id
        /// </summary>
        [SugarColumn(ColumnName = "my_username", IsPrimaryKey = false, ColumnDescription = "【我】")]
        public string MyUsername { get; set; }

        [SugarColumn(ColumnName = "friend_username", IsPrimaryKey = false, ColumnDescription = "【我】的朋友")]
        public string FriendUsername { get; set; }

    }
}
