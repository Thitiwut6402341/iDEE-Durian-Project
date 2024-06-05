export type TJwtPayload = {
  user_id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

export type TRequestWithDecoded = Request & { decoded: TJwtPayload };
