import 'dotenv/config';
import { Sequelize } from 'sequelize';


const sequelize = new Sequelize(process.env.DB_NAME ?? '', 'root', process.env.DB_PASSWORD ?? '', {
  // host: 'host.docker.internal',
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false,
  port: 3306,
  dialectOptions: {
    charset: 'utf8mb4',
  },
  define: {
    freezeTableName: true,
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  }
});

export default sequelize;
