import { CatSchema , Cat} from "./cat.schema";
import { RefreshToken, RefreshTokenSchema } from "./refresh-token.schema";
import { User, UserSchema } from "./user.schema";

const MongooseModels = [
  { name: Cat.name, schema: CatSchema },
  { name: User.name, schema: UserSchema },
  { name: RefreshToken.name, schema: RefreshTokenSchema },
];

export default MongooseModels;