# ImpactFrames Ad Showcase

A modern, responsive showcase page for rich media, mobile-first interactive advertisements. Built with vanilla HTML, CSS, Alpine.js, and a dark-mode inspired premium UI, this project allows you to seamlessly demonstrate mobile-exclusive ads to clients natively on a PC screen without running into mobile-only access restrictions.

## Features

- **Device Emulation Mockups:** Renders high-quality mobile phone mockups to display mobile-only ads seamlessly on a desktop.
- **Dynamic Content Toggling:** Uses Alpine.js to allow users to toggle between different variations of ads within a single phone mockup.
- **Built-in Ad Cloner:** Includes a Node.js script (`clone_ads.js`) that automatically fetches remote ad HTML, injects User-Agent spoofing to bypass "mobile-only" locks, and saves the ad for local rendering.
- **Premium Design:** Eye-catching color palettes, smooth hover animations, and a polished user interface.
- **Integrated QR Codes:** Quickly allows clients to scan and view the actual interactive ad on their physical smartphones.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/blazecodeprakhar/impactframes-ad-showcase.git
   cd impactframes-ad-showcase
   ```

2. **Clone Remote Ads (Optional but recommended for bypassing mobile locks):**
   Ensure you have [Node.js](https://nodejs.org/) installed, then run the ad cloner script:
   ```bash
   node clone_ads.js
   ```
   This will download the ads from the remote URLs and aggressively bypass any Google Web Designer `mobile-view-component` warnings so they display perfectly on PC.

3. **Run the Project:**
   Simply open `index.html` in your web browser. For the best experience, use an extension like VS Code's "Live Server".

## Tech Stack
- HTML5
- CSS3 (Custom Variables, Flexbox, CSS Grid)
- Vanilla Javascript
- Alpine.js (for reactive toggle states)
- Node.js (for the `clone_ads.js` utility)

## License
&copy; 2026 ImpactFrames. All Rights Reserved.
