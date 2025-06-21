
import { AccessToken, AccessTokenSchema } from "./access-token.schema";
import { EmailVerification, EmailVerificationSchema } from "./email-verification.schema";
import { Schedule, ScheduleSchema } from "./schedule.schema";
import { User, UserSchema } from "./user.schema";

const MongooseModels = [
  { name: User.name, schema: UserSchema },
  { name: Schedule.name, schema: ScheduleSchema },
  { name: AccessToken.name, schema: AccessTokenSchema },
  { name: EmailVerification.name, schema: EmailVerificationSchema },
];

export default MongooseModels;