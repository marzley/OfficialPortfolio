---
slug: track-changes-collaboration
title: Track changes, comments and working on documents together
after: tables-mail-merge
---
# Track changes, comments and working on documents together

In offices, NGOs and group assignments, documents pass between several people. **Track Changes** and **Comments** show who changed what, so nothing is lost and the final version is agreed.

## Track Changes (Review tab)

1. **Review → Track Changes** (Ctrl + Shift + E) to turn it on.
2. Every insertion, deletion and formatting change is now marked, in a different colour for each person.
3. Choose the view in **Display for Review**:
   - **All Markup**: see every change
   - **Simple Markup**: clean text with a red line where changes are
   - **No Markup**: preview the final result
   - **Original**: the document before changes

## Accepting and rejecting changes

- **Review → Next / Previous** to move between changes.
- **Accept** or **Reject** each one, or use the arrow under Accept for **Accept All Changes**.
- The final version should have **no remaining tracked changes or comments** before you send it outside the organisation, otherwise readers can see all earlier edits.

> Before sending a document to a client or an employer, use **File → Info → Check for Issues → Inspect Document** to find hidden comments, tracked changes and personal information.

## Comments

- Select text → **Review → New Comment** (Ctrl + Alt + M).
- Use **@mention** (e.g. @Wanjiku) in Microsoft 365 to notify a colleague by email.
- **Reply** to discuss, and **Resolve** when done.

Good comments are specific: "Please add the 2025 enrolment figures here" is better than "incomplete".

## Compare two versions

Someone edited a copy without Track Changes? **Review → Compare → Compare** shows the differences between the original and the revised document as tracked changes.

## Real-time co-authoring

When the file is saved in **OneDrive** or **SharePoint** (Microsoft 365), or when you use **Google Docs**, several people can edit at the same time. You see their cursors, and changes save automatically.

| Tool | Share | Version history |
|---|---|---|
| Word + OneDrive | Share button → people or link | File → Info → Version History |
| Google Docs | Share → add emails, set Viewer/Commenter/Editor | File → Version history |

Permission levels:

- **Viewer**: can only read.
- **Commenter**: can add comments and suggestions.
- **Editor**: can change everything.

Google Docs' **Suggesting mode** (pencil icon → Suggesting) works like Track Changes.

## Protecting a document

- **Review → Restrict Editing**: allow only comments or form filling.
- **File → Info → Protect Document → Encrypt with Password**: needed to open it. Don't lose the password: it can't be recovered.
- Mark as Final to discourage casual edits.

## A simple team workflow

1. One person creates the document from a template and shares it.
2. Everyone writes in their assigned section, with Track Changes on (or in Suggesting mode).
3. The lead reviews, accepts or rejects changes, and resolves comments.
4. Final check: Inspect Document, spell check, page numbers, table of contents update.
5. Export to PDF for submission; keep the Word file as the editable master.

Name versions clearly: `Proposal_v3_2026-09-28.docx`, not `final final 2.docx`.

## Why collaboration features matter

Most important documents are written by more than one person: a board report reviewed by managers, a tender prepared by a team, a thesis checked by a supervisor, a contract negotiated by two lawyers, a church or chama constitution discussed by members. Track Changes and comments show **who changed what**, let the author accept or reject each edit, and keep a clear record. Emailing "final_v3_REALLY_final.docx" back and forth leads to lost edits; collaboration features prevent that.

## Track Changes settings

| Setting | Where | Use |
|---|---|---|
| Simple Markup | Review → Display for Review | Clean view with a red line marking changed lines |
| All Markup | Same | Every insertion, deletion and formatting change shown |
| No Markup | Same | Preview the final version |
| Original | Same | View the document before changes |
| Show Markup → specific people | Review → Show Markup | Review one reviewer's edits at a time |
| Balloons | Show Markup → Balloons | Show deletions in the margin or inline |
| Lock Tracking | Track Changes → Lock Tracking | Stop others turning tracking off (with a password) |

Make sure your name is set correctly (File → Options → General → User name) so reviewers know who made each change.

## Reviewing efficiently

1. Use **Next/Previous** on the Review tab to move change by change.
2. Accept obvious corrections (typos) in bulk: **Accept → Accept All Changes Shown** after filtering to one reviewer.
3. For important wording changes, read the full sentence in context before accepting.
4. Reply to comments explaining decisions, then **Resolve** them.
5. Before sending the final version, check **Review → Reviewing Pane** shows 0 revisions and 0 comments.

## Writing helpful comments

| Unhelpful | Helpful |
|---|---|
| "Wrong" | "This figure doesn't match Table 2 (KSh 1.2M vs 1.4M). Which is correct?" |
| "Rewrite this" | "Could we shorten this to two sentences? The main point is the cost saving." |
| "??" | "I'm not sure what 'the system' refers to here: the portal or the mobile app?" |

