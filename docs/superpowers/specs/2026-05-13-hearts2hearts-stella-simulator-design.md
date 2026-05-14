# Hearts2Hearts Stella Simulator Design

Date: 2026-05-13
Status: Approved for implementation planning

## Goal

Build a deployable web-based AI chat romance simulator for a fictional parallel-world Hearts2Hearts Stella route. The first version is a playable vertical slice: Stella only, three player identity origins, a balanced story-and-strategy loop, a mock DM engine that works without an API key, and a provider boundary reserved for a future OpenAI-backed DM.

The simulator must preserve the source material's tone: realistic Korean entertainment industry romance, not a wish-fulfillment fantasy. Relationship progress should be slow, risky, and shaped by career pressure, company oversight, fandom attention, secrecy, player selfhood, and Stella's own professional boundaries.

## Product Scope

Version 1 includes:

- A deployable website that runs locally during development and can later be hosted on a platform such as Vercel.
- A direct game experience as the first screen, not a marketing landing page.
- Player creation with name, adult age, one of three identity origins, and story pacing.
- Stella as the fixed first route.
- A Stella character card with public persona, private personality, romance red flags, route keywords, and initial stats.
- A main play screen with current state, narrative history, choices, and free action input.
- A mock DM provider that generates playable turns and stat changes from local data.
- A provider interface that can later switch to an OpenAI provider without rewriting the UI.
- Browser local save so refreshes do not erase progress.

Out of scope for version 1:

- Full eight-member route selection.
- Real image generation, group chat avatars, or persistent character image attachments.
- User accounts, cloud saves, payments, or social sharing.
- Real-person claims, real private life content, or imagery that could be mistaken for real photos.

## Core Experience

The player creates an adult protagonist, chooses one of three Stella-compatible identity origins, then enters a weekly narrative loop. Each turn shows the current week, scene, relationship stage, and seven core stats:

- Affection
- Public attention
- Mood
- Money
- Secrecy
- Company alertness
- Career pressure

The DM presents a scene, Stella or NPC reactions, three structured choices, and one free action input. Any action must affect at least two state values. The story should remain limited to the player viewpoint: the simulator cannot reveal Stella's hidden thoughts, company plans, fandom behavior, or NPC actions unless the player can plausibly observe or infer them.

## Stella Route

Stella is written as an original fictional parallel-world interpretation inspired by the user's Stella design notes.

Route pillars:

- Outgoing coolness in public, with humor and a relaxed social surface.
- Idol identity first: she is a Hearts2Hearts member whose career, company obligations, public image, fandom risk, and group responsibilities define the main pressure system.
- Drumming as a distinctive performance skill: rhythm, stamina, practice-room discipline, physical detail, and stage pressure should shape her scenes without redefining her profession as "drummer."
- Korean-Canadian background expressed through language switching and cross-cultural thinking, without exoticizing her.
- A clear separation between work and private life.
- Professional standards she will not soften for romance.
- Resistance to being labeled as a girlfriend, exotic fantasy, or "soft girl" role.

Her romance should feel approachable early but difficult to sustain. She may warm quickly to honest, grounded behavior, but trust is tested when the player pushes into her work world, treats her like an idol fantasy, creates exposure risk, or expects romance to override her career.

## Player Identity Origins

Version 1 supports three identities:

1. Music show staff member
   - Strongest backstage access.
   - High workplace-boundary risk.
   - Company alertness can rise quickly.

2. Translator / overseas business assistant
   - Strongest fit for Stella's English use and cross-cultural scenes.
   - Creates trust through competence and discretion.
   - Risk comes from being visible to both company staff and overseas fandom.

3. Student / part-time worker
   - Strongest ordinary-life contrast.
   - Lower initial access, stronger money and self-worth pressure.
   - Risk comes from fandom scrutiny, life instability, and unequal worlds.

Identity affects initial stats, first meeting, available events, and likely pressure sources. It should not merely change flavor text.

## Game Loop

1. Create player.
2. Generate Stella route card and initial state.
3. Start week 1 with an identity-specific first scene.
4. Player selects a choice or writes a free action.
5. DM provider returns:
   - Updated state.
   - Relationship stage.
   - Scene text.
   - Stella/NPC visible reaction.
   - Three next choices.
   - Optional event tags and warnings.
6. Save game state locally.
7. Repeat until a route branch or ending is reached.

Relationship stages follow the source material:

- Stranger
- Remembered
- Interested
- Ambiguous
- Confirmed
- In Love
- Trial

The implementation may use English internal identifiers, but the UI should present Chinese labels matching the source tone.

## Mock DM Engine

The mock engine should be deterministic enough to test and varied enough to play. It will use local route data, event templates, stat thresholds, relationship stages, and player identity to select scenes and compute state changes.

The first version does not need a large content library. It needs enough content to prove the loop:

- Three identity-specific opening scenes.
- Several Stella-focused work, practice, language, and boundary events.
- A few pressure events tied to secrecy, company alertness, mood, money, and career pressure.
- Basic ending/branch detection can be present but does not need all final endings fully written.

Free action input in mock mode can be classified with simple keyword and intent rules. If the input cannot be classified, the engine should still respond with a reasonable neutral continuation.

## AI Provider Boundary

The app should route all DM generation through a common provider interface.

Initial providers:

- `mockProvider`: local, no API key, used by default.
- `openAIProvider`: disabled server-side adapter in version 1. It defines the future interface and returns a clear "not configured" response until API integration is intentionally enabled.

The UI should call one game action function rather than calling a specific provider directly. This keeps the future OpenAI integration isolated to API/provider code.

When the OpenAI provider is implemented later, API keys must stay server-side. The browser must never receive the API key.

## Data Model

Core state:

- Player profile: name, age, identity, pacing.
- Route: Stella.
- Week number.
- Stats.
- Relationship stage.
- Current scene.
- Narrative history.
- Choice history.
- Save metadata.

Route data:

- Public persona.
- Private personality.
- Romance red flags.
- Detail notes.
- Stage thresholds.
- Event pools.
- Identity-specific opening events.

## UI Design

The app should feel like a polished interactive story tool, not a decorative landing page. The first screen should be the playable experience.

Primary views:

- Character creation view.
- Stella route card view.
- Play view.

Play view layout:

- Dense but readable stat panel.
- Current week, scene, route, and relationship stage.
- Narrative transcript.
- Choice buttons.
- Free action text input.
- Save/reset controls.

Visual tone:

- Korean entertainment backstage atmosphere.
- Dark, restrained interface with contrast from signal colors for risk and affection.
- No fake real-person photography.
- No in-app text explaining obvious UI mechanics.

## Safety And Fiction Rules

The app must clearly frame the experience as fictional parallel-world fan-created storytelling. It must not claim to describe real people, real private lives, real relationships, real scandals, or real events.

All romance must involve adult characters. The simulator should avoid sexual explicitness, coercive framing, or parasocial claims. Fandom, company staff, managers, and other artists should be written as people with incentives and boundaries, not cartoon villains.

## Testing And Verification

Version 1 should be verified by:

- Starting a new game for each of the three identities.
- Completing several turns in mock mode.
- Confirming stat changes persist after refresh.
- Confirming the relationship stage changes only when thresholds are reached.
- Confirming reset clears local save.
- Confirming no API key is required for mock mode.
- Confirming the app can build for deployment.

## Implementation Planning Decisions

- Use a standard deployable web scaffold that supports colocated UI and server routes.
- Keep the OpenAI path disabled in version 1 while preserving the provider boundary.
- Prioritize Stella route quality over route breadth for the first content batch.
