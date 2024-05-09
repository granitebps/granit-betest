export interface ILoginRequest {
  emailAddress: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: IAuthPayload;
}

export interface IAuthPayload {
  _id: string;
  emailAddress: string;
  userName: string;
  identityNumber: string;
  accountNumber: string;
}
