---
title: "GSoC with Zulip"
published: true
categories: posts
---

I've been putting off writing a blog for a while, but as my GSoC coding period comes to an end, I thought it'd be a good idea to write about what I worked on and what I learnt from working with Zulip as a GSoC student. 

My [proposal]({{kanishk98.github.io}}/assets/zulip_proposal.pdf) was primarily concerned with making Zulip's desktop app an obvious choice for all Zulip users, and I've worked with my mentor ([Akash Nimare](https://github.com/akashnimare)) to prioritise and fine-tune the suggestions I'd outlined in the proposal. I've listed all the PRs I've sent in below (these were all worked on during the coding period).

## Feature additions and major improvements

[Add custom configurations for enterprise](https://github.com/zulip/zulip-desktop/pull/681) - _merged_

This was the most highly requested feature addition to the desktop app, and is probably among the most hotly discussed (since we ideate over features in Zulip itself, GitHub PR conversations rarely reach 100 messages). 
It involved adding a `global_config.json` file that the app would both read on load and also detect changes in during runtime to govern admin-level settings such as auto-update options and preset organizations. 

[Migrate database to LevelDB](https://github.com/zulip/zulip-desktop/pull/810)  - _discussed, awaiting merge_

It took me a couple of do-overs to get this right (and I learnt a fair bit about Electron process management and promises in JS), but I was able to migrate our flat `node-json-db` to [LevelDB](https://github.com/Level/level), which uses locking and forces the developer to move all database operations to the main process. This brought process conflicts (and consequent app crashes) while updating the `settings.json` and `domain.json` files to zero, and I'd say this was one of the highlights of my coding period. 

[Update server validation logic](https://github.com/zulip/zulip-desktop/pull/750)  - _merged_

Prior to merging this PR, the app faced 2 problems related to server validation:
1. If you made a typo while entering a `*.zulipchat.com` URL, the app would validate the server but then lead to a `webview` that said (correctly) that the organization does not exist. ([#573](https://github.com/zulip/zulip-desktop/issues/573))
2. No error was shown when a user tried to add a Zulip instance without an associated organisation to the app. ([#596](https://github.com/zulip/zulip-desktop/issues/596))

This PR requests `zulip.ogg` as a fallback option in the case of HTTP 404 errors, preferring to use `getServerSettings()` first. Prevents `typo.zulipchat.com` from getting added to the app. It also shows an error message when trying to add a Zulip server with no organisations by checking for a realm icon on the instance.

[Tackle network issues independently](https://github.com/zulip/zulip-desktop/pull/723) - _discussed, awaiting merge_

Working with a very helpful user who reported an issue with using Zulip in their proxy environment, I changed the way we displayed network errors (by opening a new tab in the app that showed an error message) to an org-wise error message, so even if a user was unable to access one server because of network issues, they could continue working on another server if their network allowed it. 

We were using a buggy `npm` package for detecting if the user's network was down, and this PR removed its usages in favour of DOM listeners to detect the same.

Along with this, I also enabled a retry logic with exponential backoff to allow an offline server to come back online automatically. 

[Add translation support to menu](https://github.com/zulip/zulip-desktop/pull/730)  - _merged_

This feature reads the system language of the user and uses an updated Google Translate API to translate in-app settings and menu items to that language. This PR marked a major milestone in our effort towards internalisation of the app. 
I plan to migrate translations used in this PR from the local codebase to Transifex with the help of Zulip's lead developer, [Tim Abbott](https://github.com/timabbott).

[Add option to find accounts by email](https://github.com/zulip/zulip-desktop/pull/745) - _merged_

The Zulip website has a cool feature where any user can enter their email address and get a list of the organizations that email is associated with. Some of our users told us that they wanted to see a similar feature on the desktop, so we added that to the Settings page. 

This was a relatively easy addition to the app, but taught me a fair bit about CSS and design decisions (adding placeholder `zulipchat.com` and moving the cursor directly in front of it, no matter where the user clicked was something that I particularly remember). 

[Mute specific organisations from the context menu](https://github.com/zulip/zulip-desktop/pull/812) and [notifications: Add 'none' to unread count options](https://github.com/zulip/zulip/pull/13044) - _discussed, awaiting merge_

We had been discussing adding a setting to mute a specific organisation for a while and ultimately decided that it would work best if it were built end-to-end in the Zulip ecosystem. So I added a feature to the web app and also added an option for Notification Settings to each server's context menu that would direct the `<webview>` to said web app feature.

[Add loading indicator to sidebar](https://github.com/zulip/zulip-desktop/pull/674) - _merged_

Picked up an old feature request that asked for addition of a browser-like loading indicator to the sidebar, and ensured that the status of the indicator was different for different organizations. 

[Improve auto-detection of spellchecker language](https://github.com/zulip/zulip-desktop/pull/752) - _merged_

Changed usage of our spellchecker module to auto-detect the language the user was typing in, with the default language being set to the one chosen in the web app settings. Fixed [#542](https://github.com/zulip/zulip-desktop/issues/542).

[Make org tabs draggable in sidebar](https://github.com/zulip/zulip-desktop/pull/617) - _discussed, awaiting merge_

The title is pretty self-explanatory - we wanted the users to treat their Zulip servers as browser tabs and feel free to drag them around without adding/removing any server. This was challenging because we had to both manipulate the DOM properly and also save the new order of domains to disk. I solved this using an in-memory data store where the app would read the order of domains from and lazily save the new order to disk.

[Add URL copy/paster to left sidebar](https://github.com/zulip/zulip-desktop/pull/655) - _discussed, waiting on another PR_

To help Zulip users copy-pasting organisation URLs from their browser into their app, I added a pop-out text box that contains the URL of the currently active server and also copies the same to the user's clipboard on click. On entering another URL, the app is supposed to take the user to either one of the existing domains (if a match exists) or adds a new org with the corresponding URL. We're waiting on a migration to `BrowserView` before we can be sure that the redirection works as intended. 

[Add zulip:// URI scheme for navigating within app](https://github.com/zulip/zulip-desktop/pull/716) - _discussed, waiting on another PR_

This PR implements deep linking for the app and takes the user to the relevant message/conversation if they click on `zulip://<some zulip url>`. Although this feature worked well for most users, we noticed a few erratic cases and decided that similar to [#655](https://github.com/zulip/zulip-desktop/pull/655), we'd have to wait for the migration to `BrowserView` to be completed before we'd be happy with our app's redirection logic.  

## Bug fixes and minor corrections

[Fix JSON db errors on tab switch](https://github.com/zulip/zulip-desktop/pull/761) - _merged_

After a feature addition, we started updating and reading the `lastActiveTabIndex` from the `settings.json` file in both the renderer and the main processes, and the app began crashing frequently for everyone on `master`. As a quick fix, I sent this PR to move writes of this field to the main process. 

[Revert to fallback icon only when needed](https://github.com/zulip/zulip-desktop/pull/714) - _merged_

Some of our users were experiencing a problem where the icon of an organisation would change to a fallback icon showing just the first character of the organisation's URL (typically `h`).
I wrote a fix to stop updating the server icon every time and instead change the same only when the app got a legitimately new server icon (turns out updating every time meant the app could often not get the icon because of network issues and the icon would get needlessly updated).

[Add option to hide menu bar to View menu](https://github.com/zulip/zulip-desktop/pull/666) - _merged_

I noticed that the option to hide the menu bar was tucked away in Settings rather than being easily accessible through the View menu (as I thought it should be). I sent in a PR to make the change, and used IPC according to pre-existing patterns in the codebase to communicate config changes from the View menu to the settings page and the other way around. 

[Sync loading indicator with loading GIF](https://github.com/zulip/zulip-desktop/pull/757) - _merged_

In this PR, I addressed [some concerns](https://github.com/zulip/zulip-desktop/pull/674#issuecomment-502374530) about the UX associated with the loading indicator I'd added to the sidebar and synced it with the appearance of the loading GIF in the main `webview`. 

[Fix flashing icons of servers in sidebar](https://github.com/zulip/zulip-desktop/pull/621) - _discussed, awaiting merge_

Every time a user starts up the app, their servers are added, activated, and then the last active server is activated again. Since we colour the active server with a slightly lighter shade of green than the rest of the sidebar, this sort of continous activation appears as a flashing of server icons in the sidebar. [#621](https://github.com/zulip/zulip-desktop/pull/621) fixes this problem by adding all servers to the sidebar, loading the last active one first, and then lazily loading the others in order. 

[Remove trailing brackets from settings page](https://github.com/zulip/zulip-desktop/pull/811) - _merged_

While working on translations for the General settings page, I'd accidentally added an extra pair of brackets to a setting's text. This PR was a quick fix for that. 

## Developer-oriented changes

[Use `.env` file for Sentry DSN](https://github.com/zulip/zulip-desktop/pull/755) - _merged_

Developers working on the Zulip desktop app often have to build packaged versions of the app, and I personally often forget to replace the `SENTRY_DSN` placeholder string with the actual DSN. This PR reads a `.env` file that'll be ignored by git and therefore can be used across branches for development.

[Upgrade Electron version to 5.0.6](https://github.com/zulip/zulip-desktop/pull/781) - _closed in favour of another PR_

This PR was meant to jump a couple versions of Electron all the way to v5, and I'd made the changes required to account for the breaking changes from v3 to v5. Eventually though, we decided that it was best to close this in favour of a larger [migration to `BrowserView`](https://github.com/zulip/zulip-desktop/pull/793).

## Documentation

[Add rmate instructions for remote development](https://github.com/zulip/zulip/pull/12421) - _merged_

I was using `rmate` a lot while working with the Zulip web app and server, and I noticed that the documentation did not detail that workflow in its remote development section. I sent in a PR to explain how to use `rmate` with VS Code and easily edit remote files from your local computer via SSH. 

[Docs for remote development with PyCharm](https://github.com/zulip/zulip/issues/4891) - _merged_

JetBrains makes some of the best IDEs around, and a contributor to Zulip server mentioned that they'd like to see some docs on remote development with PyCharm. This PR adds the same. 

[Update desktop repo URL](https://github.com/zulip/zulip/pull/12358) - _merged_

During the first few weeks of my coding period, the auto-update feature of the desktop app broke down because of some native Electron packaging modules and we were forced to migrate to another GitHub repo for distributing future releases. I just sent in a quick PR to document the changes on the server-side repo too. 

[Update desktop app version to 3.0.0](https://github.com/zulip/zulip/pull/12373) - _merged_

[Add release notes for v4.0.0](https://github.com/zulip/zulip-desktop/pull/811) - _merged_

[Add release notes for v3.1.0-beta](https://github.com/zulip/zulip-desktop/pull/795) - _merged_ 

As a closing note, I'd like to thank [Akash Nimare](https://github.com/akashnimare) for his guidance and patience, [Priyank Patel](https://github.com/priyank-p) for his brilliant code reviews, and [Tim Abbott](https://github.com/timabbott) for helping me out whenever I worked on the web app or the server. GSoC has been an incredible experience for me because of the extremely welcoming Zulip Community, and these 3 people have played a crucial role in shaping my presence in the same. 

I intend to continue working with Zulip after GSoC, and will be starting work on a resource manager for the app soon.