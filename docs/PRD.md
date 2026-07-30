# Tasma - Product Requirement Document (PRD)

## 1. Executive Summary
Tasma is a next-generation, AI-powered SaaS platform designed for the automated and scalable creation of short-form video content tailored for YouTube Shorts, TikTok, Instagram Reels, Facebook Reels, and Ranking Videos. The platform bridges the gap between complex video editing tools and basic templated solutions by offering an enterprise-grade, high-performance rendering engine combined with state-of-the-art generative AI capabilities.
- **Market Opportunity:** The short-form video market is experiencing hyper-growth, with a projected market size exceeding $3 billion by 2028. Creators and enterprises alike struggle with the time, cost, and technical barriers of consistent video production.
- **Revenue Model:** Freemium SaaS with tiered subscriptions (Pro, Team, Enterprise), PAYG API usage, and micro-transactions for premium AI generation credits (e.g., custom voice cloning, premium stock assets).
- **Key Differentiators:** True enterprise-grade collaboration, proprietary distributed FFmpeg rendering pipeline ensuring sub-second latency for previews, integrated multi-modal AI (text, voice, image, video), and the capability to generate perfectly lip-synced avatars and dynamic subtitles in one workflow.
- **Target Scale:** Architected to support 1M+ active users concurrently, rendering millions of videos daily with 99.99% uptime.
- **Competitive Advantage:** Significantly outpaces Weblock.ai through superior distributed rendering, granular team workspaces, deeper integrations with modern social APIs, and advanced programmatic hooks for agency bulk-generation.

## 2. Business Goals
- **Revenue Targets:** Achieve $5M ARR within 12 months of launch; scale to $50M ARR by Year 3.
- **User Growth Targets:** Acquire 100,000 active users in the first 6 months, scaling to 1M+ active users by Year 2.
- **Market Penetration Goals:** Capture 15% of the agency-level short-form video generation market within 18 months, heavily disrupting existing tools like Descript and Opus Clip.
- **Partnership Goals:** Secure strategic API partnerships with TikTok, Meta, and YouTube for native publishing and analytics integrations by Month 9.
- **Retention Targets:** Achieve a net revenue retention (NRR) of 125% and a monthly churn rate of under 3%.

## 3. Vision
- To become the global standard for AI-driven video content creation across all social platforms.
- To eliminate the technical barriers of video production, allowing ideas to go from concept to published video in under 60 seconds.
- To democratize high-end video production, giving solo creators the power of a full production studio.
- To establish a self-optimizing platform where AI suggests video structures based on real-time viral trends.
- To evolve into a comprehensive media ecosystem capable of programmatic, hyper-personalized video ad generation at scale.

## 4. Mission
- **Empowerment:** Empower storytellers to focus on creativity while AI handles the execution and technical heavy lifting.
- **Innovation:** Continuously integrate the latest generative AI research into a stable, user-friendly interface.
- **Quality:** Refuse to compromise on export quality, ensuring 4K rendering and perfectly synchronized multi-modal assets.
- **Efficiency:** Drastically reduce the time-to-market for digital content from days to minutes.
- **Collaboration:** Build tools that bring teams together, fostering seamless review, approval, and iteration cycles.

## 5. Target Audience
- **Content Creators:** Solo influencers and YouTubers needing high-volume daily output to maintain algorithm relevance.
- **Marketing Agencies:** Mid-to-large agencies managing dozens of client accounts and requiring bulk content generation with brand consistency.
- **Enterprises:** Corporate marketing teams needing localized, compliant, and scalable video communication and ad campaigns.
- **Educators & Course Creators:** Professionals turning long-form lectures into digestible, highly engaging micro-learning shorts.
- **E-commerce Brands:** D2C brands requiring rapid iteration of product showcase videos for A/B testing on TikTok and Meta ads.

## 6. User Personas

