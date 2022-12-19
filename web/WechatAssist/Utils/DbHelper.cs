using SqlSugar;

namespace WechatAssist.Utils
{
    public class DbHelper
    {
        private static DbHelper? _dbHelper = null;
        private SqlSugarClient? _db = null;
        private DbHelper()
        {

            _db = new SqlSugarClient(
                new ConnectionConfig()
                {
                    ConnectionString = "server=172.17.0.1;uid=sa;pwd=Liaoningdalian1;database=wechat",
                    DbType = DbType.SqlServer,//设置数据库类型
                    IsAutoCloseConnection = true,//自动释放数据务，如果存在事务，在事务结束后释放
                    InitKeyType = InitKeyType.Attribute //从实体特性中读取主键自增列信息
                });
        }

        public static DbHelper Instance()
        {
            if (_dbHelper == null)
            {
                _dbHelper = new DbHelper();
            }

            return _dbHelper;
        }

        public static SqlSugarClient GetSqlClient()
        {
            return Instance()._db;
        }
    }
}
