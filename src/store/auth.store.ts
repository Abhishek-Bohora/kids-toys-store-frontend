import { create } from "zustand";
import { z } from "zod";
import { UserRolesEnum } from "@/constants";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

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
  accessTkn: Cookies.get("accessToken") || undefined,
  refreshTkn: Cookies.get("refreshToken") || undefined,
  isAuthenticated: !!Cookies.get("accessToken"),
  accessTokenData: Cookies.get("accessToken")
    ? decodeAccessToken(Cookies.get("accessToken") as string)
    : undefined,

  setAccessToken: (accessToken: string | undefined) => {
    let accessTokenData: TokenData | undefined;
    try {
      if (accessToken) {
        accessTokenData = decodeAccessToken(accessToken);
        Cookies.set("accessToken", accessToken, { expires: 1 }); // expires in 1 day
      } else {
        Cookies.remove("accessToken");
      }
    } catch (error) {
      console.error(error);
      accessTokenData = undefined;
      Cookies.remove("accessToken");
    }
    set(() => ({ accessTokenData, accessTkn: accessToken }));
  },

  setRefreshToken: (refreshToken: string | undefined) => {
    if (refreshToken) {
      Cookies.set("refreshToken", refreshToken, { expires: 7 }); // expires in 7 days
    } else {
      Cookies.remove("refreshToken");
    }
    set(() => ({ refreshTkn: refreshToken }));
  },

  setIsAuthenticated: (isAuth: boolean) =>
    set(() => ({ isAuthenticated: isAuth })),

  clearTokens: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    set({
      accessTkn: undefined,
      accessTokenData: undefined,
      refreshTkn: undefined,
      isAuthenticated: false,
    });
  },
}));
