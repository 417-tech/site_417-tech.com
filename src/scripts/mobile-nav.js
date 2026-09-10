// Close the mobile menu on outside click — <details> has no native support for this.
document.addEventListener('click', (e) => {
  document.querySelectorAll('details.mobile-nav[open]').forEach((d) => {
    if (e.target instanceof Node && !d.contains(e.target)) d.removeAttribute('open');
  });
});
