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

        public void OnGet()
        {
            var sqlClient = DbHelper.GetSqlClient();

            Chat = sqlClient.Queryable<WechatChat>().Where(it =>
                 it.FromUsername == "@@6bd436a19f3accfcb6988665e5fbb472d201e8d599c4abde9a263f1ea16ee007"
                 || it.FromUsername == "@@66eaad13b532aa6496e5860b017fa50301daf6510140afe754f6660b0e2c1d96"
                 || it.FromUsername == "@@efad63ebe60dea676e8bc76b65fa08d39251dc63857038650683dfe29487fdf6"
                ).ToList().OrderByDescending(a => a.CreateTime).ToList();
            //Chat = sqlClient.Queryable<WechatChat>().ToList().OrderByDescending(a => a.CreateTime).ToList();
        }
    }
}