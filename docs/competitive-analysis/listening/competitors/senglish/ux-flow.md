# S English Dictation UX Flow

Source: https://senglish.net/vi/dictation  
Date: 2026-04-29

This flow is a working hypothesis from page metadata and public route inspection. It must be verified with screenshots and a logged-in session.

## Hypothesized Flow

```text
Landing / Dictation route
  ↓
Choose video or lesson
  ↓
Listen to a short segment
  ↓
Type heard words / sentence
  ↓
Check answer
  ↓
Use support tools if stuck
  ├─ transcript / translation
  ├─ dictionary
  ├─ AI explanation
  └─ vocabulary save
  ↓
Continue dictation or switch to shadowing
```

## UX Questions To Capture

- Does the learner start immediately, or must they browse content first?
- Is the audio segment short enough for repeated attempts?
- Are mistakes highlighted at word level, phrase level, or sentence level?
- Can the learner replay only the current segment?
- Does the system explain connected speech, reduced sounds, or only text correctness?
- Can the learner move from a failed dictation line into slower replay?
- Does vocabulary save include source sentence and audio timestamp?

## What QuackUp Should Watch

- If S English exposes too many helper tools at once, QuackUp should keep the first listening screen calmer.
- If S English uses real YouTube content, QuackUp needs curation so beginners are not overwhelmed.
- If S English connects Dictation and Shadowing well, QuackUp should make that bridge even more explicit.
