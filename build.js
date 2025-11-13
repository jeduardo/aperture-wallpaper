import puppeteer from "puppeteer-core";
import { execSync } from "child_process";
import fs from "fs";

const resolutions = [
  { width: 960, height: 540 }, // 540p - qHD
  { width: 1280, height: 720 }, // 720p - HD
  { width: 1440, height: 900 },
  { width: 1600, height: 900 },
  { width: 1920, height: 1080 }, // 1080p - FullHD
  { width: 2048, height: 1080 }, // 2K
  { width: 2560, height: 1440 }, // 1440p - QHD
  { width: 3840, height: 2160 }, // 2160p - UHD
  { width: 4096, height: 2160 }, // 4K
];

const browserPath =
  process.env.BROWSER_PATH ||
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";

async function build() {
  const cwd = process.cwd();

  const location = `file:///${cwd}/aperture.html`;

  console.log(`# Generating wallpapers using ${browserPath}`);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: browserPath,
  });
  const page = await browser.newPage();

  const colorSchemes = ["light", "dark"];

  console.log(`# Building wallpapers out of ${location}`);

  try {
    for (const resolution of resolutions) {
      // Save images
      for (const scheme of colorSchemes) {
        // Set the color scheme preference
        await page.emulateMediaFeatures([
          { name: "prefers-color-scheme", value: scheme },
        ]);
        await page.setViewport(resolution);
        await page.goto(location);

        await page.addStyleTag({
          content: `
        body {
          width: ${resolution.width}px;
          height: ${resolution.height}px;
        `,
        });

        const imagePath = `${cwd}/build/aperture-simple-${resolution.width}x${resolution.height}-${scheme}.png`;
        await page.screenshot({
          path: imagePath,
          clip: {
            x: 0,
            y: 0,
            width: resolution.width,
            height: resolution.height,
          },
        });
        console.log(`# Image saved: ${imagePath}`);
      }

      // Create macOS wallpaper
      const outputFileName = `aperture-${resolution.width}x${resolution.height}.heic`;
      const configContent = [
        {
          fileName: `aperture-simple-${resolution.width}x${resolution.height}-dark.png`,
          isPrimary: true,
          isForLight: false,
          isForDark: true,
        },
        {
          fileName: `aperture-simple-${resolution.width}x${resolution.height}-light.png`,
          isPrimary: false,
          isForLight: true,
          isForDark: false,
        },
      ];

      const configPath = `${cwd}/build/config-${resolution.width}x${resolution.height}.json`;
      try {
        fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2));

        // Create dynamic wallpaper using wallpapper
        execSync(`wallpapper -i "${configPath}" -o ${outputFileName}`, {
          cwd: `${cwd}/build`,
          stdio: "inherit",
        });

        console.log(`# Created dynamic wallpaper: ${outputFileName}`);
      } catch (error) {
        console.error(
          `!!! Error creating wallpaper for ${resolution.width}x${resolution.height}:`,
          error.message
        );
      } finally {
        fs.unlinkSync(configPath);
      }
    }
  } finally {
    await browser.close();
  }
}

build()
  .then(() => {
    console.log("# Build finished successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("# Build failed:", err);
    process.exit(1);
  });
