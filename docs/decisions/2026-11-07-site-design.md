# LiwanOS marketing site — decisions

Date: 2026-11-07. Status: owner decisions recorded in session; no code written. This document
records approved requirements only. It does not claim any implementation exists.

> **Visual identity superseded (owner, 2026-11-08).** Colours, type, corners, buttons and
> gradients are defined only in [`docs/brand.md`](../brand.md). Wherever this document names
> lavender (`#7843c6`, `#c2aae5`), sand backgrounds or bands, brown, gradients or fully round
> buttons, read the matching value from `docs/brand.md` instead: brand ink for lavender, the
> muted grey surface for sand backgrounds, sand for Sadu details only. Layout, copy, structure and
> every other decision here still apply.

## 1. Intent

The landing page, product pages and pricing page move out of the product repository into an
independent public site. The product (`apps/web`, Odoo, control plane) stays the only place
where accounts, trials, payment and customer data live.

## 1A. Alignment with the site contract (owner, 2026-11-07) — overrides anything below

The product session's contract `.scratch/release1-launch/site-contract.md` (webvue repository)
is the boundary between the site and the product, and its claims register (§6) decides what
the site may say. Where this document disagrees, the contract wins:

- **Repository public, named `liwan-website`** (owner, 2026-11-07, overriding the contract's
  "private until the name is reserved"; the owner accepted that the name becomes public before
  the trademark check). The contract's §5 must be updated by the product session to match.
- **One form: «تواصل معنا» on `/contact`,** posting straight to
  `POST https://app.liwanos.com/api/v1/public/contact` with a Turnstile token; the site stores
  nothing (replaces decision 4 "no forms"). A WhatsApp click-to-chat button may sit beside it.
- **Prices from `GET https://app.liwanos.com/api/v1/public/pricing`** (schema_version 1),
  rendered at request time with the site's own last-good cache, or hidden with «تواصل معنا» on
  failure; never hardcoded. Built by the product session (package P4c). This replaces §3, §4
  and the build-time/webhook design; the plan's PR1 and PR2 are dropped.
- **Pages:** `/`, `/product`, `/pricing`, `/security`, `/contact`, `/terms`, `/privacy`,
  `/refund`, `/dpa`, and the same under `/en`. Calls to action go to
  `https://app.liwanos.com/register?lang=ar` and `/login`, passing `utm_*`.
- **Never mention tax, VAT or ZATCA** anywhere (replaces decision 9).
- **Claims follow the register:**
  - Shown as available: CRM; customer messages with WhatsApp **and TikTok** (TikTok is in the
    product since PR #408; owner 2026-11-07, the register still says "soon" and must be
    updated by the product session); the free base: tasks, team chat, documents, meetings,
    operations and approvals, the AI assistant.
  - Never shown, not even as «قريبًا»: projects, HR and payroll, finance, appointments, Saudi
    e-invoicing.
  - «قريبًا» only: conversation becomes an opportunity, quote with a pay link, AI reply
    suggestion and conversation summary, Saudi hosting (hidden until true), two-step sign-in.
- **Effect on approved sections:** the hero ring holds the seven shown applications (العملاء،
  الرسائل، الاجتماعات، المستندات، العمليات، المهام، المحادثات) with Liwan AI in the centre and
  no coming-soon apps; the «before» scene has eight windows and the stat cards count from ٨;
  the applications section lists five free apps (adds tasks and team chat) and drops the «قادم
  إلى ليوان» block; the "every step" map drops the invoice step; the AI section adds the soon
  tab «يقترح ردًا ويلخّص المحادثة».
- **Claims to add to the register before use** (the owner passes them to the product
  session): «قاعدة بيانات خاصة بشركتك», «كل تطبيقاتك تقرأ من مصدر واحد», «لا باقات، ولا
  ميزات مقفلة», the AI capabilities (settings agent, semantic search, answers from dashboards,
  how-to help), and the soon AI items (form drafts, reports, PDF reading, Excel import).
- **Where these files live:** this spec and the plan belong to the site repository and move
  there when it is created; the site session does not edit the product repository.

## 2. Decisions (owner, 2026-11-07)

1. **Separate repository**, public on GitHub, no shared code, packages or CI with this repo.
   Brand assets (colors, fonts, Sadu pattern) are copied as files; `packages/ui` is not imported
   (UI1).
2. **Technology: Astro**, static output, Arabic (`ar`) default and RTL-first.
3. **Hosting: OVH through Openship**, as a new project. The existing OVH "WebVue" WordPress
   project is not touched.
4. **No forms and no personal data on the site.** Sign-up, sign-in and the trial happen in the
   product on its own host (`app.<domain>/join`, `/login`). Contact is a WhatsApp link and a
   `mailto:` link. Nothing a visitor types is stored on OVH.
5. **Live prices** come from a new anonymous, read-only control-plane endpoint, read at **build
   time**. The control plane's public address already exists.
6. **Price changes rebuild the site** through a webhook fired when the vendor publishes a price
   in `apps/vendor-admin`. If the endpoint is down during a build, the build fails and the
   previous site keeps serving.
7. **Attribution**: UTM parameters are passed on every link to `/join`; the product stores them
   with the new account.
8. **Tracking only after consent.** A cookie consent banner gates GTM/GA4 and ad pixels
   (PDPL). Third-party scripts run off the main thread (Partytown).
9. Prices are shown **without VAT**, stated on the pricing page.
10. **Hero (approved by the owner, 2026-11-07).** See §2A.

**Copy trim (owner, 2026-11-07):** the owner found the home page too wordy; about 40% of the
words were cut (section leads, audience tags, card descriptions, panel and step explanations,
FAQ down to four short questions). Where the wording in sections 2A–2I below differs from the
built components in `src/components/home/`, the built wording is current.

