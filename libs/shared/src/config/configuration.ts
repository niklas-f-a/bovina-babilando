export default () => ({
  apiPort: parseInt(process.env.API_PORT) || 5001,
  rabbitOptions: {
    user: process.env.RABBITMQ_USER,
    pass: process.env.RABBITMQ_PASS,
    host: process.env.RABBITMQ_HOST,
    queue: {
      auth: process.env.RABBITMQ_AUTH_QUEUE,
      chat: process.env.RABBITMQ_CHAT_QUEUE,
    },
  },
  chatDb: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: parseInt(process.env.POSTGRES_PORT),
    host: process.env.POSTGRES_HOST,
  },
  authDb: {
    username: process.env.MONGO_INITDB_ROOT_USERNAME,
    password: process.env.MONGO_INITDB_ROOT_PASSWORD,
    host: process.env.MONGO_HOST,
    name: process.env.MONGO_DB_NAME,
    options: process.env.MONGO_OPTIONS,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: process.env.GITHUB_SCOPE.split(','),
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
});
