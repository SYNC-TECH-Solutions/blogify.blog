
import Header from '@/components/blog/Header';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header user={null} onLogout={() => {}} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-3xl font-bold text-muted-foreground">Contact Us - Coming Soon!</p>
            <p className="text-center text-muted-foreground mt-2">This page is under construction. Check back later!</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
