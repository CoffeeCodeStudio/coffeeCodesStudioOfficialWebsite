

## Plan: Byt ikoner till kaffe-relaterade alternativ

### Ändringar per fil

**1. `src/components/PricingSection.tsx`**
- `Zap as ZapIcon` → `Coffee` (starter-kortet)
- `Star` → `Crown` (populärast-märket)
- `Rocket` → `Flame` (engångsprojekt-kortet)
- `Check` → `CircleCheck`

**2. `src/components/TestimonialsSection.tsx`**
- `Quote` → `MessageSquareQuote`

**3. `src/components/TjansterSection.tsx`**
- `Rocket` → `Flame` i `serviceIcons`
- `Zap` → `Coffee` i `serviceIcons`
- `RocketIcon` → `Flame` i `stepIcons` (sista steget)

**4. `src/pages/FrisorGoteborg.tsx`**
- `Quote` → `MessageSquareQuote`
- `Check` → `CircleCheck`

**5. `src/pages/SmaforetagGoteborg.tsx`**
- `Quote` → `MessageSquareQuote`
- `Check` → `CircleCheck`
- `Zap` → `Coffee`

**Filer som INTE ändras** (UI-komponenter / admin / portal):
- `select.tsx`, `checkbox.tsx`, `dropdown-menu.tsx`, `menubar.tsx`, `context-menu.tsx` — dessa är primitiva UI-komponenter, Check behålls
- `NotificationBell.tsx` — Check används för markera-som-läst, behålls
- `AdminClientRequests.tsx`, `ClientRequests.tsx` — Zap används som request-typ-ikon, behålls
- `ProjectStatus.tsx` — Rocket i portalen behålls (admin-kontext, inte publik)
- `ChevronDown` — behålls överallt

### Sammanfattning av nya ikoner
| Förr | Nu | Kontext |
|------|-----|---------|
| Zap | Coffee | Pricing starter, Tjänster, Småföretag |
| Star | Crown | Pricing "Populärast" badge |
| Rocket | Flame | Pricing engångsprojekt, Tjänster |
| Check | CircleCheck | Pricing features, landningssidor |
| Quote | MessageSquareQuote | Testimonials, landningssidor |

