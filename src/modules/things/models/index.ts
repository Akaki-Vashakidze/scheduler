
import { AccessToken, AccessTokenSchema } from "./access-token.schema";
import { User, UserSchema } from "./user.schema";

const MongooseModels = [
  { name: User.name, schema: UserSchema },
  { name: AccessToken.name, schema: AccessTokenSchema },
];

export default MongooseModels;