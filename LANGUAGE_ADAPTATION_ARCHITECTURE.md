# Language Adaptation Architecture

## System Architecture Diagram

```mermaid
graph TD
    A[User Selects Language] -->|Change Event| B[i18next]
    B -->|languageChanged| C[applyLanguageStyles]
    C -->|Update| D[HTML Attributes]
    C -->|Add Class| E[Language Class]
    C -->|Add Class| F[Direction Class]
    
    D --> G[dir='rtl/ltr']
    D --> H[lang='en/ar/ur/hi']
    
    E --> I[html.lang-en]
    E --> J[html.lang-ar]
    E --> K[html.lang-ur]
    E --> L[html.lang-hi]
    
    F --> M[body.rtl]
    F --> N[body.ltr]
    
    I --> O[CSS Rules Apply]
    J --> O
    K --> O
    L --> O
    M --> O
    N --> O
    
    O --> P[Typography Adjusts]
    O --> Q[Spacing Changes]
    O --> R[Forms Resize]
    O --> S[Layout Mirrors]
    
    P --> T[UI Renders]
    Q --> T
    R --> T
    S --> T
    
    T --> U[User Sees Adapted Layout]
    
    style A fill:#3B82F6,color:#fff
    style U fill:#10B981,color:#fff
    style C fill:#F59E0B,color:#000
    style O fill:#8B5CF6,color:#fff
```

## Component Flow

```mermaid
sequenceDiagram
    participant User
    participant LanguageSelector
    participant i18n
    participant applyLanguageStyles
    participant DOM
    participant CSS
    participant Component
    
    User->>LanguageSelector: Clicks Language
    LanguageSelector->>i18n: changeLanguage('ar')
    i18n->>i18n: languageChanged event
    i18n->>applyLanguageStyles: Trigger with 'ar'
    
    applyLanguageStyles->>DOM: Set dir='rtl'
    applyLanguageStyles->>DOM: Set lang='ar'
    applyLanguageStyles->>DOM: Add class 'lang-ar'
    applyLanguageStyles->>DOM: Add class 'rtl' to body
    
    DOM->>CSS: Match .lang-ar rules
    DOM->>CSS: Match [dir="rtl"] rules
    
    CSS->>Component: Apply font: Noto Sans Arabic
    CSS->>Component: Apply size: 17px
    CSS->>Component: Apply line-height: 1.75
    CSS->>Component: Mirror layout
    
    Component->>User: Render adapted UI
```

## Data Flow

```mermaid
flowchart LR
    subgraph Config["Language Configuration"]
        LC[Language Code]
        LN[Native Name]
        D[Direction]
        FF[Font Family]
        FS[Font Size]
        LH[Line Height]
        LS[Letter Spacing]
    end
    
    subgraph System["i18n System"]
        I[i18next]
        G[getLanguageConfig]
        A[applyLanguageStyles]
    end
    
    subgraph DOM["DOM Updates"]
        HA[HTML Attributes]
        HC[HTML Classes]
        BC[Body Classes]
    end
    
    subgraph Styles["CSS Activation"]
        LR[Language Rules]
        DR[Direction Rules]
        TR[Typography]
        SR[Spacing]
        FR[Forms]
    end
    
    LC --> I
    I --> G
    G --> A
    A --> HA
    A --> HC
    A --> BC
    
    HA --> DR
    HC --> LR
    BC --> DR
    
    LR --> TR
    LR --> SR
    LR --> FR
    DR --> TR
    DR --> SR
    DR --> FR
    
    style Config fill:#E0F2FE
    style System fill:#FEF3C7
    style DOM fill:#DBEAFE
    style Styles fill:#DCFCE7
```

## CSS Cascade

```mermaid
graph TB
    subgraph Base["Base Styles"]
        B1[* - Border]
        B2[body - Typography]
        B3[h1-h6 - Headings]
    end
    
    subgraph Language["Language-Specific"]
        L1["html.lang-en { font: Inter }"]
        L2["html.lang-ar { font: Noto Sans Arabic, size: 17px }"]
        L3["html.lang-ur { font: Noto Nastaliq, size: 18px }"]
        L4["html.lang-hi { font: Noto Devanagari }"]
    end
    
    subgraph Direction["Direction-Specific"]
        D1["[dir='rtl'] { flip layouts }"]
        D2["[dir='rtl'] .text-left { text-right }"]
        D3["[dir='rtl'] .flex-row { row-reverse }"]
    end
    
    subgraph Components["Component Adjustments"]
        C1["html.lang-ar input { height: 2.75rem }"]
        C2["html.lang-ur input { height: 3rem }"]
        C3["html.lang-ar button { height: 2.5rem }"]
        C4["Spacing adjustments"]
    end
    
    Base --> Language
    Language --> Direction
    Direction --> Components
    
    style Base fill:#FEE2E2
    style Language fill:#DBEAFE
    style Direction fill:#FEF3C7
    style Components fill:#DCFCE7
```

## Tailwind Plugin System

