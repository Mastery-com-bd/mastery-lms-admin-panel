/* eslint-disable @typescript-eslint/no-explicit-any */
export const buildParams = (paramsObj: any) => {
  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value as any);
    }
  });
  return params.toString();
};
