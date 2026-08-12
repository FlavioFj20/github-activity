
function isValidGitHubUsername(username: string): boolean {
    const GITHUB_USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    return GITHUB_USERNAME_REGEX.test(username);
}

export const checkExtraInputs = (extra: string[]) => {
    if (extra.length > 0){
      console.error(`Wrong Usage:\n\tExtra arguments detected: ${extra.join(',')}`);
      console.error(`Usage correct :\n\tgithub-activity <username>`);
      process.exit(1);
    }
}

export const validateUser = (username:string|undefined) => {
    if (!username){
      console.error("Error: Any username given.");
      console.error(`Usage correct :\n\tgithub-activity <username>`);
      process.exit(1);
    }
    else if (username.length > 39 || !isValidGitHubUsername(username)){
      console.error("Error: Invalid username.");
      console.error(`A valid GitHub username must be between 1 and 39 characters long and can only contain alphanumeric characters (letters and numbers) and single hyphens`);
      process.exit(1);
    }
}