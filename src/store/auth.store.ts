import { create } from "zustand";
import { z } from "zod";
import { UserRolesEnum } from "@/constants";
import { jwtDecode } from "jwt-decode";

const TokenDataSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  username: z.string(),
  role: z.nativeEnum(UserRolesEnum),
});

type TokenData = z.infer<typeof TokenDataSchema>;

type State = {
  accessTkn: string | undefined;
  refreshTkn: string | undefined;
  isAuthenticated: boolean;
  accessTokenData: TokenData | undefined;
};

type Action = {
  setAccessToken: (accessToken: State["accessTkn"]) => void;
  setRefreshToken: (refreshToken: State["refreshTkn"]) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  clearTokens: () => void;
};

export const decodeAccessToken = (accessToken: string) =>
  TokenDataSchema.parse(jwtDecode<TokenData>(accessToken));

export const useAuthStore = create<State & Action>((set) => ({
  accessTkn: undefined,
  refreshTkn: undefined,
  isAuthenticated: false,
  accessTokenData: undefined,
  setAccessToken: (accessToken: string | undefined) => {
    let accessTokenData: TokenData | undefined;
    try {
      accessTokenData = accessToken
        ? decodeAccessToken(accessToken)
        : undefined;
    } catch (error) {
      console.error(error);
      accessTokenData = undefined;
    }
    set(() => ({ accessTokenData, accessTkn: accessToken }));
  },
  setRefreshToken: (refreshToken: string | undefined) =>
    set(() => ({ refreshTkn: refreshToken })),
  setIsAuthenticated: (isAuth: boolean) =>
    set(() => ({ isAuthenticated: isAuth })),
  clearTokens: () =>
    set({
      accessTkn: undefined,
      accessTokenData: undefined,
      refreshTkn: undefined,
      isAuthenticated: false,
    }),
}));