1. **Alex "The Hustler" Mercer (Content Creator)**
   - **Age:** 24 | **Role:** Solo YouTuber & TikToker
   - **Goals:** Upload 3-5 high-quality Shorts/Reels daily to maximize algorithmic reach.
   - **Frustrations:** Spending 4 hours manually cutting long videos and adding subtitles.
   - **Tech Proficiency:** High (Premiere Pro, CapCut).
   - **Willingness to Pay:** $30/month.
   - **Usage Patterns:** Daily, late-night editing, mobile-first previewing.

2. **Sarah "The Director" Jenkins (Agency Owner)**
   - **Age:** 35 | **Role:** Founder of a Social Media Marketing Agency
   - **Goals:** Manage 20+ brand accounts, maintaining strict brand guidelines while keeping costs low.
   - **Frustrations:** Disjointed workflows across Canva, Descript, and Premiere; client approval nightmares.
   - **Tech Proficiency:** Moderate to High.
   - **Willingness to Pay:** $200-$500/month for team plans.
   - **Usage Patterns:** Weekdays, bulk rendering, team comment resolution.

3. **David "The Optimizer" Chen (E-commerce Marketer)**
   - **Age:** 29 | **Role:** Performance Marketer for D2C Brand
   - **Goals:** Rapidly test 50 video ad variations per week to find winning ROAS creatives.
   - **Frustrations:** Waiting days for video editors to make minor text or hook changes to ads.
   - **Tech Proficiency:** Moderate (Data-focused).
   - **Willingness to Pay:** $150/month.
   - **Usage Patterns:** Programmatic generation via templates, high reliance on analytics.

4. **Elena "The Educator" Rodriguez (Course Creator)**
   - **Age:** 42 | **Role:** Online Instructor
   - **Goals:** Repurpose 1-hour Zoom lectures into engaging 60-second educational snippets.
   - **Frustrations:** Has no video editing skills; finds existing tools too complicated or low quality.
   - **Tech Proficiency:** Low to Moderate.
   - **Willingness to Pay:** $50/month.
   - **Usage Patterns:** Bi-weekly batch creation, relies heavily on AI script extraction.

5. **Marcus "The Developer" Johnson (Enterprise Integrator)**
   - **Age:** 31 | **Role:** Backend Software Engineer
   - **Goals:** Automate customized video generation for a real-estate platform using user data.
   - **Frustrations:** APIs of existing video tools are slow, unreliable, and lack proper webhooks.
   - **Tech Proficiency:** Expert.
   - **Willingness to Pay:** Pay-as-you-go ($1000+/month based on volume).
   - **Usage Patterns:** 100% API usage, relies on documentation and reliability.

6. **Jessica "The Reviewer" Smith (Client Stakeholder)**
   - **Age:** 45 | **Role:** Brand Manager (Agency Client)
   - **Goals:** Quickly review and approve agency-generated content before it goes live.
   - **Frustrations:** Confusing feedback loops via email and scattered video links.
   - **Tech Proficiency:** Low.
   - **Willingness to Pay:** Free (Invited by Agency).
   - **Usage Patterns:** Click links, leave comments, click "Approve".

## 7. Problems
1. Existing AI video tools produce generic, easily identifiable "AI-generated" content.
2. Rendering times for high-quality, heavily layered videos in cloud editors are unacceptably slow.
3. Repurposing long-form content often misses the contextual "hook," resulting in low retention.
4. Multilingual dubbing tools fail to match lip movements, breaking the illusion for viewers.
5. Agency teams lack a unified workspace for drafting, rendering, and getting client approvals.
6. Managing brand assets (fonts, colors, logos) across multiple editors and projects is error-prone.
7. Automated subtitles often misspell niche jargon and require tedious manual correction.
8. Stock footage integrations are generic; users cannot dynamically generate highly specific B-roll.
9. Exporting formats for different platforms (TikTok vs. YouTube Shorts) requires manual aspect ratio and safe-zone adjustments.
10. D2C marketers cannot programmatically inject variables (e.g., price, discount) into video ad templates at scale.

