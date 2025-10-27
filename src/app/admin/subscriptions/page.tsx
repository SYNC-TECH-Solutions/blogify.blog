"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import type { Subscription } from '@/lib/types';
import Header from '@/components/blog/Header';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Loader } from '@/components/ui/loader';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const subscriptionsCollectionPath = `subscriptions`;

export default function AdminSubscriptionsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
      if (!currentUser) {
        router.push('/admin'); // Redirect if not logged in
      }
    });
    return () => unsubscribeAuth();
  }, [auth, router]);

  useEffect(() => {
    if (!firestore || !user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);

    const subscriptionsCollection = collection(firestore, subscriptionsCollectionPath);
    const q = query(subscriptionsCollection);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Subscription));
      setSubscriptions(subsData);
      setLoading(false);
    }, (error) => {
      const permissionError = new FirestorePermissionError({
        path: subscriptionsCollectionPath,
        operation: 'list',
      });
      errorEmitter.emit('permission-error', permissionError);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, user]);


  const handleLogout = () => {
    if (auth) {
      signOut(auth).then(() => {
        router.push('/');
      });
    }
  };
  
  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (date.toDate) {
      return format(date.toDate(), 'MMMM d, yyyy');
    }
    try {
      return format(new Date(date), 'MMMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (!authChecked || loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader className="h-12 w-12" />
      </div>
    );
  }
  
  if(!user){
    // This will be rendered briefly before the redirect in useEffect kicks in
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Subscriber Management</CardTitle>
              <CardDescription>A list of all users who have subscribed to your service.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Stripe Customer ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.length > 0 ? (
                    subscriptions.map(sub => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium truncate max-w-xs">{sub.userId}</TableCell>
                        <TableCell className="truncate max-w-xs">{sub.stripeCustomerId}</TableCell>
                        <TableCell>
                          <Badge variant={sub.status === 'active' ? 'default' : 'destructive'} className={sub.status === 'active' ? 'bg-green-500' : ''}>
                            {sub.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(sub.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No subscribers yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      </main>
    </div>
  );
}
