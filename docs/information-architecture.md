# Information Architecture (Tri-lingual)

## Languages
- zh (Simplified Chinese)
- ja (Japanese)
- en (English)

## Global sections
- home
- about
- blog
- projects
- contact

## Shared content rules
- Every section exists in all 3 languages.
- Slugs and content structure stay consistent across languages.
- Navigation labels are language-specific, but routes remain stable.

## Content models

### home (section landing)
- Summary blocks:
  - latest_blog (list of recent posts)
  - latest_projects (list of recent projects)

### about (single page)
- title
- summary
- body

### blog (list + posts)
- list page: title, description
- post page:
  - title
  - date
  - summary
  - tags (optional)
  - body

### projects (list + items)
- list page: title, description
- item page:
  - title
  - date
  - summary
  - role (optional)
  - stack (optional)
  - link (optional)
  - body

### contact (single page)
- title
- summary
- body
- methods (optional): email, social
