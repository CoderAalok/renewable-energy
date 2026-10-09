# Renewable Energy Transition in India: Challenges and Opportunities for Sustainable Development
## Environmental Studies CA1 Academic Project • Interactive Digital Showcase
**Lovely Professional University (LPU) • Department of Environmental Studies**

---

### 🌟 Project Identity & Overview

* **Project Title:** Renewable Energy Transition in India: Challenges and Opportunities for Sustainable Development
* **Course:** Environmental Studies (CA1)
* **Primary Digital Product:** Research-Based Educational Documentary (5:02 mins)
* **Digital Presentation & Evidence Portal:** Interactive Project Website Hub
* **Institution:** Lovely Professional University (LPU)
* **Official Evaluation Google Drive Repository:** [Google Drive Folder](https://drive.google.com/drive/folders/1n4MEGUzt7OeqC9GoL7X_GUomdXCH9SVY)

> **Academic Product Hierarchy:**
> * The **Research-Based Educational Documentary** is the **Primary Product** of this CA1 project.
> * This website functions as the **Digital Presentation and Evidence Portal** that synthesizes the researched content, data statistics, challenges and opportunities analysis, project development trail, social-media promotion, and supporting documentation into one unified, accessible platform.

---

### 📂 Project Structure

```text
CHE PROJECT/
├── index.html                    # Main interactive website portal
├── css/
│   ├── style.css                 # Site stylesheet
│   ├── icons.css                 # Local icon definitions (subset of Font Awesome Free 6.4.0)
│   └── fonts/                    # Subsetted icon fonts used by icons.css (woff2)
├── js/
│   └── script.js                 # Navigation, theme, counters, accordion, modals, report viewer
├── assets/
│   ├── images/
│   │   └── lpu_logo.png          # Lovely Professional University crest
│   ├── documentary/
│   │   ├── opening_thumbnail.jpg # Documentary opening frame
│   │   └── ending_thumbnail.png  # Documentary closing frame
│   ├── attachments/              # Evidence-gallery figures
│   │   ├── website_screenshot.png    # Figure 1: Website overview
│   │   ├── main_info_section.png     # Figure 2: Main information section
│   │   ├── doc_screenshot.png        # Figure 3: Documentary screenshot
│   │   └── promo_reel.png            # Figure 4: Promotional reel still
│   ├── social-media/
│   │   ├── promo_reel.mp4            # Promotional reel (playable on the site)
│   │   └── promotion_opening.jpg     # Reel cover (also used as Figure 5)
│   ├── qr/
│   │   └── qr_code.png               # Project QR code (also used as Figure 6)
│   └── report/
│       └── page_1.svg … page_7.svg   # Page-by-page report preview
├── Renewable Energy Transition in India CA1 Report (Revised).docx   # Full report
└── README.md
```

Each file exists once. Figures 5 and 6 reuse images from the folders above instead of keeping copies.

---

### 📑 Research Data & Citations

The figures on the website come from these official publications. Re-check them against the source pages before submission and update them in `index.html` (`data-target` values in the "At a Glance" section) and in the DOCX report if they change.

| Metric | Value | Reference / Source |
| :--- | :--- | :--- |
| **Total Renewable-Energy Capacity** | **299.25 GW** | Ministry of New and Renewable Energy (MNRE), Govt. of India (as of 30 Sept 2026) |
| **Solar Installed Capacity** | **171.05 GW** | MNRE, Govt. of India |
| **Wind Installed Capacity** | **59.20 GW** | MNRE, Govt. of India |
| **Clean Power Investment (2024)** | **83%** | International Energy Agency (IEA, 2025): share of India's power-sector investment going to clean energy |

---

### 🌐 Website Architecture & Interactive Features

1. **Sticky Navigation Bar:**
   * Links: `Home` | `About` | `Renewable Energy` | `Challenges` | `Opportunities` | `Documentary` | `Project` | `Social Media`
   * "Explore Project" button, scroll-progress bar, active-section highlighting.
   * Responsive mobile menu (closes with Esc) and a Light / Dark theme toggle that remembers the choice and otherwise follows the system setting.

2. **Hero Section:** project title, slogan, LPU badge, and "Explore the Project" / "Watch Documentary" buttons.

3. **Project Introduction (Why Renewable Energy Matters):** context narrative plus cards for Solar, Wind, Hydropower and Biomass.

4. **India's Renewable Energy at a Glance:** animated counters (299.25 GW, 171.05 GW, 59.20 GW, 83%) with MNRE / IEA attribution. The final values are in the HTML, so they are correct without JavaScript or with reduced-motion enabled.

5. **Major Renewable Energy Sources:** detailed cards for each source.

6. **The Energy Transition (Visual Flow):** Conventional Sources → Transition Enablers → Sustainable System.

7. **Challenges:** six accordion cards (Variable Generation, Energy Storage, Transmission Infrastructure, Financing, Land & Environment, DISCOMs). Keyboard accessible.

8. **Opportunities for Sustainable Development:** six cards plus the core thesis statement.

9. **Documentary Section (Primary Digital Product):**
   * Thumbnail with play button, 5:02 duration badge, and inline chapter timestamps.
   * Video modal that plays the documentary from Google Drive (loaded only while the modal is open) and a link to the Drive folder.

10. **Project Development & AI Supporting Technology:** 4-step timeline: Research → Content Development → Digital Development → Awareness.

11. **Project Evidence Gallery:** six figures with a fullscreen lightbox.

12. **Social Media Coverage:**
    * HTML5 player for `assets/social-media/promo_reel.mp4`.
    * Static engagement table (views, likes, comments, shares: 215, 15, 5, 6).

13. **Report Archive:** page-by-page SVG preview of the report (pages 1–7) with previous/next buttons, a dropdown, and a DOCX download.

14. **Conclusion & References:** closing synthesis and references to MNRE, IEA and IRENA.

---

### 💻 How to View the Project

Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari). No server or build step is needed.

* Works offline: layout, icons (bundled locally), scripts, images and the promotional reel.
* Needs internet: the documentary player (Google Drive), the Instagram link and the Google Fonts. Without internet the site falls back to system fonts.

---

### 🛠️ Maintenance Notes

* Styles live in `css/style.css`; there are no inline `style` attributes or `onclick` handlers. Behaviour is attached in `js/script.js` using `data-*` attributes (`data-open-video`, `data-lightbox-title`, `data-close-modal`).
* To change the documentary video, edit the `data-src` of `#doc-modal-video-frame` in `index.html`.
* To add a report page, add `assets/report/page_N.svg` and one `<option>` in `#report-page-select`; the page count is read from the dropdown.
* Icons: `css/icons.css` only contains the icons currently used. A new icon must be added there (and its glyph included in the matching file in `css/fonts/`), or the full Font Awesome Free package can be used instead.
* Font Awesome Free is licensed under CC BY 4.0 (icons), SIL OFL 1.1 (fonts) and MIT (code): https://fontawesome.com/license/free
