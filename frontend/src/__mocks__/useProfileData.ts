const useProfileData = () => {
  return Promise.resolve({
    userInfo: null,
    loading: false,
    error: null,
    getUserInfo: () => {},
  });
};
export default useProfileData;
