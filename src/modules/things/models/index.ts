import { CatSchema , Cat} from "./cat.schema";
import { RefreshToken, RefreshTokenSchema } from "./refresh-token.schema";
import { ResetToken, ResetTokenSchema } from "./reset-token.schema";
import { User, UserSchema } from "./user.schema";

const MongooseModels = [
  { name: Cat.name, schema: CatSchema },
  { name: User.name, schema: UserSchema },
  { name: RefreshToken.name, schema: RefreshTokenSchema },
  { name: ResetToken.name, schema: ResetTokenSchema },
];

export default MongooseModels;