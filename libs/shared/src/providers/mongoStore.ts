import * as makeMongoStore from 'connect-mongodb-session';

export const makeMongo = ({
  session,
  uri,
  collection,
}: {
  session: any;
  uri: string;
  collection: string;
}) => {
  const MongoDBStore = makeMongoStore(session);

  const store = new MongoDBStore({
    uri,
    collection,
  });

  return store;
};