## 8. Solutions
1. Advanced AI parameter tuning and proprietary templates that emulate human-edited pacing and jump-cuts.
2. A distributed FFmpeg cluster and edge-caching architecture to reduce render times by 70%.
3. An LLM-powered context engine that analyzes transcripts to find high-retention peaks for automatic clip extraction.
4. Deep-learning visual lip-sync technology integrated directly into the rendering pipeline.
5. Role-based access control (RBAC) team workspaces with timestamped, frame-accurate commenting and approval workflows.
6. Centralized Brand Kits that automatically apply styling to AI-generated subtitles and overlays.
7. Custom dictionary support and contextual spell-check for the AI transcription engine.
8. Integrated Stable Diffusion/Midjourney APIs to generate custom B-roll perfectly matched to script segments on the fly.
9. One-click magic resize with AI-driven subject tracking and built-in UI safe-zone overlays for all major platforms.
10. A headless template engine with a robust REST API for variable injection and bulk rendering.

## 9. Competitive Analysis

| Feature / Platform | Tasma (Proposed) | Weblock.ai | CapCut | Canva Video | InVideo | Pictory | Synthesia | Descript | Opus Clip |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Enterprise Scale (1M+ Users)** | Yes | No | Yes | Yes | Partial | Partial | Partial | Yes | No |
| **AI B-Roll Generation** | Yes (Native GenAI) | No | No | Partial | No | No | No | No | No |
| **Distributed FFmpeg Engine** | Yes | No | Native App | Cloud | Cloud | Cloud | Cloud | Cloud/Native| Cloud |
| **Programmatic API (Bulk)** | Yes | No | No | No | Partial | No | Yes | No | No |
| **Team Workspaces & Approvals**| Yes | No | Partial | Yes | Partial | Partial | Yes | Yes | No |
| **Advanced Auto-Hooks** | Yes | Partial | No | No | No | Yes | No | No | Yes |
| **UI Safe Zones (TikTok/YT)** | Yes | Yes | Yes | No | Partial | No | No | No | Partial |
| **Perfect Lip-Sync Dubbing** | Yes | No | No | No | No | No | Yes | Partial | No |

## 10. Functional Requirements

### Video Editor
- Frame-accurate multi-track timeline (Video, Audio, Text, Effects).
- Draggable and resizable clips with magnetic snapping.
- Platform-specific safe zone overlays (TikTok, IG, YT Shorts).
- Hardware-accelerated WebGL playback for real-time 1080p preview without buffering.
- Customizable keyframe animations for scale, position, and opacity.

### AI Script Generator
- GPT-4o powered script drafting based on simple prompts.
- Viral hook generation specifically trained on top-performing TikTok/Shorts data.
- Tone and style selection (e.g., educational, aggressive, storytelling).
- Storyboard view linking script lines to visual segments.
- Script-to-timeline automatic generation.

### AI Voice Generator
- 100+ hyper-realistic AI voices with emotion and pacing control.
- Voice cloning capability (requiring 30s audio sample and legal consent check).
- Multi-language support (40+ languages).
- Auto-sync audio with timeline video elements.
- Granular pronunciation dictionary for brand names.

### AI Subtitle Generator
- Whisper-based transcription with >99% accuracy.
- Dynamic word-by-word highlight animations (Karaoke style).
- Auto-emoji insertion based on sentence context.
- Bulk translation to multiple languages.
- Brand kit integration for automatic font/color application.

### AI Image & Video Generator (B-Roll)
- Prompt-to-image integration for custom static B-roll.
- Prompt-to-video integration (e.g., Runway/Sora API equivalents) for dynamic B-roll.
- Automatic insertion of generated assets based on script context.
- Style consistency enforcement across generated assets.

### FFmpeg Rendering Pipeline
- Distributed microservices architecture for rendering.
- Support for up to 4K 60fps export.
- Job queuing system with priority queues for premium users.
- Server-side caching of pre-rendered layers for faster re-exports.