**Naming (owner, 2026-11-07):** the product is «منصة ليوان» in the header, footer, page titles,
sharing cards and sentences; the copyright keeps «© ليوان». The assistant is «ليوان AI», part of
the platform and never called an application. Every application is «تطبيق …» (for example
«تطبيق إدارة العملاء»), taken from `src/content/apps`. This overrides the bare app names
(«العملاء», «الرسائل») used in the sections below.

**Numbers (owner, 2026-11-08):** every number on the site uses Latin digits (0–9), Arabic pages
included; Arabic-Indic digits in the sections below are superseded.

## 2A. Approved hero

Copy (owner, revised 2026-11-07): headline «كل أعمالك بنظام ذكي واحد» with the gradient on
«بنظام ذكي واحد»; sub-line «تطبيقاتك كلها في ليوان واحد.»; primary action «ابدأ تجربة 14 يومًا» with
«بدون بطاقة ائتمان» under it. No before/after toggle: the scene loops on its own.

**Before (≈2.6 s).** Twelve small system windows scattered with slight rotation and a gentle
1.5 px float: the eleven applications plus an AI assistant. Each window has a title bar with a
generic system name (never a competitor's name), a username field, a password field whose dots
keep typing, a «دخول» button and a «اشتراك» tag.

**With Liwan (≈7.5 s).** Window content fades out first (0.15 s); each window shrinks to a
circle and moves to its ring seat (0.75 s, ease-in-out curve, 0.02 s stagger); it takes its
colour only on arrival, so no empty coloured rectangle is ever shown. Returning to «before»
reverses the order: colour clears first, content appears only after the window is full size.
The official mark (`MARK_ARCHES` and the four corner triangles from
`packages/ui/app/utils/brandMark.ts`, copied unchanged; only scaled) draws itself in the
centre, then the triangles appear and pulse softly.

- **Liwan AI sits inside the Sadu,** in place of the stepped diamond: a sand circle with the
  approved AI glyph (four-point star with a small star) and a soft halo. No text inside the
  circle; the name appears in the legend «في القلب: ليوان AI».
- **Ring of eleven applications,** clockwise from the top, released and coming soon
  alternating: العملاء ● · المشاريع ○ · الرسائل ● · المهام ○ · الاجتماعات ● · الموارد
  البشرية ○ · المالية ○ · المستندات ● · المحادثات ○ · العمليات ● · المواعيد ○
  (● released at release 1: filled lavender with a sand glyph; ○ coming soon: dashed outline).
  The set and each status come from `content/apps` (`status` field).
- **Lines into the triangles:** each application has a curved line ending at the base of the
  Sadu triangle in its quadrant (released apps stronger, coming-soon fainter); pulses travel
  only from released apps; a short line joins each triangle's tip to the AI circle. Every
  triangle receives at least one released app.
- **Labels never crossed by a line:** apps whose line leaves downward (top of the ring) carry
  their name above the circle; the others below.
- **Stat cards under the scene:** three cards (systems, logins, subscriptions) count down from
  ١٢ to ١ when the scene turns to Liwan and back up on return; warning tint before, brand
  lavender after (`#7843c6`, `#c2aae5` in dark mode). The legend (filled, dashed, sand
  circle) shows only in the Liwan state.

Animation uses `transform`, `opacity` and SVG stroke offsets only, starts when the hero enters
the viewport, and is static (final Liwan state) under reduced motion. Brand colours are the
fixed tokens of DESIGN.md (lavender, sand, ink, brown); icons in production are the product's
Lucide set or a dedicated SVG set, not the preview's icon font.

**Owner revisions, 2026-11-07 (built, these win over the text above):**

- «Before»: each system is a small card with an icon and a generic system name only (no
  sign-in form), joined to its neighbours by dashed links cut in the middle by an amber ✕.
- «With Liwan» grows from the centre: the Liwan AI circle, lines out to the triangle tips, the
  triangles, the arches opening outward (no stroke drawing), the lines out to the apps, then
  each app lights up when its line reaches it, then the names; pulses flow inward.
- Colours: apps are outlined circles with no fill, ring and icon in lavender; Liwan AI is the
  sand circle with a lavender icon and a soft sand halo; ring lines are light grey and dashed, and each enters its
  triangle through the middle of the triangle's base.
- The header carries a light/dark toggle; the page follows the device until the visitor picks.

## 2B. Approved trust strip (home section 2)

One row directly under the hero: a sand band (`#eadfc8`, text and glyphs in brown `#6b4e2e`)
edged top and bottom by the official slim Sadu band (`sadu-band-slim.svg`), items separated by
the Sadu dot. Platform-level claims only (not an application feature, not "Arabic", which every
competitor offers). Owner wording, 2026-11-07:

In this order (first item on the right, RTL):

| Desktop | Mobile | Basis |
| --- | --- | --- |
| مستضاف في السعودية | في السعودية | Production on Oracle Cloud Jeddah: **hidden until production runs there** |
| كل تطبيقاتك تقرأ من مصدر واحد | مصدر واحد | One connected data model (product definition) |
| لا باقات، ولا ميزات مقفلة | بلا باقات | Applications sold whole, no internal caps (pricing decision 2026-10-24) |
| قاعدة بيانات خاصة بشركتك | قاعدة خاصة | Database per tenant (AGENTS.md) |

The strip stays one row at every width; on narrow screens each item switches to its mobile
wording. The hosting item carries a content flag so it is published only once true; the strip
must not say that data never leaves the Kingdom, because Liwan AI may send consented data to an
external model provider.

## 2C. Approved AI section (home section 3)

Two columns: text on the right, an animated chat on the left (stacked on mobile, text first);
the chat stretches to the height of the text column.

**Text column.** Eyebrow «ليوان AI»; heading «ذكاء واحد يعرف شركتك كلها»; line «اكتب ما تريد
كما تقوله لزميلك، ويعمل عبر تطبيقاتك بصلاحياتك أنت.» Then the capabilities as tabs in two
groups, each group under a coloured label: «متاح الآن» (lavender) and «قريبًا» (amber). A
coming-soon tab has a dashed icon, an amber «قريبًا» pill, and lights amber when shown. The
playing tab is highlighted with a thin progress bar; clicking any tab plays its scene at once.
Trust line: «يرى ما تراه فقط» and «لا يغيّر شيئًا إلا بموافقتك».

| Tab | Status | Basis in code (2026-11-07) |
| --- | --- | --- |
| يضبط إعداداتك | available | setup agent `core.setup` (`liwan_ai/models/setup_agent.py`): proposes current → new value with impact, applies only after approval; readiness check |
| يبحث في بياناتك | available | `ai.search_knowledge` over declared sources (CRM opportunity text, tasks) |
| يجيب ويقارن من كل تطبيقاتك | available, **comparison must be completed before publishing** | `crm.get_dashboard`, `crm.list_opportunities`, `meetings.list_my_meetings`, `operations.list_my_requests`; no period-comparison tool exists yet |
| يعلّمك النظام | available | help agent (LiwanOS guide) |
| يعبّئ النماذج | coming soon | draft-card mechanism exists (`AiDraftCard`), draft tools only in PMO today |
| يجهّز التقارير | coming soon | deferred in the AI agents spec §6.14 |
| يقرأ ملفات PDF | coming soon | chat attachments blocked until a platform malware scanner exists |
| يستورد من Excel | coming soon | import assistant planned (AI agents spec, "planned next") |

Customer messages have no AI tools today, so no example may claim the assistant reads or
writes customer messages. Web research is not planned and is not shown.

**Chat column.** App strip on top (العملاء، الاجتماعات، العمليات، المستندات، الإعدادات،
الدليل; المشاريع and المالية dashed). Empty state: the full official mark with «صباح الخير»
(the greeting follows the visitor's time of day in production) and «وش نقدر نسوي لك اليوم؟»;
it fades out when the request is sent. Composer: a «+» attachments button, the text, a send
button. Each scene: the visitor-like typing of a first word («اضبط»، «ابحث»، «وش»، «كيف»،
«أنشئ»، «جهّز»، «لخّص»، «استورد»), three suggestions appear above the composer with the tags of
the applications they use (coming-soon rows carry the amber pill), each highlighted in turn
while its applications light up in the strip with a faint grey dashed guide line; the first
suggestion is sent, then the answer appears with the source tag of each item and, for
coming-soon scenes, an amber «قريبًا» pill. File scenes press «+» first and show the attached
file in the composer. No divider lines inside answers. Examples and figures are illustrative
and labelled so.

## 2D. Approved applications section (home section 4, absorbs "included with every subscription")

Written for the buyer (owner decision 2026-11-07: every word in a design speaks to the customer
decision maker in outcome language; internal labels and caveats never appear in the design).

- Eyebrow «التطبيقات»; heading «ابدأ بما يحتاجه فريقك اليوم، وأضف التطبيقات مع نمو شركتك»; line «كل تطبيق
  تضيفه ينضم للنظام نفسه: دخول واحد، صلاحيات واحدة، ومساعد واحد يعرفه.»
- **Two large cards for the sold applications,** each with: app name, outcome headline, an
  audience tag, a real product screenshot, three benefit lines, the live price «… ر.س شهريًا»
  and «جرّبه ١٤ يومًا».
  - العملاء: «لا تضيع صفقة بعد اليوم» · «لفريق المبيعات ومديره» · كل فرصة بمرحلتها ومسؤولها،
    أمام عينك / تذكير بالمتابعة في وقتها / لوحة تُريك أين يقف فريقك.
  - رسائل العملاء: «كل محادثات عملائك في صندوق واحد» · «لخدمة العملاء والمبيعات» · واتساب
    وتيك توك في مكان واحد / فريقك يرد من صندوق مشترك، بلا جوال واحد يتناقلونه / حملات لعملائك
    الموافقين، وتقرير يريك سرعة رد فريقك. Campaigns and reports are part of the messages
    application (owner, 2026-11-07; the `inbox` tier of `deploy/catalog/solutions/platform_v4.json`
    grants every `inbox.*` feature). The pricing page must state the subscription limits
    (channels, outgoing messages, campaign recipients) and that Meta bills marketing messages to
    the company's own account. Campaigns and reports need a test on a real WhatsApp number before
    launch.
- **Sand band:** «ومعك من أول يوم، بلا تكلفة إضافية: تطبيقات يحتاجها كل فريق، تأتيك مع أي
  اشتراك», then three cards: الاجتماعات «اجتماعات تنتهي بقرارات تُنفَّذ»، المستندات «ملفات شركتك
  مرتبة، وكل موظف يرى ما يخصه»، العمليات «طلبات وموافقات بلا ملاحقة ولا أوراق».
- **Dashed block «قادم إلى ليوان»:** «يُضاف إلى حسابك حين يُطلق، بلا نقل بيانات ولا إعداد من
  جديد» with pills for المشاريع، المهام، الموارد البشرية، المالية، المحادثات، المواعيد.
- All of it is generated from `content/apps` (`status`, price joined from the public catalog by
  feature key). When more applications are sold, the same data can render as a filterable grid.

## 2E. Approved "every step has a place" section (home section 5, replaces the sector section)

Heading «شغلك كله له مكان في ليوان»; line «من أول رسالة إلى آخر ريال، لكل خطوة تطبيقها. وكل تطبيق
تضبطه على طريقة شركتك: مراحلك، وموافقاتك، وردودك.»

- A map of seven generic steps with one word each and the application under it: تواصل
  (الرسائل) ← رد تلقائي (الرسائل) ← فرصة بيع (العملاء) ← متابعة (العملاء) ← موافقة (العمليات)
  ← دفع (المدفوعات) ← فاتورة (المالية, «قريبًا»). No sector words, so every visitor sees their
  own company.
- The three configurable steps carry a gear and open, in turn, a panel showing what the company
  sets there: sales stages (+ مرحلة), approval steps (+ خطوة موافقة), and the out-of-hours
  auto reply switch.
- The section must not suggest one cross-application flow builder or automatic hand-over
  between applications: today each application is shaped in its own settings page
  (`/settings/apps/crm` stages, `/settings/apps/operations/processes`, the inbox working hours,
  auto messages and rules) and staff move work between applications. A cross-application flow
  editor (starting with linking a conversation to an opportunity) is a product idea for later;
  if built, the section can show steps being inserted between applications.
- The earlier sector section (six sectors with sector words) was dropped: too specific, visitors
  outside the shown sector read it as "not for me".

## 2F. Pricing glance (home section 6, approved)

Heading «سعر واضح، يكبر مع فريقك»; line «ابدأ مجانًا، وادفع فقط للتطبيقات التي تحتاجها
وللمستخدمين الذين تضيفهم.» Every number comes from the public pricing endpoint.

- Monthly / annual switch; annual labelled «شهران مجانًا» (annual = ten months).
- Sand card «الأساس — مجانًا، دائمًا، بلا مدة» (the word, never «٠», which reads as a dot in
  Arabic digits): up to 3 users, tasks and team chat, meetings and documents, requests and
  approvals, Liwan AI, **20 GB** (owner 2026-11-07; the contract's seed says 5 GB and the
  catalog must be updated by the product session).
- Calculator «احسب اشتراكك», every control starting at its minimum (no application ticked, 1
  user, 20 GB, no onboarding): tick CRM and customer messages; users 1–100 (first three free,
  each extra user priced; at 100 a «تواصل معنا» hint); storage from the free 20 GB, priced per
  10 GB a month (10 SAR per 10 GB, owner 2026-11-07 after briefly setting 5; the number comes
  from the catalog), the
  stepper adding 10 GB up to 100 GB and then 100 GB at a time (100, 200, 300 …), and going down
  by the same steps in reverse; the optional «إعداد مع فريقنا» (one-time, «نجهّز معك كل شيء خلال شهر، بزيارات لمقرّك
  أو اجتماعات», owner 2026-11-07). The total shows the recurring amount with a breakdown, the
  annual saving, and the one-time onboarding on its own line.
- Band «١٤ يومًا تجربة مجانية بلا بطاقة ← ثم ١٤ يومًا ضمان استرداد كامل من أول دفعة».
- No separate add-on cards (onboarding and storage live in the calculator). Fine print: Meta bills WhatsApp marketing messages to the company's own
  account. No tax wording anywhere.
- The three free users apply to every company, including those that buy paid applications;
  extra users start from the fourth (owner 2026-11-07).

## 2G. Approved "start" section (home section 7)

Eyebrow «البداية»; heading «تشتغل على ليوان من أول يوم»; line «ثلاث خطوات في جلسة واحدة، وليوان
AI معك في كل خطوة.» Three numbered steps joined by a line that fills as each completes, each
with a small live mock:

1. «سجّل شركتك» — «اسم شركتك وجوالك، وتبدأ تجربتك فورًا بلا بطاقة.» (a two-field form and
   «ابدأ تجربتي»).
2. «جهّزها على طريقتك» — «اربط رقم واتساب، واختر ما يناسب نشاطك.» (a checklist: company
   details, WhatsApp number, sales stages, with a Liwan AI note «جهّزت لك مراحل تناسب نشاطك»).
3. «ادعُ فريقك» — «كل واحد يدخل بصلاحياته، ويبدأ الشغل.» (three people join with role tags).

Footer: «جرّب ١٤ يومًا مجانًا» and «تفضّل أن نجهّزه معك؟ إعداد مع فريقنا». Basis: release-1
setup wizard with the AI agent, WhatsApp via Embedded Signup or manual credentials, invitations
(PR #411). «في جلسة واحدة» is a goal from the pricing design and must be measured before launch.

## 2H. Approved FAQ (home section 8)

Eyebrow «أسئلة شائعة», heading «قبل أن تبدأ». One column inside one frame, rows of equal height
with hairline dividers, one answer open at a time (the first open by default). Questions and
answers, all from the release-1 decisions and the contract:

1. هل أحتاج بطاقة ائتمان لأبدأ؟ — لا. تجرّب ١٤ يومًا كاملة بكل التطبيقات، بلا بطاقة ولا التزام.
2. ماذا يحدث بعد انتهاء التجربة؟ — تبقى شركتك على الأساس المجاني دائمًا، ببياناتها كاملة.
   والتطبيقات المدفوعة تبقى بياناتها للعرض والتصدير حتى تشترك فيها.
3. هل أسترجع مبلغي إن لم يناسبني؟ — نعم. نعيد لك المبلغ كاملًا خلال ١٤ يومًا من أول دفعة، في
   الاشتراك الشهري والسنوي.
4. هل أستطيع الإلغاء متى شئت؟ — نعم، وتبقى على الأساس المجاني ولا تخسر بياناتك.
5. كيف أربط رقم واتساب شركتي؟ — من داخل ليوان بخطوات قليلة عبر ميتا. ورسائل واتساب التسويقية
   تحاسبك عليها ميتا مباشرة من حسابك.
6. هل أستطيع أخذ بياناتي معي؟ — نعم. يطلب المدير نسخة كاملة، ويستلمها ملفات Excel لكل تطبيق مع
   المرفقات. (**Add the tenant export claim to the register before publishing.**)
7. هل النظام بالعربي؟ — العربية أولًا، والإنجليزية كاملة أيضًا.
8. من يساعدني إن احتجت؟ — ليوان AI داخل النظام يجيبك فورًا، وفريقنا على واتساب والبريد. وإن
   أردت، نجهّز معك كل شيء بالإعداد مع فريقنا.

A Saudi-hosting question is added only once production runs in Jeddah. Below the list, a sand
band «ما لقيت جوابك؟ اكتب لنا، ونرد عليك بنفسنا» with «تواصل معنا» (the `/contact` form) and
«واتساب», then «كل الأسئلة».

## 2I. Approved closing call to action and footer (home section 9)

- Lavender block: the white LiwanOS mark draws itself when reached, then the triangles and the
  stepped diamond appear in sand; heading «جاهز تجمع شركتك في مكان واحد؟»; line «ابدأ مجانًا،
  وجرّب كل التطبيقات ١٤ يومًا بلا بطاقة.»; buttons «جرّب ١٤ يومًا مجانًا» (white) and «تسجيل
  الدخول» (outline).
- The slim Sadu band in sand separates it from the footer.
- Footer: brand column (mark, «ليوان», «كل أعمالك بنظام ذكي واحد.»); المنتج
  (التطبيقات `/product`، ليوان AI، الأسعار `/pricing`); الشركة (الأمان والبيانات `/security`،
  تواصل معنا `/contact`، تسجيل الدخول); قانوني (`/terms`، `/privacy`، `/refund`، `/dpa`). Bottom
  line: «© ٢٠٢٦ ليوان», WhatsApp, «English» (`/en`). No email address anywhere: the domain cannot
  receive mail (contract §4.5).

The home page is complete: hero, trust strip, Liwan AI, applications, every step has a place,
pricing glance, start, FAQ, closing call to action and footer.

## 2J. Application pages: one page per application (owner, 2026-11-07)

**Paths renamed (owner, 2026-11-07): `/apps` and `/apps/<slug>` replace `/product` and
`/product/<slug>` everywhere in this document and in the contract** (Liwan calls them
applications in the product and on the home page; one word everywhere). The product session's
contract §2.1 must be updated.

**The `/apps` index:** H1 «ليوان: نظام واحد تدير به شركتك»; four platform pillars (دخول واحد،
صلاحيات واحدة، مساعد واحد، مكان واحد لبياناتك — a private database per company); the grid of
the eight applications with price or «مجاني» and a link to each page; a comparison section and
a closing call to action.

**Owner corrections 2026-11-07 (override the paragraph below):** the comparison is «ليوان، أو
أدوات منفصلة؟» with two columns only — the "large company system" column is removed because
Liwan also sells to large companies. The calculator asks the number of employees once, first;
then the yearly cost of each tool the visitor uses (empty = not used). Liwan is priced only for
the matching applications: a CRM cost adds the CRM application, a WhatsApp tool adds customer
messages, tasks/projects and meetings/chat map to free applications; users beyond three are
added once. Each tool card says what it maps to in Liwan; the Liwan result lists what it
counted. The third card shows the yearly difference as «توفّر في السنة» or «تزيد في السنة»
(owner: keep it yearly, no monthly reframing). Below the results, always, «ومع ليوان تحصل أيضًا
على» lists what the visitor gets beyond the tools entered: the free applications they left
empty or at zero, documents, requests and approvals, Liwan AI across the applications, 20 GB,
one permission model for the team, «استضافة داخل السعودية» (owner 2026-11-07; same content
flag as the trust strip: shown only once production runs on Oracle Jeddah), and «دخول واحد
بدل N» when they use several tools.

**Comparison without competitor names** (named comparisons need dated sources and the lawyer's
review, and a wrong number about a competitor harms Liwan): a table «ليوان، والطريقة التي تعمل
بها اليوم» against two ways of working — separate tools (a CRM, a WhatsApp tool, a tasks tool)
and a large company system that needs implementation — on sign-in, subscriptions, getting
started, data analysis (Liwan: a dashboard in each application and Liwan AI answering from the
company's data; no cross-application report claimed), technical integration (Liwan: its
applications on one platform, connected to WhatsApp, TikTok and the company's own payment
gateway; no public API claimed), an assistant across departments, the free base applications,
adding an application;
qualified with «غالبًا» where it varies. Then «كم تدفع في السنة؟» (owner: yearly, not monthly):
the visitor types what they pay **a year** for their current tools and the number of
employees; the page compares it with Liwan's live annual price for CRM and messages (ten months
paid) — and says honestly «توفّر» or «تزيد». Meta fees are
outside both sides.

**`/apps/inbox` — owner correction 2026-11-07:** the application is an omnichannel inbox, not a
WhatsApp tool. H1 «كل قنوات عملائك في صندوق واحد لفريقك»; channel chips WhatsApp and TikTok
(available), Telegram and email («قريبًا», owner 2026-11-07 — the register lists email as "not"
and has no Telegram row; **the product session must update the register**); a prominent soon
group «من محادثة إلى صفقة» (conversation → CRM opportunity, one customer record, quote with a
pay link; P7); price «٢٥٠ ر.س شهريًا للشركة» without promising which future channels it
includes; FAQ adds «ما القنوات المتاحة؟». A section «كل قناة بكامل قدراتها» («ربط رسمي مع
ميتا وتيك توك، لا حلول جانبية تعرّض حسابك للحظر») shows two channel cards, read from
`liwan_inbox/adapters/whatsapp.py`, `adapters/tiktok.py` and their models:
- WhatsApp (Meta Cloud API): text, image, video, audio, PDF/Word/Excel/PowerPoint documents,
  location, contacts, reactions, read receipts; interactive buttons and lists; WhatsApp Flows
  built, previewed and published from Liwan; template create/edit/delete with Meta approval
  status and click insights; marketing campaigns to opted-in customers with stop/start keywords
  and a consent trail; product and catalog messages, cart orders, the product a customer asks
  about; business profile and display name; number health, quality and sending limits with
  alerts to channel managers; daily Meta cost by category.
- TikTok (Business Messaging API): connect the business account by OAuth; earlier conversations
  imported on connect; text, images, button cards (up to 3 buttons), reactions, typing
  indicator, read receipts; welcome message, up to 3 suggested questions and up to 6 chat
  prompts reviewed by TikTok; referral source (ad or short link).
Then Telegram and email as «قريبًا». **Several of these are not yet in the claims register
(Flows, template insights, number health, cost tracking, TikTok ad referral, history import);
the product session must add them, and the release-1 live proof (P6) must cover what the page
shows.**

Final order of `/apps/inbox` (2026-11-07): hero → three pains → «كل قناة بكامل قدراتها» (the two
channel cards, then Telegram and email «قريبًا») → «ولفريقك، مهما كانت القناة» (soon «من محادثة
إلى صفقة», then the shared inbox, faster replies, reports — the channel-specific forms,
campaigns and commerce groups were removed because the WhatsApp card now covers them) → soon AI
box → FAQ (adds «هل الربط رسمي؟») → closing call to action. Earlier draft:
H1 «واتساب لفريقك كله: صندوق مشترك للمحادثات والحملات والطلبات»; price «٢٥٠ ر.س شهريًا للشركة،
واتساب وتيك توك معًا»; pains (one phone passed around
→ a shared inbox on each person's device; customers waiting → instant auto reply and a
response-time report; orders lost in chats → an order and pay link from the conversation).
Groups, all from the inbox code (features `inbox.whatsapp`, `tiktok`, `templates`,
`automation`, `flows`, `reports`, `catalog`, `campaigns`; settings departments, tags, canned
replies, working hours, rules, auto messages, catalog, campaigns, channels): one inbox for all
channels; faster replies; forms inside WhatsApp (Flows — **add to the claims register**);
campaigns to opted-in customers; selling from the conversation; reports (daily volume,
first-response buckets, number health). Soon box: AI reply suggestion and summary (P8), and
conversation → opportunity with a quote and pay link (P7). FAQ: connecting the number (guided,
no promise about the number type), Meta fees billed by Meta, how many staff can reply (all;
users priced as on the pricing page).

**Free applications say "free" first (owner 2026-11-07):** on every free application page
(tasks, chat, meetings, documents, operations, Liwan AI) the word «مجاني» comes first: a sand
pill «مجاني دائمًا» before the application tag, the H1 carries «مجانًا» where it reads
naturally (e.g. «… مجانًا مع كل حساب»), the line under the H1 states it, and the primary
button is «ابدأ مجانًا». It is never left to a price line under the buttons.

**The five free application pages (draft 2026-11-07)** — tasks, chat, meetings, documents,
operations — follow one shorter template: free-first hero with a small mock; three pains;
«ماذا يقدم لك» as four group cards; an optional «على طريقة شركتك» (admin settings) and «ومعك
ليوان AI» (only where the app has AI tools); a two-question FAQ; a closing call to action. The
content comes from a code inventory (2026-11-07) and avoids what it found missing:
- Tasks: title, description, deadline, normal/high priority, several assignees, one-level
  sub-tasks, attachments (10 MB); open/closed/archived, "assigned to me"/"created by me", table
  or cards, KPI strip; comments; an assignment notification; the «شغلي» page (do / decide /
  follow from other apps). No settings. AI: two read tools. **Do not claim** reminders,
  recurring tasks, labels, boards or stages (project tasks belong to PMO, not shown).
- Chat: direct chats, groups, named channels (**not** "public company channels": there is no
  browse/join); text and one attachment per message, replies, @mentions, edit/delete own,
  reactions, typing and read markers; pin, star, in-conversation search, attachment gallery;
  mute and notification level, filters, add/remove members, leave. Setting: what deleting a
  message does. No AI tools, no calls.
- Meetings: scheduling (place, video link URL, attendees, secretary, agenda, automatic
  reference), calendar event, no overlap for the organizer; recurring series up to 60
  occurrences, edit this / this and following; free or structured minutes (up to 100 topics),
  a saved version on completion, print and PDF, attachments; recommendations with owner,
  deadline and priority, a follow-up page, overdue notices; eight notification kinds including
  a reminder. Settings: who schedules, reminder lead time, reference prefix. AI: one read tool.
  **Do not claim** RSVP or embedded video calls; project links need PMO (not shown).
- Documents: rich-text documents with tags, attachments (10 MB), name search, filters; same-name
  upload as a new version keeping the old one, file lock while editing, archive and restore;
  company-wide or restricted with reader/editor grants; expiry date with expiring/expired
  filters and KPIs. No settings, no notifications, no AI. **Do not claim** folders, search
  inside files, previews, e-signature or expiry reminders; "my documents" needs HR (not shown).
- Operations: processes with 1–20 stages, named reviewers, per-stage or consecutive-stage
  approval, publish/archive, edits create a new revision; requests with title, description and
  attachments, submit/withdraw/resubmit; approve, reject or return with a comment, no
  self-approval; "my requests", "awaiting me", company monitoring, full audit trail, four
  notification kinds. AI: two read tools. **Do not claim** conditional or parallel approval,
  delegation, deadlines, escalation or custom form fields; leave and project-completion kinds
  need HR or PMO (not shown).

**`/apps/ai` (draft 2026-11-07):** H1 «مساعد ذكاء اصطناعي بالعربي، يعرف شركتك كلها»; «مجاني مع
الأساس»; pains (five systems for one number; weeks of setup; fear for data). Groups from
`liwan_ai` and the `liwan_*_ai` bridges: one conversation with a router to per-app agents
(sales, meetings, operations, tasks, setup, help; every new app joins); the setup agent
(proposals with current/new/impact, applied only on approval; readiness check); semantic search
and answers from dashboards with a source on every item; the help agent from the LiwanOS guide.
A sand "safe by design" block: reads with the user's permissions; no change without approval;
ID numbers, bank accounts and salaries never sent to the model provider (outbound scan); off
until an authorised person signs the acknowledgement, revocable; an audit log; per-agent and
per-tool switches and the company's own provider key. Soon pills: reply suggestion and summary,
form drafts, reports, PDF reading, Excel import. FAQ: free with a monthly limit then the
company's own key; what is sent; never changes on its own; Arabic. **Verify «اسأل عن هذه
الصفحة» is shipped (AI agents spec §6.13); add these AI claims to the register.**

Original draft below (read `/product` as `/apps`):

`/product` is an index of the applications; each application has its own page for search and
for depth, because several applications are complete systems: `/product/crm`,
`/product/inbox`, `/product/tasks`, `/product/chat`, `/product/meetings`,
`/product/documents`, `/product/operations`, `/product/ai`, and the same under `/en`. Short
English slugs, Arabic content. These are new site URLs: the product session's contract §2.1
must list them.

Template (from `content/apps/<slug>`): breadcrumb; hero with an H1 carrying the search phrase,
an outcome line, «جرّبه ١٤ يومًا» or «ابدأ مجانًا», the live price and a real screenshot; three
"before → with Liwan" pains; feature groups, each a short list beside a small visual,
alternating sides; a Liwan AI line where the application has AI tools; a «قريبًا» box only for
register items; a per-application FAQ; a closing call to action. SEO per page: own title and
155-character description, `SoftwareApplication` with the catalog price, `FAQPage`,
`BreadcrumbList`, `hreflang` to the English page, internal links to related applications.

The CRM page is the model. Its groups come from the CRM settings and pages in code: opportunities
and stages (board, stages, sources, lost reasons); follow-up and calls (attempts and interval,
call outcomes, after last attempt lost or manager, recycling); team, distribution and privacy
(round robin, manual or on import; own or all visibility; roles); packages, prices and discounts
(packages, maximum discount, selling above list); dashboards (agent and manager); fit to the
business (terms, custom fields, presets, import). Soon box: conversation becomes an opportunity
and a quote with a pay link (register: soon, package P7).

## 2K. `/pricing` (draft 2026-11-07)

H1 «ابدأ مجانًا، وادفع لما تحتاجه فقط»; line «لا باقات ولا ميزات مقفلة…»; monthly/annual switch
(«شهران مجانًا»). Three blocks: the free base (sand: 3 users, the six free applications,
20 GB, «ابدأ مجانًا»), CRM and customer messages (live price, five benefit lines each,
«جرّبه ١٤ يومًا»). Add-ons row: extra user (from the fourth), extra storage per 10 GB,
assisted onboarding (one time). The full calculator (two columns: controls and a summary with
a line-by-line breakdown, the annual saving and the one-time onboarding). «في كل اشتراك»: the
whole application, updates, support (Liwan AI, then WhatsApp and email), add apps or users any
time, pay by card or bank transfer, your data on request. Trial-then-refund band. FAQ: after
the trial; refund covers monthly and annual, renewals not refunded; per-user pricing; over 100
users; other fees (Meta, the payment gateway) paid directly. No tax wording. **Add to the
register before publishing:** card or bank transfer (release-1 decision: Moyasar and bank
transfer), tenant export on request, "updates included".

## 2L. `/security` (draft 2026-11-07)

H1 «بيانات شركتك لشركتك وحدها». Four lavender pillars (Saudi hosting, a private database,
precise permissions, two-step sign-in), then seven sections: where data is kept (Jeddah,
Riyadh backups hourly for 7 days and daily for 30, RPO 1 h / RTO 4 h phrased as «لا تخسر أكثر من
ساعة… ونعيد الخدمة خلال ٤ ساعات»); isolation (database and filestore per company); who sees what
(roles per application, permissions granted not assumed, per-company visibility); secure
sign-in (two-step by SMS or email code, remember device 30 days, encrypted connection); AI safety
(signed consent, sensitive data never sent, user permissions, approval, audit); money never
passes through Liwan (the company's own gateway, write-only keys); customer privacy (PDPL
export/erase) and company export. FAQ and a closing call to action.

Every item carries a content flag and is published only when true: hosting, backups and
recovery targets after P3; two-step sign-in and remembered devices after P2; customer privacy
tools after P5; company export and the recovery targets once in the claims register. No
security certification is claimed; nothing is said about Liwan staff access to customer data
until the support access policy is decided.

## 2M. `/contact` (draft 2026-11-07)

**Owner corrections 2026-11-07 (override the paragraph below):** no WhatsApp on this page (the
WhatsApp card and the WhatsApp wording are removed; the reply promise is «نتواصل معك بأنفسنا»,
and the success state says «على بريد شركتك أو جوالك»). The right column lists three reasons to
write (a tailored demo, a price for a large team, assisted onboarding) and the note for
existing customers points to Liwan AI only. **A company email is required for everyone**: the
field «بريد الشركة» is mandatory and free-mail domains (gmail, googlemail, hotmail, outlook,
live, msn, yahoo, ymail, icloud, me, mac, aol, proton, yandex, mail.com, gmx, zoho …) are refused
with «اكتب بريد شركتك، لا بريدًا شخصيًا». The product must enforce the same rule on
`/api/v1/public/contact`: **contract §4.5 change** (email from optional to required business
email), for the product session. **Owner confirmed 2026-11-07: sign-up too** — `/register` in
the product must require a company email and refuse the same free-mail domains; the site's
copy around «ابدأ تجربتك» may say «ببريد شركتك». This is product work for the product session.

Earlier draft:

Two columns. Right: «تكلّم معنا», a line promising a personal reply by WhatsApp or phone, a
WhatsApp click-to-chat card («أسرع طريقة للوصول إلينا»), a form card, and a note for existing
customers (ask Liwan AI in the product first, then WhatsApp). Left: the form from contract §4.5
— name, company, mobile (+966, sent as E.164), optional email, optional employee range, message,
a consent checkbox linking to `/privacy`, the Turnstile check, «أرسل». Inline Arabic errors per
field (empty name/company/message, a Saudi mobile starting with 5, a malformed email, missing
consent); the success state «وصلتنا رسالتك…». The site stores nothing and maps the product's
error codes to its own messages; no email address is published.

## 2N. Legal pages template (`/terms`, `/privacy`, `/refund`, `/dpa`, draft 2026-11-07)

One template: title, version (the product's `terms_version`), last-updated date and reading
time; print and «English»; a sand «بالمختصر» box of three plain-language points (written or
approved by the lawyer); a sticky table of contents beside numbered sections; a footer «سؤال عن
هذه الوثيقة؟ تواصل معنا» and «الإصدارات السابقة» (every published version kept, so a customer can
read the version they accepted). Texts are the lawyer's, stored as Markdown in the site
content with the same version string as the product. The refund text matches the system rule
word for word: full refund within 14 days of the first payment, monthly and annual alike,
renewals not refunded. No email address is shown.

## 2O. English version (`/en/...`, draft 2026-11-07)

Same pages and components, written for an English reader rather than translated word for word,
with the layout mirrored left to right (flows, arrows, the calculator, the chat). Rules:
- Name «LiwanOS» in Latin script; the assistant «Liwan AI». Prices «SAR 99/month» with Latin
  digits. No tax wording. Arabic stays the default (`x-default`), `hreflang` pairs every page,
  and the header carries «العربية» to switch back.
- Latin type for English text (a Latin companion to the Arabic face), the same colours, mark
  and Sadu band.
- Claims follow the same register; content flags (Saudi hosting, two-step sign-in, …) apply to
  both languages at once.
- Draft headlines: hero «Your whole business in one place, with one AI» / «Every app your team
  needs on one platform, with Liwan AI built in.» / «Start your 14-day free trial» / «No credit
  card needed»; stat cards «1 system / 1 login / 1 subscription»; trust strip «Hosted in Saudi
  Arabia · Every app reads from one source · No tiers, no locked features · A private database
  for your company»; AI «One AI that knows your whole company»; apps «Start with what your team
  needs today. Grow when you do.»; every step «Every part of your work has a place in LiwanOS»;
  pricing «Clear pricing that grows with your team»; start «Up and running on day one»; FAQ
  «Before you start»; closing «Ready to bring your company together?».
- Legal pages in English come from the lawyer as their own texts with the same version numbers.

## 3. Public prices endpoint (this repository)

`GET /v1/public/catalog`, anonymous, no session, beside the existing public invitation routes in
`apps/control-plane/src/http.ts`.

- Returns only published and available plan and bundle revisions with no customer audience
  (`audience_customer_id IS NULL`).
- Whitelisted fields only: name, price, included users, storage and branches, extra-unit
  prices, trial days. No internal ids, drafts or customer-specific revisions.
- Shape is a zod schema in `@liwan/commercial-contracts`; `Cache-Control: public, max-age=60`
  and a rate limit.
- Tests: hides drafts, hides customer-audience revisions, returns no extra fields, rate limit.
- Reuses the selection logic of `customerCatalog` in
  `apps/control-plane/src/commercial/customer-http.ts` without its customer filter.

### 3.1 Feature key in the contract

Each plan or bundle in the response carries the feature keys it grants (for example
`crm.enabled`), taken from `liwan.feature.registry` (R10). The site uses the key to link a
price to its application page. No other internal field is added.

## 3A. Site structure scales by content, not by code

Adding an application must not require editing navigation, the home page or the pricing page.

- **One template for application pages.** A dynamic route `/apps/[slug]` reads one file per
  application in `content/apps/` (name, summary, features, screenshots, icon, feature key,
  `status`). `/apps` is the index. A new application is a new file.
- **Generated navigation.** The menu, the home page application grid and the footer read the
  same content folder.
- **Pricing from the endpoint only.** The pricing page renders whatever the public catalog
  returns and joins it to application pages by feature key. A price published in
  `apps/vendor-admin` appears after the next rebuild with no code change.
- **`status` field:** `available`, `soon` or `hidden`. `soon` shows a notify-me link
  (WhatsApp or `mailto:`, no form per decision 4); `hidden` appears nowhere. A page never
  claims readiness for an application that is not released.
- **Sectors** use the same pattern: `/solutions/[slug]` from `content/solutions/`, linking
  applications and recommended settings, consistent with the configurable-applications
  constitution. Sector pages are not part of release 1.
- Screenshots and marketing copy remain per-application content work; the template only
  removes the engineering step.

## 4. Product-side change

`/join` must accept UTM parameters and persist them with the created account.

## 5. Out of scope

Blog, forms, a CMS, a customer area on the site, and any runtime call from the browser to the
control plane. Each needs a separate decision.

## 6. Open items

- Site map and page list (next step).
- Resolved 2026-11-07: domains are `liwanos.com` (site) and `app.liwanos.com` (product);
  release 1 sells CRM and customer messages only. Execution plan:
  [2026-11-07-liwan-marketing-site.md](../plans/2026-11-07-liwan-marketing-site.md).
