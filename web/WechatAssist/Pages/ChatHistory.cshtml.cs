using SqlSugar;
using WechatAssist.Entities;
using WechatAssist.Utils;

namespace WechatAssist.Pages
{
    public class ChatHistoryModel : Microsoft.AspNetCore.Mvc.RazorPages.PageModel
    {
        private readonly ILogger<ChatHistoryModel> _logger;
        public List<WechatChat> Chat { get; set; }

        public ChatHistoryModel(ILogger<ChatHistoryModel> logger)
        {
            _logger = logger;
        }

        public void OnGet(string chatgroup = "0701")
        {
            var sqlClient = DbHelper.GetSqlClient(_logger);
            Chat = sqlClient.Queryable<WechatChat>().InnerJoin<DisplayChatRef>((c, r) => c.FromUsername == r.ChatFromUsername && r.Note == chatgroup).ToList().OrderByDescending(a => a.CreateTime).ToList();
        }
    }
}