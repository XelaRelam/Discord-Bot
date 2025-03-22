# Styling Guidelines

To ensure consistency and readability across the codebase, we follow these coding and language style guidelines. Adhering to these guidelines is essential for maintaining a professional and cohesive project.

---

## Code Style

### General Rules

- Use **TypeScript** for all code.
- Follow the **[ESLint](https://eslint.org/)** style guide with TypeScript-specific rules.
- Indentation: Use **2 spaces**.
- Line length: Aim for a maximum of **80 characters**; use line breaks for readability when needed.
- Avoid using `any` type unless absolutely necessary.
- Add new types to `/src/types.ts`.

### Naming Conventions

- **Variables and functions:** Use `camelCase` (e.g., `handleCommand`).
- **files and Directories:** Use `PascalCase` (e.g., `CommandHandler`).

### File Organization

- Place each class or major module in its own file.
- Use meaningful and descriptive filenames (e.g., `messageHandler.ts`, `guildConfig.ts`).
- Keep imports organized:
  1. Node.js built-in modules.
  2. Third-party dependencies.
  3. Local modules.

### Comments

- Use comments sparingly but effectively to explain **why** rather than **what**.
- For functions, use JSDoc-style comments to describe parameters and return values:

  ```ts
  /**
  * Loads a YAML translation file and retrieves the value for a given key.
  * @param lang - The language code (e.g., 'en', 'es').
  * @param key - The translation key in dot notation (e.g., 'greetings.hello').
  * @returns The translation value or an error message if the key or file is not found.
  */
  export function loadYaml(lang: string, key: string): string {
    // Implementation
  }
  ```

  ```ts
  `
  $c[
    Sends a message to a channel.
    @param channel - The channel to send the message to.
    @param content - The message content.
    @returns Message.
  ]
  $sendMessage[$channelID;Message]
  `
  ```

---

## Language Style

### Examples

- When responding to users:
  - **Good:** "I've added the role for you. Let me know if there's anything else I can help with!"
  - **Avoid:** "Done! :) lol"
- When an error occurs:
  - **Good:** "I couldn't find that user. Please double-check the ID and try again."
  - **Avoid:** "oops! couldn’t find. try again plz!"

> [!NOTE]
> We use `$customError[errorID;origin]` for error handling.
>
> Errors are gotten from the [errors.json](../files/errors.json)

---

## Example Messages

### Commands

- Use concise and clear responses:

  ```txt
  a.info
  - **Response:** "Hello! I'm your assistant bot. Use !help for a list of commands."
  ```

### Error Handling

- Be informative but concise:

  ```txt
  "I couldn’t complete your request because the bot lacks permission to manage roles in this server."
  ```

### User Engagement

- Engage naturally, but avoid being overly playful:

  ```txt
  "Did you mean to use `/ban`? If , try `/help` for guidance."
  ```

---

## Git Commit Style

- Use **[Conventional Commits](https://www.conventionalcommits.org/)** to structure commit messages:
  - **feat:** A new feature.
  - **fix:** A bug fix.
  - **docs:** Documentation updates.
  - **chore:** Non-code changes.
  - **docs:** Documentation changes.
  - **style:** Code style changes without affecting logic.
  - **refactor:** Code restructuring without functionality changes.
  - **perf:** A code change that improves performance.
  - **test:** Adding or modifying tests.
  - **build:** Changes to the build process or tools.
  - **ci:** Changes to Continuous Integration configurations.

---

## Release Process

To ensure consistent releases and changelogs, follow these steps:

1. Before releasing a new version, make sure your code adheres to the style guide by running:

    ```bash
    pnpm run lint
    ```

2. Generate a new version and update the changelog by running:

    ```bash
    pnpm run release
    ```

3. Push the changes and tags to the repository:

    ```bash
    git push --follow-tags origin main
    ```

By adhering to these guidelines, we can ensure that the project remains a high-quality, professional, and user-friendly project. Thank you for contributing and maintaining consistency!
