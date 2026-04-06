# Dmitry Mekhontsev

Mathematician and software developer. My research and tools focus on
**iterated function systems (IFS)**, self-affine tiles, and algebraic fractals.

---

## Scientific Results

### [The aspect ratio of the Twin Dragon is 1/φ](papers/twin-dragon/)

The Twin Dragon fractal is defined purely via the Gaussian integer $1+i$,
yet its geometric aspect ratio — the ratio of standard deviations along the
principal axes of its area measure — equals $1/\varphi$, where
$\varphi = (1+\sqrt{5})/2$ is the golden ratio.
The result follows from an explicit solution of the covariance fixed-point equation
for the self-similar measure.

📄 [PDF](papers/twin-dragon/twin-dragon-aspect-ratio.pdf) · [LaTeX source](papers/twin-dragon/twin-dragon-aspect-ratio.tex)

---

## Software

### [IFStile](https://github.com/mekhontsev/ifstile)

An interactive editor and search engine for algebraic IFS.
IFStile finds self-similar tiles and fractals by searching the space of
IFS defined over algebraic number fields, computes similarity invariants
(including aspect ratio, moments, Hausdorff dimension estimates), and
renders attractors in real time via WebAssembly.

🌐 [app.ifstile.com](https://app.ifstile.com)

### [IFS Encyclopedia](https://ifsdb.github.io)

A static reference site cataloguing iterated function systems — definitions,
AIFS programs, interactive fractal renderings, and bibliographic references.
Built with Astro and rendered client-side via `ifslib.wasm`.

🌐 [ifsdb.github.io](https://ifsdb.github.io) · [source](https://github.com/ifsdb/ifsdb.github.io)

---

## Thesis

**An algebraic framework for finding and analyzing self-affine tiles and fractals**  
Doctoral thesis, Ernst-Moritz-Arndt-Universität Greifswald, 2019.  
[urn:nbn:de:gbv:9-opus-24794](https://nbn-resolving.org/urn:nbn:de:gbv:9-opus-24794)