```mermaid
flowchart TD
    subgraph Plugin["Tailwind Plugin"]
        P1[addVariant]
        P2[addUtilities]
    end
    
    P1 -->|Create| V1["rtl: variant"]
    P1 -->|Create| V2["ltr: variant"]
    P1 -->|Create| V3["lang-ar: variant"]
    P1 -->|Create| V4["lang-ur: variant"]
    P1 -->|Create| V5["lang-hi: variant"]
    P1 -->|Create| V6["lang-en: variant"]
    
    P2 -->|Create| U1[".rtl-flip"]
    P2 -->|Create| U2[".rtl-rotate-180"]
    P2 -->|Create| U3[".ps-*, .pe-*"]
    P2 -->|Create| U4[".start-*, .end-*"]
    P2 -->|Create| U5[".ms-auto, .me-auto"]
    
    V1 --> C1[Compile to CSS]
    V2 --> C1
    V3 --> C1
    V4 --> C1
    V5 --> C1
    V6 --> C1
    
    U1 --> C2[Add to Utilities]
    U2 --> C2
    U3 --> C2
    U4 --> C2
    U5 --> C2
    
    C1 --> Final[Final CSS]
    C2 --> Final
    
    style Plugin fill:#8B5CF6,color:#fff
    style Final fill:#10B981,color:#fff
```

## Runtime Behavior

```mermaid
stateDiagram-v2
    [*] --> Initial: App Loads
    Initial --> DetectLanguage: Check localStorage/browser
    DetectLanguage --> ApplyStyles: Language detected
    
    ApplyStyles --> EnglishActive: English
    ApplyStyles --> ArabicActive: Arabic
    ApplyStyles --> UrduActive: Urdu
    ApplyStyles --> HindiActive: Hindi
    
    EnglishActive --> UserChange: User changes language
    ArabicActive --> UserChange
    UrduActive --> UserChange
    HindiActive --> UserChange
    
    UserChange --> ApplyStyles: Apply new styles
    
    state EnglishActive {
        [*] --> SetLTR
        SetLTR --> SetInter
        SetInter --> Set16px
        Set16px --> Render
    }
    
    state ArabicActive {
        [*] --> SetRTL
        SetRTL --> SetArabicFont
        SetArabicFont --> Set17px
        Set17px --> MirrorLayout
        MirrorLayout --> Render
    }
    
    state UrduActive {
        [*] --> SetRTL
        SetRTL --> SetUrduFont
        SetUrduFont --> Set18px
        Set18px --> MirrorLayout
        MirrorLayout --> Render
    }
    
    state HindiActive {
        [*] --> SetLTR
        SetLTR --> SetHindiFont
        SetHindiFont --> Set16px
        Set16px --> Render
    }
```

## Component Integration

```mermaid
graph LR
    subgraph App["Application"]
        A1[App.tsx]
        A2[LanguageProvider]
        A3[useLanguage Hook]
    end
    
    subgraph Components["UI Components"]
        C1[Forms]
        C2[Buttons]
        C3[Cards]
        C4[Navigation]
        C5[Modals]
    end
    
    subgraph Utilities["CSS Utilities"]
        U1[rtl: variants]
        U2[lang-*: variants]
        U3[Logical properties]
        U4[RTL helpers]
    end
    
    A1 --> A2
    A2 --> A3
    
    A3 --> C1
    A3 --> C2
    A3 --> C3
    A3 --> C4
    A3 --> C5
    
    C1 --> U1
    C1 --> U2
    C1 --> U3
    
    C2 --> U1
    C2 --> U4
    
    C3 --> U2
    C3 --> U3
    
    C4 --> U1
    C4 --> U4
    
    C5 --> U1
    C5 --> U3
    
    style App fill:#3B82F6,color:#fff
    style Components fill:#10B981,color:#fff
    style Utilities fill:#F59E0B,color:#000
```

## Performance Optimization

```mermaid
flowchart TB
    subgraph Loading["Font Loading"]
        L1[Google Fonts CDN]
        L2[Preconnect]
        L3[Font Display: Swap]
    end
    
    subgraph Caching["Caching Strategy"]
        CA1[Language in localStorage]
        CA2[Fonts cached by browser]
        CA3[CSS compiled at build]
    end
    
    subgraph Rendering["Rendering"]
        R1[CSS Transitions: 0.2s]
        R2[Minimal Reflow]
        R3[GPU Acceleration]
    end
    
    L1 --> L2
    L2 --> L3
    L3 --> Fast[Fast Initial Load]
    
    CA1 --> Instant[Instant Language Restore]
    CA2 --> Instant
    CA3 --> Instant
    
    R1 --> Smooth[Smooth Transitions]
    R2 --> Smooth
    R3 --> Smooth
    
    Fast --> Result[Optimal Performance]
    Instant --> Result
    Smooth --> Result
    
    style Result fill:#10B981,color:#fff
```

## Key Advantages

1. **Automatic**: No manual intervention required
2. **Performant**: Pure CSS, no runtime overhead
3. **Maintainable**: Centralized configuration
4. **Scalable**: Easy to add new languages
5. **Consistent**: Design system preserved across languages
6. **Developer-Friendly**: Simple APIs and utilities

## Critical Paths

### Language Change Path
```
User Action → i18n Event → applyLanguageStyles() → DOM Updates → CSS Activation → UI Re-render
```

### Component Render Path
```
Component Mount → useLanguage Hook → Get Config → Apply Classes → CSS Rules Match → Render
```

### Style Application Path
```
HTML Class Added → CSS Selector Matches → Styles Applied → Browser Paint → User Sees Change
```
