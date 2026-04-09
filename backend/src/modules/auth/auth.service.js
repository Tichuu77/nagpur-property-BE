const authService = {
  login: async (payload) => ({ token: 'stub-token', user: payload }),
  register: async (payload) => ({ id: 'new-user', ...payload })
};

export default authService;
