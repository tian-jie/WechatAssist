using SqlSugar;
using WechatAssist.Pages;

namespace WechatAssist.Utils
{
    public class DbHelper
    {
        private static DbHelper? _dbHelper = null;
        private SqlSugarClient? _db = null;
        private ILogger _logger;

        private DbHelper(ILogger logger)
        {
            _logger = logger;
            _db = new SqlSugarClient(
                new ConnectionConfig()
                {
                    ConnectionString = "server=172.17.0.1;uid=sa;pwd=Liaoningdalian1;database=wechat",
                    //ConnectionString = "server=localhost;uid=sa;pwd=Liaoningdalian1;database=wechat",
                    DbType = DbType.SqlServer,//设置数据库类型
                    IsAutoCloseConnection = true,//自动释放数据务，如果存在事务，在事务结束后释放
                    InitKeyType = InitKeyType.Attribute //从实体特性中读取主键自增列信息
                });
            _db.Aop.OnLogExecuting = (sql, pars) =>
            {
                logger.LogError(sql);
            };
            
        }

        public static DbHelper Instance(ILogger logger)
        {
            if (_dbHelper == null)
            {
                _dbHelper = new DbHelper(logger);
            }

            return _dbHelper;
        }

        public static SqlSugarClient GetSqlClient(ILogger logger)
        {
            return Instance(logger)._db;
        }
    }
}
