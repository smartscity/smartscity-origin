/** Document-scoped progressive enhancement: no requests, storage, or HTML injection. */
const root = document.querySelector<HTMLElement>('[data-library-search]');
if (root) {
  const form = root.querySelector<HTMLFormElement>('form')!;
  const input = form.elements.namedItem('q') as HTMLInputElement;
  const selects = ['kind', 'product', 'topic'].map(
    (name) => form.elements.namedItem(name) as HTMLSelectElement,
  );
  const cards = [...root.querySelectorAll<HTMLElement>('[data-reading]')];
  const count = root.querySelector<HTMLElement>('[role="status"]')!;
  const empty = root.querySelector<HTMLElement>('[data-empty]')!;
  const restore = () => {
    const params = new URLSearchParams(location.search);
    input.value = (params.get('q') ?? '').slice(0, 200);
    for (const select of selects) {
      const value =
        params.get(select.name) ??
        (select.name === 'kind' ? root.dataset.defaultKind! : '');
      select.value = [...select.options].some((o) => o.value === value)
        ? value
        : '';
    }
  };
  const filter = (updateUrl = true) => {
    const terms = input.value
      .normalize('NFKC')
      .toLocaleLowerCase(document.documentElement.lang)
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    let visible = 0;
    for (const card of cards) {
      card.hidden =
        !selects.every(
          (select) =>
            !select.value || card.dataset[select.name] === select.value,
        ) || !terms.every((term) => card.dataset.search!.includes(term));
      if (!card.hidden) visible++;
    }
    count.textContent = `${visible} ${root.dataset.count}`;
    empty.hidden = visible !== 0;
    if (updateUrl) {
      const url = new URL(location.href);
      url.search = '';
      if (input.value.trim()) url.searchParams.set('q', input.value.trim());
      for (const select of selects)
        url.searchParams.set(select.name, select.value);
      history.replaceState(null, '', url);
    }
  };
  restore();
  filter(false);
  form.hidden = false;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    filter();
  });
  form.addEventListener('input', () => filter());
  form.addEventListener('reset', (event) => {
    event.preventDefault();
    input.value = '';
    for (const select of selects) select.value = '';
    filter();
    input.focus();
  });
  window.addEventListener('popstate', () => {
    restore();
    filter(false);
  });
}
