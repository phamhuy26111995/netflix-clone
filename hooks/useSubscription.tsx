import { onCurrentUserSubscriptionUpdate, Subscription } from '@stripe/firestore-stripe-payments'
import { User } from 'firebase/auth';
import React, { useState, useEffect } from 'react'
import payments from '../lib/stripe';

function useSubscription(user : User | null) {
    const [subscriptions , setSubscription] = useState<Subscription | null>(null);

    useEffect(() => {
        if(user) {
            onCurrentUserSubscriptionUpdate(payments, (snapshot) => {
                let activeSubscription = snapshot.subscriptions.filter(subscription => subscription.status === 'active' || 
                subscription.status === 'trialing');
                
                if(activeSubscription.length > 0) {
                    setSubscription(activeSubscription[0]);
                }
            })
        }
    },[user])
 
    return subscriptions;
  
}

export default useSubscription