### Template Engine
- Pre-built viral templates (e.g., "Reddit Story", "Top 5", "Podcast Clip").
- Ability for users to save their own timelines as custom templates.
- Variable injection syntax (`{{variable_name}}`) for programmatic generation.

### Asset Library
- Integration with premium stock providers (Storyblocks/Getty).
- Searchable user upload library with auto-tagging.
- Centralized Brand Kits (Logos, Color Palettes, Fonts).

### Collaboration System & Team Workspace
- Frame-specific commenting on video previews.
- Role-based access control (Admin, Editor, Reviewer).
- Audit logs for team actions.
- Client share links with password protection and expiration.

### Analytics Dashboard
- Post-publish tracking (views, engagement) via social APIs.
- Credit usage and storage monitoring.
- Top-performing template tracking.

### User Management, Billing & Subscriptions
- OAuth integration (Google, Apple, Microsoft).
- Stripe integration for tiered subscriptions and PAYG credits.
- Automated invoice generation and tax compliance.
- Usage-based throttling and alert notifications.

### Notification System
- In-app and email alerts for render completion.
- Mention notifications in team comments.
- Daily/Weekly performance summaries.

### Export System
- Direct API publishing to YouTube, TikTok, Instagram, Facebook.
- Scheduled publishing calendar.
- Download as MP4 or project file export (Premiere XML).

## 11. Non-functional Requirements
- **Performance:** 
  - UI load time < 2 seconds.
  - Video playback latency < 100ms.
  - Render time: < 30 seconds for a 60-second 1080p video.
- **Scalability:** 
  - Horizontal scaling of FFmpeg workers via Kubernetes Event-driven Autoscaling (KEDA) based on queue length.
  - Support 1M+ MAU and handle 10,000 concurrent render jobs.
- **Reliability:** 
  - 99.99% uptime SLA for Enterprise users.
  - Multi-region database replication and active-active failover.
- **Security:** 
  - SOC2 Type II compliance.
  - End-to-end encryption for stored assets (AES-256).
  - Regular automated OWASP top 10 vulnerability scanning.
- **Accessibility:** 
  - WCAG 2.1 AA compliance for the web platform.
  - Full keyboard navigation and screen reader support.
- **Internationalization (i18n):** 
  - UI translated into English, Spanish, French, German, Mandarin, and Japanese.
  - RTL text support for Arabic/Hebrew in subtitles.
- **Observability:** 
  - Distributed tracing via OpenTelemetry.
  - Centralized logging via ELK stack and alerting via PagerDuty.

