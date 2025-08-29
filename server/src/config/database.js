const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'real_estate_chatbot',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'dulaj1998',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected successfully');
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized');
    
    // Handle connection events
    sequelize.addHook('afterConnect', (connection) => {
      console.log('New database connection established');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await sequelize.close();
      console.log('MySQL connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };
