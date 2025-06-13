import { CatSchema , Cat} from "./cat.schema";
import { User, UserSchema } from "./user.schema";

const MongooseModels = [
  { name: Cat.name, schema: CatSchema },
  { name: User.name, schema: UserSchema },
];

export default MongooseModels;