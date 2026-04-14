# TODO

## papers/comb-tile

### Mathematical gaps

- [x] **Uniqueness of dominant root λ_n in (n−1, n)**
  Remark "Root location" (after Theorem 5) proves existence via IVT but not uniqueness.
  Fix: show p_n'(x) > 0 on (n−1, n), or use Descartes' rule of signs.

- [x] **Justify μ_n ∈ (1, n−1) explicitly**
  Section 5.3 "Root structure" states μ_n ∈ (1, n−1) without proof.
  Fix: add p_n(1) = 2(n−2) > 0, p_n(n−1) < 0 ⇒ root in (1, n−1) by IVT.

### Comparison with known examples

- [ ] **Compare with twin-dragon and other disk-like tiles**
  Twin-dragon (2 maps, dim_H(∂A) ≈ 1.524) is disk-like but not mentioned.
  For n=3 comb tile gives 1.453, which is *lower* than twin-dragon.
  State at which n the comb tile surpasses known examples.

- [ ] **Optimality of the rate 8/(n² ln n)**
  Can one construct a disk-like family with 2 − dim_H = o(1/(n² ln n))?
  At least formulate as an open question or give a heuristic lower bound.

### Proof details

- [ ] **Expand «direct computation» in Theorem 5 (disk-like), condition (1)**
  Step 2 claims the unique surviving child of σ₁ is σ₅ via (n−1, n−2),
  but the full enumeration of all n² cases is not shown.
  Add at least an outline of the elimination (or an appendix).

### Topology and geometry

- [ ] **Reference for «6 is the minimum number of neighbors»**
  Remark (rem:topology), item 4, and Remark (rem:neighbor-count) cite
  Euler's formula for normal planar tilings, but don't give a precise
  reference. Add citation (Grünbaum–Shephard or Akiyama–Thuswaldner).

- [ ] **Quasicircle / Hölder regularity**
  Remark 7 (topology) doesn't discuss whether ∂A_n is a quasicircle.
  For dim_H → 2 the Hölder exponent of the Jordan parametrization → 0.
  At least state a conjecture or note the open problem.

- [ ] **Higher-dimensional conjecture needs justification**
  Discussion item 3 claims «we expect dim_H(∂A_n) → d» for R^d without
  proof or heuristic. Either justify the analogy or mark as Conjecture.

### Editorial

- [ ] **Open question: minimality of 6 neighbors**
  Add to Discussion: "Is 6 the minimum number of neighbor types for a disk-like
  tile family with dim_H(∂A) → 2? Can it be achieved with fewer?"

- [ ] **Computational reproducibility**
  Tables 1–2 don't specify the software used. Add a sentence:
  "All numerical values were computed using [SageMath / Mathematica / IFStile]
  with arbitrary-precision arithmetic."

- [x] **Additional illustrations**
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
- [x] Clarify Bandt–Wang formulation: tiles vs first-level IFS pieces (added Remark after Thm 6)
