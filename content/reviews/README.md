# Review Documentation

## File Structure

```
reviews/
  movies/
  tv/
  books/
```

## File Naming

`YYYY-MM-DD-title-slug.md`

Examples:

- `2024-03-15-grand-budapest-hotel.md`
- `2024-03-17-the-bear-season-2.md`
- `2024-03-19-long-way-to-a-small-angry-planet.md`

**Slugification:** lowercase, spaces → hyphens, remove special characters

## Frontmatter

### Required Fields

| Field      | Type       | Description             | Example           |
| ---------- | ---------- | ----------------------- | ----------------- |
| `title`    | string     | Display title           | `"Dune Part Two"` |
| `date`     | YYYY-MM-DD | Date watched/read       | `2024-03-15`      |
| `rating`   | number     | Your rating (any scale) | `8.5`             |
| `finished` | boolean    | Did you complete it?    | `true`            |

### Media-Specific Fields

| Field     | Type   | Used For   | Example           |
| --------- | ------ | ---------- | ----------------- |
| `tmdb_id` | string | Movies/TV  | `"693134"`        |
| `season`  | number | TV seasons | `2`               |
| `isbn`    | string | Books      | `"9781500453305"` |

### Optional Fields

| Field     | Type    | Description               | Example                    |
| --------- | ------- | ------------------------- | -------------------------- |
| `tags`    | array   | Personal taxonomy         | `[comfort-watch, rewatch]` |
| `with`    | array   | Who you watched/read with | `["Sarah", "Mom"]`         |
| `revisit` | boolean | Is this a rewatch/reread? | `true`                     |

## Example Review

```markdown
---
title: "The Grand Budapest Hotel"
date: 2024-03-15
rating: 9
finished: true
tmdb_id: "120467"
tags: [visual-feast, quirky, rewatch-worthy]
revisit: false
---

# The Grand Budapest Hotel

Wes Anderson at his most Wes Anderson. Every frame is a painting...

## What Worked

- The aspect ratio changes
- Ralph Fiennes' comedic timing

## Thoughts

Would watch again just for the cinematography alone.
```
