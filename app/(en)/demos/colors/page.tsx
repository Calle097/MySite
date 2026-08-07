import type { Metadata } from 'next';
import { ColorLab } from './ColorLab';

export const metadata: Metadata = {
  title: 'Color lab',
  robots: { index: false },
};

export default function Colors() {
  return <ColorLab />;
}