## 12. User Stories
1. **As a** Content Creator, **I want** to upload a YouTube link, **so that** the AI can automatically extract the 3 best clips for Shorts.
2. **As a** Marketer, **I want** to select a specific tone for my AI voiceover, **so that** the video matches my brand's energetic personality.
3. **As an** Editor, **I want** the timeline to automatically snap clips together, **so that** I don't have blank black frames in my export.
4. **As an** Agency Owner, **I want** to invite clients as 'Reviewers', **so that** they can leave comments but not edit the timeline.
5. **As a** Creator, **I want** to toggle UI safe zones on the preview, **so that** my subtitles aren't blocked by the TikTok interface.
6. **As a** Marketer, **I want** to upload my custom font, **so that** my generated subtitles match my brand guidelines.
7. **As an** Enterprise User, **I want** to trigger a video render via REST API, **so that** I can automate ad creation.
8. **As a** User, **I want** to type a prompt to generate background B-roll, **so that** I don't have to search through generic stock footage.
9. **As a** Creator, **I want** the AI to automatically highlight spoken words in subtitles, **so that** my videos are more engaging.
10. **As a** User, **I want** to export directly to my connected TikTok account, **so that** I save time downloading and re-uploading.
11. **As a** Creator, **I want** to clone my own voice, **so that** the AI can generate narration that sounds exactly like me.
12. **As an** Editor, **I want** to use keyboard shortcuts for splitting clips, **so that** I can edit faster.
13. **As a** Marketer, **I want** to A/B test 5 different AI hooks for one video, **so that** I can maximize retention.
14. **As a** User, **I want** to see my AI credit balance on the dashboard, **so that** I know when to upgrade.
15. **As an** Agency Owner, **I want** separate workspaces for each client, **so that** assets and videos are kept segregated.
16. **As a** User, **I want** the system to automatically remove silences from my uploaded audio, **so that** the pacing is fast and engaging.
17. **As a** Creator, **I want** to add sound effects that automatically sync to subtitle animations, **so that** the video feels dynamic.
18. **As a** User, **I want** to translate my finished video's audio and text into Spanish with one click, **so that** I can reach a global audience.
19. **As a** Reviewer, **I want** to click on a timeline frame and type a comment, **so that** my feedback is exactly tied to a specific moment.
20. **As an** Admin, **I want** to enforce Single Sign-On (SSO), **so that** my corporate team can securely access the platform.
21. **As a** Creator, **I want** to use a "Reddit Story" template, **so that** I can generate a video by just pasting a Reddit URL.
22. **As a** User, **I want** my renders to continue in the background, **so that** I can start working on the next video immediately.
23. **As a** Marketer, **I want** to see view metrics for published videos in Tasma, **so that** I don't have to check 4 different apps.
24. **As a** Creator, **I want** an AI assistant to suggest trending audio tracks, **so that** my videos have a higher chance of going viral.
25. **As a** User, **I want** to recover deleted projects from a trash bin within 30 days, **so that** I don't lose accidental deletions.

## 13. Acceptance Criteria (Top 10 Critical Features)
1. **AI Video Clip Extraction:** 
   - **AC1:** Accepts valid YouTube URLs or MP4 uploads up to 2 hours.
   - **AC2:** Returns minimum 3 clips ranked by a "Virality Score".
   - **AC3:** Clips must be automatically cropped to 9:16 keeping the speaker centered.
2. **Word-by-Word Subtitle Animation:** 
   - **AC1:** Text appears synchronously with the audio within a 50ms tolerance.
   - **AC2:** Active word must change color as defined by the user's styling.
   - **AC3:** Supports manual correction of transcript without losing animation timing.
3. **Voice Cloning Integration:** 
   - **AC1:** Requires the user to read a specific legal disclaimer paragraph to prevent deepfakes.
   - **AC2:** Voice generation succeeds within 2 minutes of sample approval.
   - **AC3:** Output voice matches pitch and timbre of the original source.
4. **Distributed Rendering Engine:** 
   - **AC1:** A 60-second video with 5 layers (Video, Audio, Subtitles, Overlay, Image) renders in under 30 seconds.
   - **AC2:** If a render node fails, the job must automatically retry on a new node without user intervention.
5. **Programmatic Template Generation (API):** 
   - **AC1:** Endpoint accepts JSON payload with dynamic text, image URLs, and template ID.
   - **AC2:** Returns a 202 Accepted status and a job ID.
   - **AC3:** Webhook fires with the final MP4 URL upon completion.
6. **Frame-Accurate Team Commenting:** 
   - **AC1:** Comments lock exactly to the timecode where the user paused.
   - **AC2:** Clicking a comment moves the playhead to that exact timecode.
   - **AC3:** Editors can mark comments as "Resolved".
7. **Silence Removal (Jump-cut generator):** 
   - **AC1:** Detects audio below -40dB lasting longer than 0.5s.
   - **AC2:** Automatically cuts the video track and ripples the timeline to close gaps.
8. **UI Safe Zone Overlays:** 
   - **AC1:** Editor UI contains a toggle for TikTok, Reels, and YT Shorts safe zones.
   - **AC2:** Elements placed outside safe zones turn red or show a warning tooltip.
