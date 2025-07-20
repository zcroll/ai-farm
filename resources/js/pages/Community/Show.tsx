import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface Props {
  post?: any;
}

export default function CommunityShow({ post }: Props) {
  return (
    <>
      <Head title={post ? post.title : 'Community Post'} />
      <AppShell>
        <div className="container mx-auto py-6 max-w-3xl">
          <Link href="/community">
            <Button variant="ghost" size="sm" className="mb-4">Back to Community</Button>
          </Link>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-2">{post ? post.title : 'Community Post'}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {post ? post.content : 'This is a placeholder for the community post details.'}
            </p>
          </div>
        </div>
      </AppShell>
    </>
  );
} 