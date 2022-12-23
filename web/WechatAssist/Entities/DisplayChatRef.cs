
using SqlSugar;
using System.Diagnostics.CodeAnalysis;

namespace WechatAssist.Entities
{
    /// <summary>
    /// 机构实体
    /// </summary>
    [SugarTable("display_chat_ref")]
    public class DisplayChatRef
    {
        /// <summary>
        /// 主键Id
        /// </summary>
        [SugarColumn(ColumnName = "id", IsPrimaryKey = true, ColumnDescription = "主键Id", IsIdentity = true)]
        public int Id { get; set; }

        /// <summary>
        /// chat_from_username
        /// </summary>
        [SugarColumn(ColumnName = "chat_from_username", IsNullable = true, ColumnDescription = "说话人"), NotNull]
        public string? ChatFromUsername { get; set; }

        /// <summary>
        /// note
        /// </summary>
        [SugarColumn(IsNullable = true, ColumnName = "note", ColumnDescription = "说明，相当于分组")]
        public string? Note { get; set; }


    }
}
