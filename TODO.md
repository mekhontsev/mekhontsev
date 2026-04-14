# TODO

## papers/comb-tile

### Mathematical gaps

- [ ] **Uniqueness of dominant root λ_n in (n−1, n)**
  Remark "Root location" (after Theorem 5) proves existence via IVT but not uniqueness.
  Fix: show p_n'(x) > 0 on (n−1, n), or use Descartes' rule of signs.

- [ ] **Justify μ_n ∈ (1, n−1) explicitly**
  Section 5.3 "Root structure" states μ_n ∈ (1, n−1) without proof.
  Fix: add p_n(1) = 2(n−2) > 0, p_n(n−1) < 0 ⇒ root in (1, n−1) by IVT.

### Editorial

- [ ] **Open question: minimality of 6 neighbors**
  Add to Discussion: "Is 6 the minimum number of neighbor types for a disk-like
  tile family with dim_H(∂A) → 2? Can it be achieved with fewer?"

- [ ] **Computational reproducibility**
  Tables 1–2 don't specify the software used. Add a sentence:
  "All numerical values were computed using [SageMath / Mathematica / IFStile]
  with arbitrary-precision arithmetic."

- [ ] **Additional illustrations**
  Currently only A_5 is shown. Consider adding A_3 and/or A_10 to illustrate
  the progression of boundary complexity.

### Done

- [x] Add Remark [Neighbor count] after Theorem 3 (PR #7)
- [x] Remove compiled PDFs, add .gitignore (PR #8)
- [x] Add cross-references to rem:neighbor-count in Intro and Discussion (PR #9)
- [x] Add line break before \begin{align*} (PR #9)
- [x] Expand bibliography with 3 references (PR #9)
- [x] Fix incorrect OSC argument for boundary GIFS — removed V_k = int(A) ∩ σ_k(int(A)) (PR #10)
- [x] Sort bibliography alphabetically (PR #10)