Use **@mentions** in comments (in Microsoft 365 and Google Docs) to notify a specific person: `@Wanjiru please confirm the budget figure`.

## Combining reviews from several people

If three reviewers each edited separate copies:

1. **Review → Compare → Combine Documents**.
2. Choose the original and one revised copy; repeat for each reviewer.
3. All changes appear in one document, labelled by reviewer.

**Compare** (instead of Combine) shows the differences between two versions when someone edited without Track Changes, which is common with contracts received from another party.

## Co-authoring in Microsoft 365 and Google Docs

| Feature | Word (OneDrive/SharePoint) | Google Docs |
|---|---|---|
| Real-time editing | Yes, when saved in the cloud | Yes |
| Suggesting changes | Track Changes | Suggesting mode |
| Comments and @mentions | Yes | Yes |
| Version history | File → Info → Version History | File → Version history |
| Offline editing | Desktop app | Offline mode (set up in Drive) |
| Sharing links | Share button with permissions | Share button with permissions |

Name versions at milestones (Google Docs: File → Version history → Name current version, e.g. "Sent to board 12 March"), so you can return to them.

## Sharing permissions safely

| Permission | Can do |
|---|---|
| Viewer | Read only |
| Commenter | Read and comment |
| Editor | Change everything, including sharing (unless restricted) |

- Share with specific people for confidential documents rather than "Anyone with the link".
- Set expiry dates on links where available.
- Remove access when a project ends or someone leaves the organisation.
- Prevent editors from changing permissions or downloading if needed (sharing settings).

## Restrict Editing and document protection

**Review → Restrict Editing** lets you:

- Allow only **comments** or only **tracked changes**.
- Allow only **filling in forms** (for templates with content controls).
- Make exceptions for certain parts of the document that specific people can edit.

**File → Info → Protect Document** offers Mark as Final, Encrypt with Password and Restrict Access. Encryption is the only option that truly protects confidentiality; keep the password safe.

## Cleaning a document before sending it outside

Before sending a proposal or contract to a client or the other side:

1. Accept or reject all changes and delete all comments.
2. **File → Info → Check for Issues → Inspect Document** to remove hidden comments, personal information, hidden text and metadata.
3. Save as PDF if they shouldn't edit it.

Embarrassing internal comments ("they'll accept a lower price") have been sent to clients many times because someone forgot this step.

## Version naming conventions (when not using the cloud)

```
ProjectName_DocumentType_YYYY-MM-DD_v01_Initials.docx
Tender_Proposal_2026-03-10_v03_JK.docx
```

Year-month-day dates sort correctly. Keep one person responsible for the master copy.

## Common mistakes

| Mistake | Fix |
|---|---|
| Editing without Track Changes on a shared review | Turn it on first (Ctrl + Shift + E) |
| Accepting all changes without reading | Review each substantive change |
| Hidden comments sent to a client | Inspect Document before sending |
| Several "final" copies by email | One shared cloud file or one master copy owner |
| Author name shown as "User" or "Admin" | Set your user name in Options |

## Practice

1. With a partner, edit each other's one-page document with Track Changes on, then accept/reject every change.
2. Add three helpful comments with @mentions and resolve them after replies.
3. Use Compare on two versions of a CV and review the differences.
4. Restrict editing on a document so others can only add comments.
5. Run Inspect Document on a file and note what hidden information it found.

:::think A supervisor sends back a thesis chapter with 200 tracked changes. What's an efficient but careful way to process them?
Switch to All Markup, filter by reviewer if several people edited, and use Next/Accept for each change, reading substantive ones in context. Accept clear typo fixes faster, reply to comments that need discussion, keep a list of questions for the supervisor, and confirm 0 remaining revisions in the Reviewing Pane before saving a new version.
:::

```quiz
Q: Which keyboard shortcut turns Track Changes on or off in Word?
A: Ctrl + Shift + E | ctrl+shift+e
Q: Which view shows the document as if all changes were accepted? (two words)
A: No Markup | no markup
Q: Which Word feature finds hidden comments and personal information? (two words)
A: Inspect Document | inspect document
Q: Which Google Docs mode works like Track Changes?
A: Suggesting | suggesting mode
Q: Which permission level lets someone comment but not edit?
A: Commenter
Q: Which Word feature merges edits from several reviewers' copies into one document? (two words)
A: Combine Documents | combine
Q: Which Word option lets you allow only comments or tracked changes? (two words)
A: Restrict Editing
Q: Which symbol mentions a person in a comment so they get notified?
A: @ | at
```
