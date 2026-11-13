function toTgLink(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch (e) {
    return null;
  }

  if (!/^(t\.me|www\.t\.me|telegram\.me|www\.telegram\.me)$/i.test(url.hostname)) {
    return null;
  }

  const path = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
  if (!path) {
    return 'tg://resolve';
  }

  if (path.startsWith('+')) {
    return 'tg://join?invite=' + encodeURIComponent(path.slice(1));
  }

  if (path.startsWith('s/')) {
    return null;
  }

  const parts = path.split('/');
  const domain = parts[0];
  if (!domain) {
    return null;
  }

  let link = 'tg://resolve?domain=' + encodeURIComponent(domain);
  if (parts[1] && /^\d+$/.test(parts[1])) {
    link += '&post=' + parts[1];
  }
  if (parts[2] && /^\d+$/.test(parts[2])) {
    link += '&comment=' + parts[2];
  }

  const single = url.searchParams.get('single');
  if (single) {
    link += '&single=' + encodeURIComponent(single);
  }

  return link;
}

function redirectToApp(rawUrl) {
  const link = toTgLink(rawUrl);
  if (!link) {
    return false;
  }
  location.replace(link);
  return true;
}

const params = new URLSearchParams(location.search);
const original = params.get('u') || '';

if (!redirectToApp(original)) {
  const box = document.getElementById('fallback');
  const text = document.getElementById('target');
  if (box && text) {
    text.textContent = original || '—';
    box.hidden = false;
  }
}
