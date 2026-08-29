// Shared Types

export type AccessToken = {
  token: string;
};

export type Session = {
  userDataInJWT: Record<string, unknown>; // Maps to crate::agents::Agent
};

// Response Types

export type SigninResponse = {
  status: string;
  recipeUserId?: string;
};

export type CreateSessionResponse = {
  status: string;
  accessToken?: AccessToken;
  refreshToken?: AccessToken;
};

export type CreatePasswordResetTokenResponse = {
  status: string;
  token?: string;
};

export type ConsumePasswordResetTokenResponse = {
  status: string;
  userId?: string;
  email?: string;
};

export type UpdateUserResponse = {
  status: string;
};

export type VerifySessionResponse = {
  status: string;
  session: Session;
};


export type RemoveSessionResponse = {
  status: string;
};
