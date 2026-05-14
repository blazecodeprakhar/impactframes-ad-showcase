const fs = require('fs');
const https = require('https');
const path = require('path');

const ads = [
    { name: 'bkt', url: 'https://impactframes.in/bkt/v2/' },
    { name: 'cetaphil', url: 'https://onlymedia.in/ads/SunscreenCetaphil/v1/' },
    { name: 'junglethamma', url: 'https://onlymedia.in/ads/JungleThamma/v3/' },
    { name: 'pepe', url: 'https://impactframes.in/pepe/v1/' },
    { name: 'fujifilm1', url: 'https://onlymedia.in/ads/fujifilms/v1/' },
    { name: 'fujifilm2', url: 'https://onlymedia.in/ads/fujifilms/v2/' }
];

const dir = path.join(__dirname, 'cloned_ads');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

async function cloneAds() {
    for (const ad of ads) {
        console.log(`Cloning ${ad.name}...`);
        try {
            const html = await new Promise((resolve, reject) => {
                https.get(ad.url, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => resolve(data));
                }).on('error', reject);
            });

            let modifiedHtml = html;
            
            // 1. Inject base tag to fix relative assets
            modifiedHtml = modifiedHtml.replace('<head>', '<head><base href="' + ad.url + '">');
            
            // 2. Kill the mobile-view-component logic unconditionally
            // Replace the regex check so it ALWAYS evaluates to true (meaning it hides the warning overlay)
            modifiedHtml = modifiedHtml.replace(
                /const isMobile = \/Mobi\|Android\/i\.test\(navigator\.userAgent\);/g, 
                'const isMobile = true;'
            );
            
            // Also force the display style to none just in case
            modifiedHtml = modifiedHtml.replace(
                /this\.style\.display = 'block'; \/\/ Show the component on desktop/g,
                "this.style.display = 'none';"
            );
            
            // Also override the userAgent dynamically just in case Google Web Designer core checks it
            modifiedHtml = modifiedHtml.replace('<head>', '<head><script>Object.defineProperty(navigator, "userAgent", {get: function () { return "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"; }});</script>');

            // Inject Touch Emulator so that PC mouse clicks simulate mobile touch events
            modifiedHtml = modifiedHtml.replace('<head>', '<head><script src="https://cdn.jsdelivr.net/npm/hammer-touchemulator@0.0.2/touch-emulator.js"></script><script>window.addEventListener("load", function() { TouchEmulator(); });</script>');

            fs.writeFileSync(path.join(dir, `${ad.name}.html`), modifiedHtml);
            console.log(`Saved ${ad.name}.html`);
        } catch (err) {
            console.error(`Failed to clone ${ad.name}:`, err);
        }
    }
}

cloneAds();
