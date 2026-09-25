# Portfolio

Static portfolio published through GitHub Pages. The checked-in HTML and CSS can be served without a JavaScript build at runtime.

## Update styles

```sh
npm ci
npm run build:css
```

Edit `portfolio.input.css` for shared portfolio styling. Tailwind scans the root HTML pages and emits `portfolio.css`; commit the generated CSS with page changes. `styles.css` contains the local proxy diagram styling. The Pythia subsite keeps its own CSS.

## Local preview

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://localhost:8765. The Full-Stack resume download is `resumes/shaun-shahbazi-full-stack.pdf`. Replace that file to update the download. A Backend resume button can be added when a separate Backend PDF is supplied.
