export const loadAuthState = () => {
  try {
    const data = localStorage.getItem('auth');
    return data ? JSON.parse(data) : undefined;
  } catch {
    return undefined;
  }
};

export const saveAuthState = (state) => {
  try {
    localStorage.setItem('auth', JSON.stringify(state));
  } catch {}
};

export const clearAuthState = () => {
  localStorage.removeItem('auth');
};