# Aperture Laboratories wallpaper generator

Public domain image from [here](https://commons.wikimedia.org/wiki/File:Aperture_Laboratories_Logo.svg).

## Manual process to generate page screenshots

Open the page in the browser, then save the wallpaper with:

- F12 for dev tools
- Command+Shift+P for action lookup
- Look for "Screenshot"" and select "Full Size Screenshot"
- Save as png for maximum quality
- Switch the OS to dark theme (or light theme) and save another image
- Use [Equinox](https://equinoxmac.com/) to merge both images into a wallpaper

## Automated process

```shell
npm run build
```

## Dependencies

The [wallpapper](https://github.com/mczachurski/wallpapper) utility is required to generate dynamic wallpapers for macOS.

It can be installed with:

```shell
brew tap mczachurski/wallpapper
brew install wallpapper
```

## Caveats

1. The browser **must** be a Chrome-based browser to work with light/dark themes. I used Brave. The browser path can be overridden through the environment variable `BROWSER_PATH`.
2. The wallpapers need to be built on a Mac, given that they rely on a CLI utility that runs on macOS.

## Future ideas

1. Process multiple HTML files (e.g. *.html under resources)
2. Add Github Action for build with [macOS runners](https://github.blog/changelog/2024-01-30-github-actions-introducing-the-new-m1-macos-runner-available-to-open-source/)
