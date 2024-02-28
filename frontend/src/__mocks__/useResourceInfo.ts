import { ResourceState } from "../interfaces";

export const requestUpdateResourceMock = vi.fn(async () => {
  return Promise.resolve();
});

export const useResourceInfoMockReturnWithSuccess = <T>(data: T) => ({
  data,
  loading: false,
  error: null,
  requestGetResource: vi.fn(),
  requestUpdateResource: requestUpdateResourceMock,
  requestDeleteResource: vi.fn(),
});

export const useResourceInfoMockReturnWithError = {
  data: null,
  loading: false,
  error: new Error("Error"),
  requestGetResource: vi.fn(),
  requestUpdateResource: vi.fn(),
  requestDeleteResource: vi.fn(),
};

const useResourceInfo = async () => {
  const actualUseResourceInfo = (await vi.importActual(
    "../../../../hooks/useResourceInfo"
  )) as typeof useResourceInfo;

  return Promise.resolve({
    ...actualUseResourceInfo,
  });
};
export default useResourceInfo;

export const getUseResourceInfoMockReturnValue = async <T>(
  useResourceInfo: () => ResourceState<T>,
  returnValueMock: ResourceState<T>
) => {
  vi.mocked(useResourceInfo).mockClear().mockReturnValue(returnValueMock);
};
