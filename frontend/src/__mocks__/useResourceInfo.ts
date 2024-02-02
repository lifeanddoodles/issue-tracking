const useResourceInfo = async () => {
  const actualUseResourceInfo = (await vi.importActual(
    "../../../../hooks/useResourceInfo"
  )) as typeof useResourceInfo;

  return Promise.resolve({
    ...actualUseResourceInfo,
  });
};
export default useResourceInfo;
