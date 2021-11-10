backend dev {
    .host = "app.stage-y77w3ti-nv7d6mu5vsflk.us-2.platformsh.site";
}

sub vcl_recv {
  set req.backend_hint = dev;
}