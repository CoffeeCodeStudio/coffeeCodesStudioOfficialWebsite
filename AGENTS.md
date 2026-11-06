# Architecture rules

- Configure Vercel response headers in root `vercel.json`; `public/_headers` is retained for hosts that support that format because hosting platforms read different configuration files.
- Keep social image references aligned in the static head and React page metadata, and render route-specific Twitter metadata in prerendering, so navigation and crawlers do not restore stale previews.
