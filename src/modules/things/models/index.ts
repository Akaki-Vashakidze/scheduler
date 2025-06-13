import { CatSchema , Cat} from "./cat.schema";

const MongooseModels = [
  { name: Cat.name, schema: CatSchema },
];

export default MongooseModels;