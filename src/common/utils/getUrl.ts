export const getApiUrl = () => {
  if (process.env.NODE_ENV === "prod") {
    return `https://api.company.com`;
  } else {
    return `http://127.0.0.1:4444`;
  }
};

export const getWebsiteUrl = () => {
  if (process.env.NODE_ENV === "prod") {
    return `https://company.com`;
  } else {
    return `http://127.0.0.1:3000`;
  }
};
