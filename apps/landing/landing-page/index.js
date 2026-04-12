async function handleShare() {
  const hint = document.getElementById('shareHint');
  const url = window.location.href;
  const text = 'Check out My Happy Jar — a tiny app to collect your happy moments every day 🫙';

  if (navigator.share) {
    try {
      await navigator.share({ title: 'My Happy Jar', text, url });
    } catch (error) {
      // Ignore share-sheet cancellations.
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    hint.textContent = '✓ Link copied to clipboard!';
    setTimeout(() => {
      hint.textContent = '';
    }, 3000);
  } catch (error) {
    hint.textContent = window.location.href;
  }
}

window.handleShare = handleShare;
