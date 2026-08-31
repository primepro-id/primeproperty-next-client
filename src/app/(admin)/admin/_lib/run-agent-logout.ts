type RunAgentLogoutOptions = {
  supertokensUserId: string | null;
  removeSession: (supertokensUserId: string) => Promise<unknown>;
  deleteCookies: () => Promise<unknown>;
};

export async function runAgentLogout({
  supertokensUserId,
  removeSession,
  deleteCookies,
}: RunAgentLogoutOptions) {
  try {
    if (supertokensUserId) {
      await removeSession(supertokensUserId);
    }
  } finally {
    await deleteCookies();
  }
}
