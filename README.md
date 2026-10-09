# Renewable Energy Transition in India: Challenges and Opportunities for Sustainable Development
## Environmental Studies CA1 Academic Project • Interactive Digital Showcase
**Department of Environmental Studies**

---

### 🌟 Project Identity & Overview

* **Project Title:** Renewable Energy Transition in India: Challenges and Opportunities for Sustainable Development
* **Course:** Environmental Studies (CA1)
* **Primary Digital Product:** Research-Based Educational Documentary (5:02 mins)
* **Digital Presentation & Evidence Portal:** Interactive Project Website Hub
* **Academic Discipline:** Environmental Studies
* **Official Evaluation Google Drive Repository:** [Google Drive Folder](https://drive.google.com/drive/folders/1n4MEGUzt7OeqC9GoL7X_GUomdXCH9SVY)

> **Academic Product Hierarchy:**
> * The **Research-Based Educational Documentary** is the **Primary Product** of this CA1 project.
> * This website functions as the **Digital Presentation and Evidence Portal** that synthesizes the researched content, data statistics, challenges and opportunities analysis, project development trail, social-media promotion, and supporting documentation into one unified, accessible platform.

---

### 📂 Project Structure

```text
RENEWABLE-ENERGY/
├── index.html                    # Main interactive website portal
├── css/
│   ├── style.css                 # Site stylesheet
│   ├── icons.css                 # Local icon definitions (subset of Font Awesome Free 6.4.0)
│   └── fonts/                    # Subsetted icon fonts used by icons.css (woff2)
├── js/
│   └── script.js                 # Navigation, theme, counters, accordion, modals, report viewer
├── assets/
│   ├── images/
│   │   └── re_logo.svg           # Project emblem logo
│   ├── documentary/
│   │   └── opening_thumbnail.jpg # Documentary opening frame
│   ├── attachments/              # Evidence-gallery figures
│   │   ├── website_screenshot.png    # Figure 1: Website overview
│   │   ├── main_info_section.png     # Figure 2: Main information section
│   │   ├── doc_screenshot.png        # Figure 3: Documentary screenshot
│   │   └── promo_reel.png            # Figure 4: Promotional reel still
│   ├── social-media/
│   │   ├── promo_reel.mp4            # Promotional reel (compressed faststart, ~16 MB)
│   │   └── promotion_opening.jpg     # Reel cover (also used as Figure 5)
│   ├── qr/
│   │   └── qr_code.png               # Project QR code (Figure 6: Drive Folder)
│   └── report/
│       └── page_1.svg … page_7.svg   # Page-by-page report preview
├── Renewable Energy Transition in India CA1 Report (Revised).docx   # Full report
├── .gitignore                    # Git exclusions
├── LICENSE                       # MIT License
└── README.md
```

Each file exists once. Figures 5 and 6 reuse images from the folders above instead of keeping copies.

---

### 📑 Research Data & Citations

The figures on the website come from these official publications. Sourced from officially released MNRE monthly achievement reports (as of 30 September 2026) and CEA/IEA publications:

| Energy Source | Installed Capacity | Share of RE | Reference / Source |
| :--- | :--- | :--- | :--- |
| ☀️ **Solar power** | **171.05 GW** | 57.16% | [MNRE, Govt. of India](https://mnre.gov.in/en/) (as of 30 September 2026) |
| 🌬️ **Wind power** | **59.20 GW** | 19.78% | [MNRE, Govt. of India](https://mnre.gov.in/en/) |
| 🌱 **Bioenergy** | **11.75 GW** | 3.93% | [MNRE, Govt. of India](https://mnre.gov.in/en/) |
| 💧 **Small hydropower** (≤ 25 MW) | **5.18 GW** | 1.73% | [MNRE, Govt. of India](https://mnre.gov.in/en/) |
| 🏞️ **Large hydropower** (> 25 MW) | **52.06 GW** | 17.40% | [MNRE / CEA](https://mnre.gov.in/en/) |
| ⚡ **Total renewable energy** | **299.25 GW** | **100.0%** | [MNRE, Govt. of India](https://mnre.gov.in/en/) |
| 📈 **Clean Power Investment (2024)** | **83%** | — | [IEA World Energy Investment 2025: India](https://www.iea.org/reports/world-energy-investment-2025/india) |

#### 🔗 Academic Bibliography (Harvard Referencing)
1. **Ministry of New and Renewable Energy (MNRE), Govt. of India (2026)** *Physical Achievements & Programme Overview: Installed Renewable Energy Capacity (as of 30 September 2026)*. New Delhi: Ministry of New and Renewable Energy. Available at: [https://mnre.gov.in/en/](https://mnre.gov.in/en/) [Accessed: 30 September 2026].
2. **Central Electricity Authority (CEA), Ministry of Power (2026)** *Monthly Generation Report & Executive Summary of Power Sector in India*. New Delhi: Central Electricity Authority. Available at: [https://cea.nic.in/](https://cea.nic.in/) [Accessed: 30 September 2026].
3. **International Energy Agency (IEA) (2025)** *World Energy Investment 2025: India Country Profile & Clean Energy Capital Inflows*. Paris: International Energy Agency. Available at: [https://www.iea.org/reports/world-energy-investment-2025/india](https://www.iea.org/reports/world-energy-investment-2025/india) [Accessed: 1 October 2026].
4. **International Renewable Energy Agency (IRENA) (2026)** *Renewable Capacity Statistics 2026*. Abu Dhabi: International Renewable Energy Agency. Available at: [https://www.irena.org/Publications/2026/Mar/Renewable-capacity-statistics-2026](https://www.irena.org/Publications/2026/Mar/Renewable-capacity-statistics-2026) [Accessed: 1 October 2026].
5. **International Energy Agency (IEA) (2024)** *India Case Study: Clean Energy Transition & Cost of Capital Observatory*. Paris: International Energy Agency. Available at: [https://www.iea.org/reports/india-case-study](https://www.iea.org/reports/india-case-study) [Accessed: 1 October 2026].

---

### 🌐 Website Architecture & Interactive Features

1. **Sticky Navigation Bar:**
   * Links: `Home` | `About` | `Renewable Energy` | `Challenges` | `Opportunities` | `Documentary` | `Project` | `Social Media`
   * Scroll-progress bar and active-section highlighting.
   * Responsive mobile menu (closes with Esc) and a Light / Dark theme toggle that remembers the choice and otherwise follows the system setting.

2. **Hero Section:** project title, slogan, academic research badge, and "Explore the Project" / "Watch Documentary" buttons.

3. **Project Introduction (Why Renewable Energy Matters):** context narrative plus cards for Solar, Wind, Hydropower and Biomass.

4. **India's Renewable Energy at a Glance:** animated counters (299.25 GW, 171.05 GW, 59.20 GW, 83%) with MNRE, CEA, and IEA attribution, plus Capacity vs. Generation and CUF context cards. The final values are in the HTML, so they are correct without JavaScript or with reduced-motion enabled.

5. **Major Renewable Energy Sources:** detailed cards for each source.

6. **The Energy Transition (Visual Flow):** Conventional Sources → Transition Enablers → Sustainable System.

7. **Challenges:** six accordion cards (Variable Generation, Energy Storage, Transmission Infrastructure, Financing, Land & Environment, DISCOMs). Keyboard accessible.

8. **Opportunities for Sustainable Development:** six cards plus the core thesis statement.

9. **Documentary Section (Primary Digital Product):**
   * Thumbnail with play button, 5:02 duration badge, and inline chapter timestamps.
   * Video modal that plays the documentary from Google Drive (loaded only while the modal is open) and a link to the Drive folder.

10. **Project Development & AI Supporting Technology:** 4-step timeline: Research → Content Development → Digital Development → Awareness.

11. **Project Evidence Gallery:** six figures with a fullscreen lightbox (including Figure 6: Live Project Website QR Code).

12. **Social Media Coverage:**
    * HTML5 player for `assets/social-media/promo_reel.mp4`.
    * Static engagement table (views, likes, comments, shares: 215, 15, 5, 6).

13. **Report Archive:** page-by-page SVG preview of the report (pages 1–7) with previous/next buttons, a dropdown, and a DOCX download.

14. **Conclusion & References:** closing synthesis and references to MNRE, IEA and IRENA.

---

### 💻 How to View the Project

* **Live Digital Portal (GitHub Pages):** [https://coderaalok.github.io/renewable-energy/](https://coderaalok.github.io/renewable-energy/)
* **Local Offline View:** Open `index.html` in any modern web browser. No server or build step required.
* **Offline Capability:** Layout, styles, local icon fonts, scripts, evidence gallery images, and the compressed promotional reel (16 MB) work completely offline.
* **Online Resources:** The documentary video embed (Google Drive), external Instagram post, and Google Fonts require internet connectivity (system fonts are used offline).

---

### 🛠️ Maintenance Notes

* Styles live in `css/style.css`; there are no inline `style` attributes or `onclick` handlers. Behaviour is attached in `js/script.js` using `data-*` attributes (`data-open-video`, `data-lightbox-title`, `data-close-modal`).
* To change the documentary video, edit the `data-src` of `#doc-modal-video-frame` in `index.html`.
* To add a report page, add `assets/report/page_N.svg` and one `<option>` in `#report-page-select`; the page count is read from the dropdown.
* Icons: `css/icons.css` only contains the icons currently used. A new icon must be added there (and its glyph included in the matching file in `css/fonts/`), or the full Font Awesome Free package can be used instead.
* Font Awesome Free is licensed under CC BY 4.0 (icons), SIL OFL 1.1 (fonts) and MIT (code): https://fontawesome.com/license/free
