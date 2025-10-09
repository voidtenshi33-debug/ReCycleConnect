
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { handleSeedDatabase } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Database, CheckCircle, XCircle } from 'lucide-react';

export function DatabaseSeeder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSeed = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const result = await handleSeedDatabase();

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccessMessage(result.success);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Click the button below to upload all mock items and users from `src/lib/data.ts` to your Firestore database.
        This is useful for populating your database for testing. This action is idempotent and can be run multiple times.
      </p>

      {successMessage && (
        <Alert variant="default" className="border-green-500 bg-green-50 text-green-900">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

       {error && (
        <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Seeding Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
       )}

      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={isLoading}
        onClick={handleSeed}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Database className="mr-2 h-4 w-4" />
        )}
        {isLoading ? 'Seeding...' : 'Seed Database with Mock Data'}
      </Button>
    </div>
  );
}
