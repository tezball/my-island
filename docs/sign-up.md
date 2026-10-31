# Host and guide sign-up

The host page and the guide page each post to `POST /accounts`. The host page sends `role` `host`. The guide page sends `role` `supplier`. The screen title on `/supplier` is Guide.

`POST /accounts` already returns 400 for `guest` and 409 when the email exists. These forms do not offer a guest role. There is no guest sign-up.

Tools: the existing Ktor route and the HTML on `/host` and `/supplier`.
