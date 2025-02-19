import { CrudTypeOf, createCrud } from "../../crud";
import { yupObject } from "../../schema-fields";
import { teamsCrudClientReadSchema } from "./teams";
import { usersCrudServerDeleteSchema, usersCrudServerReadSchema, usersCrudServerUpdateSchema } from "./users";

const clientUpdateSchema = usersCrudServerUpdateSchema.pick([
  "display_name",
  "client_metadata",
  "selected_team_id",
]).required();

const serverUpdateSchema = usersCrudServerUpdateSchema;

const clientReadSchema = usersCrudServerReadSchema.pick([
  "project_id",
  "id",
  "primary_email",
  "primary_email_verified",
  "display_name",
  "client_metadata",
  "profile_image_url",
  "signed_up_at_millis",
  "has_password",
  "auth_with_email",
  "oauth_providers",
  "selected_team_id",
]).concat(yupObject({
  selected_team: teamsCrudClientReadSchema.nullable().defined(),
})).nullable().defined(); // TODO: next-release: make required

// TODO: next-release: make required
const serverReadSchema = usersCrudServerReadSchema.nullable().defined();

const serverDeleteSchema = usersCrudServerDeleteSchema;

export const currentUserCrud = createCrud({
  clientReadSchema,
  serverReadSchema,
  clientUpdateSchema,
  serverUpdateSchema,
  serverDeleteSchema,
  docs: {
    clientRead: {
      summary: 'Get current user',
      description: 'Gets the currently authenticated user.',
      tags: ['Users'],
    },
    clientUpdate: {
      summary: 'Update current user',
      description: 'Updates the currently authenticated user. Only the values provided will be updated.',
      tags: ['Users'],
    },
    clientDelete: {
      summary: 'Delete current user',
      description: 'Deletes the currently authenticated user. Use this with caution.',
      tags: ['Users'],
    },
  },
});
export type CurrentUserCrud = CrudTypeOf<typeof currentUserCrud>;
