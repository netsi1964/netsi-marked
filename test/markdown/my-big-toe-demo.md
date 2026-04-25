# My Big TOE inspired markdown demo

This test content is inspired by Thomas Campbell's *My Big TOE* vocabulary: consciousness, intent, entropy, feedback, probability, and virtual reality.

> [!NOTE]
> This demo is not an official summary of Thomas Campbell's work. It is sample markdown for testing rendering features.

## Consciousness feedback loop

```mermaid
flowchart TD
  A[Consciousness unit] --> B[Intent]
  B --> C[Choice]
  C --> D[Feedback]
  D --> E{Lower entropy?}
  E -- Yes --> F[More coherent interaction]
  E -- No --> G[Learn from consequence]
  F --> A
  G --> A
```

## Probability and decision space

```mermaid
stateDiagram-v2
  [*] --> CurrentExperience
  CurrentExperience --> ChoiceA: Caring intent
  CurrentExperience --> ChoiceB: Fear-based intent
  ChoiceA --> LowerEntropy
  ChoiceB --> HigherEntropy
  LowerEntropy --> Feedback
  HigherEntropy --> Feedback
  Feedback --> CurrentExperience
```

## Code formatting examples

JavaScript:

```js
const intent = 'coherent';
const entropyTrend = intent === 'coherent' ? 'lowering' : 'increasing';
console.log({ intent, entropyTrend });
```

HTML:

```html
<netsi-marked plugins="mermaid,code-enhance,callouts" locale="da">
  <template type="text/markdown">
# Hello virtual reality
  </template>
</netsi-marked>
```

CSS:

```css
netsi-marked {
  --netsi-marked-accent: #6f42c1;
  --netsi-marked-radius: 1rem;
}
```

## Table

| MBT term | Demo interpretation |
|---|---|
| Intent | Direction behind a choice |
| Feedback | Consequence data |
| Entropy | Coherence or disorder trend |
