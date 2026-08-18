
function isValidGitHubUsername(username: string): boolean {
    const GITHUB_USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    return GITHUB_USERNAME_REGEX.test(username);
}

export const checkExtraInputs = (extra: string[]) => {
    if (extra.length > 0){
      throw new Error(`Wrong Usage:\n\tExtra arguments detected: ${extra.join(',')}\nUsage correct :\n\tgithub-activity <username>`);
    }
}

export const validateUser = (username:string|undefined) => {
    if (!username){
      // throw new Error("Expected an username.\nUsage correct :\n\tgithub-activity <username>");
      console.log(`
      🌟 Welcome to GitHub-Activity! 🌟

      To see your recent activities, run:
      => github-activity <username>
      `);
      process.exit(0)
    }
    else if (username.length > 39 || !isValidGitHubUsername(username)){
      throw new Error("Invalid username.\nA valid GitHub username must be between 1 and 39 characters long and can only contain alphanumeric characters (letters and numbers) and single hyphens");
    }
}