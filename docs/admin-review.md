# Admin review

Automatic review still hides a new or edited stay or experience that fails the bar. This screen is how `tezball86@gmail.com` then accepts or rejects what a person just saved, plus a new guide account. Seed stays, `Load camp N` rows, and the seeded experiences stay off the deck. See [review deck](review-deck.md).

`/admin/review` is a phone-first page: one card, then a big Reject and a big Approve. Swipe right approves. Swipe left opens the reason. Reject does not submit until a reason is present. The reason is trimmed, required, and at most 200 characters. It is stored on the row (`review_reason` on the stay, the experience, or the account).

Approve publishes a stay or experience (`hidden` false) and clears the reason. Reject keeps it hidden, stores the reason, and takes it out of the queue. A later edit clears the reason and runs automatic review again, so a bad edit is hidden and can return to the queue. The host stay list includes the stored reason.

A new guide account (`role` still `supplier`, `supplier_approved` false, no reason yet) is a card after the hidden stays and hidden experiences a person saved. Seeded guide accounts stay approved. The card says guide. Approve and reject still post to `/admin/review/supplier/{id}`. Approve marks the account approved. Reject stores the reason and leaves them unapproved, off the queue.

The card can show a stored PNG or JPEG through an admin-only photo URL. Other accounts get 403. A missing session gets 401.

Tools: Ktor HTML and JSON, PostgreSQL columns from Flyway `V4__harden.sql` and `V5__launch.sql`. No extra UI library.
