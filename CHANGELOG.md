# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.7.0](https://github.com/XelaRelam/Discord-Bot/compare/v1.6.0...v1.7.0) (2025-03-29)


### Features

* Added a function to see if a user has certain perms in a channel. ([037ff66](https://github.com/XelaRelam/Discord-Bot/commit/037ff66f1ec0f6012786c71600230f4b0ef7b12a))
* Added Loop Handler. ([9163cd5](https://github.com/XelaRelam/Discord-Bot/commit/9163cd50f34b2269142e5abd1b1617063ff58589))
* Added Thread Create command and handler. ([16090d6](https://github.com/XelaRelam/Discord-Bot/commit/16090d6081d6a1319428c2f525696ff4976a05dd))


### Bug Fixes

* Added index for threads. ([b074686](https://github.com/XelaRelam/Discord-Bot/commit/b0746865d98e9e3c52d4255d95ee97021e207c95))
* Now we use a global prisma client. ([0a336dc](https://github.com/XelaRelam/Discord-Bot/commit/0a336dc0d40ffb4a62cdd3ba0a72e414ebb9975a))
* Removed Deploy:Commands script and now deploys commands on start. ([d6032c1](https://github.com/XelaRelam/Discord-Bot/commit/d6032c1028e7bcc6b1b8c8d3ad98ab3491c5c293))

## [1.6.0](https://github.com/XelaRelam/Discord-Bot/compare/v1.5.0...v1.6.0) (2025-03-28)


### Features

* Added a emoteFind function and collection to extended client. ([8aef58d](https://github.com/XelaRelam/Discord-Bot/commit/8aef58d168a4d13e6d99632b452ad8e4a98b2d70))
* Added bot Info command. ([caf7b61](https://github.com/XelaRelam/Discord-Bot/commit/caf7b61f26c2f843bc4a5dda1c0881279835ce19))
* Added button Handler. ([f189ea6](https://github.com/XelaRelam/Discord-Bot/commit/f189ea6df3acb572659c41a9694f6762f8fcdf43))
* Added Decline button. ([e4bfa1f](https://github.com/XelaRelam/Discord-Bot/commit/e4bfa1f5a084166fed10770b1e6c2ba2eda116f2))
* added hasRole function. ([88a9607](https://github.com/XelaRelam/Discord-Bot/commit/88a9607af09d9f266489ad43656b4bf7d902b467))
* Added Staff Resources. (Slash and Buttons.) ([84a851c](https://github.com/XelaRelam/Discord-Bot/commit/84a851c2a88e1f8bbba6b69dcc66cf685136ea5f))
* Button for Bot Approval now works. ([c64cbfa](https://github.com/XelaRelam/Discord-Bot/commit/c64cbfa35d26fe2c096ca2642af0209bbc666dbf))
* Updated Database and added more Database Functions. ([7fa5e96](https://github.com/XelaRelam/Discord-Bot/commit/7fa5e961349e03fd85d422a02f67169912d7c5f5))


### Bug Fixes

* Added ApprovedBy to bot model. ([840f5dc](https://github.com/XelaRelam/Discord-Bot/commit/840f5dc407af147004af45d28d0b12219ce78f23))
* Added description input for bot edit. ([874791c](https://github.com/XelaRelam/Discord-Bot/commit/874791cc60000f0f39242b99bb280d43dfabd4a7))


### Chores

* Updated gitIgnore. ([4bfbd2e](https://github.com/XelaRelam/Discord-Bot/commit/4bfbd2eaa603e7f181aa379343a17e92d05914c7))


### Code Refactoring

* Improved subcommand handler. ([e707fd0](https://github.com/XelaRelam/Discord-Bot/commit/e707fd0ab06fb680e827ce662bf4b8552cfd39d8))
* Improved subcommand handler. ([7861793](https://github.com/XelaRelam/Discord-Bot/commit/7861793fd8a03f5cb3f8d9bd1d47012b13bba062))

## [1.5.0](https://github.com/XelaRelam/Discord-Bot/compare/v1.4.0...v1.5.0) (2025-03-27)


### Features

* Added Bot Add command. ([976182d](https://github.com/XelaRelam/Discord-Bot/commit/976182d387cc5dc06d8910dbf051d7606b8f2a3f))
* Database botData Update file. ([ca2eb6e](https://github.com/XelaRelam/Discord-Bot/commit/ca2eb6e77f2a62cb41d7b448072c9389e9efeeee))
* Function to check Perms. ([4847498](https://github.com/XelaRelam/Discord-Bot/commit/4847498f2cb9578359936c3b2fb4ea14133d8706))
* function to see if user exists. ([18bb908](https://github.com/XelaRelam/Discord-Bot/commit/18bb908e7482bd9c2d13f1c902c234036b3ec826))


### Bug Fixes

* Add Bot command. ([a8a6a22](https://github.com/XelaRelam/Discord-Bot/commit/a8a6a2205733d1de8bd4c3fb83ab381efb5e8800))
* Added bot now works fully, no errors. (i hope) ([91b9fab](https://github.com/XelaRelam/Discord-Bot/commit/91b9fab61e3de9aea288ec173513dd35a49a902c))


### Code Refactoring

* Code Climate. ([7d30254](https://github.com/XelaRelam/Discord-Bot/commit/7d302543246ff0ff502c38fa180f78c92c31ba18))

## [1.4.0](https://github.com/XelaRelam/Discord-Bot/compare/v1.3.0...v1.4.0) (2025-03-26)


### Features

* Added A Welcome System. ([d3715f7](https://github.com/XelaRelam/Discord-Bot/commit/d3715f74cb2c9b54a9f68b5ddf61dbfc465c12ca))
* Added stickyPost for scripts. ([28766c0](https://github.com/XelaRelam/Discord-Bot/commit/28766c031273e89c4d53390243186e0af233580b))


### Chores

* Cleanup of unused files. ([cc3de40](https://github.com/XelaRelam/Discord-Bot/commit/cc3de40f1af7ee7c0f80320939d7040c0bd81a85))

## [1.3.0](https://github.com/XelaRelam/Discord-Bot/compare/v1.2.0...v1.3.0) (2025-03-25)


### Features

* Added onReady event. ([8f0d8e3](https://github.com/XelaRelam/Discord-Bot/commit/8f0d8e32f9b94f2c1559e5679df812a252f8a4a8))
* Added starboard. ([2efa9bb](https://github.com/XelaRelam/Discord-Bot/commit/2efa9bb19109231f17bbe88cc405ca7af517fef5))


### Bug Fixes

* Embed now uses role instead of perms. ([0e48900](https://github.com/XelaRelam/Discord-Bot/commit/0e489002bfdada858d5e3547412cce093809c79d))


### Code Refactoring

* Made types input consist and have client always first. ([e1df533](https://github.com/XelaRelam/Discord-Bot/commit/e1df5334c9125701550066625a4cefeb1119aadd))

## [1.2.0](https://github.com/XelaRelam/Discord-Bot/compare/v1.1.0...v1.2.0) (2025-03-24)

### Features

* Added embed command. ([2086a2a](https://github.com/XelaRelam/Discord-Bot/commit/2086a2a06da00f5ac9001731fe8e126f33260d5f))
* Added Eval command. ([7d38bf1](https://github.com/XelaRelam/Discord-Bot/commit/7d38bf16954ab4f6861a4f8110324e2b3044b2d9))
* Added interactionCreate event. ([79c820d](https://github.com/XelaRelam/Discord-Bot/commit/79c820d504b5c63bd0bfd9cb05c292924faa29ff))
* Added Regex file. ([14caa43](https://github.com/XelaRelam/Discord-Bot/commit/14caa43921636ac52143007848f82d20f1e4f2e7))
* Added Staff Embed Command ([7c28415](https://github.com/XelaRelam/Discord-Bot/commit/7c284151831bf0aada39244de01ba42fc59bab46))

## [1.1.0](https://github.com/XelaRelam/Discord-Bot/compare/v1.0.0...v1.1.0) (2025-03-23)

### Features

* Added README.md ([ae6b670](https://github.com/XelaRelam/Discord-Bot/commit/ae6b670bae5fbbd99b10ae7845c586f45398aa49))
* Added Slash Command Register. ([4e996b7](https://github.com/XelaRelam/Discord-Bot/commit/4e996b7cbaf17d4937db4932d958a7bb8aa536b1))

### Chores

* added cspell words. ([dc3472d](https://github.com/XelaRelam/Discord-Bot/commit/dc3472d342ef360d4f78356275c4662b983a32ab))

## 1.0.0 (2025-03-23)

### Features

* Added logger util. ([7c5a40a](https://github.com/XelaRelam/Discord-Bot/commit/7c5a40aae44e00dc30b40a72c9089895cdd8bf5f))

### Bug Fixes

* Database tests. ([ae66d23](https://github.com/XelaRelam/Discord-Bot/commit/ae66d2360044b5bbe807f8bd25da44e6148c26e9))
* Now uses logger from util. ([cb3a1e4](https://github.com/XelaRelam/Discord-Bot/commit/cb3a1e48635336d7f5fa864d3fa87874e487d610))

### Chores

* Commands Cleanup. ([7861869](https://github.com/XelaRelam/Discord-Bot/commit/78618699dcfe8c8cab865adb7329bc63bbd90719))
* Made database scheme ([66ab7ed](https://github.com/XelaRelam/Discord-Bot/commit/66ab7ede8fa96c3d604319d834def754340e6fe9))


### Code Refactoring

* Apply .gitignore ([2929b45](https://github.com/XelaRelam/Discord-Bot/commit/2929b45adeebf4280a5a97194569c9e6b6cdf9fb))
