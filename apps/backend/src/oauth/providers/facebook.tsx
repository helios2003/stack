import { TokenSet } from "openid-client";
import { OAuthBaseProvider } from "./base";
import { OAuthUserInfo, validateUserInfo } from "../utils";
import { getEnvVariable } from "@stackframe/stack-shared/dist/utils/env";

export class FacebookProvider extends OAuthBaseProvider {
  private constructor(
    ...args: ConstructorParameters<typeof OAuthBaseProvider>
  ) {
    super(...args);
  }

  static async create(options: {
    clientId: string,
    clientSecret: string,
  }) {
    return new FacebookProvider(...await OAuthBaseProvider.createConstructorArgs({
      issuer: "https://www.facebook.com",
      authorizationEndpoint: "https://facebook.com/v20.0/dialog/oauth/",
      tokenEndpoint: "https://graph.facebook.com/v20.0/oauth/access_token",
      redirectUri: getEnvVariable("STACK_BASE_URL") + "/api/v1/auth/oauth/callback/facebook",
      baseScope: "public_profile email",
      ...options
    }));
  }

  async postProcessUserInfo(tokenSet: TokenSet): Promise<OAuthUserInfo> {
    const url = new URL('https://graph.facebook.com/v3.2/me');
    url.searchParams.append('access_token', tokenSet.access_token || "");
    url.searchParams.append('fields', 'id,name,email');
    const rawUserInfo = await fetch(url).then((res) => res.json());

    return validateUserInfo({
      accountId: rawUserInfo.id,
      displayName: rawUserInfo.name,
      email: rawUserInfo.email,
      profileImageUrl: `https://graph.facebook.com/v19.0/${rawUserInfo.id}/picture`,
      accessToken: tokenSet.access_token,
      refreshToken: tokenSet.refresh_token,
    });
  }
}
