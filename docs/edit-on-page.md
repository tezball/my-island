# Edit on the listing page

A host edits a stay on that stay’s page. A guide edits an experience on that experience’s page. The pages post to the routes that already exist: `POST /host/stays/{id}` and `POST /supplier/experiences/{id}`.

`/host` and `/supplier` still create. The listing form sends the same JSON those creates send, including lots on a stay and a PNG or JPEG. Saving runs the existing review bar. The row stays off the public list until that bar passes. A later edit clears any reject reason and runs the bar again.

The guide form is on the experience page. The route and the `supplier_id` column stay as they are.

Tools: Ktor HTML in `Pages.kt`. No extra UI library.
