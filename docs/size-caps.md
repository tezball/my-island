# Size caps

A stay or an experience is rejected with HTTP 400 when:

- the title or name is longer than 120 characters
- the description is longer than 4000 characters
- the photo text is longer than 1500000 characters, or the decoded bytes are larger than 1 MiB (1048576)

A photo over the cap is not stored. A shorter title, description, and PNG or JPEG still go through automatic review.

Tools: length checks in the Ktor routes before insert or update.
