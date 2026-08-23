export interface AuthResponse {
  token: string;
}

export interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}
