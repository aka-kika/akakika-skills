---
name: apple-hig-search-filtering
description: Use when designing or implementing search, filtering, sorting, query bars, and result states in Apple-platform apps — keep search, filter, and sort as separate jobs with clear no-result states.
---

# Apple HIG Search Filtering

Keep search, filtering, and sorting as distinct jobs with native SwiftUI patterns, visible active filters, and useful no-result states. Reach for it when building search bars, filter chips, sort menus, command palettes, or result and empty states.

## Purpose

Use this skill when designing or implementing search, filtering, sorting, query bars, and result states in Apple-platform apps.

Use for project search, skill search, prompt search, file search, memory search, command palette filtering, report filtering, and no-result states.

## Core rule

```
Search finds. Filters narrow. Sort changes order.
Do not mix their jobs.
```

## When to use this skill

Use for:

- Search bars
- `.searchable`
- Filter chips
- Sort menus
- Search results
- No results
- Recent search
- Saved filters
- Command palette search
- File/project/skill lists

## Search vs filter vs sort

```
Search: user types text to find matching content
Filter: user chooses constraints like status/type/date
Sort: user changes order like newest/name/priority
```

Example:

```
Search: “sidebar”
Filter: Type = Skill
Sort: Last Updated Desc
```

## SwiftUI searchable pattern

```swift
struct SkillsView: View {
    @State private var searchText = ""
    @State private var selectedFilter: SkillFilter = .all
    @State private var sort: SkillSort = .recent

    var filteredSkills: [Skill] {
        SkillSearch.filter(
            skills,
            query: searchText,
            filter: selectedFilter,
            sort: sort
        )
    }

    var body: some View {
        List(filteredSkills) { skill in
            SkillRow(skill: skill)
        }
        .searchable(text: $searchText, placement: .toolbar)
        .toolbar {
            ToolbarItemGroup(placement: .primaryAction) {
                filterMenu
                sortMenu
            }
        }
        .overlay {
            if filteredSkills.isEmpty {
                noResultsView
            }
        }
    }
}
```

## Filter menu

```swift
private var filterMenu: some View {
    Menu {
        Picker("Filter", selection: $selectedFilter) {
            Text("All").tag(SkillFilter.all)
            Text("Enabled").tag(SkillFilter.enabled)
            Text("Needs Review").tag(SkillFilter.needsReview)
        }
    } label: {
        Label("Filter", systemImage: "line.3.horizontal.decrease.circle")
    }
}
```

## Sort menu

```swift
private var sortMenu: some View {
    Menu {
        Picker("Sort", selection: $sort) {
            Text("Recently Updated").tag(SkillSort.recent)
            Text("Name").tag(SkillSort.name)
            Text("Category").tag(SkillSort.category)
        }
    } label: {
        Label("Sort", systemImage: "arrow.up.arrow.down")
    }
}
```

## Search implementation

```swift
enum SkillSearch {
    static func filter(
        _ skills: [Skill],
        query: String,
        filter: SkillFilter,
        sort: SkillSort
    ) -> [Skill] {
        let q = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()

        var result = skills

        if !q.isEmpty {
            result = result.filter { skill in
                skill.name.lowercased().contains(q)
                || skill.category.lowercased().contains(q)
                || skill.summary.lowercased().contains(q)
                || skill.keywords.contains { $0.lowercased().contains(q) }
            }
        }

        result = applyFilter(result, filter: filter)
        result = applySort(result, sort: sort)
        return result
    }
}
```

## No-result state

```swift
ContentUnavailableView {
    Label("No Results", systemImage: "magnifyingglass")
} description: {
    Text("Try a project, skill, prompt, file, or command name.")
} actions: {
    Button("Clear Search") {
        searchText = ""
    }
}
```

## Example search targets

```
Projects: name, path, tags, recent files
Skills: name, category, trigger words, summary
Prompts: title, variables, model target, purpose
Files: filename, path, extension
Notes: title, tags, source, body excerpt
Reports: date, title, source apps
Command palette: command title, keywords, category
```

## Filter examples

```
Status: All / Running / Done / Failed / Needs Review
Type: Project / Skill / Prompt / File / Note
Source: Local / Cloud / Imported
Date: Today / This Week / This Month
Provider: Ollama / OpenAI / Gemini
Enabled: Enabled / Disabled
```

## Design rules

- Put search in toolbar when central.
- Use filter and sort menus, not too many visible controls.
- Show active filters clearly.
- Add Clear Filters when filters are active.
- Preserve the user’s query when switching sections only if useful.
- No-result state should explain what to try next.
- Do not search hidden/private content without clear user intent.

## Review checklist

```
[ ] Search field is easy to find
[ ] Search, filter, and sort are separate concepts
[ ] Results update predictably
[ ] Active filters are visible
[ ] Clear Search / Clear Filters exists
[ ] No-result state is useful
[ ] Sorting is stable
[ ] Search covers relevant fields
[ ] Keyboard shortcut ⌘F works where appropriate
[ ] VoiceOver labels are clear
```

## Common mistakes

```
Search field hidden in random menu
Filters mixed into search syntax only
No no-result state
No way to clear filters
Search only checks title when users expect content
Sort changes unexpectedly
Command palette used as only search
```

## Prompt template

```
Use the apple-hig-search-filtering skill to improve search, filters, and sorting.

Rules:
- Search finds text matches.
- Filters narrow by structured constraints.
- Sort changes order.
- Use .searchable where appropriate.
- Put filters and sort in toolbar menus when space is limited.
- Show active filters.
- Add Clear Search and Clear Filters.
- Add useful no-result state.
- Support ⌘F where appropriate.
- Keep VoiceOver labels clear.

After coding:
1. List search fields added.
2. Explain filter/sort behavior.
3. Explain no-result state.
4. Give manual test steps.
```
