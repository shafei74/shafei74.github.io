/* =====================================================================
   SITE CONTENT — edit this file to update the website.
   You never need to touch the HTML/CSS/JS to change videos, titles,
   thumbnails or contact links.

   Tips
   - Text must stay inside quotes: "like this".
   - Every item in a list ends with a comma.
   - Paths are relative to index.html (e.g. "assets/thumbs/my-video.jpg").
   - Save, then refresh the page.
   ===================================================================== */

window.SITE = {

  /* ------------------------------------------------------------------
     CONTACT — leave a value as "" to hide that row on the site.
     ------------------------------------------------------------------ */
  contact: {
    instagram: { handle: "@ph_mohamed.elshafei", url: "https://www.instagram.com/ph_mohamed.elshafei/" },
    linkedin:  { handle: "in/dr-mohamed-elshafei", url: "https://www.linkedin.com/in/dr-mohamed-elshafei" },

    // PLACEHOLDER — add your professional email, e.g. "hello@yourdomain.com"
    email: "",

    // International format, digits only (Egypt = 20 + number without the first 0)
    whatsapp: "201145469600",

    // PLACEHOLDER — other platforms. Fill in a url to show it.
    other: [
      { label: "TikTok",  handle: "", url: "" },
      { label: "YouTube", handle: "", url: "" },
      { label: "Facebook", handle: "", url: "" }
    ]
  },

  /* ------------------------------------------------------------------
     SKINCARE & HAIRCARE VIDEO PORTFOLIO  (section 03)
     Each video is its own card. To add a video:
       1. Put the web-ready .mp4 in  assets/videos/
       2. Put a thumbnail .jpg in    assets/thumbs/   (vertical 9:16 works best)
       3. (optional) a 4–6 s silent hover clip in assets/previews/
       4. Copy one block below, paste it, and change the values.

     Fields
       id          unique, no spaces
       title       the video's title (shown on the card and in the player)
       category    "skincare" | "haircare"
       topic       a short sub-topic label
       description 1–3 sentences
       thumbnail   path to the thumbnail image
       video       path to the .mp4 (leave "" if you only want an external link)
       preview     path to a short silent hover clip (optional, "" to skip)
       link        optional link to the original post (Instagram/TikTok…)
       duration    shown on the card, e.g. "1:01"
       visible     true = shown on the site, false = hidden

     NOTE: The titles below are WORKING TITLES written from each video's
     on-screen text. Replace them with your published titles.
     ------------------------------------------------------------------ */
  videos: [
    {
      id: "acniact",
      title: "Acniact: Using an Acne Gel the Right Way",
      category: "skincare",
      topic: "Acne education",
      description: "What's inside Acniact (adapalene + benzoyl peroxide), how it works against inflammation and acne bacteria, why it belongs under medical supervision — and why a thin layer on the spot plus daily sunscreen matters.",
      thumbnail: "assets/thumbs/acniact.jpg",
      video: "assets/videos/acniact.mp4",
      preview: "assets/previews/acniact.mp4",
      link: "",
      duration: "1:01",
      visible: true
    },
    {
      id: "vitamin-c",
      title: "Vitamin C Serum, Explained",
      category: "skincare",
      topic: "Active ingredients",
      description: "What vitamin C actually does inside the skin, shown layer by layer, the rules for using it well — moisturiser and, above all, sunscreen — and a look at Egyptian and imported serum options.",
      thumbnail: "assets/thumbs/vitamin-c.jpg",
      video: "assets/videos/vitamin-c.mp4",
      preview: "assets/previews/vitamin-c.mp4",
      link: "",
      duration: "1:07",
      visible: true
    },
    {
      id: "hair-care",
      title: "A Hair-Loss Routine, Ingredient by Ingredient",
      category: "haircare",
      topic: "Hair loss & scalp health",
      description: "A complete hair-fall routine: the actives behind anti-shedding lotions (Procapil, Capixyl, saw palmetto, biotin, panthenol), how often to apply ampoules on a clean scalp, and where shampoo, serum and heat protection fit in.",
      thumbnail: "assets/thumbs/hair-care.jpg",
      video: "assets/videos/hair-care.mp4",
      preview: "assets/previews/hair-care.mp4",
      link: "",
      duration: "1:38",
      visible: true
    },
    {
      id: "lash-serum",
      title: "Lash Serum: Longer, Fuller Lashes — Safely",
      category: "haircare",
      topic: "Lash care",
      description: "How a lash-growth serum works, the four key ingredients behind it, and the safety rules for applying it along the lash line while keeping it out of the eye.",
      thumbnail: "assets/thumbs/lash-serum.jpg",
      video: "assets/videos/lash-serum.mp4",
      preview: "assets/previews/lash-serum.mp4",
      link: "",
      duration: "1:01",
      visible: true
    }

    /* --- TEMPLATE: copy, paste above this comment, and fill in ---------
    ,{
      id: "skin-barrier",
      title: "Understanding Your Skin Barrier",
      category: "skincare",
      topic: "Skin barrier",
      description: "Short professional description.",
      thumbnail: "assets/thumbs/skin-barrier.jpg",
      video: "assets/videos/skin-barrier.mp4",
      preview: "",
      link: "",
      duration: "1:00",
      visible: true
    }
    ------------------------------------------------------------------ */
  ],

  /* ------------------------------------------------------------------
     MEDICAL CONTENT  (section 04 — kept separate from skin & hair)
     Same fields as above, except instead of "category" each video has
     "tags" — one or more of:
        "awareness"     Medical awareness
        "education"     Pharmaceutical education
        "medication"    Medication information
        "myths"         Myths & facts
        "safety"        Drug interactions & safety
        "science"       Scientific explanations
     Filters appear automatically for the tags that are used.

     NOTE: WORKING TITLES written from each video's on-screen text.
     Replace them with your published titles.
     ------------------------------------------------------------------ */
  medicalVideos: [
    {
      id: "plavix",
      title: "Plavix & Omeprazole: An Interaction Worth Knowing",
      tags: ["safety", "science"],
      topic: "Drug interactions & safety",
      description: "Why clopidogrel (Plavix) is a prodrug that needs the liver enzyme CYP2C19 to work, how omeprazole can interfere with that activation — shown in 3D animation — and what that means for people taking both.",
      thumbnail: "assets/thumbs/plavix.jpg",
      video: "assets/videos/plavix.mp4",
      preview: "assets/previews/plavix.mp4",
      link: "",
      duration: "0:48",
      visible: true
    },
    {
      id: "aspocid",
      title: "Aspocid & Children: Not for Fever or Headache",
      tags: ["medication", "safety"],
      topic: "Medication information",
      description: "A pharmacy-counter scenario about giving Aspocid (aspirin) to a child for fever or headache — and why aspirin isn't the right choice for children.",
      thumbnail: "assets/thumbs/aspocid.jpg",
      video: "assets/videos/aspocid.mp4",
      preview: "assets/previews/aspocid.mp4",
      link: "",
      duration: "0:46",
      visible: true
    },
    {
      id: "ppi",
      title: "Why Heartburn Comes Back When You Stop Your Medicine",
      tags: ["education", "science"],
      topic: "Pharmaceutical education",
      description: "Answering a follower's question: why acid burning returns after stopping an acid-reducing medicine, what's happening in the stomach, and how options like famotidine fit in.",
      thumbnail: "assets/thumbs/ppi.jpg",
      video: "assets/videos/ppi.mp4",
      preview: "assets/previews/ppi.mp4",
      link: "",
      duration: "0:40",
      visible: true
    },
    {
      id: "influvac",
      title: "Influvac Flu Vaccine: Who Should — and Shouldn't — Take It",
      tags: ["awareness", "medication"],
      topic: "Medical awareness",
      description: "How the 2025/2026 flu vaccine builds antibodies against this season's strains, expected side effects, who benefits most (older adults, children), and when to avoid it — such as egg allergy or an active cold.",
      thumbnail: "assets/thumbs/influvac.jpg",
      video: "assets/videos/influvac.mp4",
      preview: "assets/previews/influvac.mp4",
      link: "",
      duration: "1:14",
      visible: true
    }

    /* --- TEMPLATE -------------------------------------------------------
    ,{
      id: "my-medical-video",
      title: "Your video title",
      tags: ["myths"],
      topic: "Myths & facts",
      description: "Short professional description.",
      thumbnail: "assets/thumbs/my-medical-video.jpg",
      video: "assets/videos/my-medical-video.mp4",
      preview: "",
      link: "",
      duration: "1:00",
      visible: true
    }
    ------------------------------------------------------------------ */
  ]
};