9. **AI B-Roll Generation:** 
   - **AC1:** Accepts a text prompt and generates a 4-second looping video within 15 seconds.
   - **AC2:** Generated asset automatically drops into the active playhead position on the timeline.
10. **Direct Social Publishing:** 
    - **AC1:** OAuth flow successfully connects and refreshes tokens for TikTok and YouTube.
    - **AC2:** Videos publish directly to the connected account as "Draft" or "Public" based on user selection.

## 14. Edge Cases
1. **Video Processing:** User uploads a corrupt MP4 file. (System must detect early and show clear error message).
2. **Video Processing:** Source video is 4K 120fps but target export is 1080p 30fps. (Downsampling must handle frame-pacing without jitter).
3. **AI Generation:** Transcript contains highly complex domain-specific acronyms. (Fallback to phonetic spelling, allow user dictionary override).
4. **AI Generation:** The requested AI B-Roll prompt violates safety guidelines. (Fail gracefully with specific TOS violation message, do not deduct credits).
5. **AI Generation:** Voice cloning sample contains heavy background noise. (Reject sample prior to model training, prompt user for clean audio).
6. **Collaboration:** Two editors attempt to modify the same text layer simultaneously. (Implement operational transformation or lock the layer for the first active user).
7. **Collaboration:** A reviewer comments on a clip that is subsequently deleted by the editor. (Orphaned comments remain in a "Deleted Items" thread with a warning).
8. **Billing:** User runs out of AI credits mid-generation of a script. (Save partial script, pause job, prompt for top-up).
9. **Billing:** Enterprise user's API keys are compromised and hit rate limits. (Auto-block anomalous spikes, alert admin, rotate keys).
10. **Export:** Target social platform API is down during a scheduled publish. (Queue job, implement exponential backoff retry for 24 hours).
11. **Template Engine:** A dynamic variable string is too long for the designated text box in API generation. (Implement auto-font-scaling or text truncation with ellipsis).
12. **Subtitles:** Speaker talks too fast, causing word highlights to strobe unreadably. (Group words into chunks if WPM exceeds a set threshold).
13. **Audio:** Uploaded video has no audio track. (Bypass transcript generation, alert user, enable manual subtitle mode).
14. **Safe Zones:** User switches target aspect ratio from 9:16 to 16:9 late in the edit. (Prompt user to auto-scale assets or pad with blurred background).
15. **Localization:** Subtitles translated to German are 30% longer than English audio. (Adjust text duration on screen or dynamically shrink font size to fit constraints).

## 15. User Journey

### Journey 1: New User Onboarding
- **Trigger:** User lands on homepage and clicks "Start for Free".
- **Steps:** OAuth via Google -> Onboarding questionnaire (Role, Goals) -> Interactive 3-step tooltip tutorial on the main editor -> Prompts user to generate first script.
- **Emotion:** Curiosity -> Clarity -> Excitement.

### Journey 2: Creating First Video (End-to-End)
- **Trigger:** Clicks "New Project".
- **Steps:** Selects "AI Script Writer" -> Types "Benefits of Keto Diet" -> Approves script -> Selects AI Voice "Energetic Male" -> Clicks "Generate Video" -> System builds timeline with voice, subtitles, and stock B-Roll -> User previews -> Clicks Export.
- **Emotion:** Empowered by the speed of creation.

### Journey 3: Repurposing Long-Form Content
- **Trigger:** User wants to make shorts from a 1-hour podcast.
- **Steps:** Pastes YouTube link -> Waits 2 minutes for processing -> System presents 5 "Viral Clips" with scores -> User selects top 2 -> Drops into editor to tweak subtitle colors -> Exports.
- **Emotion:** Relief from avoiding manual scrubbing.

