import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Red Button',
    short_name: 'Red Button',
    description: '누르기만 하면 되는 가장 간단한 카운터.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f3f1ed',
    theme_color: '#e51b24',
    orientation: 'any',
  };
}
