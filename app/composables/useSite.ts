/** Site settings (content/site.yml) and whether any note is published, shared by header/footer/pages. */
export function useSite() {
  return useAsyncData('site', async () => {
    const [site, notes] = await Promise.all([
      queryCollection('site').first(),
      queryCollection('notes').where('draft', '=', false).count(),
    ])
    return { site: site!, hasNotes: notes > 0 }
  })
}

/** Open/close state for the Setup panel (footer link or the Delete key). */
export const useSetupPanel = () => useState('setup-open', () => false)
