export type Profile = {
  firstName: string;
  lastName: string;
  email: string;
};

export interface SsoService {
  getUserProfile(token: string): Promise<Profile>;

  getUserProfileFromAccessToken(token: string): Promise<Profile>;
}