### Journey 4: Team Collaboration (Agency)
- **Trigger:** Agency needs client approval on 5 videos.
- **Steps:** Editor finishes renders -> Generates Review Link -> Emails to Client -> Client opens link (no login required) -> Clicks timeline at 0:15, types "Make logo bigger" -> Editor gets in-app ping -> Editor adjusts logo, clicks "Resolve" -> Client approves.
- **Emotion:** Satisfaction with organized, centralized feedback.

### Journey 5: API Bulk Generation (Enterprise)
- **Trigger:** Marketing system needs localized ads for 50 cities.
- **Steps:** Dev creates a Tasma Template -> Dev writes script hitting Tasma API with JSON array of 50 city names -> Tasma spins up 50 render workers -> Webhooks return 50 MP4 URLs -> Ads auto-deployed.
- **Emotion:** Confidence in platform scalability.

## 16. User Flow

```mermaid
flowchart TD
    %% Registration Flow
    subgraph Registration
    A[Landing Page] --> B{Choose Auth}
    B -->|Google| C[OAuth Auth]
    B -->|Email| D[Email Verification]
    C --> E[Onboarding Questionnaire]
    D --> E
    E --> F[Dashboard]
    end

    %% Video Creation Flow
    subgraph Video Creation
    F --> G[Click 'New Project']
    G --> H{Choose Input Type}
    H -->|Text Prompt| I[AI Script Gen]
    H -->|Long Video| J[AI Clip Extractor]
    H -->|Blank| K[Manual Editor]
    I --> L[Select Voice & Style]
    L --> M[Auto-Assemble Timeline]
    J --> M
    K --> M
    M --> N[Edit & Refine (Safe Zones, B-Roll)]
    end

    %% Export Flow
    subgraph Export & Publish
    N --> O[Click 'Export']
    O --> P{Choose Destination}
    P -->|Download MP4| Q[Render Engine]
    P -->|Social Connect| R[OAuth Social Acct]
    Q --> S[Download File]
    R --> T[Schedule/Publish via API]
    T --> U[Analytics Dashboard]
    end
```

## 17. Success Metrics (AARRR Framework)
- **Acquisition:**
  - Cost Per Acquisition (CPA) < $15.
  - Organic Search Traffic growth (+20% MoM).
  - Landing Page Conversion Rate > 8%.
- **Activation:**
  - Time to First Value (TTFV) < 3 minutes.
  - Percentage of new users who export at least 1 video within 24 hours > 40%.
- **Retention:**
  - Day 1, Day 7, Day 30 Retention Rates (Targeting 60%, 40%, 25%).
  - Average sessions per user per week > 3.
- **Revenue:**
  - Monthly Recurring Revenue (MRR) Growth.
  - Average Revenue Per User (ARPU) > $25.
  - Free-to-Paid Conversion Rate > 5%.
- **Referral:**
  - Net Promoter Score (NPS) > 40.
  - Number of users acquired via 'Made with Tasma' watermarks on free tier.
  - Viral Coefficient (K-factor) > 1.1 for team invites.

## 18. Future Roadmap

### Phase 1: MVP (Months 1-3)
- Core Video Editor with WebGL timeline.
- Basic AI Script to Voice generation.
- Word-by-word AI subtitles.
- Cloud rendering for MP4 export.
- Single user accounts (Free + Pro tiers).

### Phase 2: Growth (Months 4-6)
- AI Clip Extractor (Long to Short).
- UI Safe Zone Overlays.
- Social media direct publishing (TikTok, YouTube APIs).
- Integration of custom fonts and Brand Kits.

### Phase 3: Scale (Months 7-12)
- Team Workspaces & commenting workflows.
- Distributed rendering optimization for sub-30s exports.
- AI Video/Image generation (Dynamic B-Roll).
- API for programmatic bulk generation.

### Phase 4: Enterprise & Ecosystem (Months 13-18)
- Real-time perfect lip-sync multi-lingual dubbing.
- Advanced analytics & A/B testing dashboard.
- SSO, SOC2 compliance, audit logs.
- Marketplace for custom templates and AI voices.
