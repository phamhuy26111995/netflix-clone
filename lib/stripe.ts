import {
    createCheckoutSession,
    getStripePayments,
  } from '@stripe/firestore-stripe-payments'
  import app from '../firebase'
  import {getFunctions, httpsCallable} from '@firebase/functions';
  
const payments = getStripePayments(app, {
    productsCollection: 'products',
    customersCollection: 'customers',
  })

export const loadCheckout = async (priceId : string) => {
    await createCheckoutSession(payments , {
        price : priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    }).then((snapshot) => {
        window.location.assign(snapshot.url);
    }).catch(err => {
        console.log(err.message);
    })
    
}

export const goToBillingPortal = async () => {
    const instance = getFunctions(app, 'us-central1');
    const functionRef = httpsCallable(instance,"ext-firestore-stripe-payments-createPortalLink");

    await functionRef({
        returnUrl: `${window.location.origin}/account`,
        locale: "auto"
      })
        .then(({ data }: any) => window.location.assign(data.url))
        .catch((error) => console.log(error.message))

    

    
}

export default payments;