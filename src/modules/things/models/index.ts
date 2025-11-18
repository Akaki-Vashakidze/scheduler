
import { AccessToken, AccessTokenSchema } from "./access-token.schema";
import { EmailVerification, EmailVerificationSchema } from "./email-verification.schema";
import { Invitation, InvitationSchema } from "./invitation.schema";
import { RequestContact, RequestContactSchema } from "./requestContact.schema";
import { smsRes, SmsResSchema } from "./smsRes.schema";
import { User, UserSchema } from "./user.schema";

const MongooseModels = [
  { name: User.name, schema: UserSchema },
  { name: Invitation.name, schema: InvitationSchema },
  { name: smsRes.name, schema: SmsResSchema },
  { name: AccessToken.name, schema: AccessTokenSchema },
  { name: EmailVerification.name, schema: EmailVerificationSchema },
  { name: RequestContact.name, schema: RequestContactSchema },
];

export default MongooseModels;