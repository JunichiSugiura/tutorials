[vscode-settings-sync]: https://code.visualstudio.com/docs/editor/settings-sync

## Dotfiles Tutorial

### Tools we use

- [Homebrew bundle](https://github.com/Homebrew/homebrew-bundle)
- [GNU stow](https://www.gnu.org/software/stow/)
- [VSCode Settings Sync][vscode-settings-sync]

Homebrew bundle will be used to install CLI tools as well as desktop apps.

Then, we'll link all config files (aka. dotfiles) with GNU stow.

Finally, we'll sync all VSCode settings usign "Settings Sync" which is shipped in v1.45 as a preview feature.

### Step 1: Setup

Create project directory and move inside.

```sh
# console

$ mkdir dotfiels && cd dotfiles
```

Create `install` script file on root.

```sh
# console

$ touch install

# Give it a permission to execute
$ chmod +x ./install
```

Open current directory in your favorite editor

```sh
# console

# I'm using VSCode
$ code .
```

Add shebang to tell the system which interpreter to use.

```sh
# ./install

#!/bin/sh <- add this on line 1
```

Set -e option to exit immediately if command exit with error status.

```sh
# ./install

# ...

set -e
```

macOS recently changed default shell from bash to zsh. Let's change it to zsh if the system still uses bash.

```sh
# ./install

#...

if [ "$(dscl . -read ~/ UserShell)" = "UserShell: /bin/bash" ]; then
    chsh -s /bin/zsh
    chmod -R 755 /usr/local/share/zsh
    chown -R root:staff zsh
fi
```

Now, let's add script to install Homebrew if it isn't already.

```sh
# ./install

#...

# checking brew path to see bin file exists or not
if [ ! -f /usr/local/bin/brew ]; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
fi
```

This will prompt to install `xcode-tools` if you haven't installed yet. This also installs `git` which comes in handly later.

Finally, add some code to clone dotfiles repo.

```sh
# ./install

#...

CLONE_PATH=~/local/path/to/clone/repo # <- change it
if [ ! -d "$CLONE_PATH" ]; then
    mkdir -p "$CLONE_PATH"
fi

# check whether dotfiles is already cloned or not
if [ ! -d "$CLONE_PATH"/dotfiles ]; then
    cd "$CLONE_PATH"
    git clone <remote-repo-url> # <- change it
fi
```

### Step 2: Install CLI and Apps through Homebrew Bundle

Create `Brewfile`

```sh
# console

$ touch ./Brewfile
```

Let's add [startship](https://starship.rs/) which is my favorite shell prompt as an example.

```ruby
# ./Brewfile

brew "starship"
```

If you're familier with `brew` command, `Brewfile` looks familier to you as well.

For example,

```sh
# with brew command
$ brew install starship
$ brew tap "homebrew/cask"
$ brew cask install google-chrome

# with Brewfile
tap "homebrew/cask"
cask_args appdir: "/Applications"

brew "starship"
cask "google-chrome"
```

Even more, you can install apps from [App Store](https://www.apple.com/ios/app-store/) through [mas-cli](https://github.com/mas-cli/mas).

```sh
brew "mas"

mas "Xcode", id: 497799835 # <- Don't forget the id param
mas "Final Cut Pro", id: 424389933
```

If you don't know the id, go to the app page and find it in the url.

example: https://apps.apple.com/us/app/xcode/id497799835

Add `brew bundle` command in our `./install` file.
This will install all dependencies defined in the `./Brewfile`.

```sh
# ./install

#...

# -v or --verbose option give us more details
brew bundle -v --file "$CLONE_PATH"/dotfiles/Brewfile
```

Now, Run `./install` script and see `starship` command is installed.

```sh
# console

$ ./install

# make sure that starship is installed
$ which starship
# => /usr/local/bin/starship
```

### Step 3: Link config files with GNU stow

Add `stow` as a Homebrew bundle dependency.

```ruby
# ./Brewfile

brew "starship"
brew "stow"
```

`starship` needs to be initialized by `~/.zshrc` so let's create a file. We'll link this dotfile with `stow` command later.

Create or move our `.zshrc` file in our project directory.

```sh
# console

$ mkdir -p ./packages/zsh

# if you don't have ~/.zshrc yet
$ touch ./packages/zsh/.zshrc

# if you already have ~/.zshrc in your machine,
# move it under ./pacakges/zsh/ instead of creating a new file
$ mv ~/.zshrc ./packages/zsh
```

`./packages` is our directly that will host all our stow packages.

We can create a stow package like this `mkdir -p ./packages/<package-name>`.

`./packages/<package-name>` directory acts as a root directory and stow will link it to the `$HOME/` path later in our system.

For example, if you want to link your `config.yml` file to `\$HOME/.config/app/config.yml`, you need to run this.

```sh
# console

$ mkdir -p ./packages/app/.config/app
$ touch ./packages/app/.config/app/config.yml
```

Add starship init command on `./packages/zsh/.zshrc`

```sh
# ./packages/zsh/.zshrc

eval "$(starship init zsh)"
```

Finally, add script to link our dotfile.

```sh
# ./install

#...

stow -v -d "$CLONE_PATH"/dotfiles/packages -t $HOME zsh
```

If you run `./install && source ~/.zshrc`, you shold see the beautiful prompt from starship.

```sh
# console

$ ./install

# make sure .zshrc is linked to $HOME
$ ls -la ~/.zshrc
# => lrwxr-xr-x  1 XXX  staff  XX MMM DD HH:MM /Users/XXX/.zshrc -> projects/dotfiles/packages/zsh/.zshrc

# reload zsh config
$ source ~/.zshrc
```

Now, add a configuration file for `starship`.
`starship` configuration file needs to be created like this (`~/.config/starship.toml`) in our system so...

```sh
# console

$ mkdir -p ./packages/starship/.config
$ touch ./packages/starship/.config/staship.toml
```

Let's change our prompt from `>` to `🦄` because why not? 🤷‍♀️

```toml
# ./packages/starship/.config/staship.toml

add_newline = false

[character]
symbol = "🦄 "
```

Now run `./install` again then you should see the unicorn emoji.

### Step 3: Setup Visual Studio Code

Let's find out whether `Visual Studio Code` exists in Homebrew or not.

```sh
# console

$ brew search "visual studio code"
# ==> Casks
# visual-studio-code      visual-studio-code-insiders

# you can find more details
$ brew cask info visual-studio-code
# visual-studio-code: 1.45.0 (auto_updates)
# https://code.visualstudio.com/
# Not installed
# ...
```

We found out that `visual-studio-code` cask exists so let's install through Homebrew bundle.

```ruby
# ./Brewfile

# add these two lines on top
tap "homebrew/cask"
cask_args appdir: "/Applications"

brew "starship"
brew "stow"

cask "visual-studio-code"
```

Run `./install` again, then Visual Studio Code should be installed under `/Applications` directory

Open the app and follow the instruction [here][vscode-settings-sync] for setting up Settings Sync.
