export const isValidChatLink = (link: string): boolean => {
  //TODO: check all the possible chat link patterns
  const chatLinkPattern = new RegExp(/^(http:\/\/|https:\/\/|www\.)[^\s]+$/);
  return chatLinkPattern.test(link);
};
