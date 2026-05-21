import { redirect } from 'next/navigation';

// Home redirects to search — the main entry point
export default function Home() {
  redirect('/search');
